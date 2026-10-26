// components/contact/ContactForm.tsx
// Formulaire de contact : nom, email, téléphone (facultatif), message.
// Composant CLIENT : il réagit à la saisie et envoie le message depuis le navigateur.
//
// Déroulement d'un envoi :
// 1. le visiteur clique "Envoyer" → handleSubmit
// 2. champ piège rempli ? → robot : on affiche un faux succès, on n'envoie rien
// 3. validation des champs (lib/contact/validation.ts) → erreurs affichées
// 4. captcha coché ? sinon message d'erreur
// 5. envoi à EmailJS (lib/contact/send.ts) → message de succès ou d'erreur
"use client";

import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { ContactSendError, sendContactMessage } from "@/lib/contact/send";
import {
  contactLimits,
  isValid,
  validateContactForm,
  type ContactField,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/lib/contact/validation";
import { Recaptcha } from "./Recaptcha";

type ContactFormProps = {
  lang: string;
  texts: Dictionary["contact"]["form"]; // uniquement les textes du formulaire
};

// Les 4 états possibles de l'envoi. Un seul à la fois : impossible d'être
// "en cours" et "réussi" en même temps.
type Status = "idle" | "sending" | "success" | "error";

const emptyValues: ContactFormValues = { name: "", email: "", phone: "", message: "" };
const fieldOrder: ContactField[] = ["name", "email", "phone", "message"];

// Clé PUBLIQUE reCAPTCHA (lue au build). Absente → pas de case (pratique en
// développement). En production, c'est EmailJS qui EXIGE le captcha.
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function ContactForm({ lang, texts }: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>(emptyValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  // Changer cette clé fait "redessiner" la case reCAPTCHA (remise à zéro).
  const [captchaKey, setCaptchaKey] = useState(0);
  // Champ piège (honeypot) : invisible pour les humains, rempli par certains robots.
  const [honeypot, setHoneypot] = useState("");

  // useCallback : garde la MÊME fonction d'un affichage à l'autre, pour que
  // le composant Recaptcha ne redessine pas la case inutilement.
  const handleCaptchaChange = useCallback((token: string | null) => {
    setCaptchaToken(token);
    if (token) setCaptchaError(false);
  }, []);

  // Une seule fonction pour les 4 champs : "name" de l'input = clé dans values.
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = event.target.name as ContactField;
    const nextValues = { ...values, [field]: event.target.value };
    setValues(nextValues);
    // Si le champ était en erreur, on revérifie pendant la saisie : l'erreur
    // disparaît dès qu'elle est corrigée.
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateContactForm(nextValues)[field] }));
    }
    if (status === "success" || status === "error") setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Empêche le navigateur de recharger la page (comportement par défaut d'un formulaire).
    event.preventDefault();
    if (status === "sending") return; // anti double-clic

    // 2. Robot détecté : faux succès, aucun envoi (le robot ne sait pas qu'il a échoué).
    if (honeypot) {
      setStatus("success");
      setValues(emptyValues);
      return;
    }

    // 3. Validation
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    if (!isValid(nextErrors)) {
      // Place le curseur sur le premier champ en erreur (utile au clavier
      // et aux lecteurs d'écran, qui lisent alors son message d'erreur).
      const firstInvalid = fieldOrder.find((field) => nextErrors[field]);
      if (firstInvalid) document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    // 4. Captcha (seulement s'il est configuré)
    if (recaptchaSiteKey && !captchaToken) {
      setCaptchaError(true);
      return;
    }

    // 5. Envoi
    setStatus("sending");
    try {
      await sendContactMessage(values, captchaToken ?? "");
      setStatus("success");
      setValues(emptyValues);
    } catch (error) {
      // Détail technique pour le développeur (console du navigateur), message
      // simple pour le visiteur.
      console.error(error);
      const isNetwork = error instanceof ContactSendError && error.kind === "network";
      setErrorMessage(isNetwork ? texts.errorNetwork : texts.errorFailed);
      setStatus("error");
    } finally {
      // Un jeton reCAPTCHA ne sert qu'UNE fois : on remet la case à zéro.
      setCaptchaToken(null);
      setCaptchaKey((key) => key + 1);
    }
  }

  // Attributs communs à chaque champ (accessibilité des erreurs).
  function fieldProps(field: ContactField) {
    const error = errors[field];
    return {
      id: `contact-${field}`,
      name: field,
      value: values[field],
      onChange: handleChange,
      // aria-invalid : le lecteur d'écran annonce "invalide".
      "aria-invalid": error ? true : undefined,
      // aria-describedby : relie le champ à son message d'erreur, lu avec lui.
      "aria-describedby": error ? `contact-${field}-error` : undefined,
      className: `w-full rounded-xl border bg-white px-4 py-3 text-navy ${
        error ? "border-error" : "border-line"
      }`,
    };
  }

  // Message d'erreur sous un champ (rien s'il n'y a pas d'erreur).
  function fieldError(field: ContactField) {
    const code = errors[field];
    if (!code) return null;
    return (
      <p id={`contact-${field}-error`} className="mt-2 text-sm text-error">
        {texts.errors[field][code]}
      </p>
    );
  }

  const isSending = status === "sending";

  return (
    // noValidate : on désactive les bulles d'erreur du navigateur (en anglais
    // ou en français selon le navigateur) au profit de nos propres messages.
    <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className="font-heading text-2xl font-bold">
        {texts.title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block font-semibold">
            {texts.labels.name}
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            required
            maxLength={contactLimits.name.max}
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block font-semibold">
            {texts.labels.email}
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            required
            maxLength={contactLimits.email.max}
          />
          {fieldError("email")}
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className="mb-2 block font-semibold">
          {texts.labels.phone} <span className="font-normal text-ink-muted">{texts.optional}</span>
        </label>
        <input
          {...fieldProps("phone")}
          type="tel"
          autoComplete="tel"
          maxLength={contactLimits.phone.maxLength}
        />
        {fieldError("phone")}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block font-semibold">
          {texts.labels.message}
        </label>
        <textarea {...fieldProps("message")} rows={6} required maxLength={contactLimits.message.max} />
        {fieldError("message")}
      </div>

      {/* CHAMP PIÈGE : sorti de l'écran (pas display:none, que certains robots
          repèrent), retiré de la navigation au clavier (tabIndex -1) et des
          lecteurs d'écran (aria-hidden). Un humain ne le remplit jamais. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {recaptchaSiteKey && (
        <div>
          <Recaptcha
            key={captchaKey}
            siteKey={recaptchaSiteKey}
            lang={lang}
            onTokenChange={handleCaptchaChange}
          />
          {captchaError && (
            <p role="alert" className="mt-2 text-sm text-error">
              {texts.captchaRequired}
            </p>
          )}
        </div>
      )}

      <p className="text-sm text-ink-muted">{texts.privacy}</p>

      <button type="submit" disabled={isSending} className={`${buttonClasses("primary")} disabled:opacity-60`}>
        {isSending ? texts.sending : texts.submit}
      </button>

      {/* Zones de message. role="status" : annoncé poliment par les lecteurs
          d'écran ; role="alert" : annoncé immédiatement (erreur). */}
      <div role="status">
        {status === "success" && (
          <p className="rounded-xl bg-success-bg p-4 font-semibold text-success">{texts.success}</p>
        )}
      </div>
      {status === "error" && (
        <p role="alert" className="rounded-xl bg-error-bg p-4 font-semibold text-error">
          {errorMessage}
        </p>
      )}
    </form>
  );
}