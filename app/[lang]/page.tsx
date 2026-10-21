// app/[lang]/page.tsx
// Page d'ACCUEIL, générée deux fois au build : /fr et /en.
// Contenu définitif à l'étape 3.6. (Le <main> est fourni par le layout.)

import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-5 py-12">
      <h1 className="font-heading text-4xl font-bold">{dict.slogan}</h1>
    </div>
  );
}