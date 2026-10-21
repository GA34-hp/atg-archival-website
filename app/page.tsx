// app/page.tsx
// PAGE TEMPORAIRE — "planche de charte" pour vérifier visuellement les tokens
// de l'étape 3.2. Elle sera remplacée à l'étape 3.3 (passage à app/[lang]/).

// Liste des couleurs à afficher. "as const" fige le tableau : TypeScript connaît
// alors les valeurs exactes, et personne ne peut le modifier par erreur.
const swatches = [
  { name: "navy", className: "bg-navy", hex: "#002148" },
  { name: "navy-deep", className: "bg-navy-deep", hex: "#001530" },
  { name: "navy-light", className: "bg-navy-light", hex: "#1D3451" },
  { name: "gold", className: "bg-gold", hex: "#BD830B" },
  { name: "gold-light", className: "bg-gold-light", hex: "#E3A62B" },
  { name: "gold-dark", className: "bg-gold-dark", hex: "#8F6208" },
  { name: "gold-tint", className: "bg-gold-tint", hex: "#F6E9CC" },
  { name: "cream", className: "bg-cream", hex: "#F7F1E7" },
  { name: "line", className: "bg-line", hex: "#E4DCCB" },
  { name: "ink-muted", className: "bg-ink-muted", hex: "#4A5B73" },
] as const;

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl space-y-12 px-5 py-12">
      {/* Typographie : Poppins pour les titres (font-heading), Inter pour le reste */}
      <section className="space-y-3">
        <p className="text-sm font-medium tracking-widest text-gold-dark uppercase">
          Cabinet d&apos;archivistique · Yaoundé
        </p>
        <h1 className="font-heading text-4xl font-bold">
          L&apos;expertise au service de vos archives
        </h1>
        <h2 className="font-heading text-2xl font-semibold uppercase">Nos services</h2>
        <p className="max-w-prose text-ink-muted">
          Texte courant en Inter : accents é è à ç ô, guillemets « » et tiret –.
        </p>
      </section>

      {/* Couleurs : chaque carré utilise une classe générée depuis @theme */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {swatches.map((swatch) => (
          // "key" aide React à identifier chaque élément d'une liste
          <div key={swatch.name} className="rounded-2xl border border-line bg-white p-2">
            <div className={`h-16 rounded-xl ${swatch.className}`} />
            <p className="mt-2 text-sm font-medium">{swatch.name}</p>
            <p className="text-xs text-ink-muted">{swatch.hex}</p>
          </div>
        ))}
      </section>

      {/* Boutons de la charte : principal doré / secondaire contour marine */}
      <section className="flex flex-wrap gap-4">
        <button className="rounded-xl bg-gold px-7 py-3.5 font-semibold text-navy hover:bg-gold-light">
          Contactez-nous
        </button>
        <button className="rounded-xl border-2 border-navy px-7 py-3.5 font-semibold text-navy hover:bg-white">
          Découvrir nos services
        </button>
      </section>

      {/* Bandeau marine : texte blanc, accent doré clair (jamais #BD830B sur marine pour du texte) */}
      <section className="rounded-2xl bg-navy p-8 text-white">
        <p className="font-heading text-xl font-semibold uppercase">
          Organiser – <span className="text-gold-light">Sécuriser</span> – Valoriser
        </p>
      </section>
    </main>
  );
}