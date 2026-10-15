// Les pages légales, dans l'ordre du pied de page. Le corps de chacune est contenu/legal/<id>.html.

/** @type {readonly import('./types.js').PageLegale[]} */
const legal = [
  {
    id: 'mentions-legales',
    titre: 'Mentions légales',
    description: "Qui édite mateosan.fr, qui l'héberge, et ce qu'on peut faire de son contenu.",
  },
  {
    id: 'confidentialite',
    titre: 'Confidentialité',
    description: "Ce que mateosan.fr voit de votre visite, ce qu'il en garde, et vos droits.",
  },
];

export default legal;
