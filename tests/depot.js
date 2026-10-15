// Ce que les tests lisent du dépôt : ses fichiers sources, la palette, le contraste entre deux couleurs, et les parties écrites
// en dur des gabarits d'un module (le texte d'un `…`, sans ce qu'on y glisse).

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RACINE = fileURLToPath(new URL('..', import.meta.url));

/** Ce qui n'est pas une source : les outils installés, ce que le banc écrit, ce qui vient d'ailleurs tel quel. */
const HORS_SOURCES = new Set(['.git', 'node_modules', 'banc/sortie', 'site/dependances', 'package-lock.json']);

/** @param {string} chemin Depuis la racine du dépôt. */
export const lire = (chemin) => readFileSync(join(RACINE, chemin), 'utf8');

/** @returns {string[]} Les chemins des sources, depuis la racine, avec des barres obliques. */
function lister(dossier = RACINE) {
  return readdirSync(dossier, { withFileTypes: true }).flatMap((entree) => {
    const complet = join(dossier, entree.name);
    const chemin = relative(RACINE, complet).split(sep).join('/');
    if (HORS_SOURCES.has(chemin)) return [];
    return entree.isDirectory() ? lister(complet) : [chemin];
  });
}

export const SOURCES = lister();

/** Les pages de site/, écrites par outils/pages et non à la main. */
export const estUnePage = (/** @type {string} */ chemin) => /^site\/[^/]+\.html$/.test(chemin);

/** Les images : tout sauf du texte, à part le SVG, qui se lit. */
export const estBinaire = (/** @type {string} */ chemin) => /\.(png|webp|jpe?g|woff2|pdf|ico)$/.test(chemin);

/** @returns {Map<string, string>} Chaque couleur de site/css/palette.css, sous son nom (fond-page, teinte-corail…). */
export function palette() {
  const texte = lire('site/css/palette.css');
  const couleurs = new Map();
  for (const [, nom, valeur] of texte.matchAll(/--([a-z-]+):\s*(#[0-9A-Fa-f]{6});/g)) couleurs.set(nom, valeur);
  for (const [, nom, valeur] of texte.matchAll(/\.teinte-([a-z]+) \{ --teinte: (#[0-9A-Fa-f]{6}); \}/g)) {
    couleurs.set(`teinte-${nom}`, valeur);
  }
  return /** @type {Map<string, string>} */ (couleurs);
}

/** @param {string} hex */
function luminance(hex) {
  const [r, v, b] = [1, 3, 5].map((debut) => {
    const canal = parseInt(hex.slice(debut, debut + 2), 16) / 255;
    return canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (r ?? 0) + 0.7152 * (v ?? 0) + 0.0722 * (b ?? 0);
}

/** Le rapport de contraste du WCAG entre deux couleurs. @param {string} a @param {string} b */
export function contraste(a, b) {
  const [claire, foncee] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((claire ?? 0) + 0.05) / ((foncee ?? 0) + 0.05);
}

/**
 * Le texte écrit en dur de chaque gabarit html`…` d'un module : ce qu'on y glisse (${…}) est remplacé par une espace, et les
 * gabarits glissés dans un autre sont rendus à part.
 * @param {string} code
 */
export function partiesEcritesDesGabarits(code) {
  /** @type {string[]} */
  const parties = [];
  let i = 0;
  const lireChaine = (/** @type {string} */ guillemet) => {
    for (i++; i < code.length && code[i] !== guillemet; i++) if (code[i] === '\\') i++;
    i++;
  };
  const lireExpression = () => {
    for (let profondeur = 1; i < code.length && profondeur > 0; ) {
      const c = code[i];
      if (c === '`') lireGabarit();
      else if (c === "'" || c === '"') lireChaine(c);
      else {
        if (c === '{') profondeur++;
        if (c === '}') profondeur--;
        i++;
      }
    }
  };
  const lireGabarit = () => {
    const dePage = code.slice(i - 'html'.length, i) === 'html';
    let texte = '';
    for (i++; i < code.length && code[i] !== '`'; ) {
      if (code[i] === '\\') {
        texte += code.slice(i, i + 2);
        i += 2;
      } else if (code.startsWith('${', i)) {
        i += 2;
        lireExpression();
        texte += ' ';
      } else texte += code[i++];
    }
    i++;
    if (dePage) parties.push(texte);
  };
  while (i < code.length) {
    const c = code[i];
    if (c === '`') lireGabarit();
    else if (c === "'" || c === '"') lireChaine(c);
    else if (code.startsWith('//', i)) i = code.indexOf('\n', i) === -1 ? code.length : code.indexOf('\n', i);
    else if (code.startsWith('/*', i)) i = code.indexOf('*/', i) + 2;
    else i++;
  }
  return parties;
}
