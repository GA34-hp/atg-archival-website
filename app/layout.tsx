// app/layout.tsx
// Layout racine : enveloppe HTML commune à toutes les pages.
// ⚠️ Provisoire : à l'étape 3.3, il sera déplacé dans app/[lang]/layout.tsx
// pour que l'attribut lang="fr" ou lang="en" corresponde à la langue de la page.

import type { Metadata } from "next";
import { inter, poppins } from "./fonts";
import "./globals.css";

// Métadonnées provisoires : le SEO complet (bilingue) arrive à l'étape 3.9.
export const metadata: Metadata = {
  title: "ATG SARLU – Archives Treatment General",
  description: "L'expertise au service de vos archives.",
};

// LayoutProps<"/"> : type généré par Next (d'où le script "typecheck").
// "children" contient la page en cours d'affichage.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // inter.variable et poppins.variable sont des noms de classes générés par Next.
    // Ces classes déclarent --font-inter et --font-poppins sur <html>, ce qui les
    // rend utilisables partout dans la page (et donc par @theme dans globals.css).
    // "antialiased" : lissage des polices plus fin, surtout visible sur macOS.
    <html lang="fr" className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}