// Les pages de site/ : exactement ce qu'écrit npm run pages depuis le contenu, chacune avec ce qu'il faut pour l'onglet et le
// partage, des liens qui mènent quelque part, et des textes lisibles sur leurs fonds.

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { toutesLesPages } from '../outils/pages/toutes.js';
import { contraste, estUnePage, lire, palette, RACINE, SOURCES } from './depot.js';

const PAGES = toutesLesPages();

test('les pages de site/ sont exactement celles que donne le contenu : npm run pages, jamais à la main', () => {
  assert.deepEqual(SOURCES.filter(estUnePage).map((chemin) => chemin.slice('site/'.length)).sort(), [...PAGES.keys()].sort());
  for (const [fichier, page] of PAGES) assert.equal(lire(`site/${fichier}`), page, `site/${fichier} n'est pas à jour`);
});

test("chaque page a sa langue, son titre, sa description, sa favicon, et, sauf la page introuvable, de quoi la partager", () => {
  for (const [fichier, page] of PAGES) {
    for (const motif of [/<html lang="[a-z]{2}">/, /<title>[^<]+<\/title>/, /<meta name="description" content="[^"]+">/, /<link rel="icon" /]) {
      assert.match(page, motif, fichier);
    }
    const partage = ['canonical', 'og:title', 'og:description', 'og:url'];
    if (fichier === '404.html') assert.match(page, /<meta name="robots" content="noindex">/);
    else for (const balise of partage) assert.ok(page.includes(balise), `${fichier} : ${balise}`);
  }
});

test('chaque adresse du site citée par une page ou une feuille mène à un fichier', () => {
  const sources = [...PAGES.entries(), ...SOURCES.filter((chemin) => chemin.startsWith('site/css/')).map((chemin) => [chemin, lire(chemin)])];
  for (const [fichier, texte] of sources) {
    const adresses = [...(texte ?? '').matchAll(/(?:href|src)="(\/[^"#]*)"|url\('(\/[^']+)'\)/g)].map((m) => m[1] ?? m[2] ?? '');
    for (const adresse of adresses) {
      const chemin = adresse === '/' ? 'index.html' : adresse.slice(1);
      const servi = existsSync(join(RACINE, 'site', chemin)) || PAGES.has(`${chemin}.html`);
      assert.ok(servi, `${fichier} : ${adresse} ne mène à rien`);
    }
  }
});

test('chaque texte de la palette tient 4,5:1 sur chaque fond où il se pose', () => {
  const couleurs = [...palette()];
  const de = (/** @type {RegExp} */ motif) => couleurs.filter(([nom]) => motif.test(nom));
  const paires = [
    ...de(/^texte(?!-inverse)/).flatMap((texte) => de(/^fond-(?!inverse)/).map((fond) => ({ texte, fond }))),
    ...de(/^texte-inverse$/).flatMap((texte) => de(/^fond-inverse/).map((fond) => ({ texte, fond }))),
  ];
  assert.ok(paires.length > 0);
  for (const { texte, fond } of paires) {
    const rapport = contraste(texte[1], fond[1]);
    assert.ok(rapport >= 4.5, `--${texte[0]} sur --${fond[0]} : ${rapport.toFixed(2)}:1`);
  }
});

test('le paragraphe en anglais est annoncé en anglais', () => {
  assert.match(PAGES.get('index.html') ?? '', /<section class="en-anglais" lang="en"/);
});
