// app/[lang]/page.tsx
// Page d'ACCUEIL, générée deux fois au build : /fr et /en.
// Contenu définitif à l'étape 3.6.

import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localeNames, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPath } from "@/lib/i18n/routes";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-5 py-12">
      <h1 className="font-heading text-4xl font-bold">{dict.slogan}</h1>
      {/* LIENS DE LANGUE TEMPORAIRES (vrai sélecteur à l'étape 3.4) :
          un lien vers l'accueil dans chaque AUTRE langue. */}
      <p className="flex gap-4 text-sm">
        {locales
          .filter((other) => other !== lang)
          .map((other) => (
            <Link key={other} href={getPath(other, "home")} hrefLang={other} lang={other}>
              {localeNames[other]}
            </Link>
          ))}
      </p>
    </main>
  );
}