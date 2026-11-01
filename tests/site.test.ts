// tests/site.test.ts
// Teste les coordonnées (lib/site.ts) et l'adresse du site (lib/site-url.ts).

import { afterEach, describe, expect, it, vi } from "vitest";
import { getWhatsAppUrl, siteContact } from "@/lib/site";

describe("coordonnées", () => {
  it("a des liens d'appel au format international du Cameroun", () => {
    for (const phone of siteContact.phones) {
      expect(phone.href).toMatch(/^tel:\+237\d{9}$/);
      // Le numéro affiché et le lien d'appel désignent bien le même numéro.
      expect(phone.href.replace("tel:+237", "")).toBe(phone.display.replace(/\s/g, ""));
    }
  });

  it("a un numéro WhatsApp en chiffres uniquement, avec l'indicatif", () => {
    expect(siteContact.whatsappNumber).toMatch(/^237\d{9}$/);
  });

  it("encode le message WhatsApp (espaces, accents, ponctuation)", () => {
    expect(getWhatsAppUrl("Bonjour, ça va ?")).toBe(
      `https://wa.me/${siteContact.whatsappNumber}?text=Bonjour%2C%20%C3%A7a%20va%20%3F`,
    );
  });
});

describe("getSiteUrl", () => {
  // site-url.ts lit la variable au CHARGEMENT du module : pour chaque cas, on
  // définit la variable (vi.stubEnv), on vide le cache des modules
  // (vi.resetModules) puis on recharge le fichier (import dynamique).
  async function loadWith(value: string | undefined) {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", value);
    vi.resetModules();
    return import("@/lib/site-url");
  }

  afterEach(() => {
    vi.unstubAllEnvs(); // remet les variables d'environnement d'origine
  });

  it("construit des adresses absolues", async () => {
    const { absoluteUrl } = await loadWith("https://atg-sarlu.com");
    expect(absoluteUrl("/fr/a-propos")).toBe("https://atg-sarlu.com/fr/a-propos");
  });

  it("accepte http uniquement pour localhost", async () => {
    expect((await loadWith("http://localhost:3000")).getSiteUrl().host).toBe("localhost:3000");
    const { getSiteUrl } = await loadWith("http://atg-sarlu.com");
    expect(() => getSiteUrl()).toThrow("https://");
  });

  it("échoue clairement si la variable est absente", async () => {
    const { getSiteUrl } = await loadWith(undefined);
    expect(() => getSiteUrl()).toThrow("NEXT_PUBLIC_SITE_URL manquante");
  });
});
