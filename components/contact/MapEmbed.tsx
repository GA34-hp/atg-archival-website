// components/contact/MapEmbed.tsx
// Carte Google Maps, chargée SEULEMENT si le visiteur clique sur "Afficher la carte".
//
// Pourquoi ne pas l'afficher directement ?
// - Performance : une carte Google pèse plusieurs centaines de Ko et ralentirait
//   la page (objectif du cahier des charges : moins de 3 secondes).
// - Vie privée : tant qu'on ne clique pas, le navigateur ne contacte pas Google.
// Ce principe s'appelle une "façade" : une image de remplacement, puis le vrai
// contenu à la demande.
"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { mapsEmbedUrl, mapsSearchUrl } from "@/lib/site";

type MapEmbedProps = {
  texts: Dictionary["contact"]["map"];
};

export function MapEmbed({ texts }: MapEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="space-y-4">
      {/* aspect-video : rapport largeur/hauteur 16:9, quelle que soit la largeur d'écran. */}
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-line bg-white">
        {isLoaded ? (
          <iframe
            src={mapsEmbedUrl}
            // title : obligatoire pour l'accessibilité, il annonce le contenu de l'iframe.
            title={texts.iframeTitle}
            className="h-full w-full border-0"
            loading="lazy"
            // N'envoie à Google que le nom du site, pas l'adresse complète de la page.
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            <MapPin aria-hidden="true" className="h-10 w-10 text-gold" />
            <p className="max-w-md text-sm text-ink-muted">{texts.notice}</p>
            <button type="button" onClick={() => setIsLoaded(true)} className={buttonClasses("secondary")}>
              {texts.show}
            </button>
          </div>
        )}
      </div>
      {/* Toujours présent : fonctionne même si la carte intégrée ne charge pas.
          target="_blank" ouvre un nouvel onglet ; rel="noopener noreferrer"
          empêche la page ouverte d'agir sur la nôtre (bonne pratique de sécurité). */}
      <a
        href={mapsSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-semibold text-gold-dark underline-offset-4 hover:underline"
      >
        {texts.open}
      </a>
    </div>
  );
}