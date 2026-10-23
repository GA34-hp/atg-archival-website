// lib/i18n/dictionaries/en.ts
// Textes du site en ANGLAIS.
// Le type ": Dictionary" oblige à avoir EXACTEMENT les mêmes clés qu'en français :
// une clé oubliée ou en trop = erreur de compilation (npm run typecheck).
// ⚠️ Traductions à faire valider par le client.

import type { Dictionary } from "./fr";

const en: Dictionary = {
  meta: {
    siteName: "ATG SARLU",
    description:
      "ATG SARLU, records management, document management, digitisation and EDM firm in Yaoundé.",
  },
  slogan: "Expertise at the service of your archives",
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    clients: "Our clients",
    whyUs: "Why choose us",
    contact: "Contact",
  },
  home: {
    servicesCta: "Discover our services",
  },
  pages: {
    about: { title: "About us" },
    services: { title: "Our services" },
    clients: { title: "Our clients" },
    whyUs: { title: "Why choose us" },
    contact: { title: "Contact us" },
  },
  header: {
    skipToContent: "Skip to main content",
    homeLink: "ATG SARLU – Home",
    mainNav: "Main navigation",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    languageSwitcher: "Language selection",
    cta: "Contact us",
  },
  footer: {
    signature: "Organise – Secure – Enhance",
    navTitle: "Navigation",
    contactTitle: "Contact",
    address: "Maetur Biteng, Yaoundé, Cameroon",
    rights: "All rights reserved.",
  },
  common: {
    contentComing: "Content in progress.",
  },
};

export default en;