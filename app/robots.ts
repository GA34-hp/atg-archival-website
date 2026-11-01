// app/robots.ts
// Consignes pour les robots des moteurs de recherche → out/robots.txt.
// Tout le site peut être exploré, et on indique où se trouve le plan du site.

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
