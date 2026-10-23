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
  intro:
    "ATG SARLU is a firm specialising in archival science, document management, archival training, digitisation and electronic document management. We help organisations organise, secure, enhance and optimise their archives for better performance and compliance.",
  quote: "Well-managed archives make an efficient and lasting organisation.",
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    clients: "Our clients",
    whyUs: "Why choose us",
    contact: "Contact",
  },
  home: {
    eyebrow: "Archives Treatment General",
    servicesCta: "Discover our services",
    learnMore: "Learn more",
  },
  pages: {
    about: { title: "About us", missionTitle: "Our mission" },
    services: { title: "Our services" },
    clients: { title: "Our clients", intro: "The sectors we support." },
    whyUs: { title: "Why choose us" },
    contact: { title: "Contact us" },
  },
  pillars: {
    organise: { title: "Organise", text: "For greater efficiency" },
    secure: { title: "Secure", text: "For greater compliance" },
    enhance: { title: "Enhance", text: "To preserve your memory" },
  },
  services: {
    audit: {
      title: "Records audit",
      items: [
        "Comprehensive assessment",
        "Document flow analysis",
        "Compliance evaluation",
        "Risk identification",
      ],
    },
    archiving: {
      title: "Physical archiving",
      items: [
        "Sorting and classification",
        "Reference coding",
        "Packaging",
        "Repackaging",
        "Reorganisation of archive storage",
      ],
    },
    digitization: {
      title: "Archive digitisation",
      items: [
        "Document preparation",
        "High-quality scanning",
        "Indexing and metadata",
        "Quality control",
        "Digital archiving",
      ],
    },
    edm: {
      title: "Electronic document management (EDM)",
      items: [
        "EDM solution deployment",
        "Document database structuring",
        "Configuration and training",
        "Data security",
      ],
    },
    training: {
      title: "Professional training",
      items: [
        "Archival science",
        "Records management",
        "Document preservation",
        "Electronic document management",
      ],
    },
  },
  sectors: {
    banks: "Banks",
    insurance: "Insurance",
    hospitals: "Hospitals",
    education: "Universities & schools",
    companies: "Private companies",
    ngos: "NGOs",
    legal: "Law firms",
    publicAdmin: "Public administrations",
  },
  strengths: {
    expertise: {
      title: "Proven expertise",
      text: "A team of qualified and experienced archivists.",
    },
    confidentiality: {
      title: "Confidentiality & security",
      text: "Your documents are handled with the utmost confidentiality.",
    },
    tailored: {
      title: "Tailored solutions",
      text: "Methods adapted to the specific needs of each organisation.",
    },
    responsive: {
      title: "Fast response",
      text: "Deadlines met and effective on-site support.",
    },
    standards: {
      title: "Compliance with standards",
      text: "Compliance with national and international archival standards and best practices.",
    },
  },
  cta: {
    text: "ATG SARLU, your trusted partner in document management.",
  },
  contact: {
    phoneLabel: "Phone",
    emailLabel: "Email",
    addressLabel: "Address",
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
};

export default en;