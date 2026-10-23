// components/pages/WhyUsPage.tsx
// Page Pourquoi nous choisir : les 5 arguments de l'affiche.

import { strengthIcons } from "@/components/content-icons";
import { CtaSection } from "@/components/sections/CtaSection";
import type { ContentProps } from "@/components/sections/types";
import { IconBadge } from "@/components/ui/IconBadge";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { strengthKeys } from "@/lib/content";

export function WhyUsPage({ lang, dict }: ContentProps) {
  return (
    <>
      <Section tone="cream" labelledBy="page-title">
        <SectionHeading level="h1" id="page-title" title={dict.pages.whyUs.title} />
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {strengthKeys.map((key) => (
            <li key={key} className="flex gap-4 rounded-2xl border border-line bg-white p-6">
              <IconBadge icon={strengthIcons[key]} />
              <div>
                <h2 className="font-heading text-lg font-bold uppercase">{dict.strengths[key].title}</h2>
                <p className="mt-1 text-ink-muted">{dict.strengths[key].text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <CtaSection lang={lang} dict={dict} />
    </>
  );
}