// tests/validation.test.ts
// Teste les règles du formulaire de contact (lib/contact/validation.ts).
// Principe d'un test : on donne une entrée, on vérifie la sortie attendue.

import { describe, expect, it } from "vitest";
import { isValid, validateContactForm, type ContactFormValues } from "@/lib/contact/validation";

// Un formulaire VALIDE de référence. Chaque test n'en modifie qu'un champ :
// si le test échoue, on sait exactement quel champ en est la cause.
const valid: ContactFormValues = {
  name: "Jean Atangana",
  email: "jean@exemple.cm",
  phone: "+237 691 531 946",
  message: "Bonjour, je souhaite un audit documentaire.",
};

describe("validateContactForm", () => {
  it("accepte un formulaire correctement rempli", () => {
    expect(validateContactForm(valid)).toEqual({});
    expect(isValid(validateContactForm(valid))).toBe(true);
  });

  it("signale les champs obligatoires vides (le téléphone est facultatif)", () => {
    const errors = validateContactForm({ name: "", email: "", phone: "", message: "" });
    expect(errors).toEqual({ name: "required", email: "required", message: "required" });
  });

  it("considère comme vide un champ qui ne contient que des espaces", () => {
    expect(validateContactForm({ ...valid, name: "   " }).name).toBe("required");
  });

  it("vérifie les longueurs minimales et maximales", () => {
    expect(validateContactForm({ ...valid, name: "J" }).name).toBe("tooShort");
    expect(validateContactForm({ ...valid, name: "J".repeat(101) }).name).toBe("tooLong");
    expect(validateContactForm({ ...valid, message: "Court" }).message).toBe("tooShort");
    expect(validateContactForm({ ...valid, message: "x".repeat(2001) }).message).toBe("tooLong");
  });

  // it.each : le même test, répété pour chaque valeur du tableau.
  it.each(["jean", "jean@", "jean@exemple", "@exemple.cm", "jean exemple@test.cm"])(
    "refuse l'email invalide %s",
    (email) => {
      expect(validateContactForm({ ...valid, email }).email).toBe("invalid");
    },
  );

  it("refuse un retour à la ligne dans l'email (injection d'en-tête)", () => {
    expect(validateContactForm({ ...valid, email: "jean@test.cm\nBcc: x@y.z" }).email).toBe(
      "invalid",
    );
  });

  it("refuse un retour à la ligne dans le nom", () => {
    expect(validateContactForm({ ...valid, name: "Jean\nAtangana" }).name).toBe("invalid");
  });

  it.each(["691531946", "+237 691 531 946", "(237) 691-53-19-46", "691.53.19.46"])(
    "accepte le téléphone %s",
    (phone) => {
      expect(validateContactForm({ ...valid, phone }).phone).toBeUndefined();
    },
  );

  it.each(["abc", "12345", "+237 691 531 946 12345 6", "691531946 poste 2"])(
    "refuse le téléphone %s",
    (phone) => {
      expect(validateContactForm({ ...valid, phone }).phone).toBe("invalid");
    },
  );
});
