// Le poste de radio du MCP de Honear : un transistor à la teinte, sa grille de haut-parleur, son cadran, deux boutons, une
// poignée et une antenne couchée. Ouvert, l'antenne se dresse et l'aiguille du cadran cherche la station.

const teinte = (clarte = 0, saturation = 0) => ({ couleur: 'teinte', clarte, saturation });
const plat = (/** @type {string} */ couleur) => ({ couleur, sansOmbre: true });

/** @type {import('../types.js').Modele} */
const radio = {
  place: { x: -1.85, z: 0.88, rotation: 0.3 },
  pieces: [
    { forme: 'boite-arrondie', taille: [0.1, 0.03, 0.2], rayon: 0.01, matiere: { couleur: 'noir-clair' }, position: [-0.24, 0.015, 0], repetition: { fois: 2, pas: [0.48, 0, 0] } },
    { forme: 'boite-arrondie', taille: [0.68, 0.36, 0.24], rayon: 0.06, matiere: teinte(), position: [0, 0.2, 0] },
    { forme: 'boite-arrondie', taille: [0.3, 0.26, 0.016], rayon: 0.03, matiere: { couleur: 'brun' }, position: [-0.15, 0.2, 0.118] },
    { forme: 'boite', taille: [0.25, 0.014, 0.008], matiere: plat('laiton'), position: [-0.15, 0.11, 0.128], repetition: { fois: 6, pas: [0, 0.036, 0] } },
    { forme: 'boite-arrondie', taille: [0.25, 0.11, 0.016], rayon: 0.02, matiere: { couleur: 'carte' }, position: [0.18, 0.27, 0.118] },
    { forme: 'boite', taille: [0.005, 0.035, 0.004], matiere: plat('trait'), position: [0.085, 0.275, 0.128], repetition: { fois: 7, pas: [0.032, 0, 0] } },
    {
      groupe: 'aiguille',
      position: [0.12, 0.27, 0.13],
      pieces: [{ forme: 'boite', taille: [0.007, 0.09, 0.004], matiere: plat('tuile') }],
    },
    {
      forme: 'cylindre',
      rayons: [0.042, 0.042],
      hauteur: 0.04,
      cotes: 14,
      matiere: { couleur: 'laiton' },
      position: [0.11, 0.12, 0.14],
      rotation: [Math.PI / 2, 0, 0],
      repetition: { fois: 2, pas: [0.14, 0, 0] },
    },
    { forme: 'boite-arrondie', taille: [0.05, 0.03, 0.06], rayon: 0.01, matiere: teinte(-0.3, -0.1), position: [-0.2, 0.39, 0], repetition: { fois: 2, pas: [0.4, 0, 0] } },
    { forme: 'tore', rayon: 0.2, tube: 0.018, cotes: [6, 16], arc: Math.PI, matiere: { couleur: 'brun' }, position: [0, 0.39, 0], echelle: [1, 0.62, 1] },
    {
      groupe: 'antenne',
      position: [-0.27, 0.38, -0.07],
      rotation: [0, 0, 0.75],
      pieces: [
        { forme: 'boule', rayon: 0.024, details: 0, matiere: { couleur: 'metal' } },
        { forme: 'cylindre', rayons: [0.006, 0.01], hauteur: 0.42, cotes: 6, matiere: { couleur: 'metal' }, position: [0, 0.21, 0] },
        { forme: 'boule', rayon: 0.013, details: 0, matiere: { couleur: 'metal' }, position: [0, 0.42, 0] },
      ],
    },
  ],
  prise: { taille: [0.84, 0.6, 0.42], centre: [-0.05, 0.3, 0] },
  sommet: 0.56,
  ouverture: [
    { groupe: 'antenne', rotation: [0, 0, -0.6] },
    { groupe: 'aiguille', position: [0.12, 0, 0] },
  ],
  mouvements: [],
  plongee: { regard: [0.04, 0.22, 0.06], distance: 0.7, direction: [0.278, 0.34, 0.898] },
};

export default radio;
