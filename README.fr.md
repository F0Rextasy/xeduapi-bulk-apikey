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

**Créer en masse des comptes 聚合api服务 avec des clés API — inférence compatible OpenAI + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-10%20served-412991?style=for-the-badge)](https://xeduapi.com/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-10-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi cela existe

聚合api服务 (xeduapi.com) est un fork de New API (`v1.0.0-rc.45`) avec la porte d'entrée la plus accueillante de la famille : l'inscription est **ouverte**, il n'y a **pas de captcha**, et un nouveau compte est **crédité à sa création** — `quota = 100000` (soit **0,20 $** à raison de 500 000 quota par dollar). Pas de carte, pas de téléphone, pas d'OAuth, pas de rituel quotidien : un e-mail de vérification et un POST de formulaire, et la clé peut être générée et prouvée immédiatement.

Ce que l'outil doit bien gérer, c'est la politique d'adresse et la répartition des canaux. La liste blanche d'e-mails accepte **gmail.com** et **qq.com** mais refuse `outlook.com`, et — comme ses panneaux frères — elle traite un **point ou un `+`** dans la partie locale comme un « caractère spécial », donc les alias avec plus/point sont morts ici et la voie qui fonctionne est une boîte **simple** `@gmail.com` lue directement. Côté modèles, le catalogue est mixte : `deepseek-chat`, `deepseek-v3` et compagnie répondent sur `/v1/chat/completions`, tandis que le **canal codex** (`gpt-5.6-terra` et ses frères) refuse ce point de terminaison avec un HTTP 500 et un message vous indiquant d'utiliser l'**API Responses** — la porte ignore ces identifiants pour qu'une clé saine ne soit jamais blâmée pour une incompatibilité de canal.

## 🎁 Offre gratuite — ce que vous obtenez

| Quoi | Valeur |
| --- | --- |
| Crédit d'inscription | **0,20 $** — `GET /api/user/self` juste après l'inscription renvoie `quota = 100000` (500 000 quota = 1 $) |
| Check-in quotidien | **non disponible** — `POST /api/user/checkin` répond `Check-in feature is not enabled` |
| Carte / téléphone / OAuth | **aucun requis** — code par e-mail uniquement, `turnstile_check: false` |
| Ce que cela achète | 10 modèles parmi DeepSeek / StepFun / Z.ai / xAI, aux tarifs publiés du panneau ; aucune ligne strictement à 0 $ n'existe |
| Clé par compte | une clé par compte est la forme naturelle — le crédit vit sur le compte |

Comme il n'y a pas de renouvellement quotidien, l'unité qui s'échelonne est le **compte** : N comptes ⇒ N × 0,20 $ de crédit.

> 💡 L'offre gratuite est définie par 聚合api服务 et peut changer. Vérifiez les chiffres en direct sur [xeduapi.com](https://xeduapi.com) — et laissez la porte de l'outil décider :

```bash
# every key in keys.txt: the model list plus one real completion
node src/cli.js --verify-only

# by hand (keys carry no `sk-` prefix)
curl https://xeduapi.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"gday"}],"max_tokens":64}'
```

La porte compte `content || reasoning_content` et parcourt une courte liste de candidats sur des sorties tournantes : `deepseek-chat`, `deepseek-v3` et `z-ai/glm-5.3` sont ce que l'exécution à 12 clés a prouvé (les identifiants du canal codex répondent 500 et sont ignorés).

## 🤖 Modèles — les 10 au complet

`GET /v1/models` sur une clé active (2026-10-21) — **10 identifiants** :

| Id | Canal |
| --- | --- |
| `deepseek-chat` · `deepseek-v3` · `deepseek-ai/deepseek-v4.1-flash` | **chat completions** — prouvés comme répondant |
| `stepfun-ai/step-5-preview` · `z-ai/glm-5.3` · `z-ai/glm-5.3-flash` · `grok-4.5` · `grok-4.6` · `grok-4.7` | chat completions (non testés individuellement ici) |
| `gpt-5.6-terra` | **API Responses uniquement** — `/v1/chat/completions` répond **500** avec *«当前codex渠道模型(gpt-5.6-terra等)支持的格式：OpenAI Responses (/responses)，不支持的格式：OpenAI (/v1/chat/completions)»* |

Ainsi, un identifiant du canal chat est le bon modèle pour un contrôle de santé. `/api/pricing` liste 5 lignes, groupe `default` uniquement, **aucune ligne strictement à 0 $** — l'offre gratuite est le crédit d'inscription, pas un modèle gratuit.

## 🧪 Comment utiliser l'API

URL de base **`https://xeduapi.com/v1`** — compatible OpenAI ; les clés font 48 caractères **sans préfixe `sk-`** et passent par un en-tête `Authorization: Bearer`.

```python
from openai import OpenAI
c = OpenAI(base_url="https://xeduapi.com/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-chat",
      messages=[{"role":"user","content":"gday"}]).choices[0].message.content)
```

Les modèles du canal codex nécessitent l'API Responses ; le panneau rejette `/v1/responses` avec un corps d'entrée nu (404), donc câbler ce canal est un exercice à part — tout le reste est de l'OpenAI standard.

Le quota est par compte et partagé par ses clés, donc **un compte = une clé** garde la comptabilité propre (`usd_exchange_rate: 6.8` est un taux d'affichage ; le crédit lui-même est libellé en USD).

## 🛠 Démarrage rapide

```bash
cd xeduapi-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/cli.js --screen                     # vet the exits against the panel
node src/cli.js --count 5                    # five funded keys (no browser needed)
node src/cli.js --verify-only                # re-prove every key
node src/cli.js --connect-9router            # register them with a local 9Router
```

L'outil crée une boîte gmail simple, demande le code, l'attend, s'inscrit avec le même pot à cookies, se connecte, génère un jeton, révèle la clé et la prouve avec une vraie complétion avant de la consigner.

### 🖱️ Le lanceur

Le lanceur demande la liste de proxys (facultative — sans elle, le CLI s'exécute en direct) et le nombre de comptes, mémorise les deux et lance le CLI — plus `--verify-only`, `--screen` et le connecteur 9Router.

## ✅ Vérifié fonctionnel — chaque clé est testée

Chaque vérification ci-dessous a été exécutée le **2026-10-21** depuis le CLI de ce paquet (`src/cli.js`), via des sorties publiques (aucun VPN dans la boucle).

| Vérification | Résultat |
| --- | --- |
| inscription | **aucun navigateur nécessaire** — `turnstile_check: false` |
| liste blanche d'e-mails | **gmail.com ✓** · qq.com ✓ · `outlook.com` ✗ ; un point ou un `+` dans la partie locale est refusé comme « caractère spécial » |
| e-mail de code | «聚合api服务 email verification» depuis le relais du panneau lui-même, **1–2 s**, code de 6 caractères, valide **10 minutes** |
| inscription | **200 `{"success":true}`** avec le même pot à cookies + un code frais + un mot de passe de ≥8 caractères |
| offre gratuite | `GET /api/user/self` → **`quota = 100000` = 0,20 $** sur un nouveau compte ; `POST /api/user/checkin` → `Check-in feature is not enabled` |
| route de clé | la liste l'affiche masquée ; `POST /api/token/<id>/key` renvoie le texte en clair de 48 caractères (groupe `default`) |
| `GET /v1/models` par clé | **200**, 10 identifiants |
| `POST /v1/chat/completions` par clé | **200** avec contenu (`deepseek-chat`, `deepseek-v3`, `z-ai/glm-5.3`) — **12/12 clés LIVE** ; génération en masse 2026-10-21 : **2 → 12 clés**, la porte parcourt une liste de candidats sur des sorties tournantes |
| canal codex | `gpt-5.6-terra` → **500** sur chat completions, verbatim : nécessite **OpenAI Responses (/responses)** à la place |
| vitesse de bout en bout | **~45–70 s par clé** (mail → inscription → clé → preuve) |

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: 聚合api服务 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://xeduapi.com/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| boîte mail | Emailnator en https simple | un gmail **simple** ; le panneau refuse les points et les `+` |
| code | `GET /api/verification?email=` | arrive en **1–2 s** depuis `noreply@<panel-mail>`, objet «聚合api服务 email verification», code de 6 caractères, valide 10 minutes |
| inscription | `POST /api/user/register` | corps `{username,password,password2,email,verification_code,aff_code}` ; **même pot à cookies**, code **frais**, mot de passe ≥8 |
| session | `POST /api/user/login` | `data.access_token` (Bearer JWT) |
| crédit | `GET /api/user/self` | **`quota = 100000` = 0,20 $** sur un nouveau compte |
| clé | `POST /api/token/` → `POST /api/token/<id>/key` | groupe `default` (le nom actif de ce panneau) ; la liste affiche la clé masquée et `/key` renvoie le texte en clair |
| preuve | `GET /v1/models` + `POST /v1/chat/completions` | `content || reasoning_content` ; les identifiants du canal codex sont ignorés (ils nécessitent `/v1/responses`) |

## ⚙️ Options du CLI

```bash
node src/cli.js --count N
node src/cli.js --pool proxies.txt --exits 6
node src/cli.js --proxy socks5://host:port
node src/cli.js --model deepseek-chat
node src/cli.js --verify-only
node src/cli.js --screen
node src/cli.js --connect-9router --base http://localhost:20128 --password 123456
```

| Option | Défaut | Signification |
| --- | --- | --- |
| `--count N` | `1` | comptes à générer |
| `--pool FILE` | `proxies.txt` si présent | sorties, une par ligne (`http://`, `socks5://`, `socks4://`) |
| `--proxy URL` | — | épingler une seule sortie |
| `--exits K` | `6` | sorties candidates essayées par compte |
| `--model ID` | identifiant du canal chat le moins cher | modèle utilisé pour la porte en direct |
| `--verify-only` | désactivé | re-prouver `keys.txt` |
| `--screen` | désactivé | vérifier la liste des sorties contre le panneau |
| `--connect-9router` | désactivé | exécuter le connecteur 9Router à côté de ce CLI |

## 🛰️ Derrière un proxy

**Facultatif.** Sans pool, l'outil affiche `DIRECT (no proxy)` et parle au panneau directement depuis cette machine ; avec un pool, chaque requête au panneau est épinglée à une sortie et une sortie morte ne coûte que sa propre tentative.

La boîte mail est lue **directement** à dessein — la porte mail est séparée de l'hôte API, et faire passer Emailnator par une sortie interceptant TLS répond `unable to get local issuer certificate`. Le lecteur force IPv4 car cette version résout d'abord en IPv6 sans route.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé prouvée en direct par ligne — ignoré par git |
| `accounts.json` | un enregistrement JSON par compte (boîte mail, sortie, quota d'inscription, groupe, clé, preuve) — ignoré par git |
| `proxies.txt` | vos sorties — ignoré par git |
| `out/` | journaux d'exécution — ignoré par git |

## 🔌 Se connecter à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé, compatible OpenAI :

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Valeurs par défaut : `--prefix xeduapi`, `--base-url https://xeduapi.com/v1`, `--model deepseek-chat`. Les modèles sont servis sous `xeduapi/<model id>` et le routeur équilibre la charge entre les clés du nœud.

## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **聚合api服务** — [xeduapi.com](https://xeduapi.com) |
| 🎁 Ce que le fournisseur donne | un compte par clé — un crédit d'inscription de 0,20 $ sur chaque compte, vérifié par chat, sans carte ni captcha |
| 🔑 Ce qu'une clé vous apporte | une clé API limitée à son propre compte : les 10 identifiants de modèles sur le point de terminaison ci-dessous, dans les limites de votre forfait. Le quota vit sur le **compte**, ce qui explique précisément pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://xeduapi.com/v1/chat/completions` |
| 🔒 Vos données | seuls xeduapi.com et le backend de boîte mail que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Si 聚合api服务 modifie sa politique d'adresse, la forme de son inscription, le groupe de jetons ou le catalogue, l'outil s'arrête à cette étape et le signale. **[Ouvrez un ticket](../../issues)** avec la commande et la sortie exacte.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 xeduapi-bulk-apikey contributors

</div>

---

## ⚠️ Risque lié au compte et comment le minimiser