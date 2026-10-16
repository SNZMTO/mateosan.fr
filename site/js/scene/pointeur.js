// Le pointeur sur la scène. À la souris, on survole un objet et on clique pour l'ouvrir ; au doigt, un premier toucher montre
// l'objet et son étiquette, un second l'ouvre. Faire glisser le doigt fait toujours défiler la page.

/**
 * @typedef {object} Reponses
 * @property {(indice: number | null, auDoigt: boolean) => void} survoler
 * @property {(indice: number) => void} choisir
 * @property {(x: number, y: number) => void} suivre La souris bouge sur la scène, en coordonnées de l'écran.
 */

/**
 * @param {HTMLElement} toile
 * @param {(x: number, y: number) => number | null} viser L'objet sous ce point de l'écran.
 * @param {Reponses} reponses
 */
export function ecouterLePointeur(toile, viser, reponses) {
  let auDoigt = false;
  /** @type {number | null} L'objet qu'un premier toucher a montré. */
  let montre = null;

  toile.addEventListener('pointerdown', (evenement) => {
    auDoigt = evenement.pointerType === 'touch';
  });
  toile.addEventListener('pointermove', (evenement) => {
    if (evenement.pointerType === 'touch') return;
    reponses.suivre(evenement.clientX, evenement.clientY);
    reponses.survoler(viser(evenement.clientX, evenement.clientY), false);
  });
  toile.addEventListener('pointerleave', (evenement) => {
    if (evenement.pointerType !== 'touch') reponses.survoler(null, false);
  });
  toile.addEventListener('click', (evenement) => {
    const vise = viser(evenement.clientX, evenement.clientY);
    if (auDoigt && vise !== montre) {
      montre = vise;
      reponses.survoler(vise, true);
    } else if (vise !== null) reponses.choisir(vise);
  });
}
