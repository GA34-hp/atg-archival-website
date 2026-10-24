// lib/contact/send.ts
// Envoi du message à EmailJS, par son API REST (sans bibliothèque).
// EmailJS envoie ensuite l'email depuis la boîte Zoho de contact@atg-sarlu.com.
//
// Pourquoi pas le paquet @emailjs/browser ? Il fait exactement ce fetch (vérifié
// dans son code source, v5.0.3). L'appeler nous-mêmes évite une dépendance de
// plus — donc moins de code tiers à faire confiance et pas de lockfile à modifier.
//
// ⚠️ Les identifiants EmailJS ci-dessous ne sont PAS secrets : préfixés
// NEXT_PUBLIC_, ils sont recopiés dans le JavaScript envoyé au navigateur.
// La sécurité repose sur la configuration EmailJS (domaines autorisés,
// captcha, destinataire fixé dans le modèle). La CLÉ PRIVÉE EmailJS ne doit
// JAMAIS apparaître dans ce projet.

import type { ContactFormValues } from "./validation";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

// Les causes d'échec, distinguées pour afficher le bon message.
export type SendErrorKind = "config" | "network" | "rejected";

// Une erreur qui porte en plus sa "kind" (cause), lue par le formulaire.
export class ContactSendError extends Error {
  readonly kind: SendErrorKind;

  constructor(kind: SendErrorKind, message: string) {
    super(message); // message technique, pour la console du développeur
    this.name = "ContactSendError";
    this.kind = kind;
  }
}

function getEmailJsConfig() {
  // Accès LITTÉRAL à chaque variable : Next ne remplace par la valeur au build
  // que "process.env.NEXT_PUBLIC_XXX" écrit en toutes lettres.
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) {
    // Erreur de configuration (variables absentes au build) : on échoue
    // clairement plutôt que d'envoyer une requête vouée à l'échec.
    throw new ContactSendError("config", "Configuration EmailJS manquante (.env.local).");
  }
  return { serviceId, templateId, publicKey };
}

export async function sendContactMessage(
  values: ContactFormValues,
  captchaToken: string,
): Promise<void> {
  const { serviceId, templateId, publicKey } = getEmailJsConfig();

  // Les noms des paramètres (name, email…) doivent correspondre aux variables
  // {{name}}, {{email}}… du modèle d'email créé dans le tableau de bord EmailJS.
  const body = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey, // la clé PUBLIQUE (appelée user_id par l'API)
    template_params: {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
      // Jeton du captcha : EmailJS le vérifie auprès de Google si l'option
      // captcha est activée sur le modèle. Nom imposé par reCAPTCHA.
      "g-recaptcha-response": captchaToken,
    },
  };

  let response: Response;
  try {
    response = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // fetch ne "rejette" qu'en cas de problème réseau (hors ligne, DNS…).
    throw new ContactSendError("network", "Impossible de joindre EmailJS.");
  }

  if (!response.ok) {
    // Refus d'EmailJS (captcha invalide, domaine non autorisé, quota…).
    // Le détail va dans la console pour le développeur, PAS à l'écran du
    // visiteur (pas de détails internes affichés publiquement).
    const detail = await response.text().catch(() => "");
    throw new ContactSendError("rejected", `EmailJS ${response.status} : ${detail}`);
  }
}