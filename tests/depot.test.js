// Ce que les tests lisent du dépôt, vérifié lui aussi : une règle qui lit mal le code laisse passer ce qu'elle doit refuser.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { codeSansTextes } from './depot.js';

test("le code sans ses textes : une expression régulière est un texte, qui n'avale pas la suite", () => {
  // Une apostrophe dans une expression régulière n'ouvre pas de chaîne : la règle des nombres de réglage voit encore 42.
  assert.equal(codeSansTextes("const r = /'/;\nconst v = 42;"), 'const r =  ;\nconst v = 42;');
  // Ses classes et ses échappements : une barre oblique n'y finit rien.
  assert.equal(codeSansTextes("const r = /[/']/g, s = /\\/'/;\nconst v = 42;"), 'const r =  , s =  ;\nconst v = 42;');
  // Après return, une parenthèse ou une flèche, le code attend un opérande.
  assert.equal(codeSansTextes("return /'/.test(a);"), 'return  .test(a);');
  assert.equal(codeSansTextes('a.replace(/"/g, 1);'), 'a.replace( , 1);');
  assert.equal(codeSansTextes('const f = (c) => /`/.test(c) ? 42 : 0;'), 'const f = (c) =>  .test(c) ? 42 : 0;');
});

test('le code sans ses textes : une division reste une division', () => {
  for (const code of ['const moitie = largeur / 2 / echelle;', 'const x = (a + b) / 2;', 'const y = t[0] / 4;']) {
    assert.equal(codeSansTextes(code), code);
  }
  // Une division, puis une chaîne qui contient une barre oblique : rien n'est avalé entre les deux.
  assert.equal(codeSansTextes("const p = total / 100; const nom = 'a/b';"), 'const p = total / 100; const nom =  ;');
});
