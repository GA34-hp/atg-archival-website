// app/global-not-found.tsx
// PAGE 404 du site entier : affichée pour toute adresse inexistante
// (/de, /fr/xyz…). Au build, Next la génère dans out/404.html, le fichier que
// Cloudflare Pages sert automatiquement pour les pages introuvables.
//
// Pourquoi ce fichier plutôt qu'un simple not-found.tsx ? Notre layout racine
// est dans [lang] : une adresse inconnue n'a pas de langue, donc aucun layout
// ne peut l'envelopper. global-not-found est fait pour ce cas (doc Next :
// 03-api-reference/03-file-conventions/not-found.md). Il doit donc fournir
// lui-même <html>, <body>, les polices et le CSS.
// ⚠️ Fonctionnalité EXPÉRIMENTALE : activée dans next.config.ts.
//
// La langue du visiteur est inconnue : la page est BILINGUE.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { inter, poppins } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page introuvable – Page not found | ATG SARLU",
  // Une page 404 ne doit pas apparaître dans les moteurs de recherche.
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body className="flex min-h-screen items-center justify-center px-5">
        <main className="max-w-lg space-y-8 text-center">
          <Image
            src="/logo/atg-embleme.svg"
            alt="ATG SARLU"
            width={80}
            height={80}
            className="mx-auto h-20 w-20"
          />
          <p className="font-heading text-6xl font-bold text-gold-dark">404</p>

          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold">Page introuvable</h1>
            <p className="text-ink-muted">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
          </div>

          {/* lang="en" : les lecteurs d'écran lisent ce bloc avec la prononciation anglaise. */}
          <div lang="en" className="space-y-2">
            <p className="font-heading text-xl font-bold">Page not found</p>
            <p className="text-ink-muted">The page you are looking for does not exist or has been moved.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/fr" className="rounded-xl bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold-light">
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/en"
              lang="en"
              hrefLang="en"
              className="rounded-xl border-2 border-navy px-6 py-3 font-semibold text-navy hover:bg-white"
            >
              Back to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}