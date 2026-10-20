# Planning du projet – Site vitrine ATG SARLU

> Statut : **proposition à valider** (V0.1 – 20 octobre 2026)
> Sources : cahier des charges V1.0 du 19/10/2026, affiche du client, prompt technique.

---

## 1. Vue d'ensemble

| Phase | Contenu | Durée indicative | Responsable | Livrable / point de validation |
|---|---|---|---|---|
| 0. Cadrage | Validation contenu, décisions techniques, collecte des éléments | 2 j | Toi + client | Contenu FR validé, décisions §4 tranchées |
| 1. Logo & mini-charte | Pistes, choix, déclinaisons | 4 j | Toi (je peux aider) | Logo PNG/SVG/PDF, charte (couleurs, typos) |
| 2. Maquette | Wireframes mobile → desktop, maquette haute fidélité | 3 j | Ensemble | Maquette validée par le client |
| 3. Développement | 10 étapes pédagogiques (§3) | 7 à 8 j | Ensemble | Site complet en local, `npm run build` OK |
| 4. Tests & corrections | Lint, types, tests unitaires/e2e, Lighthouse, navigateurs | 2 j | Ensemble | Rapport de tests |
| 5. Mise en ligne | GitHub → Cloudflare Pages, domaines, Google Business Profile | 1 j | Toi | Site en ligne sur atg-sarlu.com |
| 6. Livraison | Documentation d'utilisation, remise des accès | ½ j | Ensemble | Doc + accès |

Total : ~3 semaines, **à condition que le client valide chaque étape sous 48 h** (cf. cahier des charges §8).
Les phases 1 (logo) et 3.1 à 3.5 (socle technique) peuvent se chevaucher : le code prévoit un logo texte temporaire.

---

## 2. Phases 0 à 2 (hors code)

### Phase 0 – Cadrage
- [ ] Textes FR validés par le client pour les 6 pages (Accueil, À propos, Services, Nos clients, Pourquoi nous choisir, Contact)
- [ ] Photos d'archives / locaux (ou choix en banque d'images libres de droits : Unsplash, Pexels — vérifier la licence)
- [ ] Numéro WhatsApp confirmé (format international : +237 6…)
- [ ] Adresse exacte / coordonnées GPS pour la carte
- [ ] Décisions techniques du §4 tranchées

### Phase 1 – Logo & mini-charte
1. Brief à partir de l'affiche : monogramme « ATG » + classeurs, marine `#002148` / doré `#BD830B`.
2. 2 à 3 pistes → choix client → finalisation.
3. Déclinaisons : horizontale (en-tête), carrée/icône (favicon, réseaux sociaux), version claire sur fond marine.
4. Exports : SVG (web), PNG (transparent, 512 px et 1024 px), PDF (impression).
5. Mini-charte : palette, typographies (titres/texte), zone de protection, usages interdits.

