// components/layout/LanguageSwitcher.tsx
// Sélecteur de langue : "FR | EN". Le lien mène à LA MÊME PAGE dans l'autre
// langue (/fr/a-propos → /en/about), pas seulement à l'accueil.
//
// "use client" : ce composant lit l'adresse courante avec usePathname(), un hook
// qui n'existe que côté navigateur/React. Le layout, lui, ne connaît pas la page
// affichée (un layout ne reçoit pas les paramètres de ses pages enfants).
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/i18n/config";
import { getPath, parsePath } from "@/lib/i18n/routes";

type LanguageSwitcherProps = {
  currentLocale: Locale;
  label: string; // nom accessible du groupe, ex. "Choix de la langue"
};

export function LanguageSwitcher({ currentLocale, label }: LanguageSwitcherProps) {
  const pathname = usePathname();
  // Route actuelle ; si l'adresse est inconnue, on se rabat sur l'accueil.
  const route = parsePath(pathname)?.route ?? "home";

  return (
    // <nav> + aria-label : les lecteurs d'écran annoncent "Choix de la langue, navigation".
    <nav aria-label={label}>
      <ul className="flex items-center gap-1 text-sm font-semibold">
        {locales.map((locale) =>
          locale === currentLocale ? (
            // Langue actuelle : pas un lien (on y est déjà), signalée par aria-current.
            <li key={locale}>
              <span
                aria-current="true"
                title={localeNames[locale]}
                className="rounded-md bg-navy px-2 py-1 text-white"
              >
                {locale.toUpperCase()}
              </span>
            </li>
          ) : (
            <li key={locale}>
              {/* lang + hrefLang : la langue du lien et de la page cible, pour
                  les lecteurs d'écran et les moteurs de recherche.
                  aria-label : "English" est lu à la place de "EN". */}
              <Link
                href={getPath(locale, route)}
                lang={locale}
                hrefLang={locale}
                aria-label={localeNames[locale]}
                className="rounded-md px-2 py-1 text-navy hover:bg-cream"
              >
                {locale.toUpperCase()}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}