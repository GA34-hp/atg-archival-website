// components/sections/QuoteSection.tsx
// Citation de l'affiche : « Une archive bien gérée… ».
// <figure> + <blockquote> + <figcaption> : la structure HTML prévue pour
// une citation et son auteur.

import { Quote } from "lucide-react";
import { Section } from "@/components/ui/Section";
import type { ContentProps } from "./types";

export function QuoteSection({ dict }: Pick<ContentProps, "dict">) {
  return (
    <Section tone="white">
      <figure className="mx-auto max-w-3xl text-center">
        <Quote aria-hidden="true" className="mx-auto h-10 w-10 text-gold" />
        <blockquote className="mt-4 font-heading text-2xl font-semibold md:text-3xl">
          <p>« {dict.quote} »</p>
        </blockquote>
        <figcaption className="mt-4 text-sm font-semibold tracking-widest text-gold-dark uppercase">
          ATG SARLU
        </figcaption>
      </figure>
    </Section>
  );
}