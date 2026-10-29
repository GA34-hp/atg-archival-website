// lib/site.ts
// Coordonnées de l'entreprise, identiques dans toutes les langues.
// SOURCE UNIQUE : à modifier ici si un numéro ou une adresse change.
// (Les textes qui changent selon la langue, comme l'adresse, sont dans les dictionnaires.)

export const siteContact = {
  // Liste des numéros, dans l'ordre d'affichage. Un tableau plutôt que phone1/phone2 :
  // les composants font phones.map(...), et ajouter un numéro ne demande aucun autre changement.
  // Le PREMIER numéro est celui du bouton d'appel flottant (mobile).
  phones: [
    {
      // Affichage tel qu'écrit sur l'affiche du client.
      display: "691 531 946",
      // Format international pour le lien d'appel : +237 = indicatif du Cameroun.
      href: "tel:+237691531946",
    },
    {
      display: "683 579 043",
      href: "tel:+237683579043",
    },
  ],
  email: "contact@atg-sarlu.com",
  // ⚠️ À CONFIRMER par le client : numéro WhatsApp.
  // Format imposé par WhatsApp : indicatif + numéro, chiffres uniquement (pas de +, pas d'espace).
  whatsappNumber: "237691531946",
  // ⚠️ À CONFIRMER par le client : adresse exacte ou coordonnées GPS ("3.8480,11.5021").
  // C'est ce texte que Google Maps cherche pour placer le repère.
  mapQuery: "Maetur Biteng, Yaoundé, Cameroun",
} as const;

// Lien WhatsApp "click to chat" (format officiel wa.me) avec un message pré-rempli.
// encodeURIComponent : transforme espaces et accents en caractères autorisés dans une URL.
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${siteContact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Lien "ouvrir dans Google Maps" (format officiel "Maps URLs", sans clé d'API).
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  siteContact.mapQuery,
)}`;

// Adresse de la carte intégrée (iframe), sans clé d'API.
// ⚠️ Ce format "output=embed" est très utilisé mais N'EST PAS documenté par Google :
// il pourrait cesser de fonctionner. Le lien mapsSearchUrl ci-dessus reste toujours
// affiché à côté de la carte, en solution de secours.
export const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  siteContact.mapQuery,
)}&z=16&output=embed`;