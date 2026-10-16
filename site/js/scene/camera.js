// La caméra de l'établi : cadrée pour que tout l'établi tienne dans la scène, quelle que soit sa forme ; elle suit un peu la
// souris, plonge sur un objet, qui s'ouvre, avant que son panneau s'ouvre, et revient quand il se ferme.

import * as THREE from './three.js';
import { reglages } from '../reglages.js';

/** Lente au départ et à l'arrivée. @param {number} t De 0 à 1. */
const enDouceur = (t) => (t < 1 / 2 ? 4 * t ** 3 : 1 - (2 - 2 * t) ** 3 / 2);

/**
 * @typedef {object} Cadrage
 * @property {THREE.Vector3} regard Le point regardé.
 * @property {THREE.Vector3} direction D'où la caméra le regarde.
 * @property {number} distance
 *
 * @typedef {object} Trajet
 * @property {Cadrage} depart
 * @property {Cadrage} arrivee
 * @property {number} duree En secondes.
 * @property {number} avance De 0 à 1.
 * @property {import('./objets.js').ObjetPose} objet Celui qui s'ouvre, ou se referme, en chemin.
 * @property {{ depart: number, arrivee: number }} ouverture De combien il est ouvert, au départ et à l'arrivée.
 * @property {() => void} fin
 */

export class Cadreur {
  constructor() {
    const c = reglages.camera;
    this.camera = new THREE.PerspectiveCamera(c.champ, 1, c.proche, c.loin);
    /** @type {Cadrage} */
    this.repos = { regard: new THREE.Vector3(...c.regard), direction: new THREE.Vector3(...c.direction).normalize(), distance: c.distance };
    /** @type {Cadrage} */
    this.cadrage = { regard: this.repos.regard.clone(), direction: this.repos.direction.clone(), distance: c.distance };
    /** Où est la souris sur la scène, de -1 à 1 ; et où en est la caméra qui la suit. */
    this.souris = new THREE.Vector2();
    this.suivi = new THREE.Vector2();
    /** @type {Trajet | null} */
    this.trajet = null;
    /** @type {import('./objets.js').ObjetPose | null} Celui sur lequel elle a plongé. */
    this.plonge = null;
  }

  /** Recule assez pour que l'établi tienne dans un cadre de cette taille. @param {number} largeur @param {number} hauteur */
  ajuster(largeur, hauteur) {
    const c = reglages.camera;
    this.camera.aspect = largeur / hauteur;
    this.camera.updateProjectionMatrix();
    const recul = c.demiLargeur / (Math.tan(THREE.MathUtils.degToRad(c.champ) / 2) * this.camera.aspect);
    this.repos.distance = Math.max(c.distance, recul);
    if (this.trajet === null && this.plonge === null) this.cadrage.distance = this.repos.distance;
  }

  /**
   * Plonge sur un objet, qui s'ouvre en chemin ; la promesse est tenue à l'arrivée.
   * @param {import('./objets.js').ObjetPose} objet
   * @returns {Promise<void>}
   */
  plonger(objet) {
    const { regard, distance, direction } = objet.modele.plongee;
    const arrivee = { regard: objet.dansLaScene(regard), direction: new THREE.Vector3(...direction).normalize(), distance };
    // Un autre objet, encore en train de se refermer, se referme d'un coup.
    if (this.plonge !== null && this.plonge !== objet) this.plonge.ouvert = 0;
    this.plonge = objet;
    return new Promise((fin) => this.partir(arrivee, reglages.plongee.duree, 1, fin));
  }

  /**
   * Revient au cadrage de repos, et l'objet se referme : en chemin, ou d'un coup quand la page revient de l'historique.
   * @param {boolean} dUnCoup
   */
  revenir(dUnCoup) {
    const objet = this.plonge;
    if (objet === null) return;
    const fin = () => {
      this.plonge = null;
    };
    if (!dUnCoup) {
      this.partir(this.repos, reglages.plongee.retour, 0, fin);
      return;
    }
    objet.ouvert = 0;
    this.trajet = null;
    this.cadrage = { regard: this.repos.regard.clone(), direction: this.repos.direction.clone(), distance: this.repos.distance };
    fin();
  }

  /**
   * Part vers un cadrage, en ouvrant ou refermant l'objet sur lequel elle a plongé.
   * @param {Cadrage} arrivee
   * @param {number} duree En secondes.
   * @param {number} ouverture Ce que sera l'ouverture de l'objet à l'arrivée.
   * @param {() => void} fin
   */
  partir(arrivee, duree, ouverture, fin) {
    const objet = this.plonge;
    if (objet === null) return;
    const depart = { regard: this.cadrage.regard.clone(), direction: this.cadrage.direction.clone(), distance: this.cadrage.distance };
    this.trajet = { depart, arrivee, duree, avance: 0, objet, ouverture: { depart: objet.ouvert, arrivee: ouverture }, fin };
  }

  /** Une image de plus. @param {number} pas En secondes. @param {boolean} calme Moins de mouvement : la souris n'est pas suivie. */
  avancer(pas, calme) {
    const trajet = this.trajet;
    if (trajet !== null) {
      trajet.avance = Math.min(1, trajet.avance + pas / trajet.duree);
      const k = enDouceur(trajet.avance);
      const { depart, arrivee } = trajet;
      this.cadrage.regard.lerpVectors(depart.regard, arrivee.regard, k);
      this.cadrage.direction.lerpVectors(depart.direction, arrivee.direction, k).normalize();
      this.cadrage.distance = THREE.MathUtils.lerp(depart.distance, arrivee.distance, k);
      trajet.objet.ouvert = THREE.MathUtils.lerp(trajet.ouverture.depart, trajet.ouverture.arrivee, k);
      if (trajet.avance === 1) {
        this.trajet = null;
        trajet.fin();
      }
    }
    const p = reglages.parallaxe;
    const suit = !calme && this.plonge === null;
    const voulu = suit ? this.souris.clone().clampScalar(-p.limite, p.limite) : new THREE.Vector2();
    this.suivi.lerp(voulu, p.lissage);
    const { regard, direction, distance } = this.cadrage;
    this.camera.position.copy(direction).multiplyScalar(distance).add(regard);
    this.camera.position.x += this.suivi.x * p.x;
    this.camera.position.y += this.suivi.y * p.y;
    this.camera.lookAt(regard);
  }
}
