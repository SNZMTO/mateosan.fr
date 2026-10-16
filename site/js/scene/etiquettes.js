// Les étiquettes de kraft, pendues à leur ficelle au-dessus des objets : des éléments de la page posés sur la scène, qui
// suivent leur objet à l'écran (leur allure est dans site/css/etabli.css). Leur texte est le titre de la carte de l'objet.

export class Etiquettes {
  /** @param {HTMLElement} conteneur @param {readonly string[]} titres */
  constructor(conteneur, titres) {
    const calque = document.createElement('div');
    calque.className = 'etiquettes';
    this.elements = titres.map((titre) => {
      const etiquette = document.createElement('div');
      etiquette.className = 'etiquette';
      const carton = document.createElement('span');
      carton.className = 'carton';
      carton.textContent = titre;
      etiquette.append(carton);
      calque.append(etiquette);
      return etiquette;
    });
    conteneur.append(calque);
  }

  /** Montre l'étiquette de cet objet, et cache les autres. @param {number | null} indice */
  montrer(indice) {
    this.elements.forEach((etiquette, i) => etiquette.classList.toggle('visible', i === indice));
  }

  /** Pend une étiquette à ce point de l'écran, en pixels depuis le coin de la scène. @param {number} indice @param {number} x @param {number} y */
  placer(indice, x, y) {
    const etiquette = this.elements[indice];
    if (etiquette !== undefined) etiquette.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  }
}
