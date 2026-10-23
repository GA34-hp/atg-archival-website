// components/ui/ButtonLink.tsx
// Lien qui a l'apparence d'un bouton (charte : bouton principal doré à texte
// marine, bouton secondaire à contour marine).
// Pourquoi un LIEN et pas un <button> ? Il mène à une autre page : en HTML, ce
// qui navigue est un lien (<a>), ce qui déclenche une action est un <button>.
// Les styles sont dans buttonClasses() pour être réutilisés par le vrai
// <button> du formulaire de contact (étape 3.7).

import Link from "next/link";
import type { ReactNode } from "react";

// primary   : fond doré, texte marine (contraste 4,89) – l'action principale
// secondary : contour marine, sur fond clair
// onDark    : contour blanc, sur bandeau marine
export type ButtonVariant = "primary" | "secondary" | "onDark";

const baseClasses =
  "inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition-colors";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gold text-navy hover:bg-gold-light",
  secondary: "border-2 border-navy text-navy hover:bg-navy hover:text-white",
  onDark: "border-2 border-white text-white hover:bg-white hover:text-navy",
};

export function buttonClasses(variant: ButtonVariant = "primary"): string {
  return `${baseClasses} ${variantClasses[variant]}`;
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses(variant)}>
      {children}
    </Link>
  );
}