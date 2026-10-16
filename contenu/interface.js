// Les libellés communs à toutes les pages : la navigation, le pied de page, la page introuvable.

/** @type {import('./types.js').Interface} */
const libelles = {
  separateur: ' · ',
  retour: "Retour à l'établi",
  ecrire: "M'écrire",
  etabli: {
    titre: "Sur l'établi",
    intro: 'Mes projets, et qui je suis : chacun a sa page.',
    consigneSouris: "Survolez un objet pour lire son nom, cliquez pour l'ouvrir.",
    consigneDoigt: "Touchez un objet pour lire son nom, touchez-le encore pour l'ouvrir.",
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
