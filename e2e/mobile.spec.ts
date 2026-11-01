// e2e/mobile.spec.ts
// Menu mobile et boutons flottants. Ces tests ne concernent que le téléphone.

import { expect, test } from "@playwright/test";

// test.skip(condition, raison) : on saute ces tests dans le projet "ordinateur".
test.beforeEach(({ isMobile }) => {
  test.skip(!isMobile, "Comportement propre au mobile");
});

test("le menu s'ouvre, se ferme avec Échap, et se ferme après un clic", async ({ page }) => {
  await page.goto("/fr");
  const menuButton = page.getByRole("button", { name: "Ouvrir le menu" });
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");

  await menuButton.click();
  const closeButton = page.getByRole("button", { name: "Fermer le menu" });
  await expect(closeButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-menu")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toBeHidden();

  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await page.locator("#mobile-menu").getByRole("link", { name: "Nos clients" }).click();
  await expect(page).toHaveURL(/\/fr\/nos-clients$/);
  await expect(page.locator("#mobile-menu")).toBeHidden();
});

test("les boutons d'appel et WhatsApp sont présents et traduits", async ({ page }) => {
  await page.goto("/en/about");
  await expect(page.getByRole("link", { name: "Call ATG SARLU" })).toHaveAttribute(
    "href",
    "tel:+237691531946",
  );
  await expect(page.getByRole("link", { name: "Message ATG SARLU on WhatsApp" })).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\/237691531946\?text=Hello/,
  );
});

test("aucune page ne dépasse en largeur", async ({ page }) => {
  for (const path of ["/fr", "/fr/services", "/fr/contact", "/en/why-choose-us"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBe(0);
  }
});
