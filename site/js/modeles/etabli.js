// L'établi lui-même, dans la couleur du bois : un plateau de quatre planches, sa ceinture, ses quatre pieds, son étagère.

const bois = (/** @type {number} */ clarte, saturation = 0) => ({ couleur: 'bois', clarte, saturation });

/** @type {import('../types.js').Etabli} */
const etabli = {
  hauteur: 1.56,
  plateau: { largeur: 5, profondeur: 2.56 },
  pieces: [
    { forme: 'boite-arrondie', taille: [5, 0.2, 0.6], rayon: 0.05, matiere: bois(0), position: [0, 1.46, -0.96] },
    { forme: 'boite-arrondie', taille: [5, 0.2, 0.6], rayon: 0.05, matiere: bois(-0.045), position: [0, 1.46, -0.32] },
    { forme: 'boite-arrondie', taille: [5, 0.2, 0.6], rayon: 0.05, matiere: bois(0.032), position: [0, 1.46, 0.32] },
    { forme: 'boite-arrondie', taille: [5, 0.2, 0.6], rayon: 0.05, matiere: bois(-0.02), position: [0, 1.46, 0.96] },
    { forme: 'boite', taille: [4.6, 0.18, 0.14], matiere: bois(-0.09), position: [0, 1.27, -1.08], repetition: { fois: 2, pas: [0, 0, 2.16] } },
    { forme: 'boite', taille: [0.14, 0.18, 2.14], matiere: bois(-0.09), position: [-2.25, 1.27, 0], repetition: { fois: 2, pas: [4.5, 0, 0] } },
    ...[-0.95, 0.95].map((z) => /** @type {const} */ ({
      forme: 'cylindre',
      rayons: [0.2, 0.155],
      hauteur: 1.36,
      cotes: 4,
      matiere: bois(-0.07, -0.04),
      position: [-2.1, 0.68, z],
      rotation: [0, Math.PI / 4, 0],
      repetition: { fois: 2, pas: [4.2, 0, 0] },
    })),
    { forme: 'boite-arrondie', taille: [4.3, 0.07, 1.9], rayon: 0.03, matiere: bois(-0.02, -0.03), position: [0, 0.5, 0] },
    { forme: 'boite', taille: [0.12, 0.14, 1.9], matiere: bois(-0.1), position: [-2.1, 0.42, 0], repetition: { fois: 2, pas: [4.2, 0, 0] } },
  ],
};

export default etabli;
