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

**批量创建聚合api服务账户及其 API 密钥 — 兼容 OpenAI 的推理 + 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-10%20served-412991?style=for-the-badge)](https://xeduapi.com/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-10-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么有这个项目

聚合api服务 (xeduapi.com) 是 New API 的一个分支（`v1.0.0-rc.45`），拥有该系列中最友好的注册门槛：注册是**开放的**，**没有验证码**，而且新账户在**创建时即获得额度** — `quota = 100000`（按每美元 500 000 额度计算，即 **$0.20**）。无需银行卡、无需手机号、无需 OAuth、无需每日签到：一封验证邮件加一次表单 POST，密钥即可生成并立即验证。

这个工具必须处理好的，是地址策略和渠道划分。邮件白名单接受 **gmail.com** 和 **qq.com**，但拒绝 `outlook.com`，而且 — 与其同类面板一样 — 它将本地部分中的**点号或 `+`** 视为“特殊字符”，因此加号/点号别名在这里行不通，可行的路径是直接读取一个**纯** `@gmail.com` 邮箱。在模型方面，目录是混合的：`deepseek-chat`、`deepseek-v3` 等通过 `/v1/chat/completions` 应答，而 **codex 渠道**（`gpt-5.6-terra` 及其同类）则以 HTTP 500 拒绝该端点，并提示你使用 **Responses API** — 网关会跳过这些 id，这样健康的密钥就不会因渠道不匹配而被误判。

## 🎁 免费额度 — 你能获得多少

| 项目 | 值 |
| --- | --- |
| 注册赠额 | **$0.20** — 注册后立即 `GET /api/user/self` 返回 `quota = 100000`（500 000 额度 = $1） |
| 每日签到 | **不可用** — `POST /api/user/checkin` 返回 `Check-in feature is not enabled` |
| 银行卡 / 手机 / OAuth | **均不需要** — 仅需邮箱验证码，`turnstile_check: false` |
| 能买到什么 | 覆盖 DeepSeek / StepFun / Z.ai / xAI 的 10 个模型，按面板公布的价格计费；不存在严格的 $0 行 |
| 每账户密钥 | 每账户一个密钥是自然形态 — 额度属于账户 |

由于没有每日刷新，可扩展的单位是**账户**：N 个账户 ⇒ N × $0.20 的额度。

> 💡 免费额度由聚合api服务设定，可能发生变化。请在 [xeduapi.com](https://xeduapi.com) 查看实时数据 — 并让工具自身的网关来判断：

```bash
```bash
# keys.txt 中的每个密钥：模型列表加一次真实补全
node src/cli.js --verify-only

# 手动操作（密钥不带 `sk-` 前缀）
curl https://xeduapi.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"gday"}],"max_tokens":64}'
```

网关统计 `content || reasoning_content`。检查时优先使用 chat 渠道的 id：`deepseek-chat` 和 `deepseek-v3` 是这里已验证的两个。
```

## 🤖 模型 — 全部 10 个

在有效密钥上执行 `GET /v1/models`（2026-10-21）— **10 个 id**：

| Id | 渠道 |
| --- | --- |
| `deepseek-chat` · `deepseek-v3` · `deepseek-ai/deepseek-v4.1-flash` | **chat completions** — 已验证可应答 |
| `stepfun-ai/step-5-preview` · `z-ai/glm-5.3` · `z-ai/glm-5.3-flash` · `grok-4.5` · `grok-4.6` · `grok-4.7` | chat completions（此处未逐一测试） |
| `gpt-5.6-terra` | **仅 Responses API** — `/v1/chat/completions` 返回 **500**，并提示 *“当前codex渠道模型(gpt-5.6-terra等)支持的格式：OpenAI Responses (/responses)，不支持的格式：OpenAI (/v1/chat/completions)”* |

因此，chat 渠道的 id 才是健康检查的正确模型。`/api/pricing` 列出 5 行，仅 `default` 分组，**没有严格的 $0 行** — 免费额度是注册赠额，而非免费模型。

## 🧪 如何使用 API

基础 URL **`https://xeduapi.com/v1`** — 兼容 OpenAI；密钥为 48 个字符，**不带 `sk-` 前缀**，通过 `Authorization: Bearer` 请求头传递。

```python
from openai import OpenAI
c = OpenAI(base_url="https://xeduapi.com/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-chat",
      messages=[{"role":"user","content":"gday"}]).choices[0].message.content)
```

codex 渠道的模型需要 Responses API；面板会以裸 input 请求体拒绝 `/v1/responses`（404），因此接入该渠道是另一项工作 — 其他一切都是标准的 OpenAI。

额度按账户计算，由其密钥共享，因此**一个账户 = 一个密钥**能让账目保持清晰（`usd_exchange_rate: 6.8` 是显示汇率；额度本身以美元计价）。

## 🛠 快速开始

```bash
cd xeduapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # 可选 — 没有它工具将直连运行
node src/cli.js --screen                     # 对照面板检查出口
node src/cli.js --count 5                    # 五个已充值密钥（无需浏览器）
node src/cli.js --verify-only                # 重新验证每个密钥
node src/cli.js --connect-9router            # 将它们注册到本地 9Router
```

该工具会创建一个纯 gmail 邮箱，请求验证码，等待验证码，使用同一 cookie jar 注册，登录，生成令牌，显示密钥，并在写入之前用一次真实补全进行验证。

### 🖱️ 启动器

启动器会询问代理列表（可选 — 没有则 CLI 直连运行）和账户数量，记住两者并运行 CLI — 外加 `--verify-only`、`--screen` 和 9Router 连接器。

## ✅ 已验证可用 — 每个密钥都经过测试

以下每项检查均于 **2026-10-21** 在本包自带的 CLI（`src/cli.js`）上运行，通过公共出口（全程无 VPN）。

| 检查 | 结果 |
| --- | --- |
| 注册 | **无需浏览器** — `turnstile_check: false` |
| 邮件白名单 | **gmail.com ✓** · qq.com ✓ · `outlook.com` ✗；本地部分中的点号或 `+` 会作为“特殊字符”被拒绝 |
| 验证码邮件 | 来自面板自有中继的 «聚合api服务 email verification»，**1–2 秒**，6 位验证码，有效期 **10 分钟** |
| 注册 | **200 `{"success":true}`**，使用同一 cookie jar + 新验证码 + 至少 8 位密码 |
| 免费额度 | 新账户 `GET /api/user/self` → **`quota = 100000` = $0.20**；`POST /api/user/checkin` → `Check-in feature is not enabled` |
| 密钥路径 | 列表显示为掩码；`POST /api/token/<id>/key` 返回 48 字符明文（分组 `default`） |
| 每个密钥的 `GET /v1/models` | **200**，10 个 id |
| 每个密钥的 `POST /v1/chat/completions` | **200** 且有内容（`deepseek-chat`、`deepseek-v3`）— **2/2 密钥 LIVE** |
| codex 渠道 | `gpt-5.6-terra` → chat completions 返回 **500**，原文提示：需要 **OpenAI Responses (/responses)** |
| 端到端速度 | **每个密钥约 45–70 秒**（邮件 → 注册 → 密钥 → 验证） |

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 聚合api服务 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://xeduapi.com/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 说明 |
| --- | --- | --- |
| 邮箱 | 通过纯 https 使用 Emailnator | 一个**纯** gmail；面板拒绝点号和 `+` |
| 验证码 | `GET /api/verification?email=` | 在 **1–2 秒**内从 `noreply@<panel-mail>` 到达，主题为 «聚合api服务 email verification»，6 位验证码，有效期 10 分钟 |
| 注册 | `POST /api/user/register` | 请求体 `{username,password,password2,email,verification_code,aff_code}`；**同一 cookie jar**，**新**验证码，密码至少 8 位 |
| 会话 | `POST /api/user/login` | `data.access_token`（Bearer JWT） |
| 额度 | `GET /api/user/self` | 新账户 **`quota = 100000` = $0.20** |
| 密钥 | `POST /api/token/` → `POST /api/token/<id>/key` | 分组 `default`（此面板的实时名称）；列表显示掩码密钥，`/key` 返回明文 |
| 验证 | `GET /v1/models` + `POST /v1/chat/completions` | `content || reasoning_content`；codex 渠道的 id 会被跳过（它们需要 `/v1/responses`） |

## ⚙️ CLI 选项

```bash
node src/cli.js --count N
node src/cli.js --pool proxies.txt --exits 6
node src/cli.js --proxy socks5://host:port
node src/cli.js --model deepseek-chat
node src/cli.js --verify-only
node src/cli.js --screen
node src/cli.js --connect-9router --base http://localhost:20128 --password 123456
```

| 标志 | 默认值 | 含义 |
| --- | --- | --- |
| `--count N` | `1` | 要创建的账户数 |
| `--pool FILE` | 若存在则为 `proxies.txt` | 出口，每行一个（`http://`、`socks5://`、`socks4://`） |
| `--proxy URL` | — | 固定单个出口 |
| `--exits K` | `6` | 每个账户尝试的出口候选数 |
| `--model ID` | 最便宜的 chat 渠道 id | 用于实时网关的模型 |
| `--verify-only` | 关闭 | 重新验证 `keys.txt` |
| `--screen` | 关闭 | 对照面板检查出口列表 |
| `--connect-9router` | 关闭 | 在此 CLI 旁运行 9Router 连接器 |

## 🛰️ 在代理之后

**可选。** 没有代理池时，工具会打印 `DIRECT (no proxy)` 并直接从本机与面板通信；有代理池时，每个面板请求都固定到一个出口，一个失效的出口只会损失它自己的那次尝试。

邮箱读取有意**直连** — 邮件网关与 API 主机是分开的，通过 TLS 拦截出口代理 Emailnator 会返回 `unable to get local issuer certificate`。读取器强制使用 IPv4，因为此构建会优先解析到 IPv6 但没有路由。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经实时验证的密钥 — 已被 git 忽略 |
| `accounts.json` | 每个账户一条 JSON 记录（邮箱、出口、注册额度、分组、密钥、验证）— 已被 git 忽略 |
| `proxies.txt` | 你的出口 — 已被 git 忽略 |
| `out/` | 运行日志 — 已被 git 忽略 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

默认值：`--prefix xeduapi`、`--base-url https://xeduapi.com/v1`、`--model deepseek-chat`。模型以 `xeduapi/<model id>` 形式提供，路由器会在该节点的密钥之间进行负载均衡。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供商 | **聚合api服务** — [xeduapi.com](https://xeduapi.com) |
| 🎁 提供商提供什么 | 每个密钥对应一个账户 — 每个账户 $0.20 注册赠额，经 chat 验证，无需银行卡也无需验证码 |
| 🔑 一个密钥能给你什么 | 一个作用域为其自身账户的 API 密钥：下方端点上的 10 个模型 id，按你的套餐限制使用。额度属于**账户**，这正是本工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://xeduapi.com/v1/chat/completions` |
| 🔒 你的数据 | 仅联系 xeduapi.com 和你配置的邮箱后端；密钥保留在你的机器上 |

## 🐞 问题反馈

如果聚合api服务更改了其地址策略、注册形态、令牌分组或目录，工具会在该步骤停止并说明原因。请**[提交 issue](../../issues)**，附上命令和确切输出。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 xeduapi-bulk-apikey contributors

</div>

---

## ⚠️ 账号风险与降低方法
