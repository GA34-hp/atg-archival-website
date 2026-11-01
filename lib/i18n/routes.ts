// lib/i18n/routes.ts
// Table de correspondance des URL traduites (décision D3 : /fr/a-propos ↔ /en/about).
// SOURCE UNIQUE des adresses : aucun lien du site ne doit être écrit "en dur",
// on les construit toujours avec getPath().

import { defaultLocale, isLocale, locales, type Locale } from "./config";
// Clé interne de chaque page (en anglais, stable) → slug affiché dans l'URL, par langue.
// "satisfies" vérifie que CHAQUE page a un slug pour CHAQUE langue,
// sans perdre les valeurs exactes que "as const" a figées.
export const pageSlugs = {
  about: { fr: "a-propos", en: "about" },
  services: { fr: "services", en: "services" },
  clients: { fr: "nos-clients", en: "our-clients" },
  whyUs: { fr: "pourquoi-nous-choisir", en: "why-choose-us" },
  contact: { fr: "contact", en: "contact" },
} as const satisfies Record<string, Record<Locale, string>>;

// PageKey = "about" | "services" | "clients" | "whyUs" | "contact"
export type PageKey = keyof typeof pageSlugs;

// Toutes les routes du site : l'accueil + les pages ci-dessus.
export type RouteKey = "home" | PageKey;

// Liste des clés de page, typée (Object.keys renvoie sinon un simple string[]).
export const pageKeys = Object.keys(pageSlugs) as PageKey[];

// Toutes les routes dans l'ordre du menu : l'accueil puis les pages.
export const routeKeys: RouteKey[] = ["home", ...pageKeys];

// Construit l'adresse d'une page dans une langue.
// getPath("en", "about") → "/en/about" ; getPath("fr", "home") → "/fr"
export function getPath(locale: Locale, route: RouteKey): string {
  if (route === "home") {
    return `/${locale}`;
  }
  return `/${locale}/${pageSlugs[route][locale]}`;
}

// Chemin inverse : retrouve la clé de page à partir du slug lu dans l'URL.
// getPageKey("fr", "a-propos") → "about" ; getPageKey("fr", "about") → undefined
// (le slug anglais n'est pas valide en français).
export function getPageKey(locale: Locale, slug: string): PageKey | undefined {
  return pageKeys.find((key) => pageSlugs[key][locale] === slug);
}

// Analyse une adresse du site et retrouve sa langue et sa route.
// parsePath("/fr/a-propos") → { locale: "fr", route: "about" }
// parsePath("/en")          → { locale: "en", route: "home" }
// parsePath("/de/x")        → undefined (adresse inconnue)
// Utilisé par le menu (lien actif) et le sélecteur de langue.
export function parsePath(pathname: string): { locale: Locale; route: RouteKey } | undefined {
  // "/fr/a-propos/" → ["fr", "a-propos"] : filter(Boolean) retire les morceaux vides.
  const [first, second] = pathname.split("/").filter(Boolean);
  if (!first || !isLocale(first)) return undefined;
  if (!second) return { locale: first, route: "home" };
  const pageKey = getPageKey(first, second);
  return pageKey ? { locale: first, route: pageKey } : undefined;
}

// Liens entre les versions linguistiques d'une même page, pour les moteurs de
// recherche (balises <link rel="canonical"> et <link rel="alternate" hreflang>).
// getAlternates("fr", "about") →
//   { canonical: "/fr/a-propos",
//     languages: { fr: "/fr/a-propos", en: "/en/about", "x-default": "/fr/a-propos" } }
// Adresses RELATIVES : Next les complète avec metadataBase (défini dans le layout).
// "x-default" : la version à proposer quand la langue du visiteur n'est ni fr ni en.
export function getAlternates(locale: Locale, route: RouteKey) {
  const languages: Record<string, string> = {};
  for (const lang of locales) {
    languages[lang] = getPath(lang, route);
  }
  languages["x-default"] = getPath(defaultLocale, route);
  return { canonical: getPath(locale, route), languages };
}