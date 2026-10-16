// La boîte à outils du homelab : un couvercle entrouvert, un tournevis et un marteau qui dépassent, une clé plate posée
// devant. Ouverte, le couvercle bascule et les outils sortent.

const teinte = (clarte = 0, saturation = 0) => ({ couleur: 'teinte', clarte, saturation });

/** @type {import('../types.js').Modele} */
const boiteAOutils = {
  place: { x: 1.62, z: -0.45, rotation: -0.22 },
  pieces: [
    { forme: 'boite-arrondie', taille: [1.15, 0.4, 0.62], rayon: 0.07, matiere: teinte(), position: [0, 0.2, 0] },
    { forme: 'boite', taille: [1.02, 0.025, 0.5], matiere: teinte(-0.32, -0.13), position: [0, 0.402, 0] },
    { forme: 'boite', taille: [0.06, 0.3, 0.024], matiere: teinte(-0.1), position: [-0.42, 0.2, 0.312], repetition: { fois: 2, pas: [0.84, 0, 0] } },
    { forme: 'boite', taille: [0.09, 0.08, 0.035], matiere: { couleur: 'laiton' }, position: [-0.3, 0.33, 0.315], repetition: { fois: 2, pas: [0.6, 0, 0] } },
    {
      groupe: 'couvercle',
      position: [0, 0.4, -0.29],
      rotation: [-0.55, 0, 0],
      pieces: [
        { forme: 'boite-arrondie', taille: [1.15, 0.13, 0.62], rayon: 0.07, matiere: teinte(0.04), position: [0, 0.065, 0.29] },
        { forme: 'boite', taille: [0.06, 0.026, 0.58], matiere: teinte(-0.1), position: [-0.42, 0.14, 0.29], repetition: { fois: 2, pas: [0.84, 0, 0] } },
        { forme: 'tore', rayon: 0.12, tube: 0.028, cotes: [8, 14], arc: Math.PI, matiere: { couleur: 'brun' }, position: [0, 0.14, 0.29], echelle: [1, 0.72, 1] },
      ],
    },
    {
      groupe: 'tournevis',
      position: [0.27, 0.26, 0.08],
      rotation: [0.5, 0, -0.14],
      pieces: [
        { forme: 'cylindre', rayons: [0.013, 0.013], hauteur: 0.24, cotes: 7, matiere: { couleur: 'gris' }, position: [0, 0.12, 0] },
        { forme: 'capsule', rayon: 0.04, longueur: 0.15, matiere: { couleur: 'canard' }, position: [0, 0.33, 0] },
      ],
    },
    {
      groupe: 'marteau',
      position: [-0.26, 0.26, 0.02],
      rotation: [0.42, 0.15, 0.42],
      pieces: [
        { forme: 'cylindre', rayons: [0.03, 0.034], hauteur: 0.42, cotes: 7, matiere: { couleur: 'bois-fonce' }, position: [0, 0.21, 0] },
        { forme: 'boite-arrondie', taille: [0.17, 0.075, 0.075], rayon: 0.02, matiere: { couleur: 'gris-fonce' }, position: [0, 0.44, 0] },
      ],
    },
    {
      groupe: 'cle',
      position: [-0.7, 0, 0.5],
      rotation: [0, 0.5, 0],
      pieces: [
        { forme: 'boite', taille: [0.3, 0.024, 0.06], matiere: { couleur: 'gris' }, position: [0, 0.012, 0] },
        { forme: 'tore', rayon: 0.05, tube: 0.022, cotes: [6, 12], arc: 4.4, matiere: { couleur: 'gris' }, position: [0.17, 0.014, 0], rotation: [-Math.PI / 2, 0, 0.5] },
      ],
    },
  ],
  prise: { taille: [1.5, 1.05, 1.05], centre: [-0.08, 0.42, 0.08] },
  sommet: 0.82,
  ouverture: [
    { groupe: 'couvercle', rotation: [-1.5, 0, 0] },
    { groupe: 'tournevis', position: [0, 0.1, 0], rotation: [-0.3, 0, 0] },
    { groupe: 'marteau', position: [0, 0.08, 0], rotation: [-0.25, 0, 0] },
  ],
  mouvements: [],
  plongee: { regard: [-0.05, 0.4, 0], distance: 0.66, direction: [0, 0.77, 0.64] },
};

export default boiteAOutils;
