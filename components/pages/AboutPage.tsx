// components/pages/AboutPage.tsx
// Page À propos : présentation du cabinet + mission (Organiser – Sécuriser –
// Valoriser) + citation (cahier des charges, page "À propos").

import { CtaSection } from "@/components/sections/CtaSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { QuoteSection } from "@/components/sections/QuoteSection";
import type { ContentProps } from "@/components/sections/types";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutPage({ lang, dict }: ContentProps) {
  return (
    <>
      {/* <>…</> = "fragment" : regroupe plusieurs éléments sans ajouter de balise. */}
      <Section tone="white" labelledBy="page-title">
        <SectionHeading level="h1" id="page-title" title={dict.pages.about.title} intro={dict.intro} />
      </Section>
      <PillarsSection dict={dict} />
      <QuoteSection dict={dict} />
      <CtaSection lang={lang} dict={dict} />
    </>
  );
}