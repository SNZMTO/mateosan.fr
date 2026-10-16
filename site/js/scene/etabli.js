// La scène de l'établi : le rendu, le décor, les objets à leur place et leurs étiquettes, la caméra, le pointeur ; elle se met
// en pause quand on ne la voit plus. La page lui dit quel objet survoler ; elle dit à la page ce qu'on survole et ce qu'on
// choisit.

import * as THREE from './three.js';
import { reglages } from '../reglages.js';
import { Cadreur } from './camera.js';
import { poserLeDecor } from './decor.js';
import { Etiquettes } from './etiquettes.js';
import { couleurCss, Matieres } from './matieres.js';
import { ObjetPose } from './objets.js';
import { ecouterLePointeur } from './pointeur.js';

/**
 * @typedef {object} Pose Un objet à poser sur l'établi.
 * @property {import('../types.js').Modele} modele
 * @property {Element} carte Sa carte dans la page, où se lit sa teinte (--teinte).
 * @property {string} titre Le texte de son étiquette.
 *
 * @typedef {object} Ecouteurs
 * @property {(indice: number | null) => void} survol On survole un objet, ou plus aucun.
 * @property {(indice: number) => void} choix On a choisi un objet.
 * @property {() => void} perte Le navigateur a repris la carte graphique : la scène ne dessine plus.
 */

/** @param {HTMLElement} conteneur @param {readonly Pose[]} poses @param {Ecouteurs} ecouteurs */
export function creerEtabli(conteneur, poses, ecouteurs) {
  const { rendu: r, survol: s } = reglages;
  const petit = Math.min(innerWidth, innerHeight) < r.petitEcran || matchMedia('(pointer: coarse)').matches;
  const calme = matchMedia('(prefers-reduced-motion: reduce)');

  const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  rendu.setPixelRatio(Math.min(devicePixelRatio, petit ? r.densitePetitEcran : r.densite));
  rendu.shadowMap.enabled = true;
  rendu.shadowMap.type = THREE.PCFSoftShadowMap;
  const toile = rendu.domElement;
  conteneur.append(toile);

  const scene = new THREE.Scene();
  const matieres = new Matieres(document.documentElement);
  const plateau = poserLeDecor(scene, matieres);
  const objets = poses.map(({ modele, carte }, i) => {
    const teinte = couleurCss(carte, '--teinte');
    const objet = new ObjetPose(modele, (matiere) => matieres.de(matiere, teinte), plateau, i);
    scene.add(objet.racine);
    return objet;
  });
  const etiquettes = new Etiquettes(conteneur, poses.map(({ titre }) => titre));
  const cadreur = new Cadreur();

  /** @type {number | null} */
  let survole = null;
  /** @param {number | null} indice @param {number} elan */
  function survoler(indice, elan) {
    if (cadreur.plonge !== null || indice === survole) return;
    for (const [i, objet] of objets.entries()) objet.survole = i === indice;
    if (indice !== null) objets[indice]?.elan(elan);
    survole = indice;
    etiquettes.montrer(indice);
    toile.classList.toggle('sur-un-objet', indice !== null);
  }

  const visee = new THREE.Raycaster();
  const prises = objets.map((objet) => objet.prise);
  /** Le point de l'écran, de -1 à 1 sur la scène. @param {number} x @param {number} y */
  function surLaScene(x, y) {
    const cadre = toile.getBoundingClientRect();
    return new THREE.Vector2(((x - cadre.left) / cadre.width) * 2 - 1, 1 - ((y - cadre.top) / cadre.height) * 2);
  }
  ecouterLePointeur(
    toile,
    (x, y) => {
      visee.setFromCamera(surLaScene(x, y), cadreur.camera);
      const indice = visee.intersectObjects(prises, false)[0]?.object.userData['indice'];
      return typeof indice === 'number' ? indice : null;
    },
    {
      survoler: (indice, auDoigt) => {
        if (cadreur.plonge !== null) return;
        survoler(indice, auDoigt ? s.elanToucher : s.elan);
        ecouteurs.survol(indice);
        if (indice === null) cadreur.souris.set(0, 0);
      },
      choisir: (indice) => {
        if (cadreur.plonge === null) ecouteurs.choix(indice);
      },
      suivre: (x, y) => cadreur.souris.copy(surLaScene(x, y)),
    },
  );

  function ajuster() {
    const { clientWidth: largeur, clientHeight: hauteur } = conteneur;
    if (largeur === 0 || hauteur === 0) return;
    rendu.setSize(largeur, hauteur, false);
    cadreur.ajuster(largeur, hauteur);
  }
  new ResizeObserver(ajuster).observe(conteneur);
  ajuster();

  /** @type {number | null} L'heure de l'image d'avant, telle que la donne le navigateur ; aucune au premier pas. */
  let avant = null;
  let tourne = false;
  let enVue = true;
  /** @param {number} maintenant En millisecondes. */
  function image(maintenant) {
    if (!tourne) return;
    requestAnimationFrame(image);
    // Les ressorts avancent d'un pas borné ; la caméra, du temps écoulé, pour arriver à l'heure même sur un appareil lent.
    const ecoule = avant === null ? 0 : (maintenant - avant) / 1000;
    avant = maintenant;
    for (const objet of objets) objet.avancer(Math.min(reglages.pas.max, Math.max(reglages.pas.min, ecoule)), calme.matches);
    cadreur.avancer(ecoule, calme.matches);
    if (survole !== null) {
      const point = objets[survole]?.accroche().project(cadreur.camera);
      if (point !== undefined) etiquettes.placer(survole, ((point.x + 1) / 2) * toile.clientWidth, ((1 - point.y) / 2) * toile.clientHeight);
    }
    rendu.render(scene, cadreur.camera);
  }
  function relancer() {
    const voulu = enVue && !document.hidden;
    if (voulu && !tourne) {
      avant = null;
      requestAnimationFrame(image);
    }
    tourne = voulu;
  }
  new IntersectionObserver((vues) => {
    enVue = vues.some((vue) => vue.isIntersecting);
    relancer();
  }).observe(conteneur);
  document.addEventListener('visibilitychange', relancer);
  toile.addEventListener('webglcontextlost', () => {
    tourne = false;
    ecouteurs.perte();
  });
  relancer();

  return {
    /** Survole un objet depuis la page (son lien a le focus, la souris est sur sa carte), ou plus aucun. @param {number | null} indice */
    survoler: (indice) => survoler(indice, s.elan),
    /**
     * Plonge sur un objet, qui s'ouvre ; tout de suite tenue pour qui demande moins de mouvement.
     * @param {number} indice
     * @returns {Promise<void>}
     */
    plonger(indice) {
      const objet = objets[indice];
      if (objet === undefined || calme.matches) return Promise.resolve();
      survoler(null, 0);
      return cadreur.plonger(objet);
    },
    /** Revient au repos, d'un coup : la page revient de l'historique. */
    revenir: () => cadreur.revenir(),
  };
}
