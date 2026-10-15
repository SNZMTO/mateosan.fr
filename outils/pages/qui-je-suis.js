// La page « qui je suis », et la phrase des trente secondes qu'elle partage avec l'accueil.

import personne from '../../contenu/personne.js';
import libelles from '../../contenu/interface.js';
import { html } from './html.js';
import { documentComplet, retour, titreDOnglet } from './gabarit.js';

/** L'alternance cherchée, en une phrase : les précisions absentes du contenu (début, durée, lieu) n'y sont pas. */
export function phraseDesTrenteSecondes() {
  const { accroche, debut, duree, zone, rythme } = personne;
  const debutDePhrase = [accroche, debut, duree, zone].filter((morceau) => morceau !== undefined).join(', ');
  return `${debutDePhrase} : ${rythme}.`;
}

/** Les moyens de me joindre : l'adresse du site, puis les liens. */
export function contact() {
  return html`<ul class="contact">
  <li><a class="bouton" href="mailto:${personne.contact.adresse}">${libelles.ecrire}</a></li>
${personne.contact.liens.map((lien) => html`  <li><a class="bouton bouton-clair" href="${lien.adresse}">${lien.texte}</a></li>
`)}</ul>`;
}

export function pageQuiJeSuis() {
  const { titre, accroche, sections } = personne.quiJeSuis;
  return documentComplet({
    titre: titreDOnglet(titre, personne.nom),
    description: accroche,
    chemin: '/qui-je-suis',
    corps: html`${retour()}
<main class="fiche teinte-${personne.teinte}">
  <header>
    <h1>${titre}</h1>
    <p class="accroche">${phraseDesTrenteSecondes()}</p>
  </header>
  <p>${accroche}</p>
${sections.map((section) => html`  <h2>${section.titre}</h2>
${section.paragraphes.map((paragraphe) => html`  <p>${paragraphe}</p>
`)}`)}  <h2>${libelles.joindre}</h2>
  ${contact()}
</main>`,
  });
}
