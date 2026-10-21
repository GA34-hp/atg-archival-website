// app/fonts.ts
// Déclaration des polices du site, chargées avec next/font.
// Au build, Next télécharge les fichiers de police depuis Google Fonts et les copie
// dans out/_next/static/media/ : le visiteur ne contacte jamais Google.
// Doc : node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md

import { Inter, Poppins } from "next/font/google";

// Inter : police du texte courant (paragraphes, menus, formulaires).
// C'est une police "variable" : un seul fichier contient toutes les graisses
// (400, 500, 600…), donc pas besoin de les lister.
export const inter = Inter({
  // "latin" couvre les caractères du français (é, è, à, ç, «, »…).
  // On ne télécharge pas les alphabets inutiles (cyrillique, grec…).
  subsets: ["latin"],
  // "swap" : le texte s'affiche tout de suite avec une police de secours,
  // puis bascule sur Inter dès qu'elle est chargée. Le texte n'est jamais invisible.
  display: "swap",
  // Nom de la variable CSS créée par Next. On la relie à Tailwind dans globals.css.
  variable: "--font-inter",
});

// Poppins : police des titres. C'est la police du logo, d'où la cohérence visuelle.
// Elle N'EST PAS variable : chaque graisse est un fichier séparé. On ne charge
// donc que celles dont on a besoin, ce qui réduit le poids de la page.
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"], // 600 = semi-gras (sous-titres), 700 = gras (titres)
  display: "swap",
  variable: "--font-poppins",
});