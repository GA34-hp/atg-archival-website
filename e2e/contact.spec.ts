// e2e/contact.spec.ts
// Formulaire de contact et carte. EmailJS, reCAPTCHA et Google Maps sont IMITÉS
// (voir fakes.ts) : aucun email n'est réellement envoyé.

import { expect, test, type Page } from "@playwright/test";
import { fakeEmailJs, fakeGoogleMaps, fakeRecaptcha } from "./fakes";

// Remplit le formulaire avec des valeurs valides.
async function fillValidForm(page: Page) {
  await page.getByLabel("Nom", { exact: true }).fill("Jean Atangana");
  await page.getByLabel("Email", { exact: true }).fill("jean@exemple.cm");
  await page.getByLabel("Téléphone (facultatif)", { exact: true }).fill("+237 691 531 946");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Bonjour, je souhaite un audit documentaire.");
}

test.beforeEach(async ({ page }) => {
  await fakeRecaptcha(page);
});

test("affiche les erreurs d'un formulaire vide et place le curseur sur le premier champ", async ({
  page,
}) => {
  await page.goto("/fr/contact");
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  await expect(page.getByText("Indiquez votre nom.")).toBeVisible();
  await expect(page.getByText("Indiquez votre adresse email.")).toBeVisible();
  await expect(page.getByText("Écrivez votre message.")).toBeVisible();
  await expect(page.getByLabel("Nom", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Nom", { exact: true })).toHaveAttribute("aria-invalid", "true");
});

test("exige la case reCAPTCHA avant d'envoyer", async ({ page }) => {
  const sent = await fakeEmailJs(page);
  await page.goto("/fr/contact");
  await fillValidForm(page);
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  await expect(page.getByText("Cochez la case « Je ne suis pas un robot ».")).toBeVisible();
  expect(sent).toHaveLength(0);
});

test("envoie le message, puis vide le formulaire", async ({ page }) => {
  const sent = await fakeEmailJs(page);
  await page.goto("/fr/contact");
  await fillValidForm(page);
  await page.getByTestId("fake-captcha").click();
  await page.getByRole("button", { name: "Envoyer le message" }).click();

  await expect(page.getByText("Merci ! Votre message a bien été envoyé.")).toBeVisible();
  await expect(page.getByLabel("Nom", { exact: true })).toHaveValue("");
  // Contenu exact de la requête envoyée à EmailJS.
  expect(sent).toEqual([
    {
      service_id: "service_test",
      template_id: "template_test",
      user_id: "public_test",
      template_params: {
        name: "Jean Atangana",
        email: "jean@exemple.cm",
        phone: "+237 691 531 946",
        message: "Bonjour, je souhaite un audit documentaire.",
        "g-recaptcha-response": "jeton-de-test",
      },
    },
  ]);
});

test("garde la saisie et affiche une erreur si EmailJS refuse", async ({ page }) => {
  await fakeEmailJs(page, "rejected");
  await page.goto("/fr/contact");
  await fillValidForm(page);
  await page.getByTestId("fake-captcha").click();
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  // .filter : Next ajoute aussi son propre role="alert" (annonce des changements de
  // page pour les lecteurs d'écran) ; on cible le nôtre par son texte.
  await expect(page.getByRole("alert").filter({ hasText: "n'a pas pu être envoyé" })).toBeVisible();
  await expect(page.getByLabel("Nom", { exact: true })).toHaveValue("Jean Atangana");
});

test("affiche une erreur de connexion si le réseau est coupé", async ({ page }) => {
  await fakeEmailJs(page, "offline");
  await page.goto("/fr/contact");
  await fillValidForm(page);
  await page.getByTestId("fake-captcha").click();
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Connexion impossible" })).toBeVisible();
});

test("ignore silencieusement un robot qui remplit le champ piège", async ({ page }) => {
  const sent = await fakeEmailJs(page);
  await page.goto("/fr/contact");
  await fillValidForm(page);
  // Le champ piège est invisible : on le remplit comme le ferait un robot,
  // directement, sans passer par l'interface ({ force: true }).
  await page.locator("#contact-website").fill("http://spam.example", { force: true });
  await page.getByTestId("fake-captcha").click();
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  await expect(page.getByText("Merci ! Votre message a bien été envoyé.")).toBeVisible();
  expect(sent).toHaveLength(0);
});

test("ne contacte Google Maps qu'après le clic sur « Afficher la carte »", async ({ page }) => {
  const mapRequests = await fakeGoogleMaps(page);
  await page.goto("/fr/contact");
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(mapRequests).toHaveLength(0);

  await page.getByRole("button", { name: "Afficher la carte" }).click();
  await expect(page.locator("iframe[title^='Carte Google Maps']")).toBeVisible();
  expect(mapRequests.length).toBeGreaterThan(0);
});
