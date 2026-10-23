// app/[lang]/[slug]/page.tsx
// UNE SEULE route pour les 5 pages intérieures, dans les 2 langues.
// Pourquoi pas un dossier par page (app/[lang]/a-propos/) ? Parce que le dossier
// donnerait la même adresse dans les deux langues (/en/a-propos). Avec [slug],
// chaque langue a son propre slug, lu dans la table de routes.ts.
// Le contenu de chaque page est dans components/pages/ (table pageComponents).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { AboutPage } from "@/components/pages/AboutPage";
import { ClientsPage } from "@/components/pages/ClientsPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { ServicesPage } from "@/components/pages/ServicesPage";
import { WhyUsPage } from "@/components/pages/WhyUsPage";
import type { ContentProps } from "@/components/sections/types";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPageKey, pageKeys, pageSlugs, type PageKey } from "@/lib/i18n/routes";

// Quelle page afficher pour chaque clé de page.
// "Record<PageKey, …>" : une page ajoutée dans routes.ts sans composant ici
// = erreur de compilation. ComponentType<ContentProps> = "un composant qui
// reçoit { lang, dict }".
const pageComponents: Record<PageKey, ComponentType<ContentProps>> = {
  about: AboutPage,
  services: ServicesPage,
  clients: ClientsPage,
  whyUs: WhyUsPage,
  contact: ContactPage,
};

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
  // Majuscule obligatoire pour l'utiliser comme balise <PageContent />.
  const PageContent = pageComponents[pageKey];
  return <PageContent lang={lang} dict={dict} />;
}