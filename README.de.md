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

**Massenhaft 聚合api服务-Konten mit API-Schlüsseln erstellen — OpenAI-kompatible Inferenz + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-10%20served-412991?style=for-the-badge)](https://xeduapi.com/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-10-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

聚合api服务 (xeduapi.com) ist ein New-API-Fork (`v1.0.0-rc.45`) mit dem freundlichsten Zugang der Familie: Die Registrierung ist **offen**, es gibt **kein Captcha**, und ein frisches Konto wird **bei der Erstellung aufgeladen** — `quota = 100000` (das sind **$0.20** bei 500 000 Quota pro Dollar). Keine Karte, kein Telefon, kein OAuth, kein tägliches Ritual: eine Bestätigungsmail und ein Formular-POST, und der Schlüssel kann sofort erzeugt und nachgewiesen werden.

Was das Tool richtig hinbekommen muss, ist die Adressrichtlinie und die Kanalaufteilung. Die Mail-Whitelist akzeptiert **gmail.com** und **qq.com**, lehnt aber `outlook.com` ab, und — wie seine Schwester-Panels — behandelt es einen **Punkt oder ein `+`** im lokalen Teil als „Sonderzeichen", sodass Plus-/Punkt-Aliase hier tot sind und die funktionierende Schiene ein **einfaches** `@gmail.com`-Postfach ist, das direkt gelesen wird. Auf der Modellseite ist der Katalog gemischt: `deepseek-chat`, `deepseek-v3` und Verwandte antworten auf `/v1/chat/completions`, während der **Codex-Kanal** (`gpt-5.6-terra` und seine Geschwister) diesen Endpunkt mit HTTP 500 und einer Meldung ablehnt, die besagt, dass du die **Responses API** verwenden sollst — das Gate überspringt diese IDs, damit ein gesunder Schlüssel nie für eine Kanal-Fehlpaarung verantwortlich gemacht wird.

## 🎁 Kostenlose Stufe — wie viel du bekommst

| Was | Wert |
| --- | --- |
| Anmeldeguthaben | **$0.20** — `GET /api/user/self` direkt nach der Registrierung liefert `quota = 100000` (500 000 Quota = $1) |
| Täglicher Check-in | **nicht verfügbar** — `POST /api/user/checkin` antwortet `Check-in feature is not enabled` |
| Karte / Telefon / OAuth | **nichts erforderlich** — nur E-Mail-Code, `turnstile_check: false` |
| Was es kauft | 10 Modelle über DeepSeek / StepFun / Z.ai / xAI, zu den veröffentlichten Tarifen des Panels; es gibt keine strikte $0-Zeile |
| Schlüssel pro Konto | ein Schlüssel pro Konto ist die natürliche Form — das Guthaben liegt auf dem Konto |

Da es keine tägliche Auffrischung gibt, ist die Einheit, die skaliert, **Konten**: N Konten ⇒ N × $0.20 Guthaben.

> 💡 Die kostenlose Stufe wird von 聚合api服务 festgelegt und kann sich ändern. Prüfe die Live-Zahlen auf [xeduapi.com](https://xeduapi.com) — und lass das Gate des Tools selbst entscheiden:

```bash
```bash
# jeder Schlüssel in keys.txt: die Modellliste plus eine echte Completion
node src/cli.js --verify-only

# von Hand (Schlüssel tragen kein `sk-`-Präfix)
curl https://xeduapi.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"gday"}],"max_tokens":64}'
```

Das Gate zählt `content || reasoning_content`. Bevorzuge für die Prüfung eine Chat-Kanal-ID: `deepseek-chat` und `deepseek-v3` sind die beiden hier nachgewiesenen.
```

## 🤖 Modelle — alle 10 davon

`GET /v1/models` mit einem Live-Schlüssel (2026-10-21) — **10 IDs**:

| ID | Kanal |
| --- | --- |
| `deepseek-chat` · `deepseek-v3` · `deepseek-ai/deepseek-v4.1-flash` | **Chat Completions** — als beantwortbar nachgewiesen |
| `stepfun-ai/step-5-preview` · `z-ai/glm-5.3` · `z-ai/glm-5.3-flash` · `grok-4.5` · `grok-4.6` · `grok-4.7` | Chat Completions (hier nicht einzeln getestet) |
| `gpt-5.6-terra` | **nur Responses API** — `/v1/chat/completions` antwortet mit **500** und *„当前codex渠道模型(gpt-5.6-terra等)支持的格式：OpenAI Responses (/responses)，不支持的格式：OpenAI (/v1/chat/completions)"* |

Eine Chat-Kanal-ID ist also das richtige Modell für einen Health-Check. `/api/pricing` listet 5 Zeilen, nur Gruppe `default`, **keine strikte $0-Zeile** — die kostenlose Stufe ist das Anmeldeguthaben, kein kostenloses Modell.

## 🧪 Die API verwenden

Basis-URL **`https://xeduapi.com/v1`** — OpenAI-kompatibel; Schlüssel sind 48 Zeichen mit **keinem `sk-`-Präfix** und reisen in einem `Authorization: Bearer`-Header.

```python
from openai import OpenAI
c = OpenAI(base_url="https://xeduapi.com/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-chat",
      messages=[{"role":"user","content":"gday"}]).choices[0].message.content)
```

Die Modelle des Codex-Kanals benötigen die Responses API; das Panel lehnt `/v1/responses` mit einem bloßen Input-Body ab (404), daher ist die Verdrahtung dieses Kanals eine separate Übung — alles andere ist reines OpenAI.

Das Kontingent gilt pro Konto und wird von dessen Schlüsseln geteilt, daher hält **ein Konto = ein Schlüssel** die Abrechnung sauber (`usd_exchange_rate: 6.8` ist ein Anzeigekurs; das Guthaben selbst ist in USD denominiert).

## 🛠 Schnellstart

```bash
cd xeduapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — ohne sie läuft das Tool direkt
node src/cli.js --screen                     # die Exits gegen das Panel prüfen
node src/cli.js --count 5                    # fünf aufgeladene Schlüssel (kein Browser nötig)
node src/cli.js --verify-only                # jeden Schlüssel erneut nachweisen
node src/cli.js --connect-9router            # sie bei einem lokalen 9Router registrieren
```

Das Tool erstellt ein einfaches Gmail-Postfach, fordert den Code an, wartet darauf, registriert sich mit demselben Cookie-Jar, meldet sich an, erzeugt ein Token, gibt den Schlüssel preis und weist ihn mit einer echten Completion nach, bevor es ihn aufschreibt.

### 🖱️ Der Launcher

Der Launcher fragt nach der Proxy-Liste (optional — ohne eine läuft die CLI direkt) und der Kontenanzahl, merkt sich beides und führt die CLI aus — plus `--verify-only`, `--screen` und den 9Router-Connector.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

Jede Prüfung unten lief am **2026-10-21** über die eigene CLI dieses Pakets (`src/cli.js`), über öffentliche Exits (kein VPN im Spiel).

| Prüfung | Ergebnis |
| --- | --- |
| Registrierung | **kein Browser nötig** — `turnstile_check: false` |
| Mail-Whitelist | **gmail.com ✓** · qq.com ✓ · `outlook.com` ✗; ein Punkt oder `+` im lokalen Teil wird als „Sonderzeichen" abgelehnt |
| Code-Mail | «聚合api服务 email verification» vom eigenen Relay des Panels, **1–2 s**, 6-stelliger Code, gültig **10 Minuten** |
| Registrieren | **200 `{"success":true}`** mit demselben Cookie-Jar + einem frischen Code + einem Passwort mit ≥8 Zeichen |
| Kostenlose Stufe | `GET /api/user/self` → **`quota = 100000` = $0.20** bei einem frischen Konto; `POST /api/user/checkin` → `Check-in feature is not enabled` |
| Schlüsselroute | die Liste zeigt ihn maskiert; `POST /api/token/<id>/key` liefert den 48-stelligen Klartext (Gruppe `default`) |
| `GET /v1/models` pro Schlüssel | **200**, 10 IDs |
| `POST /v1/chat/completions` pro Schlüssel | **200** mit Inhalt (`deepseek-chat`, `deepseek-v3`) — **2/2 Schlüssel LIVE** |
| Codex-Kanal | `gpt-5.6-terra` → **500** bei Chat Completions, wörtlich: benötigt stattdessen **OpenAI Responses (/responses)** |
| End-to-End-Geschwindigkeit | **~45–70 s pro Schlüssel** (Mail → Registrierung → Schlüssel → Nachweis) |

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 聚合api服务 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://xeduapi.com/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Postfach | Emailnator über einfaches https | ein **einfaches** Gmail; das Panel lehnt Punkte und `+` ab |
| Code | `GET /api/verification?email=` | kommt in **1–2 s** von `noreply@<panel-mail>`, Betreff «聚合api服务 email verification», 6-stelliger Code, gültig 10 Minuten |
| Registrieren | `POST /api/user/register` | Body `{username,password,password2,email,verification_code,aff_code}`; **derselbe Cookie-Jar**, **frischer** Code, Passwort ≥8 |
| Sitzung | `POST /api/user/login` | `data.access_token` (Bearer JWT) |
| Guthaben | `GET /api/user/self` | **`quota = 100000` = $0.20** bei einem frischen Konto |
| Schlüssel | `POST /api/token/` → `POST /api/token/<id>/key` | Gruppe `default` (der Live-Name dieses Panels); die Liste zeigt den Schlüssel maskiert und `/key` liefert den Klartext |
| Nachweis | `GET /v1/models` + `POST /v1/chat/completions` | `content || reasoning_content`; Codex-Kanal-IDs werden übersprungen (sie benötigen `/v1/responses`) |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count N
node src/cli.js --pool proxies.txt --exits 6
node src/cli.js --proxy socks5://host:port
node src/cli.js --model deepseek-chat
node src/cli.js --verify-only
node src/cli.js --screen
node src/cli.js --connect-9router --base http://localhost:20128 --password 123456
```

| Flag | Standard | Bedeutung |
| --- | --- | --- |
| `--count N` | `1` | zu erstellende Konten |
| `--pool FILE` | `proxies.txt`, falls vorhanden | Exits, eine pro Zeile (`http://`, `socks5://`, `socks4://`) |
| `--proxy URL` | — | einen einzelnen Exit festlegen |
| `--exits K` | `6` | pro Konto versuchte Exit-Kandidaten |
| `--model ID` | günstigste Chat-Kanal-ID | für das Live-Gate verwendetes Modell |
| `--verify-only` | aus | `keys.txt` erneut nachweisen |
| `--screen` | aus | die Exit-Liste gegen das Panel prüfen |
| `--connect-9router` | aus | den 9Router-Connector neben dieser CLI ausführen |

## 🛰️ Hinter einem Proxy

**Optional.** Ohne einen Pool gibt das Tool `DIRECT (no proxy)` aus und spricht direkt von dieser Maschine mit dem Panel; mit einem wird jede Panel-Anfrage an einen Exit gebunden und ein toter Exit kostet nur seinen eigenen Versuch.

Das Postfach wird absichtlich **direkt** gelesen — das Mail-Gate ist vom API-Host getrennt, und Emailnator über einen TLS-abfangenden Exit zu proxien antwortet mit `unable to get local issuer certificate`. Der Reader erzwingt IPv4, weil dieser Build zuerst auf IPv6 auflöst, ohne Route.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-nachgewiesener Schlüssel pro Zeile — von Git ignoriert |
| `accounts.json` | ein JSON-Datensatz pro Konto (Postfach, Exit, Anmeldequota, Gruppe, Schlüssel, Nachweis) — von Git ignoriert |
| `proxies.txt` | deine Exits — von Git ignoriert |
| `out/` | Ausführungsprotokolle — von Git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Standardwerte: `--prefix xeduapi`, `--base-url https://xeduapi.com/v1`, `--model deepseek-chat`. Modelle werden als `xeduapi/<model id>` bereitgestellt und der Router verteilt die Last über die Schlüssel des Knotens.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **聚合api服务** — [xeduapi.com](https://xeduapi.com) |
| 🎁 Was der Anbieter gibt | ein Konto pro Schlüssel — ein $0.20-Anmeldeguthaben auf jedem Konto, chat-verifiziert, keine Karte und kein Captcha |
| 🔑 Was ein Schlüssel dir bringt | einen API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 10 Modell-IDs am unten stehenden Endpunkt, zu den Limits deines Tarifs. Das Kontingent liegt auf dem **Konto**, weshalb dieses Tool genau ein Konto pro Schlüssel erstellt |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://xeduapi.com/v1/chat/completions` |
| 🔒 Deine Daten | nur xeduapi.com und das von dir konfigurierte Inbox-Backend werden kontaktiert; Schlüssel bleiben auf deiner Maschine |

## 🐞 Probleme

Wenn 聚合api服务 seine Adressrichtlinie, seine Registrierungsform, die Token-Gruppe oder den Katalog ändert, stoppt das Tool an diesem Schritt und sagt es. **[Eröffne ein Issue](../../issues)** mit dem Befehl und der exakten Ausgabe.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 xeduapi-bulk-apikey contributors

</div>

---

## ⚠️ Konto-Risiko und Minimierung
