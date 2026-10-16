// La page d'un projet : son état, son accroche, sa première capture, son résumé, ses autres captures, ses sections et ses
// liens. Lisible seule, sans la scène ; sur l'accueil, la scène l'ouvre dans son panneau.

import personne from '../../contenu/personne.js';
import libelles from '../../contenu/interface.js';
import { html } from './html.js';
import { documentComplet, retour, titreDOnglet } from './gabarit.js';
import { tailleDImage } from './images.js';

/**
 * Une capture et sa légende ; seule la première se charge tout de suite, les autres quand on s'en approche.
 * @param {import('../../contenu/types.js').Illustration} illustration
 * @param {boolean} premiere
 */
function capture({ fichier, description, legende }, premiere) {
  const chemin = `images/projets/${fichier}`;
  const { largeur, hauteur } = tailleDImage(chemin);
  return html`<figure class="capture">
    <img src="/${chemin}" width="${String(largeur)}" height="${String(hauteur)}" alt="${description}" loading="${premiere ? 'eager' : 'lazy'}">
    <figcaption class="legende">${legende}</figcaption>
  </figure>`;
}

/** @param {import('../../contenu/types.js').Projet} projet */
export function pageProjet(projet) {
  const [premiere, ...suivantes] = projet.illustrations ?? [];
  return documentComplet({
    titre: titreDOnglet(projet.titre, personne.nom),
    description: projet.accroche,
    chemin: `/${projet.id}`,
    corps: html`${retour()}
<main class="fiche teinte-${projet.teinte}">
  <header>
    <p class="etat">${projet.etat}</p>
    <h1>${projet.titre}</h1>
    <p class="accroche">${projet.accroche}</p>
    <ul class="pastilles">
${projet.pastilles.map((pastille) => html`      <li>${pastille}</li>
`)}    </ul>
  </header>
${premiere === undefined ? html`` : html`  ${capture(premiere, true)}
`}${projet.resume.map((paragraphe) => html`  <p>${paragraphe}</p>
`)}${suivantes.length === 0 ? html`` : html`  <div class="galerie">
${suivantes.map((illustration) => html`  ${capture(illustration, false)}
`)}  </div>
`}${(projet.sections ?? []).map((section) => html`  <section>
    <h2>${section.titre}</h2>
${section.paragraphes.map((paragraphe) => html`    <p>${paragraphe}</p>
`)}  </section>
`)}  <h2>${libelles.liensDuProjet}</h2>
  <ul class="liens">
${projet.liens.map((lien) => html`    <li><a class="bouton" href="${lien.adresse}">${lien.texte}</a></li>
`)}  </ul>
</main>`,
  });
}
