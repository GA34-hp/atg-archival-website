# ATG SARLU – Site vitrine (Archives Treatment General)

Site vitrine **bilingue (français / anglais)** de **ATG SARLU**, cabinet d'archivistique, de gestion documentaire, de numérisation et de GED basé à Yaoundé (Cameroun).

Le site est **100 % statique** : aucun serveur applicatif, aucune base de données, aucune route API. Il est généré au build en HTML/CSS/JS, puis servi tel quel par **Cloudflare Pages**.

> Ce README décrit l'état réel du code. Les points marqués ⚠️ sont des limites ou des vérifications à faire.

---

## Sommaire

1. [Fonctionnalités](#1-fonctionnalités)
2. [Pile technique](#2-pile-technique)
3. [Démarrage rapide](#3-démarrage-rapide)
4. [Variables d'environnement](#4-variables-denvironnement)
5. [Scripts npm](#5-scripts-npm)
6. [Structure du projet](#6-structure-du-projet)
7. [Architecture](#7-architecture)
8. [Sécurité](#8-sécurité)
9. [SEO](#9-seo)
10. [Accessibilité et performance](#10-accessibilité-et-performance)
11. [Tests](#11-tests)
12. [Déploiement (Cloudflare Pages)](#12-déploiement-cloudflare-pages)
13. [Modifier le contenu](#13-modifier-le-contenu)
14. [Limites connues et points à confirmer](#14-limites-connues-et-points-à-confirmer)
15. [Documentation complémentaire](#15-documentation-complémentaire)

---

## 1. Fonctionnalités

### Pages (6 routes × 2 langues = 12 pages)

| Page                  | URL française               | URL anglaise        |
| --------------------- | --------------------------- | ------------------- |
| Accueil               | `/fr`                       | `/en`               |
| À propos              | `/fr/a-propos`              | `/en/about`         |
| Services              | `/fr/services`              | `/en/services`      |
| Nos clients           | `/fr/nos-clients`           | `/en/our-clients`   |
| Pourquoi nous choisir | `/fr/pourquoi-nous-choisir` | `/en/why-choose-us` |
| Contact               | `/fr/contact`               | `/en/contact`       |

- `/` redirige vers `/fr` (français = langue par défaut). Toute autre langue ou slug inconnu → page 404 du site.
- Les URL sont **traduites** (slugs différents par langue) et définies dans une table unique ([lib/i18n/routes.ts](lib/i18n/routes.ts)).

### Contenu métier

- **Slogan** : « L'expertise au service de vos archives ». **Signature** : Organiser – Sécuriser – Valoriser (les 3 piliers).
- **5 services** : audit documentaire, archivage physique, numérisation des archives, GED, formation professionnelle.
- **8 secteurs clients** : banques, assurances, hôpitaux, universités & écoles, entreprises privées, ONG, cabinets juridiques, administrations publiques.
- **5 atouts** : expertise éprouvée, confidentialité & sécurité, solutions sur mesure, intervention rapide, respect des normes.

### Interactions

- **Sélecteur de langue** qui renvoie vers la page équivalente dans l'autre langue (grâce à `parsePath` / `getPath`).
- **En-tête fixe** avec menu mobile, lien actif, et **lien d'évitement** (« Aller au contenu principal »).
- **Boutons flottants** en bas à droite : appel direct (mobile uniquement) et WhatsApp avec message pré-rempli.
- **Formulaire de contact** (nom, email, téléphone facultatif, message) : validation, anti-spam (champ piège + reCAPTCHA v2), envoi via EmailJS, états envoi / succès / erreur.
- **Carte Google Maps** chargée **uniquement au clic** (« façade ») : performance et vie privée.

---

## 2. Pile technique

Versions lues dans [package.json](package.json) (fixées exactement pour Next, React, lucide-react, vitest, prettier).

| Domaine           | Technologie                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| Framework         | **Next.js 16.4.2** (App Router, Turbopack), **React 19.3.0**                                                |
| Langage           | **TypeScript 5** (`strict: true`)                                                                           |
| Style             | **Tailwind CSS 4** via `@tailwindcss/turbopack`, tokens de charte dans `app/globals.css`                    |
| Polices           | `next/font/google` : **Inter** (texte) et **Poppins** 600/700 (titres), auto-hébergées au build             |
| Icônes            | `lucide-react` 1.53.0                                                                                       |
| Tests             | **Vitest 4.1.12** (unitaires, environnement Node) et **Playwright 1.64.1** (bout en bout, Chromium)         |
| Qualité           | ESLint 9 (`eslint-config-next` core-web-vitals + typescript), Prettier 3.9.10 (largeur 100)                 |
| Aperçu local      | `serve` 14.2.6                                                                                              |
| Hébergement       | **Cloudflare Pages** (fichiers `public/_headers` et `public/_redirects`)                                    |
| Services externes | **EmailJS** (envoi des messages), **Google reCAPTCHA v2**, **Google Maps** (iframe), **WhatsApp** (`wa.me`) |

> ⚠️ Cette version de Next.js a des changements incompatibles avec les versions antérieures. [AGENTS.md](AGENTS.md) demande de lire la documentation fournie dans `node_modules/next/dist/docs/` avant toute modification liée au framework.

### Choix structurants de [next.config.ts](next.config.ts)

- `output: "export"` : export statique dans `out/`. Conséquence : **pas de middleware, pas de routes API, pas de redirections ni d'en-têtes gérés par Next** → on utilise `_redirects` et `_headers` de Cloudflare.
- `images.unoptimized: true` : l'optimisation d'images à la demande exige un serveur.
- `experimental.globalNotFound: true` : active `app/global-not-found.tsx` (page 404 → `out/404.html`). ⚠️ Option **expérimentale** : à revérifier à chaque changement de version de Next.

---

## 3. Démarrage rapide

Prérequis : **Node.js** compatible avec Next 16 (voir la documentation de Next) et npm.

```bash
npm ci
cp .env.example .env.local     # puis remplir les valeurs (voir §4)
npm run dev                    # http://localhost:3000
```

Au minimum, `NEXT_PUBLIC_SITE_URL=http://localhost:3000` est **obligatoire** : sans elle, le build et le serveur de développement échouent volontairement (voir §4).

Vérifier une version de production en local :

```bash
npm run build                  # génère out/
npm run preview                # sert out/ avec "serve"
```

> `npm run preview` n'applique **ni** `_headers` **ni** `_redirects` (spécifiques à Cloudflare). La page `public/index.html` assure alors une redirection de secours `/` → `/fr`.

---

## 4. Variables d'environnement

Modèle versionné : [.env.example](.env.example). Le fichier réel `.env.local` n'est **pas** versionné (`.gitignore`). En production, les mêmes variables se saisissent dans Cloudflare Pages (_Settings → Variables and Secrets_), puis on redéploie.

| Variable                          | Rôle                                                                           | Obligatoire  |
| --------------------------------- | ------------------------------------------------------------------------------ | ------------ |
| `NEXT_PUBLIC_SITE_URL`            | URL publique sans `/` final (canonique, hreflang, sitemap, robots, Open Graph) | **Oui**      |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID`  | Identifiant du service EmailJS                                                 | Pour l'envoi |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Identifiant du modèle d'email EmailJS                                          | Pour l'envoi |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`  | Clé **publique** EmailJS                                                       | Pour l'envoi |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`  | Clé **de site** reCAPTCHA v2 (la clé secrète se configure dans EmailJS)        | Recommandée  |

Comportements vérifiés dans le code :

- `NEXT_PUBLIC_SITE_URL` absente ou invalide → **le build échoue** avec un message explicite ([lib/site-url.ts](lib/site-url.ts)). `http://` n'est accepté que pour `localhost`.
- Variables EmailJS absentes → l'envoi échoue avec une erreur de type `config` (aucune requête n'est envoyée).
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` absente → la case n'est pas affichée (pratique en développement) et le formulaire n'exige pas de jeton.
- Toutes ces valeurs sont **copiées dans le JavaScript du site** (préfixe `NEXT_PUBLIC_`) : elles sont publiques. **Ne jamais y mettre la clé privée EmailJS ni la clé secrète reCAPTCHA.**
- Les variables sont figées **au build** : toute modification impose un nouveau déploiement.

---

## 5. Scripts npm

| Commande               | Action                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`          | Serveur de développement                                                     |
| `npm run build`        | Export statique dans `out/`                                                  |
| `npm run preview`      | Sert `out/` localement (`serve out`)                                         |
| `npm run lint`         | ESLint                                                                       |
| `npm run typecheck`    | `next typegen && tsc --noEmit`                                               |
| `npm test`             | Tests unitaires Vitest (`vitest run`)                                        |
| `npm run test:e2e`     | Tests de bout en bout Playwright (construit le site puis le teste, voir §11) |
| `npm run format`       | Formate tout le projet avec Prettier                                         |
| `npm run format:check` | Vérifie le formatage sans modifier                                           |

Avant de livrer : `npm run lint`, `npm run typecheck`, `npm test`, `npm run format:check`, puis `npm run build` et `npm run test:e2e`.

---

## 6. Structure du projet

```
app/
  [lang]/
    layout.tsx            Layout racine : <html lang>, en-tête, pied de page, boutons flottants
    page.tsx              Accueil
    [slug]/page.tsx       Les 5 pages intérieures (une seule route, slug traduit par langue)
  fonts.ts                Inter + Poppins (next/font)
  globals.css             Tailwind + tokens de la charte (couleurs, polices)
  global-not-found.tsx    Page 404 (out/404.html)
  robots.ts / sitemap.ts  robots.txt et sitemap.xml générés au build
components/
  layout/                 Header, SiteNav, LanguageSwitcher, Footer, QuickContact
  pages/                  AboutPage, ServicesPage, ClientsPage, WhyUsPage, ContactPage
  sections/               PillarsSection, ServicesOverviewSection, QuoteSection, CtaSection, types
  contact/                ContactForm, Recaptcha, MapEmbed
  ui/                     Container, Section, SectionHeading, ButtonLink, IconBadge
  content-icons.ts        Icône de chaque service / secteur / atout / pilier
lib/
  i18n/                   config (langues), routes (URL traduites), get-dictionary, dictionaries/fr|en
  contact/                validation.ts (règles pures), send.ts (appel EmailJS)
  content.ts              Clés typées du contenu (services, secteurs, atouts, piliers)
  seo.ts                  Métadonnées par page (titre, description, canonical, hreflang, Open Graph)
  site.ts                 Coordonnées (téléphones, email, WhatsApp, Maps) — source unique
  site-url.ts             Lecture/validation de NEXT_PUBLIC_SITE_URL
public/
  _headers, _redirects    Lus par Cloudflare Pages (CSP, HSTS, cache, redirection / → /fr)
  index.html              Page de secours pour "/"
  logo/, favicon.*, icon-*.png, apple-touch-icon.png, site.webmanifest
tests/                    5 fichiers de tests unitaires Vitest
e2e/                      Tests de bout en bout Playwright (+ fakes.ts : faux EmailJS / reCAPTCHA / Maps)
playwright.config.ts      Configuration Playwright (port 3100, bureau + mobile)
docs/PLANNING.md          Planning, décisions et points de vigilance du projet
```

Alias d'import : `@/` pointe sur la racine du projet (`tsconfig.json` et `vitest.config.mts`).

---

## 7. Architecture

### 7.1 Génération statique bilingue

1. `app/[lang]/layout.tsx` exporte `generateStaticParams` → `fr` et `en`. `dynamicParams = false` : toute autre langue donne un 404.
2. `app/[lang]/[slug]/page.tsx` génère, pour chaque langue, les slugs de `pageSlugs`. Une table `pageComponents: Record<PageKey, ComponentType>` associe chaque clé de page à son composant.
3. Les composants sont des **composants serveur** : les textes sont injectés dans le HTML au build, les dictionnaires ne sont pas envoyés au navigateur. Seuls `ContactForm`, `Recaptcha`, `MapEmbed` (et la navigation interactive) sont des composants client.

### 7.2 Internationalisation maison

L'i18n intégré de Next ne fonctionne pas en export statique ; le projet utilise donc :

- [lib/i18n/config.ts](lib/i18n/config.ts) : `locales = ["fr", "en"]`, `defaultLocale = "fr"`, garde de type `isLocale`.
- [lib/i18n/dictionaries/fr.ts](lib/i18n/dictionaries/fr.ts) : dictionnaire **de référence**, son type `Dictionary` est dérivé de sa forme.
- [lib/i18n/dictionaries/en.ts](lib/i18n/dictionaries/en.ts) : typé `: Dictionary` → une clé manquante ou en trop est une **erreur de compilation**.
- [lib/i18n/routes.ts](lib/i18n/routes.ts) : `pageSlugs`, `getPath`, `getPageKey`, `parsePath`, `getAlternates`. **Aucun lien ne doit être écrit en dur**.

Ajouter une langue : l'ajouter dans `locales`, créer son dictionnaire, ses slugs dans `pageSlugs` et l'enregistrer dans `get-dictionary.ts` (le typage signale les oublis).

### 7.3 Flux du formulaire de contact

[components/contact/ContactForm.tsx](components/contact/ContactForm.tsx) :

1. Clic sur « Envoyer » (double-clic ignoré pendant l'envoi).
2. **Champ piège** (honeypot) rempli → faux succès affiché, **rien n'est envoyé**.
3. **Validation** ([lib/contact/validation.ts](lib/contact/validation.ts)), fonction pure qui renvoie des _codes_ d'erreur (`required`, `tooShort`, `tooLong`, `invalid`) traduits par le dictionnaire. Premier champ en erreur reçoit le focus.
4. **Captcha** : si la clé de site est configurée, un jeton reCAPTCHA est exigé.
5. **Envoi** ([lib/contact/send.ts](lib/contact/send.ts)) : `fetch` direct vers `https://api.emailjs.com/api/v1.0/email/send` (pas de bibliothèque `@emailjs/browser`, pour limiter les dépendances). Le jeton est transmis dans `g-recaptcha-response`.
6. Erreurs distinguées : `config`, `network`, `rejected` → message visiteur générique, détail technique uniquement dans la console.
7. Un jeton reCAPTCHA n'étant utilisable qu'une fois, la case est réinitialisée après chaque tentative.

Règles de validation (constantes `contactLimits`, réutilisées par les attributs `maxLength`) :

| Champ     | Règles                                                                         |
| --------- | ------------------------------------------------------------------------------ |
| Nom       | obligatoire, 2–100 caractères, sans retour à la ligne                          |
| Email     | obligatoire, ≤ 254 caractères, format `x@y.z` sans espace ni saut de ligne     |
| Téléphone | facultatif ; caractères `+ 0-9 espace ( ) . -`, 6–15 chiffres, ≤ 30 caractères |
| Message   | obligatoire, 10–2000 caractères                                                |

Le modèle EmailJS doit utiliser les variables `{{name}}`, `{{email}}`, `{{phone}}`, `{{message}}`.

### 7.4 Carte et contact rapide

- [MapEmbed](components/contact/MapEmbed.tsx) : iframe Google Maps créée seulement après clic ; un lien « Ouvrir dans Google Maps » reste toujours affiché. ⚠️ Le format d'URL `output=embed` n'est **pas documenté** par Google et pourrait cesser de fonctionner (le lien de secours reste valable).
- [QuickContact](components/layout/QuickContact.tsx) : appel (`tel:` du premier numéro, mobile seulement) et WhatsApp (`wa.me`, message pré-rempli dans la langue de la page).

### 7.5 Charte graphique

Définie uniquement dans `app/globals.css`. La palette Tailwind par défaut est **supprimée** (`--color-*: initial`) : une classe hors charte comme `text-red-500` ne produit aucun style.

| Token                  | Valeur                | Usage                                                             |
| ---------------------- | --------------------- | ----------------------------------------------------------------- |
| `navy`                 | `#002148`             | Couleur principale, textes, bandeaux                              |
| `navy-deep` / `-light` | `#001530` / `#1d3451` | Pied de page, séparateurs                                         |
| `gold`                 | `#bd830b`             | Fonds de boutons, traits, icônes (jamais en texte sur fond clair) |
| `gold-light`           | `#e3a62b`             | Texte/icônes sur fond marine                                      |
| `gold-dark`            | `#8f6208`             | Texte doré sur fond clair                                         |
| `cream`                | `#f7f1e7`             | Fond principal                                                    |
| `error` / `success`    | `#b3261e` / `#2f6b4f` | États du formulaire                                               |
| `whatsapp`             | `#128c7e`             | Bouton WhatsApp                                                   |

Les rapports de contraste (WCAG 2) sont documentés en commentaire dans `globals.css`.

---

## 8. Sécurité

### Modèle de menace

Site statique **sans serveur ni authentification ni base de données** : il n'y a ni session, ni contrôle d'accès, ni donnée utilisateur stockée côté ATG. La surface d'attaque se limite au navigateur du visiteur et au formulaire de contact.

### Mesures en place (vérifiées dans [public/_headers](public/_headers))

- **Content-Security-Policy** restrictive : `default-src 'self'` ; scripts autorisés = domaine + reCAPTCHA ; `connect-src` limité à `api.emailjs.com` ; `frame-src` limité à reCAPTCHA et Google Maps ; `frame-ancestors 'none'` ; `object-src 'none'` ; `base-uri 'self'` ; `form-action 'self'` ; `upgrade-insecure-requests`.
- `X-Frame-Options: DENY` (anti-clickjacking), `Permissions-Policy` (caméra, micro, géolocalisation, paiement, USB désactivés).
- `Strict-Transport-Security: max-age=31536000` (1 an). ⚠️ Difficile à annuler une fois mis en production.
- Cache immuable (1 an) pour `/_next/static/*` ; `X-Robots-Tag: noindex` sur les adresses `*.pages.dev` pour éviter le contenu dupliqué.
- Liens externes avec `rel="noopener noreferrer"` ; iframe Maps avec `referrerPolicy="strict-origin-when-cross-origin"` ; script reCAPTCHA chargé uniquement sur la page Contact ; Maps chargée uniquement sur action du visiteur.
- Email : les retours à la ligne sont refusés dans l'email et le nom (prévention d'injection d'en-têtes).
- Aucune clé privée dans le dépôt ; `.env*` ignoré par Git (sauf `.env.example`).

### Limites à connaître (importantes)

1. **La validation du formulaire est purement côté navigateur.** Elle améliore l'expérience mais **ne protège rien** : un robot peut appeler EmailJS directement. La protection réelle doit être configurée **chez EmailJS** : domaines autorisés, destinataire fixé dans le modèle (jamais fourni par le formulaire), reCAPTCHA activé sur le modèle, quotas.
2. **Les identifiants EmailJS publics sont lisibles par tout visiteur** (préfixe `NEXT_PUBLIC_`). Ce n'est pas une fuite, mais cela rend la configuration EmailJS indispensable. ⚠️ Cette configuration n'est pas dans le dépôt et **n'a pas pu être vérifiée** ici.
3. Le modèle d'email EmailJS doit traiter les champs comme du **texte brut** (pas d'HTML non échappé).
4. La CSP contient `'unsafe-inline'` pour les scripts et styles : nécessaire car Next injecte des scripts en ligne différents à chaque build, impossibles à lister sans serveur. C'est une protection XSS réduite par rapport à une CSP à nonces.
5. `_headers` et `_redirects` ne sont lus que par Cloudflare Pages. Chez un autre hébergeur, ces protections n'existent pas tant qu'elles ne sont pas reproduites.
6. Pas de page `security.txt`, pas d'analyse de dépendances automatisée dans le dépôt : à faire périodiquement avec `npm audit`.

---

## 9. SEO

Construit dans [lib/seo.ts](lib/seo.ts), [app/sitemap.ts](app/sitemap.ts) et [app/robots.ts](app/robots.ts) à partir de `NEXT_PUBLIC_SITE_URL` :

- Titre et description par page et par langue (descriptions bâties à partir des textes validés, sous 180 caractères — test automatisé).
- URL **canonique** et balises **hreflang** (`fr`, `en`, `x-default` → français).
- **Open Graph** (`fr_FR` / `en_GB`) : l'objet de la page remplace celui du layout (Next ne fusionne pas), il est donc fourni en entier à chaque page.
- `sitemap.xml` : 12 pages avec leurs alternatives linguistiques ; `robots.txt` : tout autorisé + lien vers le sitemap.
- Favicon (ICO + SVG), `apple-touch-icon`, icônes 192/512 px et `site.webmanifest` (thème `#002148`, fond `#F7F1E7`).
- ⚠️ Aucune image de partage Open Graph (`og:image`) n'est définie dans le code actuel.

---

## 10. Accessibilité et performance

- `<html lang>` dynamique selon la page, lien d'évitement, un seul `<main id="main-content">`, `<address>` pour les coordonnées.
- Menu : libellés ARIA (ouvrir / fermer, navigation principale, choix de la langue), contrastes de la charte mesurés.
- Formulaire : `aria-invalid`, `aria-describedby` vers le message d'erreur, focus sur le premier champ invalide.
- Performance : site statique, polices auto-hébergées (aucune requête vers Google Fonts côté visiteur), reCAPTCHA et Maps chargés à la demande, plus d'optimisation d'image côté serveur (⚠️ les images doivent être fournies déjà optimisées, en WebP).
- Objectif du cahier des charges : chargement < 3 s. ⚠️ Aucun rapport Lighthouse n'est stocké dans le dépôt.

---

## 11. Tests

### 11.1 Tests unitaires (Vitest)

```bash
npm test
```

Environnement Node, fichiers `tests/**/*.test.ts` (logique pure, sans rendu) :

| Fichier                | Vérifie                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `validation.test.ts`   | Règles du formulaire, champs vides/espaces, bornes de longueur, refus des sauts de ligne |
| `routes.test.ts`       | `getPath`, table des slugs, `getPageKey`/`parsePath`, aller-retour, canonique + hreflang |
| `dictionaries.test.ts` | FR/EN ont les **mêmes chemins**, aucun texte vide, traduction différente du français     |
| `seo.test.ts`          | Titre, description et canonique de chaque page/langue ; descriptions < 180 caractères    |
| `site.test.ts`         | Liens `tel:` au format international, numéro WhatsApp, encodage du message, `getSiteUrl` |

### 11.2 Tests de bout en bout (Playwright)

```bash
npx playwright install chromium   # une seule fois : télécharge le navigateur
npm run test:e2e
```

Configuration : [playwright.config.ts](playwright.config.ts). Avant les tests, Playwright lance `npm run build && npx serve out -l 3100` puis attend `/fr` (délai 180 s). Un vrai navigateur parcourt donc le **site construit** (`out/`), sur deux profils : **ordinateur** (Desktop Chrome) et **mobile** (Pixel 7), tous deux sous Chromium. Rapports, captures et traces d'échec : `test-results/` et `playwright-report/` (ignorés par Git). En CI (`CI` défini) : 1 relance, `test.only` interdit.

Les variables d'environnement sont **fictives et définies par la config** (prioritaires sur `.env.local`) : `NEXT_PUBLIC_SITE_URL=http://localhost:3100`, identifiants EmailJS `*_test` et la clé de test publique de Google pour reCAPTCHA. Les services externes sont **imités** ([e2e/fakes.ts](e2e/fakes.ts), via `page.route`) : aucun email n'est envoyé, aucun appel à Google.

| Fichier                  | Vérifie                                                                                                                                                                                                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `e2e/navigation.spec.ts` | `/` → `/fr` ; `lang`, titre et un seul `h1` par page ; sélecteur de langue vers la **même** page ; 404 bilingue (statut 404) ; lien d'évitement au premier Tab ; ancre « En savoir plus » vers le bon service ; `sitemap.xml` (12 URL) et `robots.txt`                              |
| `e2e/contact.spec.ts`    | Erreurs d'un formulaire vide + focus + `aria-invalid` ; reCAPTCHA exigé ; envoi réussi (contenu exact de la requête EmailJS) puis formulaire vidé ; refus EmailJS (saisie conservée) ; réseau coupé ; **champ piège** (faux succès, rien envoyé) ; Maps non contactée avant le clic |
| `e2e/mobile.spec.ts`     | (mobile seulement) menu : ouverture, fermeture par Échap, fermeture après clic ; boutons appel et WhatsApp traduits ; aucun débordement horizontal sur 4 pages                                                                                                                      |
| `e2e/security.spec.ts`   | Applique la **vraie CSP lue dans `public/_headers`** à chaque page : le parcours normal (navigation, Maps, formulaire, reCAPTCHA, EmailJS) ne déclenche **aucune violation**, et un script/une requête vers un site inconnu sont bien **bloqués**                                   |

### 11.3 Ce que les tests ne prouvent pas

- Le test de CSP reproduit l'en-tête localement ; il ne prouve pas que **Cloudflare** l'applique en production (`npm run preview` ignore `_headers`). À vérifier sur le site déployé.
- Les services externes sont imités : le test valide **ce que notre code envoie**, pas la configuration réelle d'EmailJS (domaines autorisés, destinataire, captcha, quotas) ni le comportement réel de reCAPTCHA / Google Maps.
- Aucun test d'accessibilité automatisé (type axe), aucun rapport Lighthouse, aucun test Firefox / WebKit / Safari iOS (Chromium uniquement).
- Les tests ne prouvent donc pas, à eux seuls, la sécurité de l'envoi du formulaire.

---

## 12. Déploiement (Cloudflare Pages)

1. Dépôt connecté à Cloudflare Pages.
2. Commande de build : `npm run build` ; dossier de sortie : `out`.
3. Variables d'environnement (§4) saisies dans Cloudflare, avec `NEXT_PUBLIC_SITE_URL=https://atg-sarlu.com`.
4. Cloudflare applique automatiquement `_headers` et `_redirects` copiés depuis `public/` dans `out/`.
5. Côté EmailJS : autoriser le domaine de production, fixer le destinataire dans le modèle, activer reCAPTCHA (clé secrète saisie dans EmailJS).
6. Après toute modification de variable : **redéployer** (valeurs figées au build).

Le build échoue volontairement si `NEXT_PUBLIC_SITE_URL` manque, afin d'éviter de publier des adresses canoniques fausses.

---

## 13. Modifier le contenu

| Je veux modifier…                          | Fichier                                                                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Un texte (FR)                              | [lib/i18n/dictionaries/fr.ts](lib/i18n/dictionaries/fr.ts)                                                             |
| Un texte (EN)                              | [lib/i18n/dictionaries/en.ts](lib/i18n/dictionaries/en.ts) (mêmes clés que FR)                                         |
| Téléphones, email, WhatsApp, requête carte | [lib/site.ts](lib/site.ts)                                                                                             |
| Un slug d'URL                              | [lib/i18n/routes.ts](lib/i18n/routes.ts) (`pageSlugs`)                                                                 |
| Une couleur / une police                   | [app/globals.css](app/globals.css) / [app/fonts.ts](app/fonts.ts)                                                      |
| Un service, secteur, atout ou pilier       | [lib/content.ts](lib/content.ts) + [components/content-icons.ts](components/content-icons.ts) + les deux dictionnaires |
| Les en-têtes de sécurité                   | [public/_headers](public/_headers)                                                                                     |

Il n'y a **pas d'interface d'administration** : toute modification de texte passe par le code puis un redéploiement.

Ajouter une page : l'ajouter dans `pageSlugs` (routes.ts), créer son composant dans `components/pages/`, l'enregistrer dans `pageComponents`, ajouter son titre dans `dict.pages` et son entrée de menu dans `dict.nav` (les types signalent les oublis ; sitemap et SEO se mettent à jour seuls).

---

## 14. Limites connues et points à confirmer

- ⚠️ **Adresse exacte / coordonnées GPS** : `mapQuery` vaut « Maetur Biteng, Yaoundé, Cameroun » et est marqué _à confirmer par le client_ dans [lib/site.ts](lib/site.ts).
- ⚠️ **Traductions anglaises** : à faire valider par le client (indiqué dans `en.ts`).
- ⚠️ **Configuration EmailJS / reCAPTCHA** (domaines, captcha, destinataire, quotas) : hors dépôt, à vérifier dans les tableaux de bord.
- ⚠️ **Option expérimentale** `globalNotFound` et format d'iframe Maps non documenté : à surveiller lors des mises à jour.
- Pas de CMS ni d'interface d'administration (site statique).
- Pas de rapport Lighthouse, de test d'accessibilité automatisé ni de test hors Chromium dans le dépôt (voir §11.3).
  L'indentation des deux lignes ajoutées dans `package.json` est irrégulière : `npm run format:check` peut échouer tant que `npm run format` n'a pas été lancé.
- Les contenus reprennent l'affiche et le cahier des charges du client : **rien d'inventé** (pas de chiffres, ni de certifications).

---

## 15. Documentation complémentaire

- [docs/PLANNING.md](docs/PLANNING.md) : phases du projet, décisions techniques (D1–D5), points de vigilance, stratégie de tests. Document de planning initial (octobre 2026 ; il prévoyait Playwright, désormais en place) : certaines sections sont prévisionnelles et peuvent différer du code actuel (le code fait foi).
- [AGENTS.md](AGENTS.md) : consigne pour les assistants IA (lire la doc de Next.js installée avant de coder).
- Commentaires pédagogiques en français dans chaque fichier source, qui expliquent les choix.

© ATG SARLU – Tous droits réservés.
