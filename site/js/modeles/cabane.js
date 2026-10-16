// La cabane de DIciELa : quatre murs de planches sur un socle de pierre, une porte, une fenêtre, et un toit pris dans le
// lierre, à la teinte. Ouverte, la porte s'écarte et le toit se soulève sur l'intérieur : un lit, une table, une lanterne.

const mur = { couleur: 'bois', clarte: 0.04 };
const fonce = { couleur: 'bois-fonce' };
const lierre = (/** @type {number} */ clarte) => ({ couleur: 'teinte', clarte });

/** @type {import('../types.js').Modele} */
const cabane = {
  place: { x: -1.62, z: -0.4, rotation: 0.28 },
  pieces: [
    { forme: 'boite', taille: [0.8, 0.05, 0.62], matiere: { couleur: 'gris' }, position: [0, 0.025, 0] },
    { forme: 'boite', taille: [0.72, 0.4, 0.03], matiere: mur, position: [0, 0.25, -0.255] },
    { forme: 'boite', taille: [0.03, 0.4, 0.54], matiere: mur, position: [-0.345, 0.25, 0], repetition: { fois: 2, pas: [0.69, 0, 0] } },
    { forme: 'boite', taille: [0.14, 0.4, 0.03], matiere: mur, position: [-0.29, 0.25, 0.255] },
    { forme: 'boite', taille: [0.42, 0.4, 0.03], matiere: mur, position: [0.15, 0.25, 0.255] },
    { forme: 'boite', taille: [0.16, 0.12, 0.03], matiere: mur, position: [-0.14, 0.39, 0.255] },
    { forme: 'boite', taille: [0.05, 0.42, 0.05], matiere: fonce, position: [-0.36, 0.26, -0.27], repetition: { fois: 2, pas: [0.72, 0, 0] } },
    { forme: 'boite', taille: [0.05, 0.42, 0.05], matiere: fonce, position: [-0.36, 0.26, 0.27], repetition: { fois: 2, pas: [0.72, 0, 0] } },
    { forme: 'boite', taille: [0.17, 0.15, 0.012], matiere: fonce, position: [0.17, 0.27, 0.274] },
    { forme: 'boite', taille: [0.13, 0.11, 0.014], matiere: { couleur: 'vitre', opacite: 0.85 }, position: [0.17, 0.27, 0.276] },
    { forme: 'boite', taille: [0.13, 0.012, 0.016], matiere: fonce, position: [0.17, 0.27, 0.277] },
    { forme: 'boite', taille: [0.012, 0.11, 0.016], matiere: fonce, position: [0.17, 0.27, 0.277] },
    { forme: 'boite', taille: [0.14, 0.06, 0.3], matiere: { couleur: 'carte' }, position: [-0.22, 0.08, -0.08] },
    { forme: 'cylindre', rayons: [0.015, 0.015], hauteur: 0.12, cotes: 6, matiere: fonce, position: [0.1, 0.11, -0.05] },
    { forme: 'cylindre', rayons: [0.07, 0.07], hauteur: 0.012, cotes: 12, matiere: fonce, position: [0.1, 0.17, -0.05] },
    { forme: 'boule', rayon: 0.035, details: 0, matiere: { couleur: 'laiton' }, position: [0.1, 0.205, -0.05] },
    { forme: 'boule', rayon: 0.07, details: 0, matiere: lierre(-0.02), position: [-0.37, 0.18, 0.28] },
    { forme: 'boule', rayon: 0.06, details: 0, matiere: lierre(0.04), position: [-0.36, 0.33, 0.27] },
    {
      groupe: 'porte',
      position: [-0.22, 0.05, 0.272],
      pieces: [
        { forme: 'boite', taille: [0.16, 0.28, 0.02], matiere: fonce, position: [0.08, 0.14, 0] },
        { forme: 'boule', rayon: 0.014, details: 0, matiere: { couleur: 'laiton' }, position: [0.13, 0.14, 0.016] },
      ],
    },
    {
      groupe: 'toit',
      position: [0, 0.45, 0],
      pieces: [
        { forme: 'prisme', taille: [0.86, 0.26, 0.7], matiere: { couleur: 'tuile' } },
        { forme: 'boite', taille: [0.08, 0.2, 0.08], matiere: { couleur: 'gris' }, position: [0.24, 0.2, -0.1] },
        { forme: 'boule', rayon: 0.09, details: 0, matiere: lierre(0), position: [-0.25, 0.1, 0.22] },
        { forme: 'boule', rayon: 0.08, details: 0, matiere: lierre(0.05), position: [-0.05, 0.16, 0.14] },
        { forme: 'boule', rayon: 0.07, details: 0, matiere: lierre(-0.06), position: [0.2, 0.07, 0.26] },
        { forme: 'boule', rayon: 0.06, details: 0, matiere: lierre(0.03), position: [0.33, 0.12, 0.17] },
        { forme: 'boule', rayon: 0.06, details: 0, matiere: lierre(-0.03), position: [0, 0.25, 0.02] },
        { forme: 'boule', rayon: 0.08, details: 0, matiere: lierre(-0.04), position: [-0.15, 0.12, -0.18] },
      ],
    },
  ],
  prise: { taille: [0.95, 0.85, 0.85], centre: [0, 0.38, 0.02] },
  sommet: 0.78,
  ouverture: [
    { groupe: 'porte', rotation: [0, -1.4, 0] },
    { groupe: 'toit', position: [0, 0.28, -0.05], rotation: [-0.45, 0, 0] },
  ],
  mouvements: [],
  plongee: { regard: [0, 0.25, 0], distance: 1.05, direction: [0, 0.75, 0.66] },
};

export default cabane;
