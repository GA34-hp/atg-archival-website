// components/pages/ContactPage.tsx
// Page Contact : coordonnées + formulaire (étape 3.7) + carte (étape 3.8).

import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/contact/MapEmbed";
import type { ContentProps } from "@/components/sections/types";
import { IconBadge } from "@/components/ui/IconBadge";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContact } from "@/lib/site";

export function ContactPage({ lang, dict }: ContentProps) {
  return (
    <Section tone="cream" labelledBy="page-title">
      <SectionHeading level="h1" id="page-title" title={dict.pages.contact.title} />
      {/* <address> : coordonnées du propriétaire du site. */}
      <address className="mt-10 grid gap-6 not-italic md:grid-cols-3">
        <div className="flex gap-4 rounded-2xl border border-line bg-white p-6">
          <IconBadge icon={Phone} />
          <div>
            <h2 className="font-heading font-semibold">{dict.contact.phoneLabel}</h2>
            {siteContact.phones.map((phone) => (
              <p key={phone.href}>
                <a href={phone.href} className="hover:underline">
                  {phone.display}
                </a>
              </p>
            ))}
          </div>
        </div>
        <div className="flex gap-4 rounded-2xl border border-line bg-white p-6">
          <IconBadge icon={Mail} />
          <div className="min-w-0">
            <h2 className="font-heading font-semibold">{dict.contact.emailLabel}</h2>
            {/* break-all : l'adresse email peut passer à la ligne sur petit écran. */}
            <a href={`mailto:${siteContact.email}`} className="break-all hover:underline">
              {siteContact.email}
            </a>
          </div>
        </div>
        <div className="flex gap-4 rounded-2xl border border-line bg-white p-6">
          <IconBadge icon={MapPin} />
          <div>
            <h2 className="font-heading font-semibold">{dict.contact.addressLabel}</h2>
            <p>{dict.footer.address}</p>
          </div>
        </div>
      </address>

      {/* Formulaire sur fond blanc, dans une carte. */}
      <div className="mt-10 rounded-2xl border border-line bg-white p-6 md:p-10">
        <ContactForm lang={lang} texts={dict.contact.form} />
      </div>

      {/* Carte de localisation (cahier des charges). */}
      <div className="mt-10 space-y-6">
        <h2 className="font-heading text-2xl font-bold">{dict.contact.map.title}</h2>
        <MapEmbed texts={dict.contact.map} />
      </div>
    </Section>
  );
}