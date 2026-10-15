// L'icône d'écran d'accueil (site/images/apple-touch-icon.png, 180 × 180) : la favicon, dessinée par Chromium. À relancer quand
// site/images/favicon.svg change, puis à commiter.

import { chromium } from 'playwright';
import { servir } from './serveur.js';

const COTE = 180;
const { adresse, fermer } = await servir(8096);
const instance = await chromium.launch();
const page = await instance.newPage({ viewport: { width: COTE, height: COTE } });
await page.goto(`${adresse}/images/favicon.svg`);
await page.screenshot({ path: new URL('../site/images/apple-touch-icon.png', import.meta.url).pathname, omitBackground: true });
await instance.close();
fermer();
console.log('site/images/apple-touch-icon.png est à jour : commite-la.');
