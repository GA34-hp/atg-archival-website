// lib/contact/validation.ts
// Règles de validation du formulaire de contact.
// Fonction PURE (aucun accès à la page, au réseau ou à React) : facile à
// comprendre et à tester. Elle renvoie des CODES d'erreur, pas des phrases :
// la phrase affichée vient du dictionnaire, dans la langue de la page.
//
// ⚠️ SÉCURITÉ : cette validation améliore l'expérience du visiteur mais ne
// PROTÈGE RIEN. Un robot peut appeler EmailJS directement sans passer par ce
// code. La protection réelle est configurée chez EmailJS (domaines autorisés,
// captcha, modèle d'email) — voir la leçon 3.7.

export type ContactFormValues = {
  name: string;
  email: string;
  phone: string; // facultatif : chaîne vide si non renseigné
  message: string;
};

export type ContactField = keyof ContactFormValues; // "name" | "email" | "phone" | "message"

export type ValidationErrorCode = "required" | "tooShort" | "tooLong" | "invalid";

// Partial : seuls les champs EN ERREUR sont présents. Objet vide = formulaire valide.
export type ContactFormErrors = Partial<Record<ContactField, ValidationErrorCode>>;

// Limites (en caractères). Exportées pour être réutilisées par les attributs
// HTML maxLength du formulaire : une seule source pour les deux.
export const contactLimits = {
  name: { min: 2, max: 100 },
  email: { max: 254 }, // longueur maximale d'une adresse email (norme RFC 5321)
  phone: { maxLength: 30, minDigits: 6, maxDigits: 15 }, // 15 chiffres max : norme E.164
  message: { min: 10, max: 2000 },
} as const;

// Email : "quelque-chose@domaine.extension", sans espace.
// Volontairement simple : la seule vraie vérification d'un email, c'est d'y
// répondre. [^\s@] = n'importe quel caractère sauf espace et @. \s couvre aussi
// les retours à la ligne, ce qui empêche d'injecter des lignes dans les
// en-têtes de l'email (le champ sert de "Reply-To").
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Téléphone : chiffres, espaces, +, point, tiret, parenthèses uniquement.
const PHONE_PATTERN = /^[+0-9 ().-]+$/;

// Retours à la ligne interdits dans les champs d'une ligne (nom, téléphone).
const LINE_BREAK = /[\r\n]/;

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  // .trim() retire les espaces au début et à la fin : "   " compte comme vide.
  const name = values.name.trim();
  if (!name) errors.name = "required";
  else if (LINE_BREAK.test(name)) errors.name = "invalid";
  else if (name.length < contactLimits.name.min) errors.name = "tooShort";
  else if (name.length > contactLimits.name.max) errors.name = "tooLong";

  const email = values.email.trim();
  if (!email) errors.email = "required";
  else if (email.length > contactLimits.email.max) errors.email = "tooLong";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "invalid";

  // Téléphone facultatif : on ne le valide que s'il est rempli.
  const phone = values.phone.trim();
  if (phone) {
    const digitCount = phone.replace(/\D/g, "").length; // \D = tout sauf un chiffre
    if (phone.length > contactLimits.phone.maxLength) errors.phone = "tooLong";
    else if (
      !PHONE_PATTERN.test(phone) ||
      digitCount < contactLimits.phone.minDigits ||
      digitCount > contactLimits.phone.maxDigits
    )
      errors.phone = "invalid";
  }

  const message = values.message.trim();
  if (!message) errors.message = "required";
  else if (message.length < contactLimits.message.min) errors.message = "tooShort";
  else if (message.length > contactLimits.message.max) errors.message = "tooLong";

  return errors;
}

// Raccourci : vrai si aucune erreur.
export function isValid(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length === 0;
}