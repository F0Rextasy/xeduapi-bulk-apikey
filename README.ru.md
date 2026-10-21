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

**Массовое создание аккаунтов 聚合api服务 с API-ключами — OpenAI-совместимый инференс + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-10%20served-412991?style=for-the-badge)](https://xeduapi.com/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-10-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

聚合api服务 (xeduapi.com) — это форк New API (`v1.0.0-rc.45`) с самым дружелюбным входом в семействе: регистрация **открыта**, **капчи нет**, а новый аккаунт **пополняется при создании** — `quota = 100000` (это **$0.20** при 500 000 квоты за доллар). Ни карты, ни телефона, ни OAuth, ни ежедневного ритуала: одно письмо с подтверждением и POST-форма, и ключ можно выпустить и сразу доказать.

Что инструмент должен сделать правильно — это политика адресов и разделение каналов. Белый список почты принимает **gmail.com** и **qq.com**, но отклоняет `outlook.com`, и — как и родственные панели — считает **точку или `+`** в локальной части «специальным символом», поэтому plus/dot-алиасы здесь не работают, а рабочий путь — это **обычный** ящик `@gmail.com`, читаемый напрямую. На стороне моделей каталог смешанный: `deepseek-chat`, `deepseek-v3` и их родственники отвечают на `/v1/chat/completions`, тогда как **канал codex** (`gpt-5.6-terra` и его родственники) отклоняет эту конечную точку с HTTP 500 и сообщением, предлагающим использовать **Responses API** — шлюз пропускает эти id, чтобы здоровый ключ никогда не был обвинён в несоответствии канала.

## 🎁 Бесплатный тариф — сколько вы получаете

| Что | Значение |
| --- | --- |
| Кредит при регистрации | **$0.20** — `GET /api/user/self` сразу после регистрации возвращает `quota = 100000` (500 000 квоты = $1) |
| Ежедневная отметка | **недоступна** — `POST /api/user/checkin` отвечает `Check-in feature is not enabled` |
| Карта / телефон / OAuth | **не требуются** — только код по e-mail, `turnstile_check: false` |
| Что это покупает | 10 моделей от DeepSeek / StepFun / Z.ai / xAI по опубликованным тарифам панели; строки со строгим $0 не существует |
| Ключ на аккаунт | один ключ на аккаунт — естественная форма — кредит живёт на аккаунте |

Поскольку ежедневного обновления нет, единица масштабирования — это **аккаунты**: N аккаунтов ⇒ N × $0.20 кредита.

> 💡 Бесплатный тариф устанавливается 聚合api服务 и может измениться. Проверяйте актуальные цифры на [xeduapi.com](https://xeduapi.com) — и пусть шлюз самого инструмента решает:

```bash
```bash
# каждый ключ в keys.txt: список моделей плюс одно реальное завершение
node src/cli.js --verify-only

# вручную (ключи не имеют префикса `sk-`)
curl https://xeduapi.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"gday"}],"max_tokens":64}'
```

Шлюз считает `content || reasoning_content`. Для проверки предпочитайте id чат-канала: `deepseek-chat` и `deepseek-v3` — два доказанных здесь.
```

## 🤖 Модели — все 10 из них

`GET /v1/models` на живом ключе (2026-10-21) — **10 id**:

| Id | Канал |
| --- | --- |
| `deepseek-chat` · `deepseek-v3` · `deepseek-ai/deepseek-v4.1-flash` | **chat completions** — доказана работоспособность |
| `stepfun-ai/step-5-preview` · `z-ai/glm-5.3` · `z-ai/glm-5.3-flash` · `grok-4.5` · `grok-4.6` · `grok-4.7` | chat completions (здесь по отдельности не проверялись) |
| `gpt-5.6-terra` | **только Responses API** — `/v1/chat/completions` отвечает **500** с *«当前codex渠道模型(gpt-5.6-terra等)支持的格式：OpenAI Responses (/responses)，不支持的格式：OpenAI (/v1/chat/completions)»* |

Таким образом, id чат-канала — правильная модель для проверки работоспособности. `/api/pricing` перечисляет 5 строк, только группа `default`, **без строки со строгим $0** — бесплатный тариф — это кредит при регистрации, а не бесплатная модель.

## 🧪 Как использовать API

Базовый URL **`https://xeduapi.com/v1`** — OpenAI-совместимый; ключи состоят из 48 символов **без префикса `sk-`** и передаются в заголовке `Authorization: Bearer`.

```python
from openai import OpenAI
c = OpenAI(base_url="https://xeduapi.com/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-chat",
      messages=[{"role":"user","content":"gday"}]).choices[0].message.content)
```

Моделям канала codex нужен Responses API; панель отклоняет `/v1/responses` с голым телом input (404), поэтому подключение этого канала — отдельная задача — всё остальное — обычный OpenAI.

Квота привязана к аккаунту и разделяется его ключами, поэтому **один аккаунт = один ключ** сохраняет учёт чистым (`usd_exchange_rate: 6.8` — это отображаемый курс; сам кредит номинирован в USD).

## 🛠 Быстрый старт

```bash
cd xeduapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # необязательно — без него инструмент работает напрямую
node src/cli.js --screen                     # проверить выходы против панели
node src/cli.js --count 5                    # пять пополненных ключей (браузер не нужен)
node src/cli.js --verify-only                # перепроверить каждый ключ
node src/cli.js --connect-9router            # зарегистрировать их в локальном 9Router
```

Инструмент создаёт обычный gmail-ящик, запрашивает код, ждёт его, регистрируется с тем же cookie jar, входит, выпускает токен, раскрывает ключ и доказывает его реальным завершением, прежде чем записать.

### 🖱️ Лаунчер

Лаунчер запрашивает список прокси (необязательно — без него CLI работает напрямую) и количество аккаунтов, запоминает и то и другое и запускает CLI — плюс `--verify-only`, `--screen` и коннектор 9Router.

## ✅ Проверено — каждый ключ протестирован

Каждая проверка ниже выполнялась **2026-10-21** из собственного CLI этого пакета (`src/cli.js`), через публичные выходы (без VPN).

| Проверка | Результат |
| --- | --- |
| регистрация | **браузер не нужен** — `turnstile_check: false` |
| белый список почты | **gmail.com ✓** · qq.com ✓ · `outlook.com` ✗; точка или `+` в локальной части отклоняется как «специальный символ» |
| письмо с кодом | «聚合api服务 email verification» от собственного релея панели, **1–2 с**, 6-символьный код, действителен **10 минут** |
| регистрация | **200 `{"success":true}`** с тем же cookie jar + свежий код + пароль ≥8 символов |
| бесплатный тариф | `GET /api/user/self` → **`quota = 100000` = $0.20** на новом аккаунте; `POST /api/user/checkin` → `Check-in feature is not enabled` |
| маршрут ключа | в списке он отображается замаскированным; `POST /api/token/<id>/key` возвращает 48-символьный открытый текст (группа `default`) |
| `GET /v1/models` на ключ | **200**, 10 id |
| `POST /v1/chat/completions` на ключ | **200** с содержимым (`deepseek-chat`, `deepseek-v3`) — **2/2 ключа LIVE** |
| канал codex | `gpt-5.6-terra` → **500** на chat completions, дословно: требуется **OpenAI Responses (/responses)** |
| скорость сквозного процесса | **~45–70 с на ключ** (почта → регистрация → ключ → доказательство) |

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 聚合api服务 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://xeduapi.com/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| почтовый ящик | Emailnator по обычному https | **обычный** gmail; панель отклоняет точки и `+` |
| код | `GET /api/verification?email=` | приходит за **1–2 с** от `noreply@<panel-mail>`, тема «聚合api服务 email verification», 6-символьный код, действителен 10 минут |
| регистрация | `POST /api/user/register` | тело `{username,password,password2,email,verification_code,aff_code}`; **тот же cookie jar**, **свежий** код, пароль ≥8 |
| сессия | `POST /api/user/login` | `data.access_token` (Bearer JWT) |
| кредит | `GET /api/user/self` | **`quota = 100000` = $0.20** на новом аккаунте |
| ключ | `POST /api/token/` → `POST /api/token/<id>/key` | группа `default` (живое имя этой панели); в списке ключ замаскирован, а `/key` возвращает открытый текст |
| доказательство | `GET /v1/models` + `POST /v1/chat/completions` | `content || reasoning_content`; id канала codex пропускаются (им нужен `/v1/responses`) |

## ⚙️ Опции CLI

```bash
node src/cli.js --count N
node src/cli.js --pool proxies.txt --exits 6
node src/cli.js --proxy socks5://host:port
node src/cli.js --model deepseek-chat
node src/cli.js --verify-only
node src/cli.js --screen
node src/cli.js --connect-9router --base http://localhost:20128 --password 123456
```

| Флаг | По умолчанию | Значение |
| --- | --- | --- |
| `--count N` | `1` | сколько аккаунтов создать |
| `--pool FILE` | `proxies.txt`, если есть | выходы, по одному в строке (`http://`, `socks5://`, `socks4://`) |
| `--proxy URL` | — | закрепить один выход |
| `--exits K` | `6` | кандидатов-выходов, пробуемых на аккаунт |
| `--model ID` | самый дешёвый id чат-канала | модель, используемая для живой проверки |
| `--verify-only` | выкл. | перепроверить `keys.txt` |
| `--screen` | выкл. | проверить список выходов против панели |
| `--connect-9router` | выкл. | запустить коннектор 9Router рядом с этим CLI |

## 🛰️ За прокси

**Необязательно.** Без пула инструмент печатает `DIRECT (no proxy)` и общается с панелью напрямую с этой машины; с пулом каждый запрос к панели привязан к выходу, и мёртвый выход стоит только своей попытки.

Почтовый ящик читается **напрямую** намеренно — почтовый шлюз отделён от хоста API, и проксирование Emailnator через выход с перехватом TLS отвечает `unable to get local issuer certificate`. Читатель принудительно использует IPv4, потому что эта сборка сначала разрешает IPv6 без маршрута.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный вживую ключ на строку — игнорируется git |
| `accounts.json` | одна JSON-запись на аккаунт (почтовый ящик, выход, квота при регистрации, группа, ключ, доказательство) — игнорируется git |
| `proxies.txt` | ваши выходы — игнорируется git |
| `out/` | логи запусков — игнорируется git |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый OpenAI-совместимый роутер:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

По умолчанию: `--prefix xeduapi`, `--base-url https://xeduapi.com/v1`, `--model deepseek-chat`. Модели подаются как `xeduapi/<model id>`, и роутер балансирует между ключами узла.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **聚合api服务** — [xeduapi.com](https://xeduapi.com) |
| 🎁 Что даёт провайдер | один аккаунт на ключ — кредит $0.20 при регистрации на каждом аккаунте, проверено в чате, без карты и без капчи |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: 10 id моделей на конечной точке ниже, в пределах лимитов вашего тарифа. Квота живёт на **аккаунте**, и именно поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Форма API | OpenAI-совместимый: `POST https://xeduapi.com/v1/chat/completions` |
| 🔒 Ваши данные | связь только с xeduapi.com и настроенным вами бэкендом почтового ящика; ключи остаются на вашей машине |

## 🐞 Проблемы

Если 聚合api服务 изменит свою политику адресов, форму регистрации, группу токенов или каталог, инструмент остановится на этом шаге и сообщит об этом. **[Откройте issue](../../issues)** с командой и точным выводом.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 xeduapi-bulk-apikey contributors

</div>

---

## ⚠️ Риск блокировки и как его снизить
