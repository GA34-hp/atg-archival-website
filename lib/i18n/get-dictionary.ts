// lib/i18n/get-dictionary.ts
// Renvoie le dictionnaire d'une langue.
// Appelé uniquement dans des composants serveur : les textes sont injectés dans
// le HTML au build, les dictionnaires ne sont pas envoyés au navigateur en JavaScript.

import type { Locale } from "./config";
import en from "./dictionaries/en";
import fr, { type Dictionary } from "./dictionaries/fr";

// "Record<Locale, Dictionary>" : si on ajoute une langue dans config.ts sans
// l'ajouter ici, TypeScript signale l'oubli.
const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}