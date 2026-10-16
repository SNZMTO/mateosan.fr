// Le contenu est complet et se tient : chaque projet a ce qu'il faut, ses teintes existent, ses liens sont sûrs, rien n'y attend
// d'être rempli, et le site comme le CV n'écrivent qu'à une seule adresse.

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import projets from '../contenu/projets.js';
import personne from '../contenu/personne.js';
import libelles from '../contenu/interface.js';
import legal from '../contenu/legal.js';
import site from '../contenu/site.js';
import { lire, palette, SOURCES } from './depot.js';

/** Chaque texte d'une valeur du contenu, aussi profond soit-il. @param {unknown} valeur @returns {string[]} */
const textes = (valeur) =>
  typeof valeur === 'string' ? [valeur] : typeof valeur === 'object' && valeur !== null ? Object.values(valeur).flatMap(textes) : [];

const TOUT = [projets, personne, libelles, legal, site];

test('chaque projet a son identifiant, unique, et tout ce que montrent sa carte et sa page', () => {
  const ids = projets.map((projet) => projet.id);
  assert.equal(new Set(ids).size, ids.length, 'deux projets ont le même identifiant');
  for (const projet of projets) {
    assert.match(projet.id, /^[a-z0-9-]+$/, `${projet.id} : des minuscules, des chiffres et des tirets`);
    for (const [champ, valeur] of Object.entries(projet)) {
      const vide = Array.isArray(valeur) ? valeur.length === 0 : String(valeur).trim() === '';
      assert.ok(!vide, `${projet.id} : ${champ} est vide`);
    }
  }
});

test('chaque fichier de contenu/projets/ est posé sur l\'établi, et chaque projet de l\'établi a son fichier', () => {
  const fichiers = readdirSync(new URL('../contenu/projets/', import.meta.url)).map((nom) => nom.replace(/\.js$/, ''));
  assert.deepEqual(fichiers.sort(), projets.map((projet) => projet.id).sort());
});

test('chaque teinte nommée par le contenu existe dans la palette', () => {
  const couleurs = palette();
  for (const teinte of [...projets.map((projet) => projet.teinte), personne.teinte]) {
    assert.ok(couleurs.has(`teinte-${teinte}`), `la teinte ${teinte} n'est pas dans site/css/palette.css`);
  }
});

test('chaque lien du contenu est sûr : en https, ou un e-mail, avec un texte', () => {
  const liens = [...projets.flatMap((projet) => projet.liens), ...personne.contact.liens];
  for (const lien of liens) {
    assert.match(lien.adresse, /^(?:https:\/\/|mailto:)/, `${lien.texte} : ${lien.adresse}`);
    assert.notEqual(lien.texte.trim(), '');
  }
});

test("aucun texte n'attend d'être rempli : pas de remplaçant entre crochets", () => {
  const corps = SOURCES.filter((chemin) => chemin.startsWith('contenu/') && chemin.endsWith('.html')).map(lire);
  const enAttente = [...TOUT.flatMap(textes), ...corps].filter((texte) => /[[\]]/.test(texte));
  assert.deepEqual(enAttente, []);
});

test("le site et le CV n'écrivent qu'à une seule adresse, celle du contact, et le CV la donne", () => {
  // Un PDF se lit octet par octet : ses liens y sont écrits en clair.
  const texte = (/** @type {string} */ chemin) => (chemin.endsWith('.pdf') ? readFileSync(new URL(`../${chemin}`, import.meta.url), 'latin1') : lire(chemin));
  const ailleurs = SOURCES.filter((chemin) => /^(?:contenu|site)\/.*\.(?:js|html|pdf)$/.test(chemin)).flatMap((chemin) =>
    [...texte(chemin).matchAll(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g)].map((m) => m[0]).filter((adresse) => adresse !== personne.contact.adresse)
      .map((adresse) => `${chemin} : ${adresse}`),
  );
  assert.deepEqual(ailleurs, []);
  assert.ok(texte(`site${personne.cv.fichier}`).includes(`mailto:${personne.contact.adresse}`), "le CV ne donne pas l'adresse du contact");
});

test('chaque page légale a son corps, et chaque corps sa page', () => {
  const corps = readdirSync(new URL('../contenu/legal/', import.meta.url)).map((nom) => nom.replace(/\.html$/, ''));
  assert.deepEqual(corps.sort(), legal.map((page) => page.id).sort());
});

test("chaque capture d'un projet existe, dit ce qu'elle montre et d'où elle vient ; chaque image de site/images/projets/ sert", () => {
  const illustrations = projets.flatMap((projet) => projet.illustrations ?? []);
  for (const { fichier, description, legende, source } of illustrations) {
    assert.ok(SOURCES.includes(`site/images/projets/${fichier}`), `${fichier} n'est pas dans site/images/projets/`);
    assert.match(fichier, /^[a-z0-9-]+\/[a-z0-9-]+\.(?:webp|jpg)$/, `${fichier} : un dossier par projet, une capture WebP ou JPEG`);
    assert.ok(description.trim() !== '' && legende.trim() !== '', `${fichier} : sa description et sa légende`);
    assert.match(source, /^SNZMTO\/[\w.-]+@[0-9a-f]{7,40} \S+$/, `${fichier} : sa source (dépôt@commit chemin)`);
  }
  const servies = SOURCES.filter((chemin) => chemin.startsWith('site/images/projets/')).map((chemin) => chemin.slice('site/images/projets/'.length));
  assert.deepEqual(servies.sort(), illustrations.map(({ fichier }) => fichier).sort(), 'une capture sans projet, ou servie deux fois');
});
