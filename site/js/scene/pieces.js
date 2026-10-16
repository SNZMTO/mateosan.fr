// L'assemblage d'un modèle : chaque pièce décrite (site/js/types.d.ts) devient un maillage three.js, à sa place, et chaque
// groupe nommé un groupe qu'on peut ensuite animer.

import * as THREE from './three.js';
import { reglages } from '../reglages.js';

/**
 * Un rectangle aux coins arrondis, centré, dans le plan.
 * @param {number} largeur
 * @param {number} profondeur
 * @param {number} rayon
 */
function rectangleArrondi(largeur, profondeur, rayon) {
  const { rayonMin, marge } = reglages.formes.biseau;
  const r = Math.max(rayonMin, Math.min(rayon, largeur / 2 - marge, profondeur / 2 - marge));
  const [x, y] = [-largeur / 2, -profondeur / 2];
  const forme = new THREE.Shape();
  forme.moveTo(x + r, y);
  forme.lineTo(x + largeur - r, y);
  forme.quadraticCurveTo(x + largeur, y, x + largeur, y + r);
  forme.lineTo(x + largeur, y + profondeur - r);
  forme.quadraticCurveTo(x + largeur, y + profondeur, x + largeur - r, y + profondeur);
  forme.lineTo(x + r, y + profondeur);
  forme.quadraticCurveTo(x, y + profondeur, x, y + profondeur - r);
  forme.lineTo(x, y + r);
  forme.quadraticCurveTo(x, y, x + r, y);
  return forme;
}

/** Une boîte aux arêtes arrondies, centrée. @param {import('../types.js').Triplet} taille @param {number} rayon */
function boiteArrondie([largeur, hauteur, profondeur], rayon) {
  const { max, part, segments, coins } = reglages.formes.biseau;
  const biseau = Math.min(max, hauteur * part, rayon);
  const droite = hauteur - 2 * biseau;
  const geometrie = new THREE.ExtrudeGeometry(rectangleArrondi(largeur - 2 * biseau, profondeur - 2 * biseau, rayon - biseau), {
    depth: droite,
    bevelEnabled: true,
    bevelThickness: biseau,
    bevelSize: biseau,
    bevelSegments: segments,
    curveSegments: coins,
  });
  geometrie.rotateX(-Math.PI / 2);
  geometrie.translate(0, -droite / 2, 0);
  return geometrie;
}

/** Un toit à deux pans, posé sur sa base. @param {import('../types.js').Triplet} taille */
function prisme([longueur, hauteur, largeur]) {
  const triangle = new THREE.Shape();
  triangle.moveTo(-largeur / 2, 0);
  triangle.lineTo(largeur / 2, 0);
  triangle.lineTo(0, hauteur);
  triangle.closePath();
  const geometrie = new THREE.ExtrudeGeometry(triangle, { depth: longueur, bevelEnabled: false });
  geometrie.rotateY(Math.PI / 2);
  geometrie.translate(-longueur / 2, 0, 0);
  return geometrie;
}

/** @param {import('../types.js').Forme} forme @returns {THREE.BufferGeometry} */
function geometrie(forme) {
  switch (forme.forme) {
    case 'boite':
      return new THREE.BoxGeometry(...forme.taille);
    case 'boite-arrondie':
      return boiteArrondie(forme.taille, forme.rayon);
    case 'cylindre':
      return new THREE.CylinderGeometry(forme.rayons[0], forme.rayons[1], forme.hauteur, forme.cotes);
    case 'capsule':
      return new THREE.CapsuleGeometry(forme.rayon, forme.longueur, reglages.formes.capsule.bouts, reglages.formes.capsule.cotes);
    case 'tore':
      return new THREE.TorusGeometry(forme.rayon, forme.tube, forme.cotes[0], forme.cotes[1], forme.arc ?? Math.PI * 2);
    case 'boule':
      return new THREE.IcosahedronGeometry(forme.rayon, forme.details);
    case 'prisme':
      return prisme(forme.taille);
    case 'feuille':
      return new THREE.PlaneGeometry(...forme.taille).rotateX(-Math.PI / 2);
  }
}

/** @param {THREE.Object3D} objet @param {import('../types.js').Placement} placement */
function placer(objet, { position, rotation, echelle }) {
  if (position !== undefined) objet.position.set(...position);
  if (rotation !== undefined) objet.rotation.set(...rotation);
  if (echelle !== undefined) objet.scale.set(...echelle);
}

/**
 * Assemble des pièces dans un groupe ; les groupes nommés qu'elles contiennent, à toute profondeur, vont dans `nommes`.
 * @param {readonly import('../types.js').Partie[]} parties
 * @param {(matiere: import('../types.js').Matiere) => THREE.Material} matiereDe
 * @param {Map<string, THREE.Group>} nommes
 */
export function assembler(parties, matiereDe, nommes = new Map()) {
  const groupe = new THREE.Group();
  for (const partie of parties) {
    if ('groupe' in partie) {
      const sous = assembler(partie.pieces, matiereDe, nommes);
      placer(sous, partie);
      nommes.set(partie.groupe, sous);
      groupe.add(sous);
      continue;
    }
    const forme = geometrie(partie);
    const { fois, pas } = partie.repetition ?? { fois: 1, pas: /** @type {const} */ ([0, 0, 0]) };
    for (let i = 0; i < fois; i++) {
      const maillage = new THREE.Mesh(forme, matiereDe(partie.matiere));
      placer(maillage, partie);
      maillage.position.addScaledVector(new THREE.Vector3(...pas), i);
      maillage.castShadow = partie.matiere.sansOmbre !== true;
      maillage.receiveShadow = true;
      groupe.add(maillage);
    }
  }
  return groupe;
}
