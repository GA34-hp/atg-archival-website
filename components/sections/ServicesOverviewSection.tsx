// components/sections/ServicesOverviewSection.tsx
// Aperçu des 5 services (accueil) : une carte par service, avec un lien vers
// le détail sur la page Services (ancre #audit, #archiving…).

import Link from "next/link";
import { serviceIcons } from "@/components/content-icons";
import { IconBadge } from "@/components/ui/IconBadge";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceKeys } from "@/lib/content";
import { getPath } from "@/lib/i18n/routes";
import type { ContentProps } from "./types";

export function ServicesOverviewSection({ lang, dict }: ContentProps) {
  const servicesPath = getPath(lang, "services");

  return (
    <Section tone="cream" labelledBy="services-overview-title">
      <SectionHeading id="services-overview-title" title={dict.pages.services.title} />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {serviceKeys.map((key) => (
          <li key={key} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6">
            <IconBadge icon={serviceIcons[key]} />
            <h3 className="font-heading text-lg font-semibold">{dict.services[key].title}</h3>
            {/* mt-auto : pousse le lien en bas de la carte, aligné sur toutes les cartes. */}
            <Link
              href={`${servicesPath}#${key}`}
              className="mt-auto font-semibold text-gold-dark underline-offset-4 hover:underline"
            >
              {dict.home.learnMore}
              {/* 5 liens "En savoir plus" identiques seraient ambigus pour un lecteur
                  d'écran : on ajoute le nom du service, invisible à l'écran (sr-only). */}
              <span className="sr-only"> : {dict.services[key].title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}