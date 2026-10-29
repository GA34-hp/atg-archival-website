// app/[lang]/layout.tsx
// LAYOUT RACINE du site. Il est dans [lang] (et non plus dans app/) pour que
// <html lang="..."> corresponde à la langue de chaque page : /fr → lang="fr".
// Il affiche l'en-tête et le pied de page communs à toutes les pages.
// Doc : node_modules/next/dist/docs/01-app/02-guides/internationalization.md

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { inter, poppins } from "@/app/fonts";
import "@/app/globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { QuickContact } from "@/components/layout/QuickContact";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

// Liste des valeurs de [lang] à générer au build : /fr et /en.
// Sans cette fonction, l'export statique refuse de construire une route dynamique.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Toute autre valeur (/de, /es…) → 404 au lieu d'essayer de générer la page.
export const dynamicParams = false;

// Titre, description et icônes, dans la langue de la page.
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
    // Favicon et icônes du pack logo (fichiers dans public/) : Next génère les
    // balises <link rel="icon">, <link rel="apple-touch-icon">, <link rel="manifest">.
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" }, // anciens navigateurs
        { url: "/favicon.svg", type: "image/svg+xml" }, // navigateurs récents, net à toute taille
      ],
      apple: "/apple-touch-icon.png", // écran d'accueil iPhone/iPad
    },
    manifest: "/site.webmanifest", // écran d'accueil Android
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
      {/* flex + min-h-screen + flex-1 sur <main> : le pied de page reste en bas
          de l'écran même quand la page a peu de contenu. */}
      <body className="flex min-h-screen flex-col">
        {/* LIEN D'ÉVITEMENT : invisible, il apparaît quand on arrive dessus avec
            la touche Tab. Il permet aux utilisateurs au clavier de sauter le menu. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          {dict.header.skipToContent}
        </a>
        <Header lang={lang} dict={dict} />
        {/* Les pages fournissent leur contenu ; le <main> est ici, une seule fois. */}
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer lang={lang} dict={dict} />
        <QuickContact texts={dict.quickContact} />
      </body>
    </html>
  );
}