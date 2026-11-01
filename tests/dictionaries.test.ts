// tests/dictionaries.test.ts
// Teste les dictionnaires FR/EN.
// TypeScript vérifie déjà que les deux ont les mêmes CLÉS. Ces tests vérifient
// ce que TypeScript ne peut pas voir : les TEXTES.
// (Ils auraient détecté le bug de l'étape 3.8 : texte français collé dans en.ts.)

import { describe, expect, it } from "vitest";
import en from "@/lib/i18n/dictionaries/en";
import fr from "@/lib/i18n/dictionaries/fr";

// "Aplatit" un dictionnaire en paires [chemin, texte] :
// { nav: { home: "Accueil" } } → [["nav.home", "Accueil"]]
function flatten(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, i) => flatten(item, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      flatten(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

const frEntries = flatten(fr);
const enTexts = new Map(flatten(en));

// Textes IDENTIQUES autorisés dans les deux langues : noms propres et mots
// qui s'écrivent pareil en français et en anglais.
const sameInBothLanguages = new Set([
  "ATG SARLU",
  "Archives Treatment General",
  "Services",
  "Contact",
  "Email",
  "Message",
  "Navigation",
  "Records management",
]);

describe("dictionnaires", () => {
  it("ont exactement les mêmes chemins (y compris le nombre d'éléments des listes)", () => {
    expect([...enTexts.keys()].sort()).toEqual(frEntries.map(([path]) => path).sort());
  });

  it("n'ont aucun texte vide", () => {
    for (const [path, text] of [...frEntries, ...enTexts]) {
      expect(text.trim(), path).not.toBe("");
    }
  });

  it("ont un texte anglais différent du français (sauf noms propres)", () => {
    // On collecte TOUS les doublons pour les afficher d'un coup en cas d'échec.
    const untranslated = frEntries
      .filter(([path, text]) => enTexts.get(path) === text && !sameInBothLanguages.has(text))
      .map(([path, text]) => `${path} = "${text}"`);
    expect(untranslated).toEqual([]);
  });
});
