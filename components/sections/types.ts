// components/sections/types.ts
// Ce que reçoivent les sections et les pages : la langue et les textes.
// Un seul type partagé, pour ne pas le réécrire dans chaque fichier.

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

export type ContentProps = {
  lang: Locale;
  dict: Dictionary;
};