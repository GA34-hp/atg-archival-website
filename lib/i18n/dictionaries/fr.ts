// lib/i18n/dictionaries/fr.ts
// Textes du site en FRANÇAIS. C'est le dictionnaire de RÉFÉRENCE :
// sa forme définit le type Dictionary que l'anglais doit respecter.
// ⚠️ Uniquement du contenu validé par le client (cahier des charges, affiche).

const fr = {
  meta: {
    siteName: "ATG SARLU",
    description:
      "ATG SARLU, cabinet d'archivistique, de gestion documentaire, de numérisation et de GED à Yaoundé.",
  },
  slogan: "L'expertise au service de vos archives",
  // Libellés du menu, un par route (voir RouteKey dans routes.ts).
  nav: {
    home: "Accueil",
    about: "À propos",
    services: "Services",
    clients: "Nos clients",
    whyUs: "Pourquoi nous choisir",
    contact: "Contact",
  },
  // Page d'accueil (complétée à l'étape 3.6).
  home: {
    servicesCta: "Découvrir nos services",
  },
  // Contenu de chaque page (complété à l'étape 3.6).
  pages: {
    about: { title: "À propos" },
    services: { title: "Nos services" },
    clients: { title: "Nos clients" },
    whyUs: { title: "Pourquoi nous choisir" },
    contact: { title: "Contactez-nous" },
  },
  // En-tête du site (étape 3.4).
  header: {
    skipToContent: "Aller au contenu principal",
    homeLink: "ATG SARLU – Accueil",
    mainNav: "Navigation principale",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    languageSwitcher: "Choix de la langue",
    cta: "Contactez-nous",
  },
  // Pied de page (étape 3.4).
  footer: {
    signature: "Organiser – Sécuriser – Valoriser",
    navTitle: "Navigation",
    contactTitle: "Contact",
    address: "Maetur Biteng, Yaoundé, Cameroun",
    rights: "Tous droits réservés.",
  },
  common: {
    contentComing: "Contenu en cours de rédaction.",
  },
};

// "typeof fr" : TypeScript déduit le type à partir de l'objet ci-dessus.
// Toute clé ajoutée ici devient OBLIGATOIRE dans en.ts.
export type Dictionary = typeof fr;

export default fr;