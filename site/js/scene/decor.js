// Le décor de la scène : les lumières, le sol qui reçoit l'ombre de l'établi, le halo sombre sous lui, et l'établi lui-même.

import * as THREE from './three.js';
import { reglages } from '../reglages.js';
import etabli from '../modeles/etabli.js';
import { assembler } from './pieces.js';

/** Le halo : une tache d'ombre, pleine au centre, nulle au bord. @param {THREE.Color} couleur */
function halo(couleur) {
  const { taille, force, finesse, hauteur } = reglages.sol.halo;
  const PIXEL = 4;
  const PLEIN = 255;
  const donnees = new Uint8Array(finesse * finesse * PIXEL).fill(PLEIN);
  for (let ligne = 0; ligne < finesse; ligne++) {
    for (let colonne = 0; colonne < finesse; colonne++) {
      const ecart = Math.hypot((colonne / (finesse - 1)) * 2 - 1, (ligne / (finesse - 1)) * 2 - 1);
      donnees[(ligne * finesse + colonne + 1) * PIXEL - 1] = PLEIN * Math.max(0, 1 - ecart);
    }
  }
  const texture = new THREE.DataTexture(donnees, finesse, finesse, THREE.RGBAFormat);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  const matiere = new THREE.MeshBasicMaterial({ map: texture, color: couleur, transparent: true, opacity: force, depthWrite: false });
  const plan = new THREE.Mesh(new THREE.PlaneGeometry(...taille).rotateX(-Math.PI / 2), matiere);
  plan.position.y = hauteur;
  return plan;
}

/**
 * Pose le décor dans la scène, et rend la hauteur du plateau, où se posent les objets.
 * @param {THREE.Scene} scene
 * @param {import('./matieres.js').Matieres} matieres
 */
export function poserLeDecor(scene, matieres) {
  const { ciel, soleil, appoint } = reglages.lumieres;
  scene.add(new THREE.HemisphereLight(matieres.couleur('ciel'), matieres.couleur('sol'), ciel));

  const lumiere = new THREE.DirectionalLight(matieres.couleur('soleil'), soleil.intensite);
  lumiere.position.set(...soleil.position);
  lumiere.castShadow = true;
  const { ombre } = soleil;
  lumiere.shadow.mapSize.set(ombre.carte, ombre.carte);
  Object.assign(lumiere.shadow.camera, {
    left: -ombre.demiLargeur,
    right: ombre.demiLargeur,
    top: ombre.demiHauteur,
    bottom: -ombre.demiHauteur,
    near: ombre.proche,
    far: ombre.loin,
  });
  lumiere.shadow.bias = ombre.biais;
  lumiere.shadow.normalBias = ombre.biaisNormal;
  scene.add(lumiere);

  const lumiereDAppoint = new THREE.DirectionalLight(matieres.couleur('appoint'), appoint.intensite);
  lumiereDAppoint.position.set(...appoint.position);
  scene.add(lumiereDAppoint);

  const brun = matieres.couleur('ombre');
  const sol = new THREE.Mesh(
    new THREE.PlaneGeometry(...reglages.sol.taille).rotateX(-Math.PI / 2),
    new THREE.ShadowMaterial({ color: brun, opacity: reglages.sol.ombre }),
  );
  sol.receiveShadow = true;
  scene.add(sol, halo(brun));

  const bois = matieres.couleur('bois');
  scene.add(assembler(etabli.pieces, (matiere) => matieres.de(matiere, bois)));
  return etabli.hauteur;
}
