// components/sections/PillarsSection.tsx
// Bandeau marine "Organiser – Sécuriser – Valoriser" (bas de l'affiche).
// Utilisé sur l'accueil et sur la page À propos.

import { pillarIcons } from "@/components/content-icons";
import { IconBadge } from "@/components/ui/IconBadge";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pillarKeys } from "@/lib/content";
import type { ContentProps } from "./types";

export function PillarsSection({ dict }: Pick<ContentProps, "dict">) {
  // Pick<ContentProps, "dict"> : seulement "dict" (cette section n'a pas de lien,
  // donc pas besoin de la langue).
  return (
    <Section tone="navy" labelledBy="pillars-title">
      <SectionHeading id="pillars-title" title={dict.pages.about.missionTitle} onDark />
      <ul className="mt-10 grid gap-8 md:grid-cols-3">
        {pillarKeys.map((key) => (
          <li key={key} className="flex items-center gap-4">
            <IconBadge icon={pillarIcons[key]} onDark />
            <div>
              <h3 className="font-heading text-xl font-bold uppercase">{dict.pillars[key].title}</h3>
              <p className="text-white/80">{dict.pillars[key].text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}