Outil possible : Figma (connecté à cette session) pour la maquette ; le logo vectoriel final doit rester **un SVG propre et léger** (pas d'image bitmap intégrée).

### Phase 2 – Maquette
1. Wireframes **mobile d'abord** (360 px), puis tablette (768 px) et desktop (1280 px).
2. Maquette haute fidélité de l'Accueil, puis gabarits des autres pages.
3. Composants identifiés dans la maquette = composants du code (bouton doré, bouton contour, carte service, bandeau marine, icône dorée…).
4. Validation client avant le début de l'intégration des pages (étape 3.6).

---

## 3. Phase 3 – Développement pas à pas

Chaque étape = **une explication, du code commenté, une vérification (`npm run build` + `npx serve out`), un commit**. On ne passe à la suivante que lorsque tu as compris la précédente.

| Étape | Objectif | Notions que tu vas maîtriser |
|---|---|---|
| 3.1 | Initialiser Next.js + TypeScript + ESLint, `output: 'export'`, `images.unoptimized`, premier build | Structure d'un projet Next.js, App Router, export statique et ses limites |
| 3.2 | Design tokens (couleurs, typos via `next/font`), Tailwind | Variables CSS, thème Tailwind, chargement des polices sans requête externe |
| 3.3 | Architecture bilingue : segment `[lang]`, `generateStaticParams`, dictionnaires FR/EN, redirection `/` → `/fr` | Routage dynamique pré-généré, typage des traductions, pourquoi l'i18n intégré de Next ne marche pas en export |
| 3.4 | Layout : en-tête fixe, menu mobile, sélecteur de langue, pied de page, logo temporaire | Layouts imbriqués, composants serveur vs client, accessibilité du menu |
| 3.5 | Composants UI réutilisables : `Button`, `Section`, `Container`, icônes | Props typées, composition, éviter la sur-abstraction |
| 3.6 | Pages : Accueil, À propos, Services, Nos clients, Pourquoi nous choisir, Contact | Contenu piloté par les données, séparation contenu / présentation |
| 3.7 | Formulaire de contact : validation, EmailJS, anti-spam, états (envoi, succès, erreur) | Validation côté client, limites de sécurité d'un site sans serveur (§5) |
| 3.8 | Carte Google Maps, bouton d'appel `tel:`, lien WhatsApp `wa.me` | Iframe en chargement différé, liens profonds mobiles |
| 3.9 | SEO : `metadata`, canonical, `hreflang`, `sitemap.xml`, `robots.txt`, image de partage, favicon — tout basé sur `NEXT_PUBLIC_SITE_URL` | Metadata API de Next, fichiers spéciaux en export statique |
| 3.10 | Images WebP, performance, en-têtes de sécurité Cloudflare (`_headers`) | Poids des pages, Core Web Vitals, CSP |

### Architecture cible (prévisionnelle, à confirmer en 3.1/3.3)

```
app/
  [lang]/
    layout.tsx          ← layout racine : <html lang={lang}>, header, footer
    page.tsx            ← Accueil
    a-propos/ services/ clients/ pourquoi-nous-choisir/ contact/
  sitemap.ts  robots.ts
components/             ← Header, Footer, LanguageSwitcher, Button, ContactForm…
lib/
  i18n/                 ← config des langues, dictionnaires fr.ts / en.ts
  validation/           ← règles du formulaire (testées unitairement)
  site.ts               ← lecture de NEXT_PUBLIC_SITE_URL
public/
  images/  _redirects  _headers   ← fichiers lus par Cloudflare Pages
```

---

## 4. Décisions à trancher avant l'étape 3.1

| # | Question | Recommandation | Pourquoi |
|---|---|---|---|
| D1 | `app/fr` + `app/en` **ou** segment `[lang]` ? | `[lang]` + `generateStaticParams` | Une seule copie de chaque page ; la langue est une donnée, pas une duplication de code |
| D2 | TypeScript ? | Oui | Les dictionnaires FR/EN typés empêchent d'oublier une traduction (erreur à la compilation) |
| D3 | URL traduites (`/en/about`) ou identiques (`/en/a-propos`) ? | À discuter | Traduites = plus propre pour le SEO anglais, mais une table de correspondance à maintenir |
| D4 | Anti-spam | reCAPTCHA v2 géré par EmailJS + champ « pot de miel » | Sans serveur, il faut que la vérification du jeton se fasse chez EmailJS, pas dans notre code (à vérifier dans leur doc en 3.7) |
| D5 | Tailwind CSS ? | Oui (le prompt technique parle de tokens Tailwind) | Tokens de la charte centralisés, CSS non utilisé éliminé au build |

---

## 5. Points de vigilance relevés à l'analyse

1. **Les clés EmailJS ne sont pas secrètes.** Une variable `NEXT_PUBLIC_*` est copiée dans le JavaScript envoyé au navigateur : n'importe qui peut la lire. `.env.local` hors dépôt évite seulement de la publier sur GitHub. La vraie protection repose sur la configuration EmailJS : domaines autorisés, destinataire fixé dans le modèle (jamais fourni par le formulaire), reCAPTCHA, quotas. → La **clé privée** EmailJS ne doit jamais apparaître dans le code.
2. **Validation côté client uniquement.** Il n'y a pas de serveur à nous : la validation du formulaire améliore l'expérience mais ne protège rien. Le modèle d'email EmailJS doit traiter les champs comme du texte brut (pas d'HTML non échappé).
3. **Redirection `/` → `/fr`** : pas de middleware en export statique ; on utilisera le fichier `_redirects` de Cloudflare Pages (+ une page de secours).
4. **Cahier des charges vs stack** :
   - « Accès d'administration » (livrables §9) : un site statique n'a **pas d'interface d'administration**. Toute modification de texte passe par le code. À clarifier avec le client (accès Cloudflare/GitHub ? CMS plus tard ?).
   - « Hébergement avec SSL – 5 000 FCFA/an » : Cloudflare Pages est gratuit pour ce volume et fournit le HTTPS. Ligne de budget à revoir.
   - Envoi via le SMTP Zoho dans EmailJS : disponibilité selon l'offre EmailJS à **vérifier** avant l'étape 3.7.
5. **Carte Google Maps** : l'iframe d'intégration ne nécessite pas de clé API, mais charge des scripts Google ; on la chargera en différé pour tenir l'objectif < 3 s.
6. **Version de Next.js** : la version exacte sera vérifiée à l'initialisation et la documentation officielle consultée pour cette version.

---

## 6. Stratégie de tests (Phase 4)

- `npm run lint` et `tsc --noEmit` à chaque étape.
- Tests unitaires (Vitest) : règles de validation du formulaire, cohérence des dictionnaires FR/EN.
- Tests de bout en bout (Playwright) sur le dossier `out/` servi : navigation, changement de langue, formulaire (EmailJS simulé), liens `hreflang`.
- Lighthouse mobile : performance, accessibilité, SEO.
- Tests manuels : Chrome, Firefox, Safari (iOS), Edge.
