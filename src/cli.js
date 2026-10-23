#!/usr/bin/env node
'use strict';

/**
 * xeduapi-bulk-apikey CLI — mint 聚合api服务 (xeduapi.com) accounts with API keys.
 *
 * Zero dependencies (Node builtins only, `curl` for proxied panel calls) and **no
 * browser**: this panel has no captcha. Each account is one plain `@gmail.com`
 * mailbox (Emailnator, read directly), one verification mail and one key; the free
 * tier is the **daily check-in** (`POST /api/user/checkin`), which is claimed before
 * the key is proved, so the key is born funded.
 *
 * Panel quirks this tool encodes (all measured 2026-10-21):
 *   • mail whitelist accepts **gmail.com / outlook.com / qq.com** but the panel
 *     refuses dots and `+` as "special characters" → use a **plain** gmail;
 *   • the register call must present the **same cookie jar** that requested the code,
 *     with a **fresh** code (10-minute TTL) and a password of at least 8 characters;
 *   • token group: `default` is deprecated (`403 Group default has been deprecated`)
 *     — the live group is `Default` (capital D), taken from `/api/pricing`;
 *   • the key is masked in the token list; the plaintext comes from
 *     `POST /api/token/<id>/key`.
 *
 * Usage:
 *   node src/cli.js --count 5                 # five funded keys
 *   node src/cli.js --verify-only             # re-prove every key in keys.txt
 *   node src/cli.js --screen                  # vet the exit list against the panel
 *   node src/cli.js --connect-9router         # register the keys with a local 9Router
 */

// Captcha-wall classifier (this panel enforces turnstile_check): names the wall in the
// account record instead of looping; a rail is used only if the operator wired one.
const solver = require('./solver.js');
require('dns').setDefaultResultOrder('ipv4first');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const IS_SRC = path.basename(__dirname) === 'src';
const ROOT = IS_SRC ? path.resolve(__dirname, '..') : __dirname;
const KEYS_FILE = path.join(ROOT, 'keys.txt');
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.json');  // the packaged .gitignore covers accounts.json
const OUT_DIR = path.join(ROOT, 'out');

const BASE = 'https://xeduapi.com';
const HOST = 'xeduapi.com';
const EMAILNATOR = 'https://www.emailnator.com';
const BRAND = /xeduapi|聚合/i;                       // sender/subject fence for the code mail
const SENDER = /@xedu\.[a-z]{2,}$/i;                 // mail comes from the panel's own relay domain
// the codex channel (`gpt-5.6-terra` …) answers 500 on /v1/chat/completions — it needs the
// Responses API, so the chat gate must not pick those ids
const DEFAULT_MODEL_SKIP = /terra|codex|gpt-5\.6/i;
const PROMPT = 'Reply with the single word: pong';
// Two-prompt sanity + a function-calling round: a key reaches keys.txt only when
// the panel answers 200, the second answer differs from the first, and the model
// emits the `get_time` tool call (mirrors the fleet's pre-add gate).
const PROMPT2 = 'Name three colours, comma separated.';
const TOOLS = [{ type: 'function', function: { name: 'get_time', description: 'Returns the current time', parameters: { type: 'object', properties: {} } } }];
const DEFAULT_MODEL_PREFS = [/^deepseek-chat$/i, /^deepseek-v3$/i, /deepseek/i, /flash|mini|nano|turbo|free/i];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';

// ------------------------------------------------------------------- options
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const has = (n) => argv.includes(`--${n}`) || argv.includes(`-${n[0]}`);

const HELP = `xeduapi-bulk-apikey — mint 聚合api服务 API keys (one account per key, each funded by the $0.20 signup credit)

  --count N        accounts to mint (default 1)
  --pool FILE      exit list, one proxy per line (default proxies.txt if present; without one the tool runs direct)
  --proxy URL      pin a single exit for the panel calls
  --exits K        exit candidates tried per account (default 6)
  --model ID       model used for the live gate (default: cheapest text model)
  --verify-only    re-prove every key in keys.txt, mint nothing
  --screen         test the exit list against the panel
  --connect-9router  register the keys with a local 9Router (src/connect-9router.js)
  --help           this text

Env: XEDUAPI_MODEL, XEDUAPI_POOL
Panel notes: no captcha; plain gmail only (outlook is refused); no daily check-in — the $0.20 signup credit funds each key.`;
if (has('help') || argv.length === 0) { console.log(HELP); process.exit(0); }

