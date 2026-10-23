// components/ui/Section.tsx
// Bandeau de page : une <section> avec un fond de la charte et un espacement
// vertical identique partout. La charte alterne fonds clairs et bandeaux marine :
// on choisit le fond avec "tone", sans réécrire les classes à chaque fois.

import type { ReactNode } from "react";
import { Container } from "./Container";

// Les fonds autorisés. Un type "union" : TypeScript refuse toute autre valeur.
export type SectionTone = "cream" | "white" | "navy";

// Fond + couleur de texte adaptée à chaque fond (contrastes vérifiés à l'étape 3.2).
// "Record<SectionTone, string>" oblige à prévoir une ligne pour CHAQUE fond.
const toneClasses: Record<SectionTone, string> = {
  cream: "bg-cream text-navy",
  white: "bg-white text-navy",
  navy: "bg-navy text-white",
};

type SectionProps = {
  children: ReactNode;
  tone?: SectionTone; // fond, crème par défaut
  id?: string; // ancre éventuelle (ex. lien vers #services)
  labelledBy?: string; // id du titre de la section, pour l'accessibilité
};

export function Section({ children, tone = "cream", id, labelledBy }: SectionProps) {
  return (
    // aria-labelledby : les lecteurs d'écran annoncent la section par son titre.
    <section id={id} aria-labelledby={labelledBy} className={`py-16 md:py-24 ${toneClasses[tone]}`}>
      <Container>{children}</Container>
    </section>
  );
}