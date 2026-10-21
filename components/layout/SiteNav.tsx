// components/layout/SiteNav.tsx
// Menu principal : liens horizontaux sur grand écran, menu déroulant ("burger")
// sur mobile. Composant CLIENT car il a un ÉTAT (menu ouvert/fermé) et lit l'adresse.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Un lien de menu, préparé par le composant serveur Header (texte déjà traduit).
export type NavItem = {
  href: string;
  label: string;
};

type SiteNavProps = {
  items: NavItem[];
  cta: NavItem; // bouton "Contactez-nous"
  labels: { mainNav: string; menuOpen: string; menuClose: string };
};

// Retire le "/" final éventuel pour comparer "/fr/a-propos/" et "/fr/a-propos".
function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export function SiteNav({ items, cta, labels }: SiteNavProps) {
  const pathname = normalizePath(usePathname());
  const [isOpen, setIsOpen] = useState(false);

  // Touche Échap = fermer le menu (attendu par les utilisateurs au clavier).
  // On n'écoute le clavier QUE quand le menu est ouvert, et on retire l'écouteur
  // à la fermeture (la fonction "return" de useEffect fait ce nettoyage).
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lien actif : aria-current="page" (annoncé par les lecteurs d'écran) + style doré.
  function linkProps(item: NavItem) {
    const isActive = pathname === item.href;
    return {
      href: item.href,
      "aria-current": isActive ? ("page" as const) : undefined,
      onClick: () => setIsOpen(false), // ferme le menu mobile après un clic
    };
  }

  return (
    <nav aria-label={labels.mainNav}>
      {/* ---------- Grand écran (lg = 1024 px et plus) ---------- */}
      <ul className="hidden items-center gap-6 lg:flex">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              {...linkProps(item)}
              className="text-sm font-medium text-navy underline-offset-8 hover:underline aria-[current=page]:text-gold-dark aria-[current=page]:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            {...linkProps(cta)}
            className="rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold-light"
          >
            {cta.label}
          </Link>
        </li>
      </ul>

      {/* ---------- Mobile : bouton qui ouvre/ferme le menu ---------- */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        // aria-expanded : dit aux lecteurs d'écran si le menu est ouvert.
        // aria-controls : relie le bouton au panneau qu'il commande.
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? labels.menuClose : labels.menuOpen}
        className="rounded-lg p-2 text-navy hover:bg-cream lg:hidden"
      >
        {/* Icône : 3 traits (fermé) ou croix (ouvert). aria-hidden car le
            bouton a déjà un nom accessible (aria-label). */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {/* Panneau mobile : rendu uniquement quand il est ouvert. */}
      {isOpen && (
        <ul
          id="mobile-menu"
          className="absolute inset-x-0 top-full space-y-1 border-b border-line bg-white px-5 pt-2 pb-5 shadow-lg lg:hidden"
        >
          {items.map((item) => (
            <li key={item.href}>
              <Link
                {...linkProps(item)}
                className="block rounded-lg px-3 py-3 font-medium text-navy hover:bg-cream aria-[current=page]:bg-cream aria-[current=page]:text-gold-dark"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link
              {...linkProps(cta)}
              className="block rounded-xl bg-gold px-5 py-3 text-center font-semibold text-navy hover:bg-gold-light"
            >
              {cta.label}
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}