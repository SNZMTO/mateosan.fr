// Écrire du HTML sans risque : le gabarit html`…` échappe tout ce qu'on y glisse, sauf ce qui est déjà du HTML (Html). Les
// listes s'y glissent telles quelles, chaque élément traité de même.

/** Du HTML déjà sûr : écrit par un gabarit html`…`, ou lu dans un fichier de contenu/. */
export class Html {
  /** @param {string} texte */
  constructor(texte) {
    this.texte = texte;
  }

  toString() {
    return this.texte;
  }
}

/**
 * Un morceau de HTML lu dans un fichier de contenu/, qui s'écrit tel quel.
 * @param {string} texte
 */
export const brut = (texte) => new Html(texte);

/** @typedef {string | Html | undefined | readonly Glissable[]} Glissable */

// Les attributs s'écrivent entre guillemets droits : l'apostrophe n'a pas à être échappée.
const ENTITES = /** @type {const} */ ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' });

/**
 * Le texte, tel qu'il doit s'écrire dans une page.
 * @param {string} texte
 */
export function echapper(texte) {
  return texte.replace(/[&<>"]/g, (c) => ENTITES[/** @type {keyof typeof ENTITES} */ (c)]);
}

/**
 * Le texte, à la française : une espace insécable avant les deux-points, le point-virgule, les points d'exclamation et
 * d'interrogation, et à l'intérieur des guillemets, pour qu'aucun ne commence une ligne.
 * @param {string} texte
 */
export function typographie(texte) {
  return texte.replace(/ ([:;!?»])/g, '\u00A0$1').replace(/« /g, '«\u00A0');
}

/** @param {Glissable} valeur @returns {string} */
function glisser(valeur) {
  if (valeur === undefined) return '';
  if (valeur instanceof Html) return valeur.texte;
  if (typeof valeur === 'string') return echapper(typographie(valeur));
  return valeur.map(glisser).join('');
}

/**
 * @param {TemplateStringsArray} morceaux
 * @param {...Glissable} valeurs
 */
export function html(morceaux, ...valeurs) {
  return new Html(morceaux.reduce((page, morceau, i) => page + glisser(valeurs[i - 1]) + morceau));
}
