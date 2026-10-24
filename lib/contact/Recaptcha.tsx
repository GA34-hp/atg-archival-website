// components/contact/Recaptcha.tsx
// Case à cocher Google reCAPTCHA v2 ("Je ne suis pas un robot").
// Quand le visiteur la valide, Google fournit un JETON (une longue chaîne).
// Ce jeton est envoyé avec le message ; EmailJS le vérifie auprès de Google
// avec la clé SECRÈTE (enregistrée dans le tableau de bord EmailJS, jamais ici).
//
// Le script de Google n'est chargé QUE sur la page Contact (ce composant n'est
// utilisé que là) : les autres pages restent légères et sans cookie Google.
"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

// Description minimale de l'objet "grecaptcha" que le script Google ajoute à
// la page. "declare global" informe TypeScript qu'il existe sur window.
type Grecaptcha = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      hl?: string;
    },
  ) => number;
  ready: (callback: () => void) => void;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

type RecaptchaProps = {
  siteKey: string; // clé PUBLIQUE du site (NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
  lang: string; // langue de la case ("fr" / "en")
  onTokenChange: (token: string | null) => void; // null = plus de jeton valide
};

export function Recaptcha({ siteKey, lang, onTokenChange }: RecaptchaProps) {
  // useRef : une "poignée" vers la <div> réelle de la page, où Google dessine la case.
  const containerRef = useRef<HTMLDivElement>(null);
  // Vrai quand le script de Google a fini de se charger.
  const [isScriptLoaded, setIsScriptLoaded] = useState(
    () => typeof window !== "undefined" && Boolean(window.grecaptcha),
  );

  useEffect(() => {
    const grecaptcha = window.grecaptcha;
    const container = containerRef.current;
    if (!isScriptLoaded || !grecaptcha || !container) return;

    // ready() attend que reCAPTCHA soit prêt, puis on dessine la case.
    grecaptcha.ready(() => {
      // Sécurité anti-doublon : si la case est déjà dessinée ici, on ne refait rien.
      if (container.childElementCount > 0) return;
      grecaptcha.render(container, {
        sitekey: siteKey,
        hl: lang,
        callback: (token) => onTokenChange(token), // case validée
        "expired-callback": () => onTokenChange(null), // jeton expiré (~2 min)
        "error-callback": () => onTokenChange(null), // erreur réseau Google
      });
    });
  }, [isScriptLoaded, siteKey, lang, onTokenChange]);

  return (
    <>
      {/* next/script charge le script une seule fois, après l'affichage de la page.
          render=explicit : on choisit nous-mêmes où et quand dessiner la case. */}
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <div ref={containerRef} />
    </>
  );
}