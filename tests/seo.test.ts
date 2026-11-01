// tests/seo.test.ts
// Teste les métadonnées de référencement (lib/seo.ts) pour les 12 pages.

import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routeKeys } from "@/lib/i18n/routes";
import { buildPageMetadata, getPageDescription } from "@/lib/seo";

describe("buildPageMetadata", () => {
  for (const lang of locales) {
    for (const route of routeKeys) {
      it(`donne un titre, une description et une canonique à ${lang}/${route}`, () => {
        const metadata = buildPageMetadata(lang, getDictionary(lang), route);
        // Le bug de l'étape 3.10 (accueil sans <title>) serait détecté ici.
        expect(metadata.title).toEqual({ absolute: expect.stringContaining("ATG SARLU") });
        expect(metadata.description).toBeTruthy();
        expect(metadata.alternates?.canonical).toMatch(new RegExp(`^/${lang}`));
      });
    }
  }
});

describe("getPageDescription", () => {
  it("reste sous 180 caractères pour toutes les pages", () => {
    for (const lang of locales) {
      for (const route of routeKeys) {
        const description = getPageDescription(getDictionary(lang), route);
        expect(description.length, `${lang}/${route}`).toBeLessThanOrEqual(180);
      }
    }
  });
});
