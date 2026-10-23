// components/ui/Container.tsx
// Conteneur : centre le contenu et limite sa largeur (max-w-6xl = 72 rem),
// avec une marge intérieure sur les côtés pour le mobile.
// Utilisé par Section ; réutilisable partout où on a besoin de la même largeur.

import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode; // ReactNode = "tout ce qu'on peut afficher" (texte, balises, composants)
  className?: string; // "?" = optionnel : classes à ajouter au cas par cas
};

export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-6xl px-5 ${className}`}>{children}</div>;
}