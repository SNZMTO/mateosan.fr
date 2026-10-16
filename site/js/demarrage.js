// Le démarrage de l'accueil. Si le navigateur dessine en 3D, l'établi se pose en tête de la section de ses objets et répond à
// leur liste : survoler l'un, c'est survoler l'autre, et choisir un objet y plonge avant d'ouvrir sa page. Sinon, ou sans
// JavaScript, la liste suffit ; three.js n'est téléchargé que s'il sert.

import { modeles } from './modeles.js';
import { ecouterLaListe, lireLaListe, marquer } from './page/liste.js';

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

  /** @type {ReturnType<typeof creerEtabli>} */
  let etabli;
  try {
    etabli = creerEtabli(conteneur, poses, {
      survol: (indice) => marquer(cartes, indice),
      choix: (indice) => {
        const lien = cartes[indice]?.lien;
        if (lien !== undefined) etabli.plonger(indice).then(() => location.assign(lien.href));
      },
      perte: retirer,
    });
  } catch (erreur) {
    retirer();
    throw erreur;
  }
  ecouterLaListe(cartes, (indice) => {
    etabli.survoler(indice);
    marquer(cartes, indice);
  });
  addEventListener('pageshow', (evenement) => {
    if (evenement.persisted) etabli.revenir();
  });
}

const section = document.querySelector('.etabli');
if (section instanceof HTMLElement && dessineEn3D()) demarrer(section).catch((erreur) => console.error(erreur));
