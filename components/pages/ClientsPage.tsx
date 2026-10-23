// components/pages/ClientsPage.tsx
// Page Nos clients : les secteurs accompagnés, présentés sous forme d'icônes
// (cahier des charges).

import { sectorIcons } from "@/components/content-icons";
import { CtaSection } from "@/components/sections/CtaSection";
import type { ContentProps } from "@/components/sections/types";
import { IconBadge } from "@/components/ui/IconBadge";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectorKeys } from "@/lib/content";

export function ClientsPage({ lang, dict }: ContentProps) {
  return (
    <>
      <Section tone="cream" labelledBy="page-title">
        <SectionHeading
          level="h1"
          id="page-title"
          title={dict.pages.clients.title}
          intro={dict.pages.clients.intro}
        />
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {sectorKeys.map((key) => (
            <li
              key={key}
              className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-white p-6 text-center"
            >
              <IconBadge icon={sectorIcons[key]} />
              <span className="font-semibold">{dict.sectors[key]}</span>
            </li>
          ))}
        </ul>
      </Section>
      <CtaSection lang={lang} dict={dict} />
    </>
  );
}