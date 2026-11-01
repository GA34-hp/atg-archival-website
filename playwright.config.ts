// playwright.config.ts
// Tests de bout en bout (E2E) : un vrai navigateur parcourt le site CONSTRUIT
// (dossier out/), comme le ferait un visiteur. Lancement : npm run test:e2e
// Doc : node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md

import { defineConfig, devices } from "@playwright/test";

// Port dédié aux tests (différent de 3000, pour ne pas gêner "npm run dev").
const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  // Un test qui échoue est relancé une fois seulement en CI (GitHub Actions),
  // pour distinguer un vrai bug d'un ralentissement ponctuel de la machine.
  retries: process.env.CI ? 1 : 0,
  // En CI, interdit les "test.only" oubliés (qui désactiveraient les autres tests).
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    // En cas d'échec : capture d'écran et "trace" (film pas à pas du test),
    // consultable avec "npx playwright show-trace".
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  // Deux tailles d'écran : ordinateur et téléphone (les deux avec Chromium).
  projects: [
    { name: "ordinateur", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // Avant les tests, Playwright construit le site puis le sert, et attend qu'il réponde.
  webServer: {
    command: `npm run build && npx serve out -l ${PORT}`,
    url: baseURL + "/fr",
    timeout: 180_000, // le build peut prendre plus d'une minute
    reuseExistingServer: !process.env.CI,
    // Variables de TEST, prioritaires sur .env.local : aucun vrai email ne part
    // (EmailJS est de toute façon imité dans les tests) et la clé reCAPTCHA est
    // la clé de test publique de Google.
    env: {
      NEXT_PUBLIC_SITE_URL: baseURL,
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: "service_test",
      NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: "template_test",
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: "public_test",
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    },
  },
});