const COUNT = Math.max(1, parseInt(arg('count', '1'), 10) || 1);
const MODEL = arg('model', process.env.XEDUAPI_MODEL || '');
const TRIES = Math.max(1, parseInt(arg('exits', '6'), 10) || 6);
const VERIFY_ONLY = has('verify-only');
const SCREEN = has('screen');
const CONNECT = has('connect-9router');
const POOL_ARG = arg('pool', process.env.XEDUAPI_POOL || '');
const FIXED = arg('proxy', '');
const CODE_WAIT_MS = Math.max(30000, (parseInt(arg('code-timeout', '240'), 10) || 240) * 1000);

fs.mkdirSync(OUT_DIR, { recursive: true });
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const randUser = () => 'wx' + crypto.randomBytes(3).toString('hex');
const randPass = () => `Wx${crypto.randomBytes(4).toString('hex')}${10 + Math.floor(Math.random() * 89)}!x`;

// --------------------------------------------------------------------- exits
const proxyOf = (line) => {
  const s = String(line).trim().split(/\s+/)[0];
  return /^(socks4|socks5|https?):\/\//i.test(s) ? s : null;
};
const exits = (() => {
  if (FIXED) return [proxyOf(FIXED)].filter(Boolean);
  const file = POOL_ARG || (fs.existsSync(path.join(ROOT, 'proxies.txt')) ? path.join(ROOT, 'proxies.txt') : '');
  if (!file || !fs.existsSync(file)) return [];
  return [...new Set(fs.readFileSync(file, 'utf8').split(/\r?\n/).map(proxyOf).filter(Boolean))];
})();
let cursor = 0;
const nextExit = () => (exits.length ? exits[cursor++ % exits.length] : null);
const exitLabel = (e) => e || '(direct)';

/** curl is the transport: one flag parses socks4/socks5/http alike. */
function curl(url, { method = 'GET', headers = {}, body = null, exit = null, jar = null, timeoutMs = 30000 } = {}) {
  const a = ['-sS', '-m', String(Math.round(timeoutMs / 1000)), '-A', UA, '-H', 'accept: application/json'];
  if (exit) {
    if (exit.startsWith('socks5')) a.push('--socks5-hostname', exit.split('//')[1]);
    else if (exit.startsWith('socks4')) a.push('--socks4a', exit.split('//')[1]);
    else a.push('-x', exit);
  }
  if (jar) a.push('-b', jar, '-c', jar);
  for (const [k, v] of Object.entries(headers)) a.push('-H', `${k}: ${v}`);
  if (body !== null) a.push('-X', method, '-H', 'content-type: application/json', '--data-binary', JSON.stringify(body));
  a.push('-w', '\n__HTTP__%{http_code}', url);
  const r = spawnSync('curl', a, { encoding: 'utf8', timeout: timeoutMs + 12000, windowsHide: true, maxBuffer: 16 * 1024 * 1024 });
  const raw = r.stdout || '';
  const i = raw.lastIndexOf('__HTTP__');
  const status = i >= 0 ? parseInt(raw.slice(i + 8).trim(), 10) || 0 : 0;
  const text = i >= 0 ? raw.slice(0, i) : raw;
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* html/empty */ }
  return { status, json, text };
}
const msg = (r) => (r.json && (r.json.message || r.json.error)) || String(r.text || '').slice(0, 160);

// ---------------------------------------------------------------------- mail
/**
 * Emailnator over curl: this box cannot reach emailnator directly (measured
 * 2026-10-23 — every direct call times out), so the rail rides the same exit
 * pool as the panel calls. Dot-free plain gmail only; the panel refuses dots.
 */
function json_https(url, { method = 'GET', body = null } = {}) {
  return curl(url, {
    method, body, exit: nextExit(), timeoutMs: 30000,
    headers: { origin: EMAILNATOR, referer: `${EMAILNATOR}/`, accept: 'application/json' },
  });
}

