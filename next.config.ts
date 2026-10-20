// next.config.ts
// Configuration de Next.js pour le site vitrine ATG SARLU.
// Doc de référence (version installée) : node_modules/next/dist/docs/01-app/02-guides/static-exports.md

// "import type" importe uniquement le type, pour l'autocomplétion et la vérification.
// Rien n'est ajouté au code exécuté.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statique : au "next build", chaque page est rendue une fois en HTML
  // et écrite dans le dossier "out/". Aucun serveur Node.js n'est nécessaire :
  // Cloudflare Pages se contente de servir ces fichiers.
  // Conséquence : pas de routes API, de middleware, de redirections ni d'en-têtes
  // gérés par Next.js. On utilisera les fichiers _redirects / _headers de Cloudflare.
  output: "export",

  // Par défaut, <Image> de Next.js redimensionne les images À LA DEMANDE,
  // sur un serveur. Sans serveur, ce n'est pas possible : on désactive cette
  // optimisation, et on fournira nous-mêmes des images déjà en WebP aux bonnes tailles.
  images: { unoptimized: true },

  // Généré par create-next-app : indique à Turbopack (l'outil de build de Next 16)
  // de passer tous les fichiers .css par le moteur de Tailwind v4.
  // C'est ce qui transforme les classes Tailwind (bg-..., text-...) en vrai CSS.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Volontairement ABSENTS (ajoutés par défaut par create-next-app 16.4) :
  // - cacheComponents / partialPrefetching : ces options mélangent du contenu
  //   statique et du contenu calculé sur un serveur. Elles sont incompatibles
  //   avec output: "export" (erreur au build : "PPR cannot be enabled in export mode").
};

export default nextConfig;