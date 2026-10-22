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

**Crie em massa contas do 聚合api服务 com chaves de API — inferência compatível com OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-10%20served-412991?style=for-the-badge)](https://xeduapi.com/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Camada gratuita](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-10-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

聚合api服务 (xeduapi.com) é um fork do New API (`v1.0.0-rc.45`) com o portão mais amigável da família: o registro é **aberto**, **não há captcha**, e uma conta nova é **financiada na criação** — `quota = 100000` (isto é **$0.20** a 500 000 de cota por dólar). Sem cartão, sem telefone, sem OAuth, sem ritual diário: um e-mail de verificação e um POST de formulário, e a chave pode ser cunhada e comprovada imediatamente.

O que a ferramenta precisa acertar é a política de endereços e a divisão de canais. A lista de permissões de e-mail aceita **gmail.com** e **qq.com**, mas recusa `outlook.com` e — como seus painéis irmãos — trata um **ponto ou um `+`** na parte local como um "caractere especial", então aliases com plus/ponto estão mortos aqui e o trilho que funciona é uma caixa de correio **simples** `@gmail.com` lida diretamente. Do lado dos modelos, o catálogo é misto: `deepseek-chat`, `deepseek-v3` e companhia respondem em `/v1/chat/completions`, enquanto o **canal codex** (`gpt-5.6-terra` e seus irmãos) recusa esse endpoint com HTTP 500 e uma mensagem dizendo para usar a **Responses API** — o portão pula esses ids para que uma chave saudável nunca seja culpada por uma incompatibilidade de canal.

## 🎁 Camada gratuita — quanto você recebe

| O quê | Valor |
| --- | --- |
| Crédito de cadastro | **$0.20** — `GET /api/user/self` logo após o registro retorna `quota = 100000` (500 000 de cota = $1) |
| Check-in diário | **não disponível** — `POST /api/user/checkin` responde `Check-in feature is not enabled` |
| Cartão / telefone / OAuth | **nenhum exigido** — apenas código por e-mail, `turnstile_check: false` |
| O que isso compra | 10 modelos entre DeepSeek / StepFun / Z.ai / xAI, pelas tarifas publicadas do painel; não existe linha de $0 estrito |
| Chave por conta | uma chave por conta é a forma natural — o crédito vive na conta |

Como não há renovação diária, a unidade que escala é **contas**: N contas ⇒ N × $0.20 de crédito.

> 💡 A camada gratuita é definida pelo 聚合api服务 e pode mudar. Confira os números ao vivo em [xeduapi.com](https://xeduapi.com) — e deixe o próprio portão da ferramenta decidir:

```bash

# every key in keys.txt: the model list plus one real completion
node src/cli.js --verify-only

# by hand (keys carry no `sk-` prefix)
curl https://xeduapi.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"gday"}],"max_tokens":64}'
```

O portão conta `content || reasoning_content` e percorre uma pequena lista de candidatos sobre saídas rotativas: `deepseek-chat`, `deepseek-v3` e `z-ai/glm-5.3` foram o que a execução com 12 chaves comprovou (ids do canal codex respondem 500 e são pulados).

## 🤖 Modelos — todos os 10

`GET /v1/models` em uma chave ativa (2026-10-21) — **10 ids**:

| Id | Canal |
| --- | --- |
| `deepseek-chat` · `deepseek-v3` · `deepseek-ai/deepseek-v4.1-flash` | **chat completions** — comprovadamente respondíveis |
| `stepfun-ai/step-5-preview` · `z-ai/glm-5.3` · `z-ai/glm-5.3-flash` · `grok-4.5` · `grok-4.6` · `grok-4.7` | chat completions (não exercitados individualmente aqui) |
| `gpt-5.6-terra` | **Somente Responses API** — `/v1/chat/completions` responde **500** com *“当前codex渠道模型(gpt-5.6-terra等)支持的格式：OpenAI Responses (/responses)，不支持的格式：OpenAI (/v1/chat/completions)”* |

Portanto, um id do canal de chat é o modelo correto para uma verificação de integridade. `/api/pricing` lista 5 linhas, apenas o grupo `default`, **sem linha de $0 estrito** — a camada gratuita é o crédito de cadastro, não um modelo gratuito.

## 🧪 Como usar a API

URL base **`https://xeduapi.com/v1`** — compatível com OpenAI; as chaves têm 48 caracteres **sem prefixo `sk-`** e usam um cabeçalho `Authorization: Bearer`.

```python
from openai import OpenAI
c = OpenAI(base_url="https://xeduapi.com/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-chat",
      messages=[{"role":"user","content":"gday"}]).choices[0].message.content)
```

Os modelos do canal codex precisam da Responses API; o painel rejeita `/v1/responses` com um corpo de entrada simples (404), então conectar esse canal é um exercício à parte — todo o resto é OpenAI puro.

A cota é por conta e compartilhada por suas chaves, então **uma conta = uma chave** mantém a contabilidade limpa (`usd_exchange_rate: 6.8` é uma taxa de exibição; o crédito em si é denominado em USD).

## 🛠 Início rápido

```bash
cd xeduapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/cli.js --screen                     # vet the exits against the panel
node src/cli.js --count 5                    # five funded keys (no browser needed)
node src/cli.js --verify-only                # re-prove every key
node src/cli.js --connect-9router            # register them with a local 9Router
```

A ferramenta cria uma caixa de correio gmail simples, solicita o código, espera por ele, registra-se com o mesmo cookie jar, faz login, cunha um token, revela a chave e a comprova com uma conclusão real antes de anotá-la.

### 🖱️ O inicializador

O inicializador pede a lista de proxies (opcional — sem uma, o CLI roda direto) e o número de contas, lembra ambos e executa o CLI — além de `--verify-only`, `--screen` e o conector 9Router.

## ✅ Verificado e funcionando — toda chave é testada

Toda verificação abaixo rodou em **2026-10-21** a partir do próprio CLI deste pacote (`src/cli.js`), sobre saídas públicas (sem VPN no circuito).

| Verificação | Resultado |
| --- | --- |
| cadastro | **sem necessidade de navegador** — `turnstile_check: false` |
| lista de permissões de e-mail | **gmail.com ✓** · qq.com ✓ · `outlook.com` ✗; um ponto ou `+` na parte local é recusado como "caractere especial" |
| e-mail com código | «聚合api服务 email verification» do próprio relay do painel, **1–2 s**, código de 6 caracteres, válido por **10 minutos** |
| registro | **200 `{"success":true}`** com o mesmo cookie jar + um código novo + uma senha de ≥8 caracteres |
| camada gratuita | `GET /api/user/self` → **`quota = 100000` = $0.20** em uma conta nova; `POST /api/user/checkin` → `Check-in feature is not enabled` |
| rota da chave | a lista a mostra mascarada; `POST /api/token/<id>/key` retorna o texto simples de 48 caracteres (grupo `default`) |
| `GET /v1/models` por chave | **200**, 10 ids |
| `POST /v1/chat/completions` por chave | **200** com conteúdo (`deepseek-chat`, `deepseek-v3`, `z-ai/glm-5.3`) — **12/12 chaves ATIVAS**; criação em massa 2026-10-21: **2 → 12 chaves**, o portão percorre uma lista de candidatos sobre saídas rotativas |
| canal codex | `gpt-5.6-terra` → **500** em chat completions, literalmente: precisa da **OpenAI Responses (/responses)** em vez disso |
| velocidade ponta a ponta | **~45–70 s por chave** (e-mail → registro → chave → comprovação) |

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 聚合api服务 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://xeduapi.com/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Notas |
| --- | --- | --- |
| caixa de correio | Emailnator via https simples | um gmail **simples**; o painel recusa pontos e `+` |
| código | `GET /api/verification?email=` | chega em **1–2 s** de `noreply@<panel-mail>`, assunto «聚合api服务 email verification», código de 6 caracteres, válido por 10 minutos |
| registro | `POST /api/user/register` | corpo `{username,password,password2,email,verification_code,aff_code}`; **mesmo cookie jar**, código **novo**, senha ≥8 |
| sessão | `POST /api/user/login` | `data.access_token` (Bearer JWT) |
| crédito | `GET /api/user/self` | **`quota = 100000` = $0.20** em uma conta nova |
| chave | `POST /api/token/` → `POST /api/token/<id>/key` | grupo `default` (o nome ativo deste painel); a lista mostra a chave mascarada e `/key` retorna o texto simples |
| comprovação | `GET /v1/models` + `POST /v1/chat/completions` | `content || reasoning_content`; ids do canal codex são pulados (precisam de `/v1/responses`) |

## ⚙️ Opções do CLI

```bash
node src/cli.js --count N
node src/cli.js --pool proxies.txt --exits 6
node src/cli.js --proxy socks5://host:port
node src/cli.js --model deepseek-chat
node src/cli.js --verify-only
node src/cli.js --screen
node src/cli.js --connect-9router --base http://localhost:20128 --password 123456
```

| Flag | Padrão | Significado |
| --- | --- | --- |
| `--count N` | `1` | contas a criar |
| `--pool FILE` | `proxies.txt` se presente | saídas, uma por linha (`http://`, `socks5://`, `socks4://`) |
| `--proxy URL` | — | fixa uma única saída |
| `--exits K` | `6` | candidatos de saída tentados por conta |
| `--model ID` | id mais barato do canal de chat | modelo usado para o portão ativo |
| `--verify-only` | desligado | recomprova `keys.txt` |
| `--screen` | desligado | avalia a lista de saídas contra o painel |
| `--connect-9router` | desligado | executa o conector 9Router junto a este CLI |

## 🛰️ Atrás de um proxy

**Opcional.** Sem um pool, a ferramenta imprime `DIRECT (no proxy)` e fala com o painel diretamente desta máquina; com um, toda requisição ao painel é fixada a uma saída e uma saída morta custa apenas sua própria tentativa.

A caixa de correio é lida **diretamente** de propósito — o portão de e-mail é separado do host da API, e passar o Emailnator por uma saída com interceptação TLS responde `unable to get local issuer certificate`. O leitor força IPv4 porque esta build resolve para IPv6 primeiro sem rota.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave comprovada ao vivo por linha — ignorado pelo git |
| `accounts.json` | um registro JSON por conta (caixa de correio, saída, cota de cadastro, grupo, chave, comprovação) — ignorado pelo git |
| `proxies.txt` | suas saídas — ignorado pelo git |
| `out/` | logs de execução — ignorado pelo git |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Padrões: `--prefix xeduapi`, `--base-url https://xeduapi.com/v1`, `--model deepseek-chat`. Os modelos são servidos como `xeduapi/<model id>` e o roteador faz balanceamento entre as chaves do nó.

## 🔑 O que uma chave oferece

| | |
| --- | --- |
| 🏢 Provedor | **聚合api服务** — [xeduapi.com](https://xeduapi.com) |
| 🎁 O que o provedor dá | uma conta por chave — um crédito de cadastro de $0.20 em cada conta, verificado por chat, sem cartão e sem captcha |
| 🔑 O que uma chave oferece | uma chave de API limitada à sua própria conta: os 10 ids de modelo no endpoint abaixo, nos limites do seu plano. A cota vive na **conta**, e é exatamente por isso que esta ferramenta cria uma conta por chave |
| 🌐 Formato da API | compatível com OpenAI: `POST https://xeduapi.com/v1/chat/completions` |
| 🔒 Seus dados | apenas xeduapi.com e o backend de caixa de correio que você configurar são contatados; as chaves ficam na sua máquina |

## 🐞 Problemas

Se o 聚合api服务 mudar sua política de endereços, o formato do registro, o grupo de tokens ou o catálogo, a ferramenta para nessa etapa e avisa. **[Abra uma issue](../../issues)** com o comando e a saída exata.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 xeduapi-bulk-apikey contributors

</div>

---

## ⚠️ Risco de conta e como minimizá-lo