async function newMailbox() {
  for (let i = 0; i < 3; i++) {
    const r = await json_https(`${EMAILNATOR}/api/generate-email`, { method: 'POST', body: { ids: [3] } });
    const dotted = r.json && r.json.email;
    if (dotted && /@gmail\.com$/i.test(dotted)) {
      const [local, domain] = dotted.split('@');
      return { dotted, plain: `${local.replace(/\./g, '')}@${domain}` };
    }
    await sleep(2000);
  }
  throw new Error('emailnator: no gmail address');
}

const CODE_RE = /(?:verification code is:?|code|verification|验证码)[^0-9a-z]{1,24}(?=[0-9a-z]*\d)([0-9a-z]{4,8})(?![0-9a-z])/i;

async function waitForCode(address, { timeoutMs = CODE_WAIT_MS } = {}) {
  const deadline = Date.now() + timeoutMs;
  const seen = new Set();
  while (Date.now() < deadline) {
    const list = await json_https(`${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: address, limit: 20 } });
    for (const m of (list.json && list.json.messages) || []) {
      const id = String(m.id || '');
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const from = String(m.from || '');
      const subject = String(m.subject || '');
      if (!BRAND.test(`${from} ${subject}`) && !SENDER.test(from)) continue;
      const full = await json_https(`${EMAILNATOR}/api/message/${encodeURIComponent(id)}`);
      const html = String((full.json && full.json.content) || '');
      const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;?/g, ' ').replace(/\s+/g, ' ');
      const code = (text.match(CODE_RE) || [])[1];
      if (code) return { code, subject, from };
    }
    await sleep(5000);
  }
  return { code: null };
}

// ---------------------------------------------------------------------- keys
const readKeys = () => (fs.existsSync(KEYS_FILE) ? fs.readFileSync(KEYS_FILE, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#')) : []);
function appendKey(key) {
  if (readKeys().includes(key)) return false;
  fs.appendFileSync(KEYS_FILE, (fs.existsSync(KEYS_FILE) && fs.statSync(KEYS_FILE).size ? '\n' : '') + key + '\n');
  return true;
}
function appendAccount(rec) {
  const all = (() => { try { const j = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8')); return Array.isArray(j) ? j : []; } catch (e) { return []; } })();
  all.push(rec);
  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(all, null, 1) + '\n');
}
const DAY = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const MINT_JSONL = path.join(OUT_DIR, `mint-100-${path.basename(ROOT)}-${DAY}.jsonl`);
const DEAD_FILE = path.join(ROOT, 'keys-dead.txt');
/** A minted-but-dead key keeps its class (401/403/quota/ban/429 or a gate miss). */
function deadClass(p) {
  if (!p) return 'unverified';
  const s = p.chat && p.chat.status;
  if (s === 401) return '401';
  if (s === 403) return '403';
  if (s === 429) return '429';
  if (s === 402) return 'quota';
  if (p.sanity && (!p.sanity.live || !p.sanity.different)) return 'sanity-fail';
  if (p.tools && !p.tools.present) return 'tools-fail';
  if (!s) return 'transport';
  return 'unverified';
}
function appendDead(key, cls) {
  const old = fs.existsSync(DEAD_FILE) ? fs.readFileSync(DEAD_FILE, 'utf8') : '';
  if (old.includes(key)) return;
  fs.appendFileSync(DEAD_FILE, (old && !old.endsWith('\n') ? '\n' : '') + `${key}\t# ${cls}` + '\n');
}
/** One evidence row per account, whatever the outcome. */
function rowOf(rec) {
  const key = rec.apiKey;
  const p = rec.proof;
  return {
    at: rec.at, n: rec.n, email: rec.email, mailbox: rec.mailbox || 'emailnator-gmail', exit: rec.exit,
    code: rec.steps && rec.steps.mail ? rec.steps.mail.code || null : null,
    register: rec.steps && rec.steps.register ? rec.steps.register.status : null,
    self: rec.self || null, checkin: rec.checkin_quota_awarded ?? null,
    key: key ? key.slice(0, 8) + '…' : null,
    proof: p ? {
      models: p.models, chat: { model: p.chat.model, status: p.chat.status, content: String(p.chat.content || '').slice(0, 60) },
      sanity: p.sanity ? { status: p.sanity.status, different: p.sanity.different, content: String(p.sanity.content || '').slice(0, 60) } : null,
      tools: p.tools || null, exit: p.exit, live: !!p.live,
    } : null,
    verdict: rec.verdict, deadClass: rec.verdict === 'minted' ? null : deadClass(p),
  };
}
function finish(rec) {
  appendAccount(rec);
  fs.appendFileSync(MINT_JSONL, JSON.stringify(rowOf(rec)) + '\n');
  return rec;
}

// ---------------------------------------------------------------------- proof
function listModels(key, exit) {
  const r = curl(`${BASE}/v1/models`, { key: null, headers: { authorization: `Bearer ${key}` }, exit });
  const ids = (r.json && (r.json.data || r.json.models)) || [];
  return { status: r.status, ids, text: r.text };
}

/**
 * Candidate gate models, best first. A panel can serve several ids that look cheap
 * but answer 500 or hang on /v1/chat/completions (measured: the codex channel needs
 * the Responses API, and one DeepSeek build times out), so the gate walks a short
 * list instead of betting on one id.
 */
function pickModels(ids) {
  if (MODEL) return [MODEL];
  const list = ids.map((m) => (typeof m === 'string' ? { id: m } : m));
  const usable = list.filter((m) => m.id && !DEFAULT_MODEL_SKIP.test(String(m.id)));
  const priced = usable.map((m) => ({ id: m.id, p: (m.pricing || {}).input_per_mtok_usd })).filter((m) => Number.isFinite(m.p)).sort((a, b) => a.p - b.p).map((m) => m.id);
  const out = [];
  for (const id of priced) if (!out.includes(id)) out.push(id);
  for (const re of DEFAULT_MODEL_PREFS) {
    for (const m of usable) if (re.test(String(m.id)) && !out.includes(m.id)) out.push(m.id);
  }
  for (const m of usable) if (!out.includes(m.id)) out.push(m.id);
  return out.slice(0, 4);
}

/** One chat call; returns content, any tool-call names, and the raw status. */
function chatCall(key, model, exit, body) {
  if (!model) return { status: 0, content: null, names: [], live: false, text: 'no model id' };
  const r = curl(`${BASE}/v1/chat/completions`, {
    method: 'POST', exit, headers: { authorization: `Bearer ${key}` },
    body: { model, max_tokens: 256, stream: false, ...body },
  });
  const m0 = r.json && r.json.choices && r.json.choices[0] && r.json.choices[0].message;
  const content = (m0 && (m0.content || m0.reasoning_content || m0.reasoning)) || null;
  const names = ((m0 && m0.tool_calls) || []).map((x) => x && x.function && x.function.name).filter(Boolean);
  return { status: r.status, content, names, live: r.status === 200 && !!content, text: String(r.text || '').slice(0, 200) };
}
const chatGate = (key, model, exit) => chatCall(key, model, exit, { messages: [{ role: 'user', content: PROMPT }], max_tokens: 64 });

function prove(key) {
  // 6 exits is plenty to prove a key; the whole pool (60+) made a dead key burn
  // every exit at ~10 s per models call.
  const attempts = Math.min(Math.max(exits.length, 3), 6);
  let last = null;
  for (let i = 0; i < attempts; i++) {
    const exit = nextExit();
    const models = listModels(key, exit);
    if (models.status !== 200) { last = { models: { status: models.status, count: 0 }, chat: { model: null, status: 0, content: null, live: false, text: 'models unreachable' }, exit, live: false }; continue; }
    for (const model of pickModels(models.ids)) {
      const p1 = chatGate(key, model, exit);
      const res = { models: { status: models.status, count: models.ids.length }, chat: { model, ...p1 }, exit, live: false };
      if (!p1.live) { last = res; if (p1.status === 200) return res; continue; }   // served but no content — do not keep burning exits
      const s = chatCall(key, model, exit, { messages: [{ role: 'user', content: PROMPT2 }], max_tokens: 64 });
      res.sanity = { status: s.status, content: s.content, different: !!s.content && String(s.content).trim().toLowerCase() !== String(p1.content).trim().toLowerCase(), live: s.live };
      const t = chatCall(key, model, exit, { messages: [{ role: 'user', content: 'What time is it right now? Use the get_time tool.' }], tools: TOOLS, tool_choice: 'auto' });
      res.tools = { status: t.status, present: t.names.length > 0, names: t.names };
      res.live = res.sanity.live && res.sanity.different && res.tools.present;
      return res;
    }
  }
  return last || { models: { status: 0, count: 0 }, chat: { model: null, status: 0, content: null, live: false, text: 'relay unreachable' }, exit: null, live: false };
}

// ----------------------------------------------------------------------- mint
async function mintOne(n) {
  const exit = nextExit();
  const jar = path.join(os.tmpdir(), `xeduapi-jar-${crypto.randomBytes(4).toString('hex')}.txt`);
  const box = await newMailbox();
  const email = box.plain;
  const username = randUser();
  const password = randPass();
  const rec = { at: new Date().toISOString(), n, email, dotted: box.dotted, username, password, exit: exitLabel(exit), steps: {} };
  log(`#${n} ${email} user=${username} exit=${exitLabel(exit)}`);

  const send = curl(`${BASE}/api/verification?email=${encodeURIComponent(email)}`, { exit, jar });
  rec.steps.sendCode = { status: send.status, body: msg(send) };
  log(`  send-code → ${send.status} ${msg(send)}`);
  if (!(send.json && send.json.success)) { rec.verdict = 'send-code-failed'; rec.captcha = solver.classify(msg(send)); return finish(rec); }

  const mail = await waitForCode(email);
  rec.steps.mail = { code: mail.code, subject: mail.subject || null, from: mail.from || null };
  log(`  code ${mail.code || 'NONE'} «${String(mail.subject || '').slice(0, 50)}»`);
  if (!mail.code) { rec.verdict = 'no-mail'; return finish(rec); }

  const reg = curl(`${BASE}/api/user/register`, {
    method: 'POST', exit, jar,
    body: { username, password, password2: password, email, verification_code: String(mail.code), aff_code: '' },
  });
  rec.steps.register = { status: reg.status, body: msg(reg) };
  log(`  register → ${reg.status} ${msg(reg)}`);
  if (!(reg.json && reg.json.success)) { rec.verdict = 'register-failed'; return finish(rec); }

  let auth = (reg.json.data && reg.json.data.access_token) || null;
  if (!auth) {
    const li = curl(`${BASE}/api/user/login`, { method: 'POST', exit, jar, body: { username, password } });
    rec.steps.login = { status: li.status, body: msg(li) };
    log(`  login → ${li.status} ${msg(li)}`);
    auth = (li.json && li.json.data && li.json.data.access_token) || null;
  }
  const authed = (p, opts = {}) => curl(`${BASE}${p}`, { ...opts, exit, jar, headers: auth ? { authorization: `Bearer ${auth}` } : {} });

  const self = authed('/api/user/self');
  rec.self = self.json && self.json.data ? { quota: self.json.data.quota, group: self.json.data.group, id: self.json.data.id } : null;
  log(`  self → ${self.status} quota=${rec.self ? rec.self.quota : '?'} group=${rec.self ? rec.self.group : '?'}`);

  // free tier: the daily check-in funds the account before the key is proved
  const ci = authed('/api/user/checkin', { method: 'POST', body: {} });
  rec.steps.checkin = { status: ci.status, body: String(ci.text).slice(0, 200) };
  rec.checkin_quota_awarded = (ci.json && ci.json.data && ci.json.data.quota_awarded) || null;
  log(`  checkin → ${ci.status} ${String(ci.text).slice(0, 110)}`);

  const pricing = authed('/api/pricing');
  const rows = (pricing.json && pricing.json.data) || [];
  rec.pricing = { status: pricing.status, rows: rows.length, strict_free: rows.filter((r) => r.quota_type === 1 && r.model_price === 0).length };
  log(`  pricing → ${pricing.status} rows=${rows.length}`);
  // `default` is deprecated on this panel; the live name is `Default`
  const group = Object.keys((pricing.json && pricing.json.group_ratio) || {}).find((g) => g.toLowerCase() === 'default') || 'Default';

  authed('/api/token/', { method: 'POST', body: { name: `wx${Date.now().toString(36)}`, remain_quota: 0, expired_time: -1, unlimited_quota: true, model_limits_enabled: false, model_limits: '', allow_ips: '', group } });
  const list = authed('/api/token/?p=0&size=100');
  const items = (list.json && list.json.data && (list.json.data.items || list.json.data)) || [];
  let key = null;
  if (items[0] && items[0].id) {
    const kk = authed(`/api/token/${items[0].id}/key`, { method: 'POST', body: {} });
    const k2 = kk.json && kk.json.data && (kk.json.data.key || kk.json.data);
    rec.steps.tokenKey = { status: kk.status, body: String(kk.text).slice(0, 160) };
    if (typeof k2 === 'string' && !k2.includes('*')) key = k2;
    else if (items[0].key && !String(items[0].key).includes('*')) key = items[0].key;
  }
  rec.apiKey = key;
  rec.group = group;
  log(`  key ${key ? key.slice(0, 12) + '…' : 'NONE'} (group ${group})`);

  if (key) {
    rec.proof = prove(key);
    rec.verdict = rec.proof.live ? 'minted' : 'key-unverified';
    log(`  proof: models=${rec.proof.models.status}(${rec.proof.models.count}) chat[${rec.proof.chat.model}]=${rec.proof.chat.status} sanity=${rec.proof.sanity ? (rec.proof.sanity.different ? 'farklı' : 'aynı/boş') : '-'} tools=${rec.proof.tools ? (rec.proof.tools.present ? rec.proof.tools.names.join('+') : 'yok') : '-'} ${rec.proof.live ? '✔ LIVE' : '✖'}`);
    if (rec.proof.live) appendKey(key);
    else appendDead(key, deadClass(rec.proof));
  } else {
    rec.verdict = 'no-key';
  }
  return finish(rec);
}

// --------------------------------------------------------------------- modes
function screen() {
  if (!exits.length) {
    const r = curl(`${BASE}/api/status`);
    log(`(direct) /api/status=${r.status} ${r.status === 200 ? 'OK' : 'DEAD'}`);
    return;
  }
  let ok = 0;
  for (const e of exits) {
    const r = curl(`${BASE}/api/status`, { exit: e, timeoutMs: 15000 });
    const live = r.status === 200 && !!r.json && !!r.json.data;
    if (live) ok++;
    log(`${exitLabel(e).padEnd(34)} status=${r.status} ${live ? 'OK' : 'DEAD'}`);
  }
  log(`${ok}/${exits.length} exits answered`);
}

function verifyOnly() {
  const keys = readKeys();
  if (!keys.length) return log(`no keys in ${KEYS_FILE}`);
  let live = 0;
  for (const key of keys) {
    const p = prove(key);
    if (p.live) live++;
    log(`${key.slice(0, 10)}… models=${p.models.status}(${p.models.count}) chat[${p.chat.model}]=${p.chat.status} ${JSON.stringify(String(p.chat.content || '').slice(0, 20))} ${p.live ? 'LIVE' : 'DEAD'}`);
  }
  log(`live: ${live}/${keys.length}`);
}

function connect9router() {
  const script = path.join(__dirname, 'connect-9router.js');
  if (!fs.existsSync(script)) { log(`connect-9router.js not found next to this CLI (expected ${script})`); return; }
  const args = [script];
  for (const n of ['base', 'password', 'name', 'prefix', 'base-url', 'model']) { const v = arg(n, ''); if (v) args.push(`--${n}`, v); }
  log(`9Router → node ${path.basename(script)} ${args.slice(1).join(' ')}`);
  const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (r.status !== 0) log(`connect-9router exited ${r.status}`);
}

(async () => {
  if (SCREEN) return screen();
  if (VERIFY_ONLY) return verifyOnly();
  if (CONNECT) return connect9router();
  log(`xeduapi mint · ${COUNT} account(s) · ${exits.length ? `${exits.length} exits` : 'DIRECT (no proxy)'} · mail emailnator(gmail, via exit)`);
  let minted = 0;
  for (let i = 1; i <= COUNT; i++) {
    try {
      const rec = await mintOne(i);
      if (rec.verdict === 'minted') minted++;
    } catch (e) {
      log(`  ✖ ${String(e.message).slice(0, 160)}`);
    }
    await sleep(1000);
  }
  log(`done: ${minted}/${COUNT} keys minted · keys.txt → ${KEYS_FILE}`);
})().catch((e) => { console.error('FATAL', e && e.message ? e.message : e); process.exit(1); });
