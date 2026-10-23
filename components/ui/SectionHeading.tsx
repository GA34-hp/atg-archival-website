// components/ui/SectionHeading.tsx
// Titre de section, sur le modèle de l'affiche : petit sur-titre doré
// (facultatif), titre en Poppins majuscules, trait doré, texte d'introduction.

type SectionHeadingProps = {
  title: string;
  id?: string; // à relier à <Section labelledBy="...">
  eyebrow?: string; // sur-titre facultatif
  intro?: string; // paragraphe facultatif
  level?: "h1" | "h2"; // h1 = titre de la page (un seul par page), h2 = sections
  onDark?: boolean; // true sur un bandeau marine : couleurs inversées
};

export function SectionHeading({
  title,
  id,
  eyebrow,
  intro,
  level = "h2",
  onDark = false,
}: SectionHeadingProps) {
  // Le niveau de titre est choisi par la page : on stocke la balise dans une
  // variable avec une MAJUSCULE, ce qui permet à React de l'utiliser comme <Heading>.
  const Heading = level;

  // Doré foncé sur fond clair, doré clair sur fond marine (règle de contraste 3.2).
  const accentText = onDark ? "text-gold-light" : "text-gold-dark";
  const accentLine = onDark ? "bg-gold-light" : "bg-gold";
  const introText = onDark ? "text-white/80" : "text-ink-muted";

  return (
    <div className="max-w-3xl space-y-4">
      {eyebrow && (
        <p className={`text-sm font-semibold tracking-widest uppercase ${accentText}`}>{eyebrow}</p>
      )}
      <Heading id={id} className="font-heading text-3xl font-bold uppercase md:text-4xl">
        {title}
      </Heading>
      {/* Trait doré décoratif (comme sur l'affiche) : aria-hidden, il n'a pas de sens à lire. */}
      <span aria-hidden="true" className={`block h-1 w-16 rounded-full ${accentLine}`} />
      {intro && <p className={`text-lg ${introText}`}>{intro}</p>}
    </div>
  );
}