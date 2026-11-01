// app/sitemap.ts
// Plan du site pour les moteurs de recherche → généré au build dans out/sitemap.xml.
// Liste les 12 pages (6 routes × 2 langues), chacune avec ses versions dans
// l'autre langue. Construit à partir de routes.ts : une page ajoutée là
// apparaît ici automatiquement.
// Doc : node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md

import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getAlternates, getPath, routeKeys } from "@/lib/i18n/routes";
import { absoluteUrl } from "@/lib/site-url";

// Export statique : le fichier doit être produit au build (pas à chaque visite).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return routeKeys.flatMap((route) =>
    locales.map((lang) => {
      const { languages } = getAlternates(lang, route);
      return {
        url: absoluteUrl(getPath(lang, route)),
        alternates: {
          // Object.fromEntries + map : transforme chaque adresse relative en absolue.
          languages: Object.fromEntries(
            Object.entries(languages).map(([code, path]) => [code, absoluteUrl(path)]),
          ),
        },
      };
    }),
  );
}