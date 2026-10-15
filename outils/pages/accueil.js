// L'accueil : qui je suis en trente secondes, puis ce qui est posé sur l'établi (les projets, et la carte « qui je suis »).

import personne from '../../contenu/personne.js';
import projets from '../../contenu/projets.js';
import libelles from '../../contenu/interface.js';
import { html } from './html.js';
import { documentComplet } from './gabarit.js';
import { contact, phraseDesTrenteSecondes } from './qui-je-suis.js';

export function pageAccueil() {
  const phrase = phraseDesTrenteSecondes();
  return documentComplet({
    titre: personne.nom + libelles.separateur + personne.surtitre,
    description: phrase,
    chemin: '/',
    corps: html`<header class="entete">
  <p class="surtitre">${personne.surtitre}</p>
  <h1>${personne.nom}</h1>
  <p class="accroche">${phrase}</p>
  <p>${personne.preuve}</p>
  ${contact()}
</header>
<main>
  <section class="etabli" aria-labelledby="etabli">
    <h2 id="etabli">${libelles.etabli.titre}</h2>
    <p>${libelles.etabli.intro}</p>
    <ol class="objets">
${projets.map((projet) => html`      <li class="objet teinte-${projet.teinte}">
        <h3><a href="/${projet.id}">${projet.titre}</a></h3>
        <p class="etat">${projet.etat}</p>
        <p>${projet.accroche}</p>
        <ul class="pastilles">
${projet.pastilles.map((pastille) => html`          <li>${pastille}</li>
`)}        </ul>
      </li>
`)}      <li class="objet teinte-${personne.teinte}">
        <h3><a href="/qui-je-suis">${personne.quiJeSuis.titre}</a></h3>
        <p>${personne.quiJeSuis.accroche}</p>
      </li>
    </ol>
  </section>
  <section class="en-anglais" lang="en" aria-labelledby="en-anglais">
    <h2 id="en-anglais">${personne.enAnglais.titre}</h2>
${personne.enAnglais.paragraphes.map((paragraphe) => html`    <p>${paragraphe}</p>
`)}  </section>
</main>`,
  });
}
