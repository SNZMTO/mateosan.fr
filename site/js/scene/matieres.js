// Les matières de la scène : un rendu en aplats, dans les couleurs de la palette du site, lues dans ses variables CSS
// (--scene-<nom>, site/css/palette.css). « teinte » est la couleur de l'objet, lue sur sa carte (--teinte).

import * as THREE from './three.js';
import { reglages } from '../reglages.js';

/**
 * La couleur d'une variable CSS, telle que la voit un élément de la page.
 * @param {Element} element
 * @param {string} variable
 */
export function couleurCss(element, variable) {
  const valeur = getComputedStyle(element).getPropertyValue(variable).trim();
  if (valeur === '') throw new Error(`${variable} : cette couleur n'est pas dans la palette`);
  return new THREE.Color(valeur);
}

/** Le dégradé à paliers du rendu en aplats : l'ombre, puis deux demi-teintes, puis la pleine lumière. */
function degradeAPaliers() {
  const { paliers } = reglages.rendu;
  const PIXEL = 4;
  const donnees = new Uint8Array(paliers.length * PIXEL);
  paliers.forEach((palier, i) => donnees.fill(palier, i * PIXEL, (i + 1) * PIXEL));
  const texture = new THREE.DataTexture(donnees, paliers.length, 1, THREE.RGBAFormat);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

/** Les matières d'une scène, chacune faite une fois et partagée par toutes les pièces qui la nomment. */
export class Matieres {
  /** @param {Element} racine L'élément où se lisent les couleurs de la scène. */
  constructor(racine) {
    this.racine = racine;
    this.degrade = degradeAPaliers();
    /** @type {Map<string, THREE.Color>} */
    this.couleurs = new Map();
    /** @type {Map<string, THREE.MeshToonMaterial>} */
    this.faites = new Map();
  }

  /**
   * Une couleur de la scène, par son nom (« bois » se lit dans --scene-bois).
   * @param {string} nom
   */
  couleur(nom) {
    const lue = this.couleurs.get(nom) ?? couleurCss(this.racine, `--scene-${nom}`);
    this.couleurs.set(nom, lue);
    return lue;
  }

  /**
   * La matière d'une pièce, pour un objet de cette teinte.
   * @param {import('../types.js').Matiere} matiere
   * @param {THREE.Color} teinte
   */
  de(matiere, teinte) {
    const { couleur, clarte = 0, saturation = 0, opacite = 1 } = matiere;
    const base = couleur === 'teinte' ? teinte : this.couleur(couleur);
    const cle = [base.getHexString(), clarte, saturation, opacite].join(' ');
    const deja = this.faites.get(cle);
    if (deja !== undefined) return deja;
    const faite = new THREE.MeshToonMaterial({
      color: base.clone().offsetHSL(0, saturation, clarte),
      gradientMap: this.degrade,
      transparent: opacite < 1,
      opacity: opacite,
    });
    this.faites.set(cle, faite);
    return faite;
  }
}
