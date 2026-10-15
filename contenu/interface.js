// Les libellés communs à toutes les pages : la navigation, le pied de page, la page introuvable.

/** @type {import('./types.js').Interface} */
const libelles = {
  separateur: ' · ',
  retour: "Retour à l'établi",
  ecrire: "M'écrire",
  etabli: {
    titre: "Sur l'établi",
    intro: 'Mes projets, et qui je suis : chacun a sa page.',
  },
  liensDuProjet: 'Pour aller plus loin',
  joindre: 'Me joindre',
  navigationLegale: 'Informations légales',
  introuvable: {
    titre: 'Page introuvable',
    description: "Rien sur l'établi à cette adresse.",
  },
};

export default libelles;
