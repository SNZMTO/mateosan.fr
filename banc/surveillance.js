// Ce que le banc surveille sur chaque page qu'il ouvre, et les appareils qu'il essaie. Une erreur, un refus de la politique de
// sécurité, un fichier introuvable, une attente déçue : c'est un ennui, et le banc sort en échec. Pendant une capture, la
// console n'est pas écoutée : pour la prendre, Playwright pose une feuille de style dans la page, que WebKit refuse au nom de
// la CSP, sans que le site y soit pour rien.

import { fileURLToPath } from 'node:url';
import { chromium, devices, webkit } from 'playwright';

export const SORTIE = fileURLToPath(new URL('sortie/', import.meta.url));
/** La page introuvable se visite par une adresse qui ne mène à rien. */
export const INTROUVABLE = '/cette-page-n-existe-pas';
/** Le temps que l'établi se pose et que ses ressorts se calment, sous un rendu sans carte graphique. */
export const POSE = 2000;

export const ORDINATEUR = { viewport: { width: 1280, height: 800 } };
export const TELEPHONES = [
  { navigateur: chromium, reglages: devices['Pixel 7'] },
  { navigateur: webkit, reglages: devices['iPhone 15'] },
];
export const APPAREILS = [
  { nom: 'ordinateur', navigateur: chromium, reglages: ORDINATEUR },
  { nom: 'ordinateur', navigateur: webkit, reglages: ORDINATEUR },
  ...TELEPHONES.map((telephone) => ({ nom: 'telephone', ...telephone })),
];

/** @type {string[]} */
const ennuis = [];

/** Relève un ennui si ce qu'on attend n'est pas là. @param {boolean} attendu @param {string} ennui */
export function exiger(attendu, ennui) {
  if (!attendu) ennuis.push(ennui);
}

/**
 * Écoute une page ; rend de quoi la capturer sans prendre pour un ennui ce que la capture fait dire à la console.
 * @param {import('playwright').Page} page
 * @param {string} ici Comment l'ennui la nomme.
 */
export function surveiller(page, ici) {
  let enCapture = false;
  page.on('console', (message) => {
    // La page introuvable répond 404 exprès : le navigateur le dit dans sa console (WebKit, avant même d'en changer l'adresse).
    const introuvable = [page.url(), message.location().url].some((adresse) => adresse.endsWith(INTROUVABLE));
    const attendue = enCapture || (introuvable && message.text().includes('404'));
    exiger(message.type() !== 'error' || attendue, `${ici} : ${message.text()}`);
  });
  page.on('pageerror', (erreur) => exiger(false, `${ici} : ${erreur.message}`));
  page.on('response', (reponse) => {
    exiger(reponse.status() < 400 || reponse.url().endsWith(INTROUVABLE), `${ici} : ${reponse.status()} ${reponse.url()}`);
  });
  return {
    /** Range une capture dans banc/sortie/. @param {string} nom @param {boolean} [entiere] Toute la page, pas seulement l'écran. */
    async capturer(nom, entiere = false) {
      enCapture = true;
      await page.screenshot({ path: `${SORTIE}${nom}.png`, fullPage: entiere });
      enCapture = false;
    },
  };
}

/** Dit ce qui a été regardé, puis ce qui cloche, et sort en échec s'il y a lieu. @param {string} bilan */
export function conclure(bilan) {
  console.log(bilan);
  if (ennuis.length === 0) return;
  console.error(ennuis.join('\n'));
  process.exit(1);
}
