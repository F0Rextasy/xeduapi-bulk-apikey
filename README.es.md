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

**Crea cuentas de 聚合api服务 en masa con claves API — inferencia compatible con OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-10%20served-412991?style=for-the-badge)](https://xeduapi.com/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-10-of-them) · [🧪 Usa la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

聚合api服务 (xeduapi.com) es un fork de New API (`v1.0.0-rc.45`) con la puerta más amigable de la familia: el registro es **abierto**, **no hay captcha**, y una cuenta nueva **se financia al crearse** — `quota = 100000` (eso es **$0.20** a 500 000 de cuota por dólar). Sin tarjeta, sin teléfono, sin OAuth, sin ritual diario: un correo de verificación y un POST de formulario, y la clave puede acuñarse y probarse de inmediato.

Lo que la herramienta debe hacer bien es la política de direcciones y la división de canales. La lista blanca de correo acepta **gmail.com** y **qq.com** pero rechaza `outlook.com`, y — como sus paneles hermanos — trata un **punto o un `+`** en la parte local como un "carácter especial", así que los alias con plus/punto están muertos aquí y el carril que funciona es un buzón **simple** `@gmail.com` leído directamente. Del lado de los modelos, el catálogo es mixto: `deepseek-chat`, `deepseek-v3` y compañía responden en `/v1/chat/completions`, mientras que el **canal codex** (`gpt-5.6-terra` y sus hermanos) rechaza ese endpoint con HTTP 500 y un mensaje que te dice que uses la **Responses API** — la puerta omite esos ids para que una clave sana nunca sea culpada por un desajuste de canal.

## 🎁 Nivel gratuito — cuánto obtienes

| Qué | Valor |
| --- | --- |
| Crédito de registro | **$0.20** — `GET /api/user/self` justo después del registro devuelve `quota = 100000` (500 000 de cuota = $1) |
| Check-in diario | **no disponible** — `POST /api/user/checkin` responde `Check-in feature is not enabled` |
| Tarjeta / teléfono / OAuth | **ninguno requerido** — solo código por correo, `turnstile_check: false` |
| Qué compra | 10 modelos entre DeepSeek / StepFun / Z.ai / xAI, a las tarifas publicadas del panel; no existe ninguna fila de $0 estricto |
| Clave por cuenta | una clave por cuenta es la forma natural — el crédito vive en la cuenta |

Como no hay renovación diaria, la unidad que escala es **cuentas**: N cuentas ⇒ N × $0.20 de crédito.

> 💡 El nivel gratuito lo define 聚合api服务 y puede cambiar. Consulta los números en vivo en [xeduapi.com](https://xeduapi.com) — y deja que la propia puerta de la herramienta decida:

```bash
```bash

# every key in keys.txt: the model list plus one real completion
node src/cli.js --verify-only

# by hand (keys carry no `sk-` prefix)
curl https://xeduapi.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"gday"}],"max_tokens":64}'
```

The gate counts `content || reasoning_content` and walks a short candidate list over rolling exits: `deepseek-chat`, `deepseek-v3` and `z-ai/glm-5.3` are what the 12-key run proved (codex-channel ids answer 500 and are skipped).
```

## 🤖 Modelos — los 10

`GET /v1/models` en una clave activa (2026-10-21) — **10 ids**:

| Id | Canal |
| --- | --- |
| `deepseek-chat` · `deepseek-v3` · `deepseek-ai/deepseek-v4.1-flash` | **chat completions** — se comprobó que responden |
| `stepfun-ai/step-5-preview` · `z-ai/glm-5.3` · `z-ai/glm-5.3-flash` · `grok-4.5` · `grok-4.6` · `grok-4.7` | chat completions (no ejercitados individualmente aquí) |
| `gpt-5.6-terra` | **solo Responses API** — `/v1/chat/completions` responde **500** con *"当前codex渠道模型(gpt-5.6-terra等)支持的格式：OpenAI Responses (/responses)，不支持的格式：OpenAI (/v1/chat/completions)"* |

Así que un id de canal chat es el modelo correcto para una comprobación de estado. `/api/pricing` lista 5 filas, solo grupo `default`, **sin fila de $0 estricto** — el nivel gratuito es el crédito de registro, no un modelo gratuito.

## 🧪 Cómo usar la API

URL base **`https://xeduapi.com/v1`** — compatible con OpenAI; las claves tienen 48 caracteres **sin prefijo `sk-`** y viajan en una cabecera `Authorization: Bearer`.

```python
from openai import OpenAI
c = OpenAI(base_url="https://xeduapi.com/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-chat",
      messages=[{"role":"user","content":"gday"}]).choices[0].message.content)
```

Los modelos del canal codex necesitan la Responses API; el panel rechaza `/v1/responses` con un cuerpo de entrada simple (404), así que conectar ese canal es un ejercicio aparte — todo lo demás es OpenAI puro.

La cuota es por cuenta y la comparten sus claves, así que **una cuenta = una clave** mantiene la contabilidad limpia (`usd_exchange_rate: 6.8` es una tasa de visualización; el crédito en sí está denominado en USD).

## 🛠 Inicio rápido

```bash
cd xeduapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/cli.js --screen                     # vet the exits against the panel
node src/cli.js --count 5                    # five funded keys (no browser needed)
node src/cli.js --verify-only                # re-prove every key
node src/cli.js --connect-9router            # register them with a local 9Router
```

La herramienta crea un buzón gmail simple, solicita el código, espera por él, se registra con el mismo cookie jar, inicia sesión, acuña un token, revela la clave y la prueba con una completion real antes de anotarla.

### 🖱️ El lanzador

El lanzador pide la lista de proxies (opcional — sin una, el CLI se ejecuta directo) y el número de cuentas, recuerda ambos y ejecuta el CLI — además de `--verify-only`, `--screen` y el conector 9Router.

## ✅ Verificado y funcionando — cada clave se prueba

Cada comprobación a continuación se ejecutó el **2026-10-21** desde el propio CLI de este paquete (`src/cli.js`), sobre salidas públicas (sin VPN en el proceso).

| Comprobación | Resultado |
| --- | --- |
| registro | **no se necesita navegador** — `turnstile_check: false` |
| lista blanca de correo | **gmail.com ✓** · qq.com ✓ · `outlook.com` ✗; un punto o `+` en la parte local se rechaza como "carácter especial" |
| correo del código | «聚合api服务 email verification» desde el propio relay del panel, **1–2 s**, código de 6 caracteres, válido **10 minutos** |
| registro | **200 `{"success":true}`** con el mismo cookie jar + un código nuevo + una contraseña de ≥8 caracteres |
| nivel gratuito | `GET /api/user/self` → **`quota = 100000` = $0.20** en una cuenta nueva; `POST /api/user/checkin` → `Check-in feature is not enabled` |
| ruta de la clave | la lista la muestra enmascarada; `POST /api/token/<id>/key` devuelve el texto plano de 48 caracteres (grupo `default`) |
| `GET /v1/models` por clave | **200**, 10 ids |
| `POST /v1/chat/completions` por clave | **200** con contenido (`deepseek-chat`, `deepseek-v3`, `z-ai/glm-5.3`) — **cada clave verificada**; acuñación en masa 2026-10-21: **claves acuñadas de principio a fin**, la puerta recorre una lista corta de candidatos sobre salidas rotativas |
| canal codex | `gpt-5.6-terra` → **500** en chat completions, textual: necesita **OpenAI Responses (/responses)** en su lugar |
| velocidad de extremo a extremo | **~45–70 s por clave** (correo → registro → clave → prueba) |

> **Controles de calidad.** Cada clave aquí pasó un `chat-200` en vivo antes de escribirse en `keys.txt`
> (las claves muertas nunca se entregan). Las combinaciones del router siguen la misma regla a nivel de modelo: una entrada se
> añade **solo si el modelo responde `chat-200` y puede llamar herramientas** — un modelo sin soporte de herramientas,
> una clave muerta o un proveedor muerto se descarta en lugar de añadirse. Vuelve a ejecutar el paso de verificación cuando quieras;
> los fallos se reportan, nunca se ocultan.

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 聚合api服务 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://xeduapi.com/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| buzón | Emailnator sobre https simple | un gmail **simple**; el panel rechaza puntos y `+` |
| código | `GET /api/verification?email=` | llega en **1–2 s** desde `noreply@<panel-mail>`, asunto «聚合api服务 email verification», código de 6 caracteres, válido 10 minutos |
| registro | `POST /api/user/register` | cuerpo `{username,password,password2,email,verification_code,aff_code}`; **mismo cookie jar**, código **nuevo**, contraseña ≥8 |
| sesión | `POST /api/user/login` | `data.access_token` (Bearer JWT) |
| crédito | `GET /api/user/self` | **`quota = 100000` = $0.20** en una cuenta nueva |
| clave | `POST /api/token/` → `POST /api/token/<id>/key` | grupo `default` (el nombre en vivo de este panel); la lista muestra la clave enmascarada y `/key` devuelve el texto plano |
| prueba | `GET /v1/models` + `POST /v1/chat/completions` | `content || reasoning_content`; los ids del canal codex se omiten (necesitan `/v1/responses`) |

## ⚙️ Opciones del CLI

```bash
node src/cli.js --count N
node src/cli.js --pool proxies.txt --exits 6
node src/cli.js --proxy socks5://host:port
node src/cli.js --model deepseek-chat
node src/cli.js --verify-only
node src/cli.js --screen
node src/cli.js --connect-9router --base http://localhost:20128 --password 123456
```

| Flag | Predeterminado | Significado |
| --- | --- | --- |
| `--count N` | `1` | cuentas a acuñar |
| `--pool FILE` | `proxies.txt` si existe | salidas, una por línea (`http://`, `socks5://`, `socks4://`) |
| `--proxy URL` | — | fija una sola salida |
| `--exits K` | `6` | salidas candidatas probadas por cuenta |
| `--model ID` | id de canal chat más barato | modelo usado para la puerta en vivo |
| `--verify-only` | off | vuelve a probar `keys.txt` |
| `--screen` | off | examina la lista de salidas contra el panel |
| `--connect-9router` | off | ejecuta el conector 9Router junto a este CLI |

## 🛰️ Detrás de un proxy

**Opcional.** Sin un pool, la herramienta imprime `DIRECT (no proxy)` y habla con el panel directamente desde esta máquina; con uno, cada solicitud al panel se fija a una salida y una salida muerta solo cuesta su propio intento.

El buzón se lee **directamente** a propósito — la puerta de correo es independiente del host de la API, y enrutar Emailnator a través de una salida con interceptación TLS responde `unable to get local issuer certificate`. El lector fuerza IPv4 porque esta compilación resuelve primero a IPv6 sin ruta.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave probada en vivo por línea — ignorada por git |
| `accounts.json` | un registro JSON por cuenta (buzón, salida, cuota de registro, grupo, clave, prueba) — ignorado por git |
| `proxies.txt` | tus salidas — ignorado por git |
| `out/` | registros de ejecución — ignorados por git |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado y compatible con OpenAI:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Predeterminados: `--prefix xeduapi`, `--base-url https://xeduapi.com/v1`, `--model deepseek-chat`. Los modelos se sirven como `xeduapi/<model id>` y el router balancea entre las claves del nodo.

## 🔌 Conectar con OmniRoute

[OmniRoute](https://omniroute.online) es un router autoalojado y compatible con OpenAI:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Predeterminados: `--prefix xeduapi`, `--base-url https://xeduapi.com/v1`, `--model deepseek-chat`. Los modelos se sirven como `xeduapi/<model id>` y el router balancea entre las claves del nodo.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **聚合api服务** — [xeduapi.com](https://xeduapi.com) |
| 🎁 Qué da el proveedor | una cuenta por clave — un crédito de registro de $0.20 en cada cuenta, verificado por chat, sin tarjeta y sin captcha |
| 🔑 Qué te da una clave | una clave API limitada a su propia cuenta: los 10 ids de modelo en el endpoint de abajo, a los límites de tu plan. La cuota vive en la **cuenta**, que es exactamente por lo que esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | compatible con OpenAI: `POST https://xeduapi.com/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta a xeduapi.com y al backend de buzón que configures; las claves se quedan en tu máquina |

## 🐞 Problemas

Si 聚合api服务 cambia su política de direcciones, la forma de su registro, el grupo de tokens o el catálogo, la herramienta se detiene en ese paso y lo indica. **[Abre un issue](../../issues)** con el comando y la salida exacta.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 xeduapi-bulk-apikey contributors

</div>