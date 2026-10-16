// Le carnet de 42 et des game jams : relié par une spirale, fermé par un élastique. Ouvert, sa couverture bascule sur la
// gauche et montre une page lignée, déjà écrite.

const teinte = (clarte = 0, saturation = 0) => ({ couleur: 'teinte', clarte, saturation });
const plat = (/** @type {string} */ couleur) => ({ couleur, sansOmbre: true });

/** La longueur de chaque ligne écrite, de haut en bas de la page. */
const ECRITURE = [0.24, 0.33, 0.18, 0.29, 0.14, 0.25, 0.2, 0.3, 0.15, 0.27, 0.22];

/** @type {import('../types.js').Modele} */
const carnet = {
  place: { x: -0.62, z: 0.7, rotation: 0.16 },
  pieces: [
    { forme: 'boite-arrondie', taille: [0.62, 0.03, 0.85], rayon: 0.08, matiere: teinte(-0.095, -0.16), position: [0, 0.015, 0] },
    { forme: 'boite-arrondie', taille: [0.585, 0.07, 0.815], rayon: 0.06, matiere: { couleur: 'tranche' }, position: [0, 0.065, 0] },
    { forme: 'feuille', taille: [0.55, 0.77], matiere: plat('papier'), position: [0, 0.102, 0] },
    { forme: 'feuille', taille: [0.49, 0.0043], matiere: plat('ligne'), position: [0, 0.1025, -0.2855], repetition: { fois: 11, pas: [0, 0, 0.0562] } },
    { forme: 'feuille', taille: [0.0064, 0.727], matiere: plat('marge'), position: [-0.176, 0.1027, 0] },
    ...ECRITURE.map((longueur, ligne) => /** @type {const} */ ({
      forme: 'feuille',
      taille: [longueur, 0.013],
      matiere: plat('ecriture'),
      position: [-0.155 + longueur / 2, 0.103, -0.3028 + ligne * 0.0562],
    })),
    {
      groupe: 'couverture',
      position: [-0.31, 0.125, 0],
      pieces: [
        { forme: 'boite-arrondie', taille: [0.62, 0.05, 0.85], rayon: 0.08, matiere: teinte(), position: [0.31, 0, 0] },
        { forme: 'boite', taille: [0.035, 0.014, 0.855], matiere: teinte(-0.24, -0.31), position: [0.495, 0.027, 0] },
      ],
    },
    { forme: 'tore', rayon: 0.058, tube: 0.012, cotes: [8, 16], matiere: plat('metal'), position: [-0.315, 0.075, -0.396], repetition: { fois: 10, pas: [0, 0, 0.088] } },
  ],
  prise: { taille: [0.75, 0.44, 0.95], centre: [0, 0.16, 0] },
  sommet: 0.19,
  ouverture: [{ groupe: 'couverture', rotation: [0, 0, 2.95] }],
  mouvements: [],
  plongee: { regard: [0, 0.1, 0], distance: 0.62, direction: [0, 0.93, 0.37] },
};

export default carnet;
