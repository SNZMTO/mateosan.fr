// L'image d'un lien partagé (site/images/partage.png, à la taille que dit contenu/site.js) : l'établi de l'accueil, dessiné
// par Chromium, seul dans le cadre. À relancer quand la scène change, puis à commiter.

import { chromium } from 'playwright';
import site from '../contenu/site.js';
import { servir } from './serveur.js';

/** Le temps que l'établi se pose et que ses ressorts se calment, sous un rendu sans carte graphique. */
const POSE = 3000;

const { largeur, hauteur, image } = site.partage;
const { adresse, fermer } = await servir(8098);
const instance = await chromium.launch();
// La scène prend tout le cadre : une feuille de style ajoutée pour la capture, que la CSP refuserait à une vraie visite.
const page = await instance.newPage({ viewport: { width: largeur, height: hauteur }, bypassCSP: true, reducedMotion: 'reduce' });
await page.goto(`${adresse}/`, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: '.scene { position: fixed; inset: 0; z-index: 1; height: auto; margin: 0; background: var(--fond-page); }' });
await page.waitForSelector('.scene canvas');
await page.waitForTimeout(POSE);
await page.screenshot({ path: new URL(`../site${image}`, import.meta.url).pathname });
await instance.close();
fermer();
console.log(`site${image} est à jour : commite-la.`);
