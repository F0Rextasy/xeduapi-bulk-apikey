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

**聚合api服务 hesaplarını API anahtarlarıyla toplu oluşturun — OpenAI uyumlu çıkarım + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-10%20served-412991?style=for-the-badge)](https://xeduapi.com/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-10-of-them) · [🧪 API'yi kullanın](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

聚合api服务 (xeduapi.com), ailenin en dostane kapısına sahip bir New API çatalıdır (`v1.0.0-rc.45`): kayıt **açık**, **captcha yok** ve yeni bir hesap **oluşturulduğu anda fonlanır** — `quota = 100000` (bu, dolar başına 500 000 kota üzerinden **$0.20**'dir). Kart yok, telefon yok, OAuth yok, günlük ritüel yok: bir doğrulama e-postası ve bir form POST'u, ve anahtar hemen üretilip kanıtlanabilir.

Aracın doğru yapması gereken şey adres politikası ve kanal ayrımıdır. Posta beyaz listesi **gmail.com** ve **qq.com**'u kabul eder ama `outlook.com`'u reddeder ve — kardeş panelleri gibi — yerel kısımdaki bir **nokta veya `+`** işaretini "özel karakter" sayar, dolayısıyla plus/nokta takma adları burada işe yaramaz ve çalışan ray, doğrudan okunan **düz** bir `@gmail.com` posta kutusudur. Model tarafında katalog karışıktır: `deepseek-chat`, `deepseek-v3` ve benzerleri `/v1/chat/completions` üzerinde yanıt verirken, **codex kanalı** (`gpt-5.6-terra` ve kardeşleri) bu uç noktayı HTTP 500 ve **Responses API** kullanmanızı söyleyen bir mesajla reddeder — kapı bu kimlikleri atlar, böylece sağlıklı bir anahtar asla bir kanal uyuşmazlığı yüzünden suçlanmaz.

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

| Ne | Değer |
| --- | --- |
| Kayıt kredisi | **$0.20** — kayıttan hemen sonra `GET /api/user/self` `quota = 100000` döndürür (500 000 kota = $1) |
| Günlük giriş | **mevcut değil** — `POST /api/user/checkin` `Check-in feature is not enabled` yanıtını verir |
| Kart / telefon / OAuth | **hiçbiri gerekli değil** — yalnızca e-posta kodu, `turnstile_check: false` |
| Ne satın alır | DeepSeek / StepFun / Z.ai / xAI genelinde 10 model, panelin yayınlanmış ücretlerinden; katı $0 satırı yok |
| Hesap başına anahtar | hesap başına bir anahtar doğal biçimdir — kredi hesapta yaşar |

Günlük yenileme olmadığı için ölçeklenen birim **hesaplardır**: N hesap ⇒ N × $0.20 kredi.

> 💡 Ücretsiz katman 聚合api服务 tarafından belirlenir ve değişebilir. Canlı sayıları [xeduapi.com](https://xeduapi.com) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
# every key in keys.txt: the model list plus one real completion
node src/cli.js --verify-only

# by hand (keys carry no `sk-` prefix)
curl https://xeduapi.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"gday"}],"max_tokens":64}'
```

Kapı `content || reasoning_content` sayar ve dönen çıkışlar üzerinde kısa bir aday listesini gezer: 12 anahtarlık çalışmanın kanıtladığı şey `deepseek-chat`, `deepseek-v3` ve `z-ai/glm-5.3`'tür (codex kanalı kimlikleri 500 yanıtlar ve atlanır).

## 🤖 Modeller — 10'unun tamamı

Canlı bir anahtarda `GET /v1/models` (2026-10-21) — **10 kimlik**:

| Kimlik | Kanal |
| --- | --- |
| `deepseek-chat` · `deepseek-v3` · `deepseek-ai/deepseek-v4.1-flash` | **chat completions** — yanıtlanabilir olduğu kanıtlandı |
| `stepfun-ai/step-5-preview` · `z-ai/glm-5.3` · `z-ai/glm-5.3-flash` · `grok-4.5` · `grok-4.6` · `grok-4.7` | chat completions (burada tek tek denenmedi) |
| `gpt-5.6-terra` | **yalnızca Responses API** — `/v1/chat/completions` **500** yanıtını *"当前codex渠道模型(gpt-5.6-terra等)支持的格式：OpenAI Responses (/responses)，不支持的格式：OpenAI (/v1/chat/completions)"* mesajıyla verir |

Dolayısıyla bir sağlık kontrolü için doğru model bir chat kanalı kimliğidir. `/api/pricing` 5 satır listeler, yalnızca `default` grubu, **katı $0 satırı yok** — ücretsiz katman kayıt kredisidir, ücretsiz bir model değil.

## 🧪 API nasıl kullanılır

Temel URL **`https://xeduapi.com/v1`** — OpenAI uyumlu; anahtarlar 48 karakterdir ve **`sk-` öneki yoktur**, bir `Authorization: Bearer` başlığıyla taşınır.

```python
from openai import OpenAI
c = OpenAI(base_url="https://xeduapi.com/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-chat",
      messages=[{"role":"user","content":"gday"}]).choices[0].message.content)
```

Codex kanalı modelleri Responses API'yi gerektirir; panel `/v1/responses`'u çıplak bir input gövdesiyle reddeder (404), dolayısıyla o kanalı bağlamak ayrı bir çalışmadır — geri kalan her şey düz OpenAI'dır.

Kota hesap başına ve anahtarları tarafından paylaşılır, dolayısıyla **bir hesap = bir anahtar** muhasebeyi temiz tutar (`usd_exchange_rate: 6.8` bir görüntüleme kurudur; kredinin kendisi USD cinsindendir).

## 🛠 Hızlı başlangıç

```bash
cd xeduapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/cli.js --screen                     # vet the exits against the panel
node src/cli.js --count 5                    # five funded keys (no browser needed)
node src/cli.js --verify-only                # re-prove every key
node src/cli.js --connect-9router            # register them with a local 9Router
```

Araç düz bir gmail posta kutusu oluşturur, kodu ister, bekler, aynı cookie kavanozuyla kaydolur, giriş yapar, bir token üretir, anahtarı açığa çıkarır ve yazmadan önce gerçek bir tamamlama ile kanıtlar.

### 🖱️ Başlatıcı

Başlatıcı proxy listesini (isteğe bağlı — olmadan CLI doğrudan çalışır) ve hesap sayısını sorar, ikisini de hatırlar ve CLI'yi çalıştırır — ayrıca `--verify-only`, `--screen` ve 9Router bağlayıcısını.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

Aşağıdaki her kontrol **2026-10-21** tarihinde bu paketin kendi CLI'sinden (`src/cli.js`) çalıştırıldı, genel çıkışlar üzerinden (döngüde VPN yok).

| Kontrol | Sonuç |
| --- | --- |
| kayıt | **tarayıcı gerekmez** — `turnstile_check: false` |
| posta beyaz listesi | **gmail.com ✓** · qq.com ✓ · `outlook.com` ✗; yerel kısımdaki bir nokta veya `+` "özel karakter" olarak reddedilir |
| kod postası | panelin kendi aktarıcısından «聚合api服务 email verification», **1–2 sn**, 6 karakterli kod, **10 dakika** geçerli |
| kayıt | aynı cookie kavanozu + taze bir kod + en az 8 karakterli bir parola ile **200 `{"success":true}`** |
| ücretsiz katman | yeni bir hesapta `GET /api/user/self` → **`quota = 100000` = $0.20**; `POST /api/user/checkin` → `Check-in feature is not enabled` |
| anahtar yolu | liste onu maskeli gösterir; `POST /api/token/<id>/key` 48 karakterli düz metni döndürür (`default` grubu) |
| anahtar başına `GET /v1/models` | **200**, 10 kimlik |
| anahtar başına `POST /v1/chat/completions` | içerikle **200** (`deepseek-chat`, `deepseek-v3`, `z-ai/glm-5.3`) — **12/12 anahtar CANLI**; toplu üretim 2026-10-21: **2 → 12 anahtar**, kapı dönen çıkışlar üzerinde bir aday listesini gezer |
| codex kanalı | `gpt-5.6-terra` → chat completions üzerinde **500**, birebir: bunun yerine **OpenAI Responses (/responses)** gerektirir |
| uçtan uca hız | **anahtar başına ~45–70 sn** (posta → kayıt → anahtar → kanıt) |

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 聚合api服务 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://xeduapi.com/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| posta kutusu | düz https üzerinden Emailnator | **düz** bir gmail; panel noktaları ve `+` işaretini reddeder |
| kod | `GET /api/verification?email=` | `noreply@<panel-mail>` adresinden **1–2 sn** içinde gelir, konu «聚合api服务 email verification», 6 karakterli kod, 10 dakika geçerli |
| kayıt | `POST /api/user/register` | gövde `{username,password,password2,email,verification_code,aff_code}`; **aynı cookie kavanozu**, **taze** kod, parola ≥8 |
| oturum | `POST /api/user/login` | `data.access_token` (Bearer JWT) |
| kredi | `GET /api/user/self` | yeni bir hesapta **`quota = 100000` = $0.20** |
| anahtar | `POST /api/token/` → `POST /api/token/<id>/key` | `default` grubu (bu panelin canlı adı); liste anahtarı maskeli gösterir ve `/key` düz metni döndürür |
| kanıt | `GET /v1/models` + `POST /v1/chat/completions` | `content || reasoning_content`; codex kanalı kimlikleri atlanır (`/v1/responses` gerektirirler) |

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count N
node src/cli.js --pool proxies.txt --exits 6
node src/cli.js --proxy socks5://host:port
node src/cli.js --model deepseek-chat
node src/cli.js --verify-only
node src/cli.js --screen
node src/cli.js --connect-9router --base http://localhost:20128 --password 123456
```

| Bayrak | Varsayılan | Anlamı |
| --- | --- | --- |
| `--count N` | `1` | üretilecek hesap sayısı |
| `--pool FILE` | varsa `proxies.txt` | çıkışlar, satır başına bir tane (`http://`, `socks5://`, `socks4://`) |
| `--proxy URL` | — | tek bir çıkışı sabitle |
| `--exits K` | `6` | hesap başına denenen çıkış adayı |
| `--model ID` | en ucuz chat kanalı kimliği | canlı kapı için kullanılan model |
| `--verify-only` | kapalı | `keys.txt`'i yeniden kanıtla |
| `--screen` | kapalı | çıkış listesini panele karşı denetle |
| `--connect-9router` | kapalı | bu CLI'nin yanında 9Router bağlayıcısını çalıştır |

## 🛰️ Proxy arkasında

**İsteğe bağlı.** Havuz olmadan araç `DIRECT (no proxy)` yazdırır ve panelle doğrudan bu makineden konuşur; havuzla birlikte her panel isteği bir çıkışa sabitlenir ve ölü bir çıkış yalnızca kendi denemesine mal olur.

Posta kutusu bilerek **doğrudan** okunur — posta kapısı API ana bilgisayarından ayrıdır ve Emailnator'u TLS araya giren bir çıkış üzerinden proxy'lemek `unable to get local issuer certificate` yanıtını verir. Okuyucu IPv4'ü zorlar çünkü bu derleme önce IPv6'ya çözümlenir ve rota yoktur.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına canlı kanıtlanmış bir anahtar — git tarafından yok sayılır |
| `accounts.json` | hesap başına bir JSON kaydı (posta kutusu, çıkış, kayıt kotası, grup, anahtar, kanıt) — git tarafından yok sayılır |
| `proxies.txt` | çıkışlarınız — git tarafından yok sayılır |
| `out/` | çalıştırma günlükleri — git tarafından yok sayılır |

## 🔌 9Router'a bağlanın

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Varsayılanlar: `--prefix xeduapi`, `--base-url https://xeduapi.com/v1`, `--model deepseek-chat`. Modeller `xeduapi/<model id>` olarak sunulur ve yönlendirici düğümün anahtarları arasında denge kurar.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **聚合api服务** — [xeduapi.com](https://xeduapi.com) |
| 🎁 Sağlayıcının verdikleri | anahtar başına bir hesap — her hesapta $0.20 kayıt kredisi, chat ile doğrulanmış, kart yok ve captcha yok |
| 🔑 Bir anahtarın size kazandırdıkları | kendi hesabına kapsanmış bir API anahtarı: aşağıdaki uç noktada 10 model kimliği, planınızın limitlerinde. Kota **hesapta** yaşar, bu aracın anahtar başına bir hesap oluşturmasının nedeni tam da budur |
| 🌐 API biçimi | OpenAI uyumlu: `POST https://xeduapi.com/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca xeduapi.com ve yapılandırdığınız posta kutusu arka ucuna bağlanılır; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

聚合api服务 adres politikasını, kayıt biçimini, token grubunu veya kataloğu değiştirirse, araç o adımda durur ve bunu söyler. Komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 xeduapi-bulk-apikey katkıda bulunanlar

</div>

---

## ⚠️ Hesap riski ve bunu nasıl en aza indirirsiniz