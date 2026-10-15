// npm run pages : écrit dans site/ chaque page que donne le contenu, et retire celles qu'il ne donne plus. Les pages de site/
// ne se retouchent jamais à la main : tests/pages.test.js refuse une page qui n'est pas exactement ce qu'écrit ce script.

import { readdirSync, rmSync, writeFileSync } from 'node:fs';
import { toutesLesPages } from './toutes.js';

const SITE = new URL('../../site/', import.meta.url);
const pages = toutesLesPages();

for (const [fichier, page] of pages) writeFileSync(new URL(fichier, SITE), page);
for (const fichier of readdirSync(SITE)) {
  if (fichier.endsWith('.html') && !pages.has(fichier)) rmSync(new URL(fichier, SITE));
}
console.log(`${pages.size} pages écrites dans site/.`);
