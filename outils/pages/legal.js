// Les pages légales et la page introuvable : un titre, et leur corps lu tel quel dans contenu/.

import { readFileSync } from 'node:fs';
import site from '../../contenu/site.js';
import libelles from '../../contenu/interface.js';
import { brut, html, typographie } from './html.js';
import { documentComplet, retour, titreDOnglet } from './gabarit.js';

const CONTENU = new URL('../../contenu/', import.meta.url);

/** @param {string} fichier Le chemin du corps, depuis contenu/. */
const corpsDe = (fichier) => brut(typographie(readFileSync(new URL(fichier, CONTENU), 'utf8').trimEnd()));

/** @param {import('../../contenu/types.js').PageLegale} page */
export function pageLegale(page) {
  return documentComplet({
    titre: titreDOnglet(page.titre, site.nom),
    description: page.description,
    chemin: `/${page.id}`,
    corps: html`${retour()}
<main class="legal">
  <h1>${page.titre}</h1>
  ${corpsDe(`legal/${page.id}.html`)}
</main>`,
  });
}

export function pageIntrouvable() {
  const { titre, description } = libelles.introuvable;
  return documentComplet({
    titre: titreDOnglet(titre, site.nom),
    description,
    chemin: undefined,
    corps: html`${retour()}
<main class="legal">
  <h1>${titre}</h1>
  ${corpsDe('introuvable.html')}
</main>`,
  });
}
