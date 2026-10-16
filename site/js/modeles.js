// Les objets qu'on peut poser sur l'établi, sous le nom que leur donne le contenu (objet: 'platine'). Un nouvel objet, c'est un
// fichier de site/js/modeles/ et une ligne ici.

import boiteAOutils from './modeles/boite-a-outils.js';
import cabane from './modeles/cabane.js';
import carnet from './modeles/carnet.js';
import carteDeVisite from './modeles/carte-de-visite.js';
import platine from './modeles/platine.js';
import radio from './modeles/radio.js';

/** @type {Readonly<Record<string, import('./types.js').Modele>>} */
export const modeles = {
  'boite-a-outils': boiteAOutils,
  cabane,
  carnet,
  'carte-de-visite': carteDeVisite,
  platine,
  radio,
};
