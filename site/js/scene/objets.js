// Un objet posé sur l'établi : son modèle assemblé à sa place, la boîte invisible qui répond au pointeur, le ressort qui le
// fait sauter quand on le survole, ses mouvements de repos, et son ouverture quand la caméra plonge dessus.

import * as THREE from './three.js';
import { reglages } from '../reglages.js';
import { assembler } from './pieces.js';

/** Ralentit vers la fin : ce qui s'ouvre arrive en douceur. @param {number} t De 0 à 1. */
const adoucir = (t) => 1 - (1 - t) ** 3;

/** Ajoute à un angle d'Euler un triplet d'angles, multiplié. @param {THREE.Euler} angle @param {import('../types.js').Triplet} ajout @param {number} fois */
function tourner(angle, [x, y, z], fois) {
  angle.set(angle.x + x * fois, angle.y + y * fois, angle.z + z * fois);
}

export class ObjetPose {
  /**
   * @param {import('../types.js').Modele} modele
   * @param {(matiere: import('../types.js').Matiere) => THREE.Material} matiereDe
   * @param {number} plateau La hauteur du plateau de l'établi.
   * @param {number} indice Son rang dans la liste de la page.
   */
  constructor(modele, matiereDe, plateau, indice) {
    this.modele = modele;
    this.plateau = plateau;
    /** @type {Map<string, THREE.Group>} */
    this.groupes = new Map();
    this.racine = assembler(modele.pieces, matiereDe, this.groupes);
    this.racine.position.set(modele.place.x, plateau, modele.place.z);
    this.racine.rotation.y = modele.place.rotation;

    this.prise = new THREE.Mesh(new THREE.BoxGeometry(...modele.prise.taille));
    this.prise.position.set(...modele.prise.centre);
    this.prise.visible = false;
    this.prise.userData['indice'] = indice;
    this.racine.add(this.prise);

    const animes = new Set([...modele.ouverture, ...modele.mouvements].map(({ groupe }) => groupe));
    /** Le repos de chaque groupe qui bouge, d'où partent son ouverture et ses tours. */
    this.repos = new Map([...animes].map((nom) => [nom, this.groupe(nom).clone(false)]));
    /** @type {Map<string, THREE.Euler>} Ce que chaque groupe a tourné depuis le début. */
    this.tours = new Map(modele.mouvements.map(({ groupe }) => [groupe, new THREE.Euler()]));

    this.survole = false;
    /** De 0 (fermé) à 1 (ouvert) : la caméra le règle en plongeant. */
    this.ouvert = 0;
    this.saut = { hauteur: 0, vitesse: 0 };
    this.taille = { echelle: 1, vitesse: 0 };
  }

  /** @param {string} nom */
  groupe(nom) {
    const groupe = this.groupes.get(nom);
    if (groupe === undefined) throw new Error(`${nom} : ce groupe n'est pas dans le modèle`);
    return groupe;
  }

  /** Un point du modèle (depuis son pied), dans la scène. @param {import('../types.js').Triplet} point */
  dansLaScene(point) {
    const { x, z, rotation } = this.modele.place;
    return new THREE.Vector3(...point).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation).add(new THREE.Vector3(x, this.plateau, z));
  }

  /** Le point où pend son étiquette, dans la scène. */
  accroche() {
    return new THREE.Vector3(this.modele.place.x, this.racine.position.y + this.modele.sommet + reglages.survol.etiquette, this.modele.place.z);
  }

  /** Lui donne de l'élan vers le haut. @param {number} force */
  elan(force) {
    this.saut.vitesse += force;
  }

  /** Une image de plus : les ressorts, les tours, l'ouverture. @param {number} pas En secondes. @param {boolean} calme Moins de mouvement. */
  avancer(pas, calme) {
    const r = reglages.survol;
    const hauteur = this.survole ? r.hauteur : 0;
    const echelle = this.survole ? r.echelle : 1;
    if (calme) {
      this.saut = { hauteur, vitesse: 0 };
      this.taille = { echelle, vitesse: 0 };
    } else {
      this.saut.vitesse += (-r.raideur * (this.saut.hauteur - hauteur) - r.amorti * this.saut.vitesse) * pas;
      this.saut.hauteur += this.saut.vitesse * pas;
      if (this.saut.hauteur < 0) {
        this.saut.hauteur = 0;
        this.saut.vitesse = Math.max(0, -this.saut.vitesse * r.rebond);
      }
      this.taille.vitesse += (-r.raideurEchelle * (this.taille.echelle - echelle) - r.amortiEchelle * this.taille.vitesse) * pas;
      this.taille.echelle += this.taille.vitesse * pas;
      for (const { groupe, tourne } of this.modele.mouvements) tourner(this.tours.get(groupe) ?? new THREE.Euler(), tourne, pas);
    }
    this.racine.position.y = this.plateau + this.saut.hauteur;
    this.racine.scale.setScalar(this.taille.echelle);
    this.poser();
  }

  /** Pose chaque groupe qui bouge : son repos, plus son ouverture, plus ses tours. */
  poser() {
    for (const [nom, repos] of this.repos) {
      const groupe = this.groupe(nom);
      groupe.position.copy(repos.position);
      groupe.rotation.copy(repos.rotation);
    }
    const k = adoucir(this.ouvert);
    for (const { groupe, position, rotation } of this.modele.ouverture) {
      if (position !== undefined) this.groupe(groupe).position.addScaledVector(new THREE.Vector3(...position), k);
      if (rotation !== undefined) tourner(this.groupe(groupe).rotation, rotation, k);
    }
    for (const [nom, tour] of this.tours) tourner(this.groupe(nom).rotation, [tour.x, tour.y, tour.z], 1);
  }
}
