// lib/site-url.ts
// Adresse publique du site, lue dans NEXT_PUBLIC_SITE_URL (cahier technique :
// "rien en dur dans le code"). Sert aux balises canoniques, aux liens hreflang,
// au sitemap et à robots.txt : des liens ABSOLUS (https://…) sont obligatoires.
//   - en local      : NEXT_PUBLIC_SITE_URL=http://localhost:3000 (dans .env.local)
//   - en production : NEXT_PUBLIC_SITE_URL=https://atg-sarlu.com (dans Cloudflare)

// Lue UNE fois au build. Accès littéral obligatoire (voir lib/contact/send.ts).
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function getSiteUrl(): URL {
  // On ÉCHOUE AU BUILD si la variable manque ou est invalide, plutôt que de
  // publier un site dont toutes les adresses canoniques seraient fausses :
  // une erreur de référencement silencieuse serait bien plus coûteuse.
  if (!rawSiteUrl) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL manquante. Ajoutez-la dans .env.local (ex. http://localhost:3000) " +
        "ou dans les variables de Cloudflare Pages (https://atg-sarlu.com).",
    );
  }
  // new URL() lève une erreur si le texte n'est pas une adresse valide.
  const url = new URL(rawSiteUrl);
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error(`NEXT_PUBLIC_SITE_URL doit commencer par https:// (reçu : ${rawSiteUrl}).`);
  }
  return url;
}

// Adresse absolue d'une page : absoluteUrl("/fr/a-propos") → "https://atg-sarlu.com/fr/a-propos".
export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
