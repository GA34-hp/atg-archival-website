// app/[lang]/layout.tsx
// LAYOUT RACINE du site. Il est dans [lang] (et non plus dans app/) pour que
// <html lang="..."> corresponde à la langue de chaque page : /fr → lang="fr".
// Doc : node_modules/next/dist/docs/01-app/02-guides/internationalization.md

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { inter, poppins } from "@/app/fonts";
import "@/app/globals.css";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPath, pageKeys } from "@/lib/i18n/routes";

// Liste des valeurs de [lang] à générer au build : /fr et /en.
// Sans cette fonction, l'export statique refuse de construire une route dynamique.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Toute autre valeur (/de, /es…) → 404 au lieu d'essayer de générer la page.
export const dynamicParams = false;

// Titre et description de l'onglet, dans la langue de la page.
// "template" : les pages fourniront "À propos", affiché "À propos | ATG SARLU".
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return {
    title: { default: dict.meta.siteName, template: `%s | ${dict.meta.siteName}` },
    description: dict.meta.description,
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  // Depuis Next 15, "params" est une Promise : il faut l'attendre avec await.
  const { lang } = await params;
  // "lang" est un simple string venant de l'URL : on le vérifie avant de s'en servir.
  // Après ce test, TypeScript sait que lang est "fr" | "en".
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body>
        {/* NAVIGATION TEMPORAIRE pour tester les routes.
            Remplacée par le vrai en-tête à l'étape 3.4. */}
        <nav className="flex flex-wrap gap-4 border-b border-line bg-white px-5 py-3 text-sm">
          <Link href={getPath(lang, "home")}>{dict.nav.home}</Link>
          {pageKeys.map((key) => (
            <Link key={key} href={getPath(lang, key)}>
              {dict.nav[key]}
            </Link>
          ))}
        </nav>
        {children}
      </body>
    </html>
  );
}