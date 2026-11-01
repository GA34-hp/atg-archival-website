// e2e/fakes.ts
// "Imitations" des services externes, pour des tests rapides, fiables et sans
// effet réel : aucun email envoyé, aucun appel à Google.
// page.route() intercepte les requêtes du navigateur vers une adresse et
// renvoie une réponse que l'on choisit.

import type { Page } from "@playwright/test";

// Faux script reCAPTCHA : dessine un bouton qui, au clic, fournit un jeton,
// exactement comme la vraie case le fait via son "callback".
const fakeRecaptchaScript = `
  window.grecaptcha = {
    ready(callback) { callback(); },
    render(container, options) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Je ne suis pas un robot (imitation)";
      button.dataset.testid = "fake-captcha";
      button.onclick = () => options.callback("jeton-de-test");
      container.appendChild(button);
      return 0;
    },
  };
`;

export async function fakeRecaptcha(page: Page) {
  await page.route("https://www.google.com/recaptcha/**", (route) =>
    route.fulfill({ contentType: "text/javascript", body: fakeRecaptchaScript }),
  );
}

// Comportements possibles de la fausse API EmailJS.
export type EmailJsBehaviour = "ok" | "rejected" | "offline";

// Renvoie la liste (remplie au fil du test) des messages "envoyés".
export async function fakeEmailJs(page: Page, behaviour: EmailJsBehaviour = "ok") {
  const sent: unknown[] = [];
  await page.route("https://api.emailjs.com/**", (route) => {
    sent.push(route.request().postDataJSON());
    if (behaviour === "ok") return route.fulfill({ status: 200, body: "OK" });
    if (behaviour === "rejected") return route.fulfill({ status: 400, body: "Refusé" });
    return route.abort("internetdisconnected");
  });
  return sent;
}

// Fausse carte Google Maps + compteur des requêtes vers Google Maps.
export async function fakeGoogleMaps(page: Page) {
  const requests: string[] = [];
  await page.route(/https:\/\/(maps|www)\.google\.com\/maps.*/, (route) => {
    requests.push(route.request().url());
    return route.fulfill({ contentType: "text/html", body: "<p>Carte (imitation)</p>" });
  });
  return requests;
}
