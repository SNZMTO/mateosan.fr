// La page d'un projet : son état, son accroche, son résumé et ses liens. Lisible seule, sans la scène.

import personne from '../../contenu/personne.js';
import libelles from '../../contenu/interface.js';
import { html } from './html.js';
import { documentComplet, retour, titreDOnglet } from './gabarit.js';

/** @param {import('../../contenu/types.js').Projet} projet */
export function pageProjet(projet) {
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
${projet.resume.map((paragraphe) => html`  <p>${paragraphe}</p>
`)}  <h2>${libelles.liensDuProjet}</h2>
  <ul class="liens">
${projet.liens.map((lien) => html`    <li><a class="bouton" href="${lien.adresse}">${lien.texte}</a></li>
`)}  </ul>
</main>`,
  });
}
