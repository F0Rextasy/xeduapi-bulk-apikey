<div align="center">

```
██╗  ██╗███████╗██████╗ ██╗   ██╗ █████╗ ██████╗ ██╗
╚██╗██╔╝██╔════╝██╔══██╗██║   ██║██╔══██╗██╔══██╗██║
 ╚███╔╝ █████╗  ██║  ██║██║   ██║███████║██████╔╝██║
 ██╔██╗ ██╔══╝  ██║  ██║██║   ██║██╔══██║██╔═══╝ ██║
██╔╝ ██╗███████╗██████╔╝╚██████╔╝██║  ██║██║     ██║
╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝
```

# xeduapi-bulk-apikey

**Bulk-create 聚合api服务 accounts with API keys — OpenAI-compatible inference + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-10%20served-412991?style=for-the-badge)](https://xeduapi.com/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-10-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

聚合api服务 (xeduapi.com) is a New API fork (`v1.0.0-rc.45`) with the friendliest gate of the family: registration is **open**, there is **no captcha**, and a fresh account is **funded on creation** — `quota = 100000` (that is **$0.20** at 500 000 quota per dollar). No card, no phone, no OAuth, no daily ritual: one verification mail and a form POST, and the key can be minted and proved immediately.

What the tool has to get right is the address policy and the channel split. The mail whitelist takes **gmail.com** and **qq.com** but refuses `outlook.com`, and — like its sibling panels — it treats a **dot or a `+`** in the local part as a “special character”, so plus/dot aliases are dead here and the working rail is a **plain** `@gmail.com` mailbox read directly. On the model side, the catalogue is mixed: `deepseek-chat`, `deepseek-v3` and friends answer on `/v1/chat/completions`, while the **codex channel** (`gpt-5.6-terra` and its siblings) refuses that endpoint with HTTP 500 and a message telling you to use the **Responses API** — the gate skips those ids so a healthy key is never blamed for a channel mismatch.

## 🎁 Free tier — how much you get

| What | Value |
| --- | --- |
| Signup credit | **$0.20** — `GET /api/user/self` right after registration returns `quota = 100000` (500 000 quota = $1) |
| Daily check-in | **not available** — `POST /api/user/checkin` answers `Check-in feature is not enabled` |
| Card / phone / OAuth | **none required** — e-mail code only, `turnstile_check: false` |
| What it buys | 10 models across DeepSeek / StepFun / Z.ai / xAI, at the panel's published rates; no strict-$0 row exists |
| Key per account | one key per account is the natural shape — the credit lives on the account |

Because there is no daily refresh, the unit that scales is **accounts**: N accounts ⇒ N × $0.20 of credit.

> 💡 The free tier is set by 聚合api服务 and can change. Check the live numbers at [xeduapi.com](https://xeduapi.com) — and let the tool's own gate decide:

```bash
```bash
# every key in keys.txt: the model list plus one real completion
node src/cli.js --verify-only

# by hand (keys carry no `sk-` prefix)
curl https://xeduapi.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"gday"}],"max_tokens":64}'
```

The gate counts `content || reasoning_content`. Prefer a chat-channel id for the check: `deepseek-chat` and `deepseek-v3` are the two proved here.
```

## 🤖 Models — all 10 of them

`GET /v1/models` on a live key (2026-10-21) — **10 ids**:

| Id | Channel |
| --- | --- |
| `deepseek-chat` · `deepseek-v3` · `deepseek-ai/deepseek-v4.1-flash` | **chat completions** — proved answerable |
| `stepfun-ai/step-5-preview` · `z-ai/glm-5.3` · `z-ai/glm-5.3-flash` · `grok-4.5` · `grok-4.6` · `grok-4.7` | chat completions (not individually exercised here) |
| `gpt-5.6-terra` | **Responses API only** — `/v1/chat/completions` answers **500** with *“当前codex渠道模型(gpt-5.6-terra等)支持的格式：OpenAI Responses (/responses)，不支持的格式：OpenAI (/v1/chat/completions)”* |

So a chat-channel id is the correct model for a health check. `/api/pricing` lists 5 rows, group `default` only, **no strict-$0 row** — the free tier is the signup credit, not a free model.

## 🧪 How to use the API

Base URL **`https://xeduapi.com/v1`** — OpenAI-compatible; keys are 48 characters with **no `sk-` prefix** and ride an `Authorization: Bearer` header.

```python
from openai import OpenAI
c = OpenAI(base_url="https://xeduapi.com/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-chat",
      messages=[{"role":"user","content":"gday"}]).choices[0].message.content)
```

The codex-channel models need the Responses API; the panel rejects `/v1/responses` with a bare input body (404), so wiring that channel is a separate exercise — everything else is plain OpenAI.

Quota is per account and shared by its keys, so **one account = one key** keeps the accounting clean (`usd_exchange_rate: 6.8` is a display rate; the credit itself is USD-denominated).

## 🛠 Quick start

```bash
cd xeduapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/cli.js --screen                     # vet the exits against the panel
node src/cli.js --count 5                    # five funded keys (no browser needed)
node src/cli.js --verify-only                # re-prove every key
node src/cli.js --connect-9router            # register them with a local 9Router
```

The tool creates a plain-gmail mailbox, requests the code, waits for it, registers with the same cookie jar, logs in, mints a token, reveals the key and proves it with a real completion before writing it down.

### 🖱️ The launcher

The launcher asks for the proxy list (optional — without one the CLI runs direct) and the account count, remembers both and runs the CLI — plus `--verify-only`, `--screen` and the 9Router connector.

## ✅ Verified working — every key is tested

Every check below ran on **2026-10-21** from this package's own CLI (`src/cli.js`), over public exits (no VPN in the loop).

| Check | Result |
| --- | --- |
| sign-up | **no browser needed** — `turnstile_check: false` |
| mail whitelist | **gmail.com ✓** · qq.com ✓ · `outlook.com` ✗; a dot or `+` in the local part is refused as a “special character” |
| code mail | «聚合api服务 email verification» from the panel's own relay, **1–2 s**, 6-char code, valid **10 minutes** |
| register | **200 `{"success":true}`** with the same cookie jar + a fresh code + a ≥8-char password |
| free tier | `GET /api/user/self` → **`quota = 100000` = $0.20** on a fresh account; `POST /api/user/checkin` → `Check-in feature is not enabled` |
| key route | the list shows it masked; `POST /api/token/<id>/key` returns the 48-char plaintext (group `default`) |
| `GET /v1/models` per key | **200**, 10 ids |
| `POST /v1/chat/completions` per key | **200** with content (`deepseek-chat`, `deepseek-v3`) — **2/2 keys LIVE** |
| codex channel | `gpt-5.6-terra` → **500** on chat completions, verbatim: needs **OpenAI Responses (/responses)** instead |
| end-to-end speed | **~45–70 s per key** (mail → register → key → proof) |

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 聚合api服务 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://xeduapi.com/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| mailbox | Emailnator over plain https | a **plain** gmail; the panel refuses dots and `+` |
| code | `GET /api/verification?email=` | arrives in **1–2 s** from `noreply@<panel-mail>`, subject «聚合api服务 email verification», 6-char code, valid 10 minutes |
| register | `POST /api/user/register` | body `{username,password,password2,email,verification_code,aff_code}`; **same cookie jar**, **fresh** code, password ≥8 |
| session | `POST /api/user/login` | `data.access_token` (Bearer JWT) |
| credit | `GET /api/user/self` | **`quota = 100000` = $0.20** on a fresh account |
| key | `POST /api/token/` → `POST /api/token/<id>/key` | group `default` (this panel's live name); the list shows the key masked and `/key` returns the plaintext |
| proof | `GET /v1/models` + `POST /v1/chat/completions` | `content || reasoning_content`; codex-channel ids are skipped (they need `/v1/responses`) |

## ⚙️ CLI options

```bash
node src/cli.js --count N
node src/cli.js --pool proxies.txt --exits 6
node src/cli.js --proxy socks5://host:port
node src/cli.js --model deepseek-chat
node src/cli.js --verify-only
node src/cli.js --screen
node src/cli.js --connect-9router --base http://localhost:20128 --password 123456
```

| Flag | Default | Meaning |
| --- | --- | --- |
| `--count N` | `1` | accounts to mint |
| `--pool FILE` | `proxies.txt` if present | exits, one per line (`http://`, `socks5://`, `socks4://`) |
| `--proxy URL` | — | pin a single exit |
| `--exits K` | `6` | exit candidates tried per account |
| `--model ID` | cheapest chat-channel id | model used for the live gate |
| `--verify-only` | off | re-prove `keys.txt` |
| `--screen` | off | vet the exit list against the panel |
| `--connect-9router` | off | run the 9Router connector next to this CLI |

## 🛰️ Behind a proxy

**Optional.** Without a pool the tool prints `DIRECT (no proxy)` and talks to the panel straight from this machine; with one, every panel request is pinned to an exit and a dead exit only costs its own attempt.

The mailbox is read **directly** on purpose — the mail gate is separate from the API host, and proxying Emailnator through a TLS-intercepting exit answers `unable to get local issuer certificate`. The reader forces IPv4 because this build resolves to IPv6 first with no route.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-proven key per line — git-ignored |
| `accounts.json` | one JSON record per account (mailbox, exit, signup quota, group, key, proof) — git-ignored |
| `proxies.txt` | your exits — git-ignored |
| `out/` | run logs — git-ignored |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Defaults: `--prefix xeduapi`, `--base-url https://xeduapi.com/v1`, `--model deepseek-chat`. Models are served as `xeduapi/<model id>` and the router balances across the keys of the node.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **聚合api服务** — [xeduapi.com](https://xeduapi.com) |
| 🎁 What the provider gives | one account per key — a $0.20 signup credit on every account, chat-verified, no card and no captcha |
| 🔑 What one key gets you | one API key scoped to its own account: the 10 model ids on the endpoint below, at your plan's limits. The quota lives on the **account**, which is exactly why this tool creates one account per key |
| 🌐 API shape | OpenAI-compatible: `POST https://xeduapi.com/v1/chat/completions` |
| 🔒 Your data | only xeduapi.com and the inbox backend you configure are contacted; keys stay on your machine |

## 🐞 Issues

If 聚合api服务 changes its address policy, its register shape, the token group or the catalogue, the tool stops at that step and says so. **[Open an issue](../../issues)** with the command and the exact output.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 xeduapi-bulk-apikey contributors

</div>

---

## ⚠️ Account risk & how to minimise it
