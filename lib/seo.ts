// lib/seo.ts
// Métadonnées de référencement de chaque page : titre, description, adresse
// canonique, versions dans les autres langues (hreflang) et aperçu de partage
// (Open Graph : ce qu'affichent WhatsApp, Facebook, LinkedIn quand on partage un lien).
// Un seul endroit construit tout ça, pour que les 12 pages soient cohérentes.

import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { getAlternates, getPath, type RouteKey } from "@/lib/i18n/routes";
import { siteContact } from "@/lib/site";

// Code de langue au format Open Graph (langue_PAYS). L'anglais du site suit
// l'orthographe britannique ("organise", "digitisation") : en_GB.
const openGraphLocales: Record<Locale, string> = { fr: "fr_FR", en: "en_GB" };

// Description de chaque page, CONSTRUITE à partir des textes déjà validés
// (aucune phrase inventée). Idéalement moins de 160 caractères : au-delà,
// Google coupe l'affichage.
export function getPageDescription(dict: Dictionary, route: RouteKey): string {
  switch (route) {
    case "home":
      return dict.meta.description;
    case "about":
      return `${dict.slogan}. ${dict.footer.signature}.`;
    case "services":
      return `${Object.values(dict.services).map((service) => service.title).join(", ")}.`;
    case "clients":
      return `${dict.pages.clients.intro} ${Object.values(dict.sectors).join(", ")}.`;
    case "whyUs":
      return `${Object.values(dict.strengths).map((strength) => strength.title).join(", ")}.`;
    case "contact":
      return `${siteContact.phones.map((phone) => phone.display).join(" / ")} · ${siteContact.email} · ${dict.footer.address}`;
  }
}

// Titre COMPLET de l'onglet et des résultats de recherche (le même sert à Open Graph) :
// - Pages intérieures : "À propos | ATG SARLU"
// - Accueil : "ATG SARLU – L'expertise au service de vos archives"
// ⚠️ Ne jamais renvoyer title: undefined : Next effacerait le titre du layout
// et la page n'aurait plus de <title> (bug détecté par Lighthouse à l'étape 3.10).
function getPageTitle(dict: Dictionary, route: RouteKey): string {
  return route === "home"
    ? `${dict.meta.siteName} – ${dict.slogan}`
    : `${dict.pages[route].title} | ${dict.meta.siteName}`;
}

export function buildPageMetadata(lang: Locale, dict: Dictionary, route: RouteKey): Metadata {
  const title = getPageTitle(dict, route);
  const description = getPageDescription(dict, route);

  return {
    // "absolute" : titre utilisé tel quel, sans le modèle "%s | ATG SARLU" du layout
    // (il contient déjà le nom du site).
    title: { absolute: title },
    description,
    // canonical + hreflang (adresses relatives, complétées par metadataBase).
    alternates: getAlternates(lang, route),
    // ⚠️ Next ne FUSIONNE pas openGraph entre layout et page : celui de la page
    // REMPLACE celui du layout. On le donne donc ici en entier.
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      locale: openGraphLocales[lang],
      url: getPath(lang, route),
      title,
      description,
    },
  };
}