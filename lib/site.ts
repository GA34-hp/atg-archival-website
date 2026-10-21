// lib/site.ts
// Coordonnées de l'entreprise, identiques dans toutes les langues.
// SOURCE UNIQUE : à modifier ici si un numéro ou une adresse change.
// (Les textes qui changent selon la langue, comme l'adresse, sont dans les dictionnaires.)

export const siteContact = {
  // Liste des numéros, dans l'ordre d'affichage. Un tableau plutôt que phone1/phone2 :
  // les composants font phones.map(...), et ajouter un numéro ne demande aucun autre changement.
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
} as const;
