// lib/i18n/dictionaries/fr.ts
// Textes du site en FRANÇAIS. C'est le dictionnaire de RÉFÉRENCE :
// sa forme définit le type Dictionary que l'anglais doit respecter.
// ⚠️ Uniquement du contenu validé par le client : textes repris de l'affiche
// et du cahier des charges. Rien d'inventé (pas de chiffres, pas de certifications).

const fr = {
  meta: {
    siteName: "ATG SARLU",
    description:
      "ATG SARLU, cabinet d'archivistique, de gestion documentaire, de numérisation et de GED à Yaoundé.",
  },
  slogan: "L'expertise au service de vos archives",
  // Présentation du cabinet (affiche).
  intro:
    "ATG SARLU est un cabinet spécialisé en archivistique, gestion documentaire, formation en archivistique, numérisation et gestion électronique des documents. Nous aidons les organisations à organiser, sécuriser, valoriser et optimiser leurs archives pour une meilleure performance et conformité.",
  quote: "Une archive bien gérée, une organisation performante et pérenne.",
  // Libellés du menu, un par route (voir RouteKey dans routes.ts).
  nav: {
    home: "Accueil",
    about: "À propos",
    services: "Services",
    clients: "Nos clients",
    whyUs: "Pourquoi nous choisir",
    contact: "Contact",
  },
  // Page d'accueil.
  home: {
    eyebrow: "Archives Treatment General",
    servicesCta: "Découvrir nos services",
    learnMore: "En savoir plus",
  },
  // Titre des pages et sections (balises <h1> / <h2>).
  pages: {
    about: { title: "À propos", missionTitle: "Notre mission" },
    services: { title: "Nos services" },
    clients: { title: "Nos clients", intro: "Les secteurs que nous accompagnons." },
    whyUs: { title: "Pourquoi nous choisir" },
    contact: { title: "Contactez-nous" },
  },
  // Les 3 piliers de la signature (affiche, bandeau du bas).
  pillars: {
    organise: { title: "Organiser", text: "Pour plus d'efficacité" },
    secure: { title: "Sécuriser", text: "Pour plus de conformité" },
    enhance: { title: "Valoriser", text: "Pour pérenniser votre mémoire" },
  },
  // Les 5 services et leurs prestations (affiche, "Nos services").
  services: {
    audit: {
      title: "Audit documentaire",
      items: [
        "Diagnostic complet",
        "Analyse des flux documentaires",
        "Évaluation de conformité",
        "Identification des risques",
      ],
    },
    archiving: {
      title: "Archivage physique",
      items: [
        "Tri et classement",
        "Cotation",
        "Conditionnement",
        "Reconditionnement",
        "Réorganisation des magasins d'archives",
      ],
    },
    digitization: {
      title: "Numérisation des archives",
      items: [
        "Préparation des documents",
        "Scannage haute qualité",
        "Indexation et métadonnées",
        "Contrôle qualité",
        "Archivage numérique",
      ],
    },
    edm: {
      title: "Gestion électronique des documents (GED)",
      items: [
        "Mise en place de solutions GED",
        "Structuration des bases documentaires",
        "Paramétrage et formation",
        "Sécurisation des données",
      ],
    },
    training: {
      title: "Formation professionnelle",
      items: [
        "Archivistique",
        "Records management",
        "Conservation documentaire",
        "Gestion électronique des documents",
      ],
    },
  },
  // Les 8 secteurs clients (affiche, "Nos clients").
  sectors: {
    banks: "Banques",
    insurance: "Assurances",
    hospitals: "Hôpitaux",
    education: "Universités & écoles",
    companies: "Entreprises privées",
    ngos: "ONG",
    legal: "Cabinets juridiques",
    publicAdmin: "Administrations publiques",
  },
  // Les 5 arguments (affiche, "Pourquoi choisir ATG SARLU ?").
  strengths: {
    expertise: {
      title: "Expertise éprouvée",
      text: "Une équipe d'archivistes qualifiés et expérimentés.",
    },
    confidentiality: {
      title: "Confidentialité & sécurité",
      text: "Vos documents sont traités avec la plus grande confidentialité.",
    },
    tailored: {
      title: "Solutions sur mesure",
      text: "Des méthodes adaptées aux besoins spécifiques de chaque organisation.",
    },
    responsive: {
      title: "Intervention rapide",
      text: "Délais respectés et accompagnement efficace sur site.",
    },
    standards: {
      title: "Respect des normes",
      text: "Conformité aux normes et bonnes pratiques archivistiques nationales et internationales.",
    },
  },
  // Bandeau d'appel à l'action en bas des pages (affiche, dernière ligne).
  cta: {
    text: "ATG SARLU, votre partenaire de confiance en gestion documentaire.",
  },
  // Page Contact.
  contact: {
    phoneLabel: "Téléphone",
    emailLabel: "Email",
    addressLabel: "Adresse",
  },
  // En-tête du site.
  header: {
    skipToContent: "Aller au contenu principal",
    homeLink: "ATG SARLU – Accueil",
    mainNav: "Navigation principale",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    languageSwitcher: "Choix de la langue",
    cta: "Contactez-nous",
  },
  // Pied de page.
  footer: {
    signature: "Organiser – Sécuriser – Valoriser",
    navTitle: "Navigation",
    contactTitle: "Contact",
    address: "Maetur Biteng, Yaoundé, Cameroun",
    rights: "Tous droits réservés.",
  },
};

// "typeof fr" : TypeScript déduit le type à partir de l'objet ci-dessus.
// Toute clé ajoutée ici devient OBLIGATOIRE dans en.ts.
export type Dictionary = typeof fr;

export default fr;