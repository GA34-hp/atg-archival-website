// components/sections/CtaSection.tsx
// Bandeau final "ATG SARLU, votre partenaire de confiance…" + bouton Contact.
// Placé en bas des pages pour inviter à prendre contact (objectif du site).

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { getPath } from "@/lib/i18n/routes";
import type { ContentProps } from "./types";

export function CtaSection({ lang, dict }: ContentProps) {
  return (
    <Section tone="navy" labelledBy="cta-title">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <h2 id="cta-title" className="max-w-2xl font-heading text-2xl font-bold uppercase">
          {dict.cta.text}
        </h2>
        <ButtonLink href={getPath(lang, "contact")}>{dict.header.cta}</ButtonLink>
      </div>
    </Section>
  );
}