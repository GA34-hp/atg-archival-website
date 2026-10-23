// app/[lang]/page.tsx
// Page d'ACCUEIL, générée deux fois au build : /fr et /en.
// Contenu définitif à l'étape 3.6. (Le <main> est fourni par le layout.)

import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPath } from "@/lib/i18n/routes";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <Section tone="white" labelledBy="home-title">
      <SectionHeading level="h1" id="home-title" title={dict.slogan} />
      {/* Les deux boutons de la charte : principal (doré) et secondaire (contour). */}
      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink href={getPath(lang, "contact")}>{dict.header.cta}</ButtonLink>
        <ButtonLink href={getPath(lang, "services")} variant="secondary">
          {dict.home.servicesCta}
        </ButtonLink>
      </div>
    </Section>
  );
}