// components/pages/ServicesPage.tsx
// Page Services : les 5 services et le détail de leurs prestations (affiche).
// Chaque service a un id (#audit…) : les cartes de l'accueil pointent dessus.

import { serviceIcons } from "@/components/content-icons";
import { CtaSection } from "@/components/sections/CtaSection";
import type { ContentProps } from "@/components/sections/types";
import { IconBadge } from "@/components/ui/IconBadge";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceKeys } from "@/lib/content";

export function ServicesPage({ lang, dict }: ContentProps) {
  return (
    <>
      <Section tone="white" labelledBy="page-title">
        <SectionHeading level="h1" id="page-title" title={dict.pages.services.title} intro={dict.intro} />
      </Section>

      <Section tone="cream">
        <div className="space-y-6">
          {serviceKeys.map((key) => (
            // <article> : un bloc qui a du sens tout seul (un service).
            // scroll-mt-24 : en arrivant par l'ancre #audit, le titre ne se cache
            // pas sous l'en-tête fixe (on garde 6 rem d'espace au-dessus).
            <article
              key={key}
              id={key}
              aria-labelledby={`${key}-title`}
              className="flex scroll-mt-24 flex-col gap-6 rounded-2xl border border-line bg-white p-6 sm:flex-row md:p-8"
            >
              <IconBadge icon={serviceIcons[key]} />
              <div className="space-y-4">
                <h2 id={`${key}-title`} className="font-heading text-2xl font-bold">
                  {dict.services[key].title}
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {dict.services[key].items.map((item) => (
                    <li key={item} className="flex gap-3">
                      {/* Puce dorée décorative */}
                      <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CtaSection lang={lang} dict={dict} />
    </>
  );
}