// lib/i18n/config.ts
// Configuration des langues du site : SOURCE UNIQUE de la liste des langues.
// Ajouter une langue = l'ajouter ici + créer son dictionnaire + ses slugs dans routes.ts.

// "as const" fige le tableau : TypeScript connaît les valeurs exactes "fr" et "en",
// et pas seulement "un tableau de chaînes".
export const locales = ["fr", "en"] as const;

// Type dérivé du tableau : Locale = "fr" | "en".
// Si on ajoute une langue dans "locales", le type se met à jour tout seul.
export type Locale = (typeof locales)[number];

// Langue par défaut (cahier des charges : français par défaut).
export const defaultLocale: Locale = "fr";

// Nom de chaque langue écrit dans cette langue (affiché par le sélecteur de langue).
// "Record<Locale, string>" oblige à fournir un nom pour CHAQUE langue de "locales".
export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

// "Garde de type" : vérifie qu'une chaîne quelconque (venant de l'URL) est une
// langue supportée. Le "value is Locale" indique à TypeScript qu'après un
// "if (isLocale(x))", x est de type Locale et non plus string.
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}