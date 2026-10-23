// components/pages/ContactPage.tsx
// Page Contact : coordonnées. Le formulaire (étape 3.7) et la carte (étape 3.8)
// seront ajoutés ici.

import { Mail, MapPin, Phone } from "lucide-react";
import type { ContentProps } from "@/components/sections/types";
import { IconBadge } from "@/components/ui/IconBadge";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContact } from "@/lib/site";

export function ContactPage({ dict }: Pick<ContentProps, "dict">) {
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
    </Section>
  );
}