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

**APIキー付きの聚合apiサービスアカウントを一括作成 — OpenAI互換の推論 + 9Routerコネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-10%20served-412991?style=for-the-badge)](https://xeduapi.com/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-10-of-them) · [🧪 APIの使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

聚合apiサービス (xeduapi.com) は New API のフォーク (`v1.0.0-rc.45`) で、このファミリーの中でもっとも親しみやすいゲートを持っています。登録は**オープン**で、**キャプチャはなく**、新規アカウントは**作成時に資金が入ります** — `quota = 100000`（1ドルあたり500 000クォータなので**$0.20**）。カードも電話もOAuthも毎日の儀式も不要で、確認メール1通とフォームPOSTだけで、キーはすぐに発行して証明できます。

このツールが正しく処理しなければならないのは、アドレスポリシーとチャネルの分割です。メールのホワイトリストは **gmail.com** と **qq.com** を受け付けますが `outlook.com` は拒否し、同系列のパネルと同様にローカル部分の**ドットや `+`** を「特殊文字」として扱うため、プラス/ドットのエイリアスはここでは使えず、機能する経路は**プレーンな** `@gmail.com` メールボックスを直接読むことです。モデル側ではカタログは混在しています。`deepseek-chat`、`deepseek-v3` などは `/v1/chat/completions` で応答しますが、**codexチャネル**（`gpt-5.6-terra` とその同類）はそのエンドポイントを HTTP 500 と**Responses API**を使うよう促すメッセージで拒否します — ゲートはそれらのIDをスキップするので、健全なキーがチャネルの不一致のせいにされることはありません。

## 🎁 無料枠 — どれだけ得られるか

| 項目 | 値 |
| --- | --- |
| 登録クレジット | **$0.20** — 登録直後の `GET /api/user/self` は `quota = 100000` を返す（500 000クォータ = $1） |
| デイリーチェックイン | **利用不可** — `POST /api/user/checkin` は `Check-in feature is not enabled` と応答 |
| カード / 電話 / OAuth | **一切不要** — メールコードのみ、`turnstile_check: false` |
| 何が買えるか | DeepSeek / StepFun / Z.ai / xAI にわたる10モデル、パネル公表の料金で。厳密な$0の行は存在しない |
| アカウントあたりのキー | アカウントあたり1キーが自然な形 — クレジットはアカウントに紐づく |

毎日のリフレッシュがないため、スケールする単位は**アカウント**です。Nアカウント ⇒ N × $0.20 のクレジット。

> 💡 無料枠は聚合apiサービスによって設定され、変更される可能性があります。最新の数値は [xeduapi.com](https://xeduapi.com) で確認してください — そしてツール自身のゲートに判断させましょう:

```bash
```bash
# keys.txt のすべてのキー: モデルリストと実際の補完1回
node src/cli.js --verify-only

# 手動で（キーに `sk-` プレフィックスはない）
curl https://xeduapi.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"gday"}],"max_tokens":64}'
```

ゲートは `content || reasoning_content` をカウントします。チェックにはチャットチャネルのIDを推奨します: `deepseek-chat` と `deepseek-v3` がここで証明された2つです。
```

## 🤖 モデル — そのすべて10個

稼働中のキーでの `GET /v1/models`（2026-10-21） — **10個のID**:

| ID | チャネル |
| --- | --- |
| `deepseek-chat` · `deepseek-v3` · `deepseek-ai/deepseek-v4.1-flash` | **chat completions** — 応答可能を証明済み |
| `stepfun-ai/step-5-preview` · `z-ai/glm-5.3` · `z-ai/glm-5.3-flash` · `grok-4.5` · `grok-4.6` · `grok-4.7` | chat completions（ここでは個別には検証していない） |
| `gpt-5.6-terra` | **Responses APIのみ** — `/v1/chat/completions` は **500** と *「当前codex渠道模型(gpt-5.6-terra等)支持的格式：OpenAI Responses (/responses)，不支持的格式：OpenAI (/v1/chat/completions)」* を返す |

したがって、ヘルスチェックに正しいモデルはチャットチャネルのIDです。`/api/pricing` は5行をリストし、グループは `default` のみ、**厳密な$0の行はない** — 無料枠は登録クレジットであり、無料モデルではありません。

## 🧪 APIの使い方

ベースURL **`https://xeduapi.com/v1`** — OpenAI互換。キーは48文字で **`sk-` プレフィックスはなく**、`Authorization: Bearer` ヘッダーで渡します。

```python
from openai import OpenAI
c = OpenAI(base_url="https://xeduapi.com/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-chat",
      messages=[{"role":"user","content":"gday"}]).choices[0].message.content)
```

codexチャネルのモデルはResponses APIが必要です。パネルは素の入力ボディでの `/v1/responses` を404で拒否するため、そのチャネルの配線は別の作業です — それ以外はすべてプレーンなOpenAIです。

クォータはアカウントごとで、そのキーによって共有されるため、**1アカウント = 1キー**が会計をクリーンに保ちます（`usd_exchange_rate: 6.8` は表示レートで、クレジット自体はUSD建てです）。

## 🛠 クイックスタート

```bash
cd xeduapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # 任意 — なければツールは直接実行
node src/cli.js --screen                     # パネルに対して出口を審査
node src/cli.js --count 5                    # 5つの資金入りキー（ブラウザ不要）
node src/cli.js --verify-only                # すべてのキーを再証明
node src/cli.js --connect-9router            # ローカル9Routerに登録
```

ツールはプレーンなgmailメールボックスを作成し、コードを要求し、それを待ち、同じCookieジャーで登録し、ログインし、トークンを発行し、キーを表示し、書き留める前に実際の補完で証明します。

### 🖱️ ランチャー

ランチャーはプロキシリスト（任意 — なければCLIは直接実行）とアカウント数を尋ね、両方を記憶してCLIを実行します — さらに `--verify-only`、`--screen`、9Routerコネクタも。

## ✅ 検証済みで動作 — すべてのキーがテストされる

以下のすべてのチェックは **2026-10-21** にこのパッケージ自身のCLI（`src/cli.js`）から、公開出口経由で実行されました（VPNは介在なし）。

| チェック | 結果 |
| --- | --- |
| サインアップ | **ブラウザ不要** — `turnstile_check: false` |
| メールホワイトリスト | **gmail.com ✓** · qq.com ✓ · `outlook.com` ✗; ローカル部分のドットや `+` は「特殊文字」として拒否される |
| コードメール | パネル自身のリレーからの «聚合apiサービス email verification»、**1〜2秒**、6文字コード、有効期間**10分** |
| 登録 | 同じCookieジャー + 新しいコード + 8文字以上のパスワードで **200 `{"success":true}`** |
| 無料枠 | 新規アカウントで `GET /api/user/self` → **`quota = 100000` = $0.20**; `POST /api/user/checkin` → `Check-in feature is not enabled` |
| キー経路 | リストではマスクされて表示; `POST /api/token/<id>/key` が48文字の平文を返す（グループ `default`） |
| キーごとの `GET /v1/models` | **200**、10個のID |
| キーごとの `POST /v1/chat/completions` | コンテンツ付きで **200**（`deepseek-chat`、`deepseek-v3`） — **2/2キー LIVE** |
| codexチャネル | `gpt-5.6-terra` → chat completionsで **500**、逐語的に: 代わりに **OpenAI Responses (/responses)** が必要 |
| エンドツーエンド速度 | **キーあたり約45〜70秒**（メール → 登録 → キー → 証明） |

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 聚合apiサービス page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://xeduapi.com/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| メールボックス | プレーンhttps経由のEmailnator | **プレーンな**gmail; パネルはドットと `+` を拒否 |
| コード | `GET /api/verification?email=` | `noreply@<panel-mail>` から**1〜2秒**で到着、件名 «聚合apiサービス email verification»、6文字コード、有効期間10分 |
| 登録 | `POST /api/user/register` | ボディ `{username,password,password2,email,verification_code,aff_code}`; **同じCookieジャー**、**新しい**コード、パスワード8文字以上 |
| セッション | `POST /api/user/login` | `data.access_token`（Bearer JWT） |
| クレジット | `GET /api/user/self` | 新規アカウントで **`quota = 100000` = $0.20** |
| キー | `POST /api/token/` → `POST /api/token/<id>/key` | グループ `default`（このパネルの稼働中の名前）; リストはキーをマスクして表示し、`/key` が平文を返す |
| 証明 | `GET /v1/models` + `POST /v1/chat/completions` | `content || reasoning_content`; codexチャネルのIDはスキップされる（`/v1/responses` が必要） |

## ⚙️ CLIオプション

```bash
node src/cli.js --count N
node src/cli.js --pool proxies.txt --exits 6
node src/cli.js --proxy socks5://host:port
node src/cli.js --model deepseek-chat
node src/cli.js --verify-only
node src/cli.js --screen
node src/cli.js --connect-9router --base http://localhost:20128 --password 123456
```

| フラグ | デフォルト | 意味 |
| --- | --- | --- |
| `--count N` | `1` | 発行するアカウント数 |
| `--pool FILE` | 存在すれば `proxies.txt` | 出口、1行に1つ（`http://`、`socks5://`、`socks4://`） |
| `--proxy URL` | — | 単一の出口を固定 |
| `--exits K` | `6` | アカウントごとに試す出口候補 |
| `--model ID` | 最安のチャットチャネルID | ライブゲートに使うモデル |
| `--verify-only` | オフ | `keys.txt` を再証明 |
| `--screen` | オフ | 出口リストをパネルに対して審査 |
| `--connect-9router` | オフ | このCLIの隣で9Routerコネクタを実行 |

## 🛰️ プロキシの背後で

**任意。** プールがなければツールは `DIRECT (no proxy)` と表示し、このマシンから直接パネルと通信します。プールがあれば、すべてのパネルリクエストは出口に固定され、死んだ出口はその試行分のコストしかかかりません。

メールボックスは意図的に**直接**読み取られます — メールゲートはAPIホストとは別であり、TLS傍受する出口経由でEmailnatorをプロキシすると `unable to get local issuer certificate` と応答します。リーダーはIPv4を強制します。このビルドはルートなしで最初にIPv6に解決するためです。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1行に1つのライブ証明済みキー — git無視 |
| `accounts.json` | アカウントごとに1つのJSONレコード（メールボックス、出口、登録クォータ、グループ、キー、証明） — git無視 |
| `proxies.txt` | あなたの出口 — git無視 |
| `out/` | 実行ログ — git無視 |

## 🔌 9Routerに接続

[9Router](https://9router.com) はセルフホストのOpenAI互換ルーターです:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

デフォルト: `--prefix xeduapi`、`--base-url https://xeduapi.com/v1`、`--model deepseek-chat`。モデルは `xeduapi/<model id>` として提供され、ルーターはノードのキー間で負荷分散します。

## 🔑 1つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **聚合apiサービス** — [xeduapi.com](https://xeduapi.com) |
| 🎁 プロバイダーが提供するもの | キーあたり1アカウント — すべてのアカウントに$0.20の登録クレジット、チャット検証済み、カードもキャプチャも不要 |
| 🔑 1つのキーで得られるもの | 自身のアカウントにスコープされた1つのAPIキー: 下記エンドポイントの10個のモデルID、プランの制限で。クォータは**アカウント**に紐づくため、このツールがキーあたり1アカウントを作成するのはまさにそのためです |
| 🌐 APIの形 | OpenAI互換: `POST https://xeduapi.com/v1/chat/completions` |
| 🔒 あなたのデータ | 接触するのはxeduapi.comと設定した受信箱バックエンドのみ; キーはあなたのマシンに留まります |

## 🐞 問題

聚合apiサービスがアドレスポリシー、登録の形、トークングループ、またはカタログを変更した場合、ツールはそのステップで停止し、そう告げます。コマンドと正確な出力を添えて **[issueを開いてください](../../issues)**。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 xeduapi-bulk-apikey contributors

</div>

---

## ⚠️ アカウントリスクと最小化
