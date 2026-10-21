// lib/i18n/routes.ts
// Table de correspondance des URL traduites (décision D3 : /fr/a-propos ↔ /en/about).
// SOURCE UNIQUE des adresses : aucun lien du site ne doit être écrit "en dur",
// on les construit toujours avec getPath().

import type { Locale } from "./config";

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