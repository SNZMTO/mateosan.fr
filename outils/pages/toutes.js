// Toutes les pages du site, chacune sous le nom de son fichier dans site/ : ce qu'écrit npm run pages, et ce que les tests
// comparent aux fichiers commités.

import projets from '../../contenu/projets.js';
import legal from '../../contenu/legal.js';
import { pageAccueil } from './accueil.js';
import { pageProjet } from './projet.js';
import { pageQuiJeSuis } from './qui-je-suis.js';
import { pageIntrouvable, pageLegale } from './legal.js';

/** @returns {Map<string, string>} */
export function toutesLesPages() {
  /** @type {[string, string][]} */
  const pages = [
    ['index.html', pageAccueil()],
    ...projets.map((projet) => /** @type {[string, string]} */ ([`${projet.id}.html`, pageProjet(projet)])),
    ['qui-je-suis.html', pageQuiJeSuis()],
    ...legal.map((page) => /** @type {[string, string]} */ ([`${page.id}.html`, pageLegale(page)])),
    ['404.html', pageIntrouvable()],
  ];
  const parFichier = new Map(pages);
  if (parFichier.size !== pages.length) throw new Error('Deux pages ont la même adresse : un identifiant du contenu est pris deux fois.');
  return parFichier;
}
