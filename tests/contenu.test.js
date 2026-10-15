// Le contenu est complet et se tient : chaque projet a ce qu'il faut, ses teintes existent, ses liens sont sûrs, rien n'y attend
// d'être rempli, et l'adresse de contact est la seule du site.

import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
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

test("l'adresse de contact est la seule adresse e-mail du site", () => {
  const ailleurs = SOURCES.filter((chemin) => /^(?:contenu|site)\/.*\.(?:js|html)$/.test(chemin)).flatMap((chemin) =>
    [...lire(chemin).matchAll(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g)].map((m) => m[0]).filter((adresse) => adresse !== personne.contact.adresse)
      .map((adresse) => `${chemin} : ${adresse}`),
  );
  assert.deepEqual(ailleurs, []);
  assert.match(personne.contact.adresse, new RegExp(`@${new URL(site.adresse).hostname.replace('.', '\\.')}$`));
});

test('chaque page légale a son corps, et chaque corps sa page', () => {
  const corps = readdirSync(new URL('../contenu/legal/', import.meta.url)).map((nom) => nom.replace(/\.html$/, ''));
  assert.deepEqual(corps.sort(), legal.map((page) => page.id).sort());
});
