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

**API 키로 聚合api服务 계정을 대량 생성 — OpenAI 호환 추론 + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-10%20served-412991?style=for-the-badge)](https://xeduapi.com/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-10-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증 완료](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 왜 만들었나

聚合api服务 (xeduapi.com)는 New API 포크(`v1.0.0-rc.45`)로, 같은 계열 중에서도 진입 장벽이 가장 낮습니다: 가입이 **개방**되어 있고, **캡차가 없으며**, 새 계정은 **생성 즉시 충전**됩니다 — `quota = 100000` (달러당 500 000 쿼터 기준으로 **$0.20**). 카드도, 전화번호도, OAuth도, 매일의 의식도 필요 없습니다: 인증 메일 한 통과 폼 POST 한 번이면 키를 즉시 발급받아 검증할 수 있습니다.

이 도구가 제대로 처리해야 하는 것은 주소 정책과 채널 분리입니다. 메일 화이트리스트는 **gmail.com**과 **qq.com**을 허용하지만 `outlook.com`은 거부하며, 형제 패널들과 마찬가지로 로컬 파트의 **점이나 `+`**를 "특수 문자"로 취급합니다. 따라서 plus/dot 별칭은 여기서는 통하지 않고, **일반** `@gmail.com` 사서함을 직접 읽는 것이 유효한 경로입니다. 모델 쪽 카탈로그는 혼합되어 있습니다: `deepseek-chat`, `deepseek-v3` 등은 `/v1/chat/completions`에서 응답하지만, **codex 채널**(`gpt-5.6-terra`와 그 형제들)은 해당 엔드포인트를 HTTP 500과 함께 거부하며 **Responses API**를 사용하라는 메시지를 반환합니다 — 게이트는 해당 id들을 건너뛰므로 채널 불일치 때문에 정상 키가 잘못 판정되는 일이 없습니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

| 항목 | 값 |
| --- | --- |
| 가입 크레딧 | **$0.20** — 가입 직후 `GET /api/user/self`가 `quota = 100000`을 반환 (500 000 쿼터 = $1) |
| 일일 출석 | **불가** — `POST /api/user/checkin`이 `Check-in feature is not enabled`를 반환 |
| 카드 / 전화 / OAuth | **모두 불필요** — 이메일 코드만, `turnstile_check: false` |
| 무엇을 살 수 있나 | DeepSeek / StepFun / Z.ai / xAI 전반의 10개 모델, 패널 공시 요율 기준; strict-$0 행은 없음 |
| 계정당 키 | 계정당 키 하나가 자연스러운 형태 — 크레딧이 계정에 귀속됨 |

일일 갱신이 없으므로 확장 단위는 **계정**입니다: N개 계정 ⇒ N × $0.20의 크레딧.

> 💡 무료 티어는 聚合api服务가 정하며 변경될 수 있습니다. 실시간 수치는 [xeduapi.com](https://xeduapi.com)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash

# every key in keys.txt: the model list plus one real completion
node src/cli.js --verify-only

# by hand (keys carry no `sk-` prefix)
curl https://xeduapi.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"gday"}],"max_tokens":64}'
```

게이트는 `content || reasoning_content`를 세고, 롤링 출구를 통해 짧은 후보 목록을 순회합니다: 12개 키 실행에서 검증된 것은 `deepseek-chat`, `deepseek-v3`, `z-ai/glm-5.3`입니다 (codex 채널 id는 500을 반환하므로 건너뜁니다).

## 🤖 모델 — 10개 전부

활성 키에서 `GET /v1/models` (2026-10-21) — **10개 id**:

| Id | 채널 |
| --- | --- |
| `deepseek-chat` · `deepseek-v3` · `deepseek-ai/deepseek-v4.1-flash` | **chat completions** — 응답 검증됨 |
| `stepfun-ai/step-5-preview` · `z-ai/glm-5.3` · `z-ai/glm-5.3-flash` · `grok-4.5` · `grok-4.6` · `grok-4.7` | chat completions (여기서 개별 검증하지는 않음) |
| `gpt-5.6-terra` | **Responses API 전용** — `/v1/chat/completions`이 **500**과 함께 *"当前codex渠道模型(gpt-5.6-terra等)支持的格式：OpenAI Responses (/responses)，不支持的格式：OpenAI (/v1/chat/completions)"*를 반환 |

따라서 상태 확인에는 chat 채널 id가 올바른 모델입니다. `/api/pricing`은 5개 행을 나열하며 그룹은 `default`뿐이고, **strict-$0 행은 없습니다** — 무료 티어는 무료 모델이 아니라 가입 크레딧입니다.

## 🧪 API 사용하기

Base URL **`https://xeduapi.com/v1`** — OpenAI 호환; 키는 48자이며 **`sk-` 접두사가 없고** `Authorization: Bearer` 헤더로 전달됩니다.

```python
from openai import OpenAI
c = OpenAI(base_url="https://xeduapi.com/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-chat",
      messages=[{"role":"user","content":"gday"}]).choices[0].message.content)
```

codex 채널 모델은 Responses API가 필요합니다; 패널은 순수 입력 본문으로 `/v1/responses`를 404로 거부하므로, 해당 채널 연결은 별도의 작업입니다 — 나머지는 모두 일반 OpenAI입니다.

쿼터는 계정별이며 그 키들이 공유하므로, **계정 하나 = 키 하나**가 회계를 깔끔하게 유지합니다 (`usd_exchange_rate: 6.8`은 표시용 환율이며, 크레딧 자체는 USD 기준입니다).

## 🛠 빠른 시작

```bash
cd xeduapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/cli.js --screen                     # vet the exits against the panel
node src/cli.js --count 5                    # five funded keys (no browser needed)
node src/cli.js --verify-only                # re-prove every key
node src/cli.js --connect-9router            # register them with a local 9Router
```

이 도구는 일반 gmail 사서함을 만들고, 코드를 요청하고, 기다린 뒤, 동일한 쿠키 jar로 가입하고, 로그인하고, 토큰을 발급하고, 키를 공개한 다음 실제 완성 요청으로 검증한 후에 기록합니다.

### 🖱️ 런처

런처는 프록시 목록(선택 사항 — 없으면 CLI는 직접 연결)과 계정 수를 묻고, 둘 다 기억한 뒤 CLI를 실행합니다 — `--verify-only`, `--screen`, 9Router 커넥터도 마찬가지입니다.

## ✅ 검증 완료 — 모든 키가 테스트됨

아래 모든 검사는 **2026-10-21**에 이 패키지 자체의 CLI(`src/cli.js`)로, 공용 출구를 통해 실행되었습니다 (VPN 미사용).

| 검사 | 결과 |
| --- | --- |
| 가입 | **브라우저 불필요** — `turnstile_check: false` |
| 메일 화이트리스트 | **gmail.com ✓** · qq.com ✓ · `outlook.com` ✗; 로컬 파트의 점이나 `+`는 "특수 문자"로 거부됨 |
| 코드 메일 | 패널 자체 릴레이에서 «聚合api服务 email verification», **1–2초**, 6자리 코드, 유효 **10분** |
| 가입 등록 | 동일한 쿠키 jar + 새 코드 + 8자 이상 비밀번호로 **200 `{"success":true}`** |
| 무료 티어 | 새 계정에서 `GET /api/user/self` → **`quota = 100000` = $0.20**; `POST /api/user/checkin` → `Check-in feature is not enabled` |
| 키 경로 | 목록에는 마스킹되어 표시됨; `POST /api/token/<id>/key`가 48자 평문을 반환 (그룹 `default`) |
| 키별 `GET /v1/models` | **200**, 10개 id |
| 키별 `POST /v1/chat/completions` | 콘텐츠와 함께 **200** (`deepseek-chat`, `deepseek-v3`, `z-ai/glm-5.3`) — **12/12 키 LIVE**; 2026-10-21 대량 발급: **2 → 12 키**, 게이트는 롤링 출구를 통해 후보 목록을 순회 |
| codex 채널 | `gpt-5.6-terra` → chat completions에서 **500**, 그대로: 대신 **OpenAI Responses (/responses)**가 필요 |
| 종단 간 속도 | **키당 약 45–70초** (메일 → 가입 → 키 → 검증) |

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 聚合api服务 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://xeduapi.com/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 사서함 | 일반 https를 통한 Emailnator | **일반** gmail; 패널은 점과 `+`를 거부 |
| 코드 | `GET /api/verification?email=` | `noreply@<panel-mail>`에서 **1–2초** 내 도착, 제목 «聚合api服务 email verification», 6자리 코드, 유효 10분 |
| 가입 등록 | `POST /api/user/register` | 본문 `{username,password,password2,email,verification_code,aff_code}`; **동일한 쿠키 jar**, **새** 코드, 비밀번호 8자 이상 |
| 세션 | `POST /api/user/login` | `data.access_token` (Bearer JWT) |
| 크레딧 | `GET /api/user/self` | 새 계정에서 **`quota = 100000` = $0.20** |
| 키 | `POST /api/token/` → `POST /api/token/<id>/key` | 그룹 `default` (이 패널의 실제 이름); 목록은 키를 마스킹해 표시하고 `/key`가 평문을 반환 |
| 검증 | `GET /v1/models` + `POST /v1/chat/completions` | `content || reasoning_content`; codex 채널 id는 건너뜀 (`/v1/responses` 필요) |

## ⚙️ CLI 옵션

```bash
node src/cli.js --count N
node src/cli.js --pool proxies.txt --exits 6
node src/cli.js --proxy socks5://host:port
node src/cli.js --model deepseek-chat
node src/cli.js --verify-only
node src/cli.js --screen
node src/cli.js --connect-9router --base http://localhost:20128 --password 123456
```

| 플래그 | 기본값 | 의미 |
| --- | --- | --- |
| `--count N` | `1` | 발급할 계정 수 |
| `--pool FILE` | 존재하면 `proxies.txt` | 출구, 한 줄에 하나 (`http://`, `socks5://`, `socks4://`) |
| `--proxy URL` | — | 단일 출구 고정 |
| `--exits K` | `6` | 계정당 시도할 출구 후보 |
| `--model ID` | 가장 저렴한 chat 채널 id | 실시간 게이트에 사용할 모델 |
| `--verify-only` | 꺼짐 | `keys.txt` 재검증 |
| `--screen` | 꺼짐 | 패널을 기준으로 출구 목록 점검 |
| `--connect-9router` | 꺼짐 | 이 CLI 옆에서 9Router 커넥터 실행 |

## 🛰️ 프록시 뒤에서

**선택 사항.** 풀이 없으면 도구는 `DIRECT (no proxy)`를 출력하고 이 머신에서 패널과 직접 통신합니다; 풀이 있으면 모든 패널 요청이 출구에 고정되고 죽은 출구는 자기 시도만 소모합니다.

사서함은 의도적으로 **직접** 읽습니다 — 메일 게이트는 API 호스트와 분리되어 있고, TLS를 가로채는 출구를 통해 Emailnator를 프록시하면 `unable to get local issuer certificate`가 반환됩니다. 리더는 IPv4를 강제하는데, 이 빌드가 경로 없이 IPv6로 먼저 해석되기 때문입니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 실시간 검증된 키가 한 줄에 하나 — git 무시됨 |
| `accounts.json` | 계정당 JSON 레코드 하나 (사서함, 출구, 가입 쿼터, 그룹, 키, 검증) — git 무시됨 |
| `proxies.txt` | 사용자의 출구 — git 무시됨 |
| `out/` | 실행 로그 — git 무시됨 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅, OpenAI 호환 라우터입니다:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

기본값: `--prefix xeduapi`, `--base-url https://xeduapi.com/v1`, `--model deepseek-chat`. 모델은 `xeduapi/<model id>`로 제공되며 라우터는 노드의 키들 사이에서 부하를 분산합니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **聚合api服务** — [xeduapi.com](https://xeduapi.com) |
| 🎁 제공자가 주는 것 | 키당 계정 하나 — 모든 계정에 $0.20 가입 크레딧, chat 검증됨, 카드도 캡차도 없음 |
| 🔑 키 하나로 얻는 것 | 자기 계정에 한정된 API 키 하나: 아래 엔드포인트의 10개 모델 id, 요금제 한도 내에서. 쿼터는 **계정**에 귀속되며, 이것이 바로 이 도구가 키당 계정 하나를 만드는 이유 |
| 🌐 API 형태 | OpenAI 호환: `POST https://xeduapi.com/v1/chat/completions` |
| 🔒 데이터 | xeduapi.com과 설정한 사서함 백엔드만 접촉되며; 키는 사용자 머신에 남음 |

## 🐞 이슈

聚合api服务가 주소 정책, 가입 형식, 토큰 그룹 또는 카탈로그를 변경하면 도구는 해당 단계에서 멈추고 그 사실을 알립니다. 명령과 정확한 출력을 포함해 **[이슈를 열어주세요](../../issues)**.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 xeduapi-bulk-apikey contributors

</div>

---

## ⚠️ 계정 위험 및 최소화 방법