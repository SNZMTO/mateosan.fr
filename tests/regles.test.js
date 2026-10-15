// Les règles de tenue du dépôt, vérifiées sur les sources elles-mêmes : un test rouge ici, c'est une règle enfreinte, pas un
// test à changer.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { estBinaire, estUnePage, lire, palette, partiesEcritesDesGabarits, SOURCES } from './depot.js';

const TEXTES = SOURCES.filter((chemin) => !estBinaire(chemin));
const CODE = TEXTES.filter((chemin) => /\.(js|ts|css|sh|ya?ml)$/.test(chemin) || /(Caddyfile|Dockerfile|\.service|\.timer)$/.test(chemin));
const MODULES = CODE.filter((chemin) => chemin.endsWith('.js'));
const HTML = TEXTES.filter((chemin) => chemin.endsWith('.html'));

/** @param {string[]} fautes @param {string} regle */
const aucune = (fautes, regle) => assert.deepEqual(fautes, [], regle);

test('chaque fichier de code commence par un commentaire qui dit son rôle', () => {
  const sansRole = CODE.filter((chemin) => !/^(#!.*\n)?\s*(\/\/|\/\*|#|<!--)/.test(lire(chemin)));
  aucune(sansRole, 'un module dit son rôle dans son premier commentaire');
});

test('aucun fichier de plus de 200 lignes, hors des pages écrites par outils/pages', () => {
  const longs = TEXTES.filter((chemin) => !estUnePage(chemin) && !chemin.endsWith('.md'))
    .filter((chemin) => lire(chemin).split('\n').length > 201);
  aucune(longs, 'un fichier qui grossit se découpe');
});

test("aucune couleur hors de la palette : seuls palette.css et les images SVG écrivent une couleur, et c'est l'une des siennes", () => {
  const couleurs = new Set([...palette().values()].map((hex) => hex.toUpperCase()));
  const fautes = TEXTES.filter((chemin) => chemin !== 'site/css/palette.css').flatMap((chemin) => {
    const texte = lire(chemin);
    const ecrites = [...texte.matchAll(/(?<![\w&])#[0-9A-Fa-f]{3,8}\b|\b(?:rgba?|hsla?)\(/g)].map((m) => m[0]);
    const permises = chemin.endsWith('.svg') ? ecrites.filter((c) => couleurs.has(c.toUpperCase())) : [];
    return ecrites.filter((c) => !permises.includes(c)).map((c) => `${chemin} : ${c}`);
  });
  aucune(fautes, 'une couleur se nomme dans site/css/palette.css');
});

test('aucune ressource ne vient d\'un autre site : feuilles, scripts, images et polices sont servis par mateosan.fr', () => {
  const ailleurs = /^(?:[a-z]+:|\/\/)/;
  const fautes = TEXTES.flatMap((chemin) => {
    const texte = lire(chemin);
    const adresses = [
      ...[...texte.matchAll(/<(?:script|img|source|iframe|audio|video)\b[^>]*\bsrc="([^"]*)"/g)].map((m) => m[1]),
      ...[...texte.matchAll(/<link\b(?![^>]*rel="canonical")[^>]*\bhref="([^"]*)"/g)].map((m) => m[1]),
      ...[...texte.matchAll(/url\(\s*['"]?([^'")]+)/g)].map((m) => m[1]),
      ...(chemin.endsWith('.js') ? [...texte.matchAll(/\b(?:from|import|fetch)\s*\(?\s*['"`]([^'"`]+)/g)].map((m) => m[1]) : []),
    ];
    return adresses.filter((adresse) => adresse !== undefined && ailleurs.test(adresse) && !adresse.startsWith('node:'))
      .map((adresse) => `${chemin} : ${adresse}`);
  });
  aucune(fautes, 'tout est servi depuis mateosan.fr : rien ne part chez un tiers');
});

test("ni style ni script écrit dans une page : la politique de sécurité du contenu n'en accepte aucun", () => {
  const fautes = HTML.flatMap((chemin) => {
    const texte = lire(chemin);
    return [/\sstyle=/, /<style\b/, /<script(?![^>]*\bsrc=)[^>]*>/, /\son[a-z]+=/].filter((motif) => motif.test(texte))
      .map((motif) => `${chemin} : ${motif.source}`);
  });
  aucune(fautes, 'les styles vont dans site/css, les scripts dans des fichiers');
});

test('aucune trace de travail en cours dans le code et le contenu : ni remplaçant, ni « temporaire », ni « pour plus tard »', () => {
  const motif = /\b(?:TODO|FIXME|XXX)\b|temporaire|pour plus tard|pour les tests|\[TON|À AJOUTER/i;
  // Les documents nomment la règle ; ce fichier aussi.
  const fautes = TEXTES.filter((chemin) => !chemin.endsWith('.md') && chemin !== 'tests/regles.test.js')
    .filter((chemin) => motif.test(lire(chemin)));
  aucune(fautes, 'ce qui est commité est fini');
});

test('les dépendances ne vont que dans un sens : contenu/, puis outils/ ; rien ne lit les tests ni le banc', () => {
  /** @type {Record<string, RegExp>} */
  const permis = {
    contenu: /^\.\.?\//,
    outils: /^(?:node:|\.\.?\/)/,
    tests: /^(?:node:|\.\.?\/)/,
    banc: /^(?:node:|playwright$|\.\.?\/)/,
  };
  const fautes = MODULES.flatMap((chemin) => {
    const couche = chemin.split('/')[0] ?? '';
    const importes = [...lire(chemin).matchAll(/\b(?:from|import)\s*\(?\s*'([^']+)'/g)].map((m) => m[1] ?? '');
    return importes.filter((importe) => {
      const cible = new URL(importe, `file:///${chemin}`).pathname.slice(1);
      const dehors = importe.startsWith('.') && ['tests', 'banc'].includes(cible.split('/')[0] ?? '') && couche !== cible.split('/')[0];
      const hautVersBas = couche === 'contenu' && importe.startsWith('.') && !cible.startsWith('contenu/');
      return !(permis[couche] ?? /^$/).test(importe) || dehors || hautVersBas;
    }).map((importe) => `${chemin} → ${importe}`);
  });
  aucune(fautes, 'une couche ne lit que celles du dessous');
});

test("les textes ne s'écrivent que dans contenu/ : un gabarit d'outils/ n'a en dur que des balises et de la ponctuation", () => {
  const attributsDeTexte = /\b(?:alt|title|aria-label|placeholder)="([^"]*)"/g;
  const fautes = MODULES.filter((chemin) => chemin.startsWith('outils/')).flatMap((chemin) =>
    partiesEcritesDesGabarits(lire(chemin)).flatMap((partie) => {
      const attributs = [...partie.matchAll(attributsDeTexte)].map((m) => m[1] ?? '').filter((valeur) => valeur.trim() !== '');
      const horsBalises = partie.replace(/^[^<>]*>/, ' ').replace(/<[^>]*>?/g, ' ');
      const mots = horsBalises.match(/[\p{L}\p{N}][\p{L}\p{N}'’]*/gu) ?? [];
      return [...attributs, ...mots].map((texte) => `${chemin} : ${texte}`);
    }),
  );
  aucune(fautes, 'un texte visible se lit dans contenu/');
});
