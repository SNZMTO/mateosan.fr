// La platine de Honear, aux couleurs du jeu : un socle laqué vert bouteille, un disque qui tourne doucement sur sa feutrine
// couleur miel, un bras au repos et deux boutons. Ouverte, le bras vient se poser sur le disque.

/** @type {import('../types.js').Modele} */
const platine = {
  place: { x: -0.02, z: -0.38, rotation: -0.08 },
  pieces: [
    { forme: 'boite-arrondie', taille: [1.12, 0.16, 0.82], rayon: 0.06, matiere: { couleur: 'laque' }, position: [0, 0.08, 0] },
    { forme: 'boite-arrondie', taille: [1.04, 0.02, 0.74], rayon: 0.04, matiere: { couleur: 'laque', clarte: 0.04 }, position: [0, 0.165, 0] },
    {
      groupe: 'disque',
      position: [-0.14, 0.175, 0],
      pieces: [
        { forme: 'cylindre', rayons: [0.33, 0.33], hauteur: 0.03, cotes: 28, matiere: { couleur: 'alu' }, position: [0, 0.015, 0] },
        { forme: 'cylindre', rayons: [0.318, 0.318], hauteur: 0.01, cotes: 28, matiere: { couleur: 'miel' }, position: [0, 0.033, 0] },
        { forme: 'cylindre', rayons: [0.3, 0.3], hauteur: 0.012, cotes: 28, matiere: { couleur: 'vinyle' }, position: [0, 0.036, 0] },
        { forme: 'tore', rayon: 0.18, tube: 0.003, cotes: [3, 28], matiere: { couleur: 'noir-clair', sansOmbre: true }, position: [0, 0.042, 0], rotation: [Math.PI / 2, 0, 0] },
        { forme: 'tore', rayon: 0.25, tube: 0.003, cotes: [3, 28], matiere: { couleur: 'noir-clair', sansOmbre: true }, position: [0, 0.042, 0], rotation: [Math.PI / 2, 0, 0] },
        { forme: 'cylindre', rayons: [0.1, 0.1], hauteur: 0.014, cotes: 20, matiere: { couleur: 'miel', sansOmbre: true }, position: [0, 0.038, 0] },
        { forme: 'boite', taille: [0.06, 0.004, 0.016], matiere: { couleur: 'carte', sansOmbre: true }, position: [0.05, 0.046, 0] },
        { forme: 'cylindre', rayons: [0.012, 0.012], hauteur: 0.03, cotes: 8, matiere: { couleur: 'alu' }, position: [0, 0.05, 0] },
      ],
    },
    {
      groupe: 'bras',
      position: [0.36, 0.175, -0.22],
      pieces: [
        { forme: 'cylindre', rayons: [0.06, 0.07], hauteur: 0.05, cotes: 12, matiere: { couleur: 'alu' }, position: [0, 0.025, 0] },
        { forme: 'cylindre', rayons: [0.012, 0.012], hauteur: 0.44, cotes: 6, matiere: { couleur: 'alu' }, position: [0, 0.07, 0.2], rotation: [Math.PI / 2, 0, 0] },
        { forme: 'cylindre', rayons: [0.035, 0.035], hauteur: 0.06, cotes: 10, matiere: { couleur: 'gris-fonce' }, position: [0, 0.07, -0.06], rotation: [Math.PI / 2, 0, 0] },
        { forme: 'boite', taille: [0.05, 0.02, 0.08], matiere: { couleur: 'carte' }, position: [-0.015, 0.062, 0.43] },
      ],
    },
    { forme: 'cylindre', rayons: [0.04, 0.045], hauteur: 0.03, cotes: 12, matiere: { couleur: 'alu' }, position: [-0.44, 0.19, 0.3], repetition: { fois: 2, pas: [0.11, 0, 0] } },
  ],
  prise: { taille: [1.25, 0.45, 0.95], centre: [0, 0.15, 0] },
  sommet: 0.3,
  ouverture: [{ groupe: 'bras', rotation: [0, -0.7, 0] }],
  mouvements: [{ groupe: 'disque', tourne: [0, 0.8, 0] }],
  plongee: { regard: [-0.05, 0.12, 0.02], distance: 0.85, direction: [0, 0.85, 0.53] },
};

export default platine;
