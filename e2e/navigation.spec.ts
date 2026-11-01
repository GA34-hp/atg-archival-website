// e2e/navigation.spec.ts
// Navigation, langues, titres et page 404 — sur ordinateur et sur mobile.

import { expect, test } from "@playwright/test";

test("l'adresse / redirige vers l'accueil en français", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("chaque page a la bonne langue, un titre et un seul h1", async ({ page }) => {
  const pages = [
    { path: "/fr", lang: "fr", title: /ATG SARLU – L'expertise/ },
    { path: "/fr/services", lang: "fr", title: "Nos services | ATG SARLU" },
    { path: "/en/about", lang: "en", title: "About us | ATG SARLU" },
    { path: "/en/our-clients", lang: "en", title: "Our clients | ATG SARLU" },
  ];
  for (const { path, lang, title } of pages) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page).toHaveTitle(title);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});

test("le sélecteur de langue mène à la MÊME page dans l'autre langue", async ({ page }) => {
  await page.goto("/fr/pourquoi-nous-choisir");
  // getByRole : trouve un élément comme le ferait un lecteur d'écran (rôle + nom).
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/why-choose-us$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("link", { name: "Français" }).click();
  await expect(page).toHaveURL(/\/fr\/pourquoi-nous-choisir$/);
});

test("une adresse inconnue affiche la page 404 bilingue", async ({ page }) => {
  const response = await page.goto("/fr/page-inexistante");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page introuvable" })).toBeVisible();
  await expect(page.getByText("Page not found")).toBeVisible();
});

test("le lien d'évitement est le premier élément atteint au clavier", async ({ page }) => {
  await page.goto("/fr");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Aller au contenu principal" })).toBeFocused();
});

test("« En savoir plus » mène au bon service sur la page Services", async ({ page }) => {
  await page.goto("/fr");
  await page.getByRole("link", { name: "En savoir plus : Numérisation des archives" }).click();
  await expect(page).toHaveURL(/\/fr\/services#digitization$/);
  await expect(page.locator("#digitization")).toBeInViewport();
});

test("les fichiers pour les moteurs de recherche sont générés", async ({ request }) => {
  // "request" : requêtes HTTP directes, sans navigateur.
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/<url>/g)).toHaveLength(12);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
});