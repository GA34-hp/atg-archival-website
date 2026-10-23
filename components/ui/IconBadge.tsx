// components/ui/IconBadge.tsx
// Pictogramme dans un rond, comme sur l'affiche.
// Décoratif : le texte à côté dit déjà ce que c'est, donc aria-hidden.

import type { LucideIcon } from "lucide-react";

type IconBadgeProps = {
  icon: LucideIcon; // le composant d'icône lui-même (ex. Archive), pas une chaîne
  onDark?: boolean; // true sur fond marine
};

export function IconBadge({ icon: Icon, onDark = false }: IconBadgeProps) {
  // "icon: Icon" renomme la prop avec une majuscule pour pouvoir écrire <Icon />.
  const colors = onDark ? "bg-gold-light text-navy" : "bg-navy text-gold-light";
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${colors}`}
    >
      <Icon className="h-7 w-7" strokeWidth={1.75} />
    </span>
  );
}