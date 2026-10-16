// La carte de visite de « qui je suis » : deux cartes posées l'une sur l'autre, celle du dessus marquée à la teinte. Ouverte,
// elle se soulève et se tourne vers la caméra.

/** @type {import('../types.js').Modele} */
const carteDeVisite = {
  place: { x: 1.12, z: 0.82, rotation: 0.3 },
  pieces: [
    { forme: 'boite-arrondie', taille: [0.5, 0.012, 0.29], rayon: 0.025, matiere: { couleur: 'carton' }, position: [0.04, 0.006, 0.015], rotation: [0, 0.28, 0] },
    {
      groupe: 'carte',
      pieces: [
        { forme: 'boite-arrondie', taille: [0.5, 0.013, 0.29], rayon: 0.025, matiere: { couleur: 'carte' }, position: [0, 0.019, 0] },
        { forme: 'cylindre', rayons: [0.045, 0.045], hauteur: 0.01, cotes: 14, matiere: { couleur: 'teinte', sansOmbre: true }, position: [-0.14, 0.028, -0.02] },
        { forme: 'boite', taille: [0.2, 0.007, 0.024], matiere: { couleur: 'trait', sansOmbre: true }, position: [0.08, 0.027, -0.045] },
        { forme: 'boite', taille: [0.15, 0.007, 0.02], matiere: { couleur: 'trait-clair', sansOmbre: true }, position: [0.055, 0.027, 0.005] },
        { forme: 'boite', taille: [0.24, 0.007, 0.016], matiere: { couleur: 'trait-clair', sansOmbre: true }, position: [0.075, 0.027, 0.075] },
      ],
    },
  ],
  prise: { taille: [0.75, 0.3, 0.55], centre: [0.02, 0.09, 0] },
  sommet: 0.06,
  ouverture: [{ groupe: 'carte', position: [0, 0.26, 0], rotation: [-1.12, 0, 0] }],
  mouvements: [],
  plongee: { regard: [0, 0.26, 0.04], distance: 0.5, direction: [0, 0.316, 0.949] },
};

export default carteDeVisite;
