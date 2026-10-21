// app/[lang]/[slug]/page.tsx
// UNE SEULE route pour les 5 pages intérieures, dans les 2 langues.
// Pourquoi pas un dossier par page (app/[lang]/a-propos/) ? Parce que le dossier
// donnerait la même adresse dans les deux langues (/en/a-propos). Avec [slug],
// chaque langue a son propre slug, lu dans la table de routes.ts.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localeNames, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPageKey, getPath, pageKeys, pageSlugs } from "@/lib/i18n/routes";

// Génération "du haut vers le bas" : Next appelle cette fonction UNE FOIS PAR
// LANGUE produite par le layout parent, en lui passant { params: { lang } }.
// Pour "fr" → [{ slug: "a-propos" }, { slug: "services" }, …]
export function generateStaticParams({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!isLocale(lang)) return [];
  return pageKeys.map((key) => ({ slug: pageSlugs[key][lang] }));
}

// Slug inconnu (/fr/about, /fr/xyz) → 404.
export const dynamicParams = false;

// Vérifie la langue et le slug, renvoie ce dont la page a besoin.
// Partagé entre generateMetadata et la page pour ne pas dupliquer les vérifications.
async function resolvePage(params: Promise<{ lang: string; slug: string }>) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const pageKey = getPageKey(lang, slug);
  if (!pageKey) notFound();
  return { lang, pageKey, dict: getDictionary(lang) };
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { pageKey, dict } = await resolvePage(params);
  return { title: dict.pages[pageKey].title };
}

export default async function InnerPage({ params }: PageProps<"/[lang]/[slug]">) {
  const { lang, pageKey, dict } = await resolvePage(params);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-5 py-12">
      <h1 className="font-heading text-3xl font-bold uppercase">{dict.pages[pageKey].title}</h1>
      <p className="text-ink-muted">{dict.common.contentComing}</p>
      {/* LIENS DE LANGUE TEMPORAIRES : la MÊME page dans chaque autre langue
          (/fr/a-propos → /en/about), grâce à la clé de page. */}
      <p className="flex gap-4 text-sm">
        {locales
          .filter((other) => other !== lang)
          .map((other) => (
            <Link key={other} href={getPath(other, pageKey)} hrefLang={other} lang={other}>
              {localeNames[other]}
            </Link>
          ))}
      </p>
    </main>
  );
}