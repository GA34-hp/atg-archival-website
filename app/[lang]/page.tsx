// app/[lang]/page.tsx
// Page d'ACCUEIL, générée deux fois au build : /fr et /en.
// Contenu (cahier des charges) : slogan, courte présentation, aperçu des
// 5 services, citation, bouton "Contactez-nous".

import { notFound } from "next/navigation";
import { CtaSection } from "@/components/sections/CtaSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { ServicesOverviewSection } from "@/components/sections/ServicesOverviewSection";
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
    <>
      {/* Bannière : slogan + présentation + les deux boutons. */}
      <Section tone="white" labelledBy="home-title">
        <SectionHeading
          level="h1"
          id="home-title"
          eyebrow={dict.home.eyebrow}
          title={dict.slogan}
          intro={dict.intro}
        />
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href={getPath(lang, "contact")}>{dict.header.cta}</ButtonLink>
          <ButtonLink href={getPath(lang, "services")} variant="secondary">
            {dict.home.servicesCta}
          </ButtonLink>
        </div>
      </Section>
      <PillarsSection dict={dict} />
      <ServicesOverviewSection lang={lang} dict={dict} />
      <QuoteSection dict={dict} />
      <CtaSection lang={lang} dict={dict} />
    </>
  );
}