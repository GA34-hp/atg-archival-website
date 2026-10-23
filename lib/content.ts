// lib/content.ts
// LISTES des éléments de contenu, dans l'ordre d'affichage (une seule source).
// Les TEXTES sont dans les dictionnaires (fr.ts / en.ts), rangés sous ces mêmes
// clés ; les ICÔNES sont dans components/content-icons.ts, sous ces mêmes clés.
// Ajouter un service = l'ajouter ici + ses textes FR/EN + son icône :
// TypeScript signale chaque endroit oublié.

// Les 5 services (affiche : "Nos services").
export const serviceKeys = ["audit", "archiving", "digitization", "edm", "training"] as const;
export type ServiceKey = (typeof serviceKeys)[number];

// Les 8 secteurs clients (affiche : "Nos clients").
export const sectorKeys = [
  "banks",
  "insurance",
  "hospitals",
  "education",
  "companies",
  "ngos",
  "legal",
  "publicAdmin",
] as const;
export type SectorKey = (typeof sectorKeys)[number];

// Les 5 arguments (affiche : "Pourquoi choisir ATG SARLU ?").
export const strengthKeys = ["expertise", "confidentiality", "tailored", "responsive", "standards"] as const;
export type StrengthKey = (typeof strengthKeys)[number];

// Les 3 piliers (affiche : "Organiser – Sécuriser – Valoriser").
export const pillarKeys = ["organise", "secure", "enhance"] as const;
export type PillarKey = (typeof pillarKeys)[number];