// Le site lui-même : son nom, son adresse publique, sa langue, et l'image qui le montre quand on partage une de ses pages.

/** @type {import('./types.js').Site} */
const site = {
  nom: 'mateosan.fr',
  adresse: 'https://mateosan.fr',
  langue: 'fr',
  locale: 'fr_FR',
  partage: {
    image: '/images/partage.png',
    largeur: 1200,
    hauteur: 630,
    description:
      "L'établi en 3D de mateosan.fr : une cabane au toit de lierre, une platine, une boîte à outils, un carnet et une carte de visite posés sur un plateau de bois.",
  },
};

export default site;
