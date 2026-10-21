// components/layout/Header.tsx
// En-tête du site, fixé en haut de l'écran (cahier des charges : "menu fixe").
// Composant SERVEUR : il prépare les liens traduits, puis délègue l'interactivité
// (menu mobile, sélecteur de langue) à deux petits composants clients.
// Avantage : seul le code interactif est envoyé au navigateur en JavaScript.

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { getPath, routeKeys } from "@/lib/i18n/routes";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SiteNav } from "./SiteNav";

type HeaderProps = {
  lang: Locale;
  dict: Dictionary;
};

export function Header({ lang, dict }: HeaderProps) {
  // Liens du menu : toutes les routes sauf "contact", qui devient le bouton doré.
  const items = routeKeys
    .filter((key) => key !== "contact")
    .map((key) => ({ href: getPath(lang, key), label: dict.nav[key] }));
  const cta = { href: getPath(lang, "contact"), label: dict.header.cta };

  return (
    // sticky top-0 : reste collé en haut pendant le défilement.
    // z-50 : passe au-dessus du contenu de la page.
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      {/* "relative" : le panneau du menu mobile se positionne sous cette barre. */}
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href={getPath(lang, "home")} className="shrink-0">
          {/* Deux versions du logo (consignes du pack logo) :
              - mobile : l'emblème seul (40 px), hidden à partir de sm (640 px) ;
              - à partir de sm : emblème + sigle "ATG" (48 px de haut).
              Celle qui est masquée (display: none) n'est pas lue par les lecteurs
              d'écran : le même texte alternatif n'est donc annoncé qu'une fois. */}
          <Image
            src="/logo/atg-embleme.svg"
            alt={dict.header.homeLink}
            width={40}
            height={40}
            priority
            className="h-10 w-10 sm:hidden"
          />
          <Image
            src="/logo/atg-entete.svg"
            alt={dict.header.homeLink}
            width={144}
            height={48}
            priority
            className="hidden h-12 w-auto sm:block"
          />
        </Link>

        <div className="flex items-center gap-3 lg:gap-8">
          <SiteNav
            items={items}
            cta={cta}
            labels={{
              mainNav: dict.header.mainNav,
              menuOpen: dict.header.menuOpen,
              menuClose: dict.header.menuClose,
            }}
          />
          <LanguageSwitcher currentLocale={lang} label={dict.header.languageSwitcher} />
        </div>
      </div>
    </header>
  );
}