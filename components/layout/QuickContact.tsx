// components/layout/QuickContact.tsx
// Boutons flottants, en bas à droite de toutes les pages (cahier des charges :
// "bouton d'appel direct (mobile) et lien WhatsApp").
// Composant SERVEUR : ce ne sont que des liens, aucun JavaScript nécessaire.

import { MessageCircle, Phone } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { getWhatsAppUrl, siteContact } from "@/lib/site";

type QuickContactProps = {
  texts: Dictionary["quickContact"];
};

export function QuickContact({ texts }: QuickContactProps) {
  // Classes communes : rond de 56 px, ombre, contour blanc (visible aussi sur
  // le pied de page marine).
  const base =
    "flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-2 ring-white transition-transform hover:scale-105";

  return (
    // fixed : reste au même endroit de l'écran pendant le défilement.
    // z-40 : au-dessus du contenu, mais sous l'en-tête (z-50) et son menu.
    // env(safe-area-inset-bottom) : évite la barre d'accueil des iPhone récents.
    <nav
      aria-label={texts.label}
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col gap-3"
    >
      {/* Appel : seulement sur mobile (md:hidden) — sur ordinateur, on ne passe
          généralement pas d'appel téléphonique depuis le navigateur. */}
      <a
        href={siteContact.phones[0].href}
        aria-label={texts.call}
        title={texts.call}
        className={`${base} bg-navy text-gold-light md:hidden`}
      >
        <Phone aria-hidden="true" className="h-6 w-6" />
      </a>
      <a
        href={getWhatsAppUrl(texts.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={texts.whatsapp}
        title={texts.whatsapp}
        className={`${base} bg-whatsapp text-white`}
      >
        <MessageCircle aria-hidden="true" className="h-7 w-7" />
      </a>
    </nav>
  );
}