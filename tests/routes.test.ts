// tests/routes.test.ts
// Teste la table des adresses traduites (lib/i18n/routes.ts).

import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/config";
import {
  getAlternates,
  getPageKey,
  getPath,
  pageKeys,
  pageSlugs,
  parsePath,
  routeKeys,
} from "@/lib/i18n/routes";

describe("getPath", () => {
  it("construit les adresses de l'accueil et des pages", () => {
    expect(getPath("fr", "home")).toBe("/fr");
    expect(getPath("en", "about")).toBe("/en/about");
    expect(getPath("fr", "whyUs")).toBe("/fr/pourquoi-nous-choisir");
  });
});

describe("table des slugs", () => {
  it.each(locales)("n'a aucun slug en double en %s", (locale) => {
    const slugs = pageKeys.map((key) => pageSlugs[key][locale]);
    // Un Set ne garde que les valeurs uniques : même taille = aucun doublon.
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(locales)("n'utilise que des minuscules, chiffres et tirets en %s", (locale) => {
    for (const key of pageKeys) {
      expect(pageSlugs[key][locale]).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("getPageKey et parsePath", () => {
  it("retrouve la page à partir de son slug, dans la bonne langue seulement", () => {
    expect(getPageKey("fr", "a-propos")).toBe("about");
    expect(getPageKey("fr", "about")).toBeUndefined();
  });

  it("analyse une adresse complète", () => {
    expect(parsePath("/fr/a-propos")).toEqual({ locale: "fr", route: "about" });
    expect(parsePath("/en/")).toEqual({ locale: "en", route: "home" });
    expect(parsePath("/de/x")).toBeUndefined();
    expect(parsePath("/fr/inconnu")).toBeUndefined();
  });

  // Aller-retour : pour TOUTES les pages et langues, parsePath(getPath(…)) redonne l'original.
  it("fait l'aller-retour getPath → parsePath pour toutes les pages", () => {
    for (const locale of locales) {
      for (const route of routeKeys) {
        expect(parsePath(getPath(locale, route))).toEqual({ locale, route });
      }
    }
  });
});

describe("getAlternates", () => {
  it("donne la canonique, chaque langue et x-default (français)", () => {
    expect(getAlternates("en", "about")).toEqual({
      canonical: "/en/about",
      languages: { fr: "/fr/a-propos", en: "/en/about", "x-default": "/fr/a-propos" },
    });
  });
});
