// Le démarrage de l'accueil. Si le navigateur dessine en 3D, l'établi se pose en tête de la section de ses objets et répond à
// leur liste : survoler l'un, c'est survoler l'autre, et choisir un objet (dans la scène ou dans la liste) y plonge avant
// d'ouvrir sa page dans le panneau. L'adresse suit : le retour du navigateur ferme le panneau, l'avance le rouvre. Sinon, ou
// sans JavaScript, la liste et ses pages suffisent ; three.js n'est téléchargé que s'il sert.

import { modeles } from './modeles.js';
import { ecouterLaListe, lireLaListe, marquer } from './page/liste.js';
import { Panneau } from './page/panneau.js';

/** L'objet dont le panneau est ouvert, d'après l'historique ; aucun sur l'accueil lui-même. */
const objetDeLHistorique = () => {
  const objet = /** @type {unknown} */ (history.state?.objet);
  return typeof objet === 'number' ? objet : null;
};

/** Le navigateur sait-il dessiner en 3D ? */
function dessineEn3D() {
  try {
    const toile = document.createElement('canvas');
    return (toile.getContext('webgl2') ?? toile.getContext('webgl')) !== null;
  } catch {
    return false;
  }
}

/** @param {HTMLElement} section La section de l'établi, avec sa liste d'objets. */
async function demarrer(section) {
  const cartes = lireLaListe(section);
  const poses = cartes.flatMap((carte) => {
    const modele = modeles[carte.objet];
    return modele === undefined ? [] : [{ modele, carte: carte.element, titre: carte.titre }];
  });
  if (poses.length !== cartes.length) throw new Error('La liste de l\'établi nomme un objet sans modèle.');

  const { creerEtabli } = await import('./scene/etabli.js');
  const conteneur = document.createElement('div');
  conteneur.className = 'scene';
  conteneur.setAttribute('aria-hidden', 'true');
  const consigne = document.createElement('p');
  consigne.className = 'consigne';
  consigne.textContent = (matchMedia('(pointer: coarse)').matches ? section.dataset['consigneDoigt'] : section.dataset['consigneSouris']) ?? '';
  section.prepend(conteneur, consigne);
  section.classList.add('avec-scene');
  const retirer = () => {
    conteneur.remove();
    consigne.remove();
    section.classList.remove('avec-scene');
  };

  /** @type {number | null} L'objet dont le panneau est ouvert. */
  let ouvert = null;
  const panneau = new Panneau(() => {
    // Fermé par Échap ou par son retour, le panneau rend aussi son adresse à l'accueil.
    if (objetDeLHistorique() !== null) history.back();
    etabli.mettreEnPause(false);
    etabli.revenir(false);
    if (ouvert !== null) cartes[ouvert]?.lien.focus({ preventScroll: true });
    ouvert = null;
  });

  /** Ouvre le panneau d'un objet ; si sa page ne vient pas, on y va. @param {number} indice @param {boolean} retenir Ajoute son adresse à l'historique. */
  async function ouvrir(indice, retenir) {
    const lien = cartes[indice]?.lien;
    if (lien === undefined) return;
    try {
      await panneau.ouvrir(lien.pathname);
    } catch {
      location.assign(lien.href);
      return;
    }
    ouvert = indice;
    etabli.mettreEnPause(true);
    if (retenir) history.pushState({ objet: indice }, '', lien.pathname);
  }

  /** @param {number} indice */
  const choisir = (indice) => {
    if (!panneau.ouvert) etabli.plonger(indice).then(() => ouvrir(indice, true));
  };

  /** @type {ReturnType<typeof creerEtabli>} */
  let etabli;
  try {
    etabli = creerEtabli(conteneur, poses, { survol: (indice) => marquer(cartes, indice), choix: choisir, perte: retirer });
  } catch (erreur) {
    retirer();
    throw erreur;
  }
  ecouterLaListe(cartes, {
    survol: (indice) => {
      etabli.survoler(indice);
      marquer(cartes, indice);
    },
    choix: choisir,
  });
  addEventListener('popstate', () => {
    const objet = objetDeLHistorique();
    if (objet === null) panneau.fermer();
    else if (!panneau.ouvert) ouvrir(objet, false);
  });
  // Revenue de l'historique après une page quittée en pleine plongée, la scène se remet d'un coup.
  addEventListener('pageshow', (evenement) => {
    if (evenement.persisted && !panneau.ouvert) etabli.revenir(true);
  });
}

const section = document.querySelector('.etabli');
if (section instanceof HTMLElement && dessineEn3D()) demarrer(section).catch((erreur) => console.error(erreur));
