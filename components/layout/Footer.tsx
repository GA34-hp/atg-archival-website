// components/layout/Footer.tsx
// Pied de page, présent sur toutes les pages (cahier des charges).
// Composant SERVEUR : aucune interactivité, donc aucun JavaScript envoyé.
// Couleurs : fond marine foncé, texte blanc, accents en doré CLAIR (gold-light),
// le seul doré lisible sur fond marine (contraste 8,48 sur navy-deep).

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { getPath, routeKeys } from "@/lib/i18n/routes";
import { siteContact } from "@/lib/site";

type FooterProps = {
  lang: Locale;
  dict: Dictionary;
};

export function Footer({ lang, dict }: FooterProps) {
  // Année calculée AU BUILD (site statique) : elle se mettra à jour au
  // prochain déploiement, pas automatiquement le 1er janvier.
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-3">
        {/* Colonne 1 : logo version fond marine + slogan + signature */}
        <div className="space-y-4">
          <Image
            src="/logo/atg-fond-marine.svg"
            alt="ATG SARLU – Archives Treatment General"
            width={188}
            height={64}
            className="h-16 w-auto"
          />
          <p className="text-sm text-white/80">{dict.slogan}</p>
          <p className="font-heading text-sm font-semibold text-gold-light">{dict.footer.signature}</p>
        </div>

        {/* Colonne 2 : liens vers toutes les pages */}
        <nav aria-label={dict.footer.navTitle}>
          <h2 className="font-heading text-sm font-semibold tracking-wider text-gold-light uppercase">
            {dict.footer.navTitle}
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {routeKeys.map((key) => (
              <li key={key}>
                <Link href={getPath(lang, key)} className="text-white/80 hover:text-white hover:underline">
                  {dict.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Colonne 3 : coordonnées. <address> = balise HTML prévue pour les
            coordonnées de contact du propriétaire du site. */}
        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wider text-gold-light uppercase">
            {dict.footer.contactTitle}
          </h2>
          <address className="mt-4 space-y-2 text-sm text-white/80 not-italic">
            {siteContact.phones.map((phone) => (
              <p key={phone.href}>
                <a href={phone.href} className="hover:text-white hover:underline">
                  {phone.display}
                </a>
              </p>
            ))}
            <p>
              <a href={`mailto:${siteContact.email}`} className="hover:text-white hover:underline">
                {siteContact.email}
              </a>
            </p>
            <p>{dict.footer.address}</p>
          </address>
        </div>
      </div>

      <div className="border-t border-navy-light">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-white/60">
          © {year} ATG SARLU. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}