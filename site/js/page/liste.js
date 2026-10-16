// La liste des objets de l'établi, telle que la page l'écrit : chaque carte dit son objet (data-objet), sa teinte et son titre.
// Survolée à la souris ou parcourue au clavier, elle le dit à la scène ; la scène y marque l'objet qu'on survole.

/**
 * @typedef {object} Carte
 * @property {HTMLElement} element
 * @property {HTMLAnchorElement} lien Le lien vers sa page.
 * @property {string} objet Le nom de son modèle.
 * @property {string} titre
 */

/** Les cartes de la liste, dans son ordre. @param {ParentNode} racine @returns {Carte[]} */
export function lireLaListe(racine) {
  return [...racine.querySelectorAll('[data-objet]')].flatMap((element) => {
    const lien = element.querySelector('a[href]');
    if (!(element instanceof HTMLElement) || !(lien instanceof HTMLAnchorElement)) return [];
    return [{ element, lien, objet: element.dataset['objet'] ?? '', titre: (lien.textContent ?? '').trim() }];
  });
}

/**
 * Dit quelle carte on survole, ou dont le lien a le focus ; `null` quand on la quitte.
 * @param {readonly Carte[]} cartes
 * @param {(indice: number | null) => void} survol
 */
export function ecouterLaListe(cartes, survol) {
  cartes.forEach(({ element, lien }, i) => {
    element.addEventListener('pointerenter', (evenement) => {
      if (evenement.pointerType === 'mouse') survol(i);
    });
    element.addEventListener('pointerleave', (evenement) => {
      if (evenement.pointerType === 'mouse') survol(null);
    });
    lien.addEventListener('focus', () => survol(i));
    lien.addEventListener('blur', () => survol(null));
  });
}

/** Marque la carte de l'objet survolé, et elle seule. @param {readonly Carte[]} cartes @param {number | null} indice */
export function marquer(cartes, indice) {
  cartes.forEach(({ element }, i) => element.classList.toggle('survolee', i === indice));
}
