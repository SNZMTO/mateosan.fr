// Le regard du banc : chaque page du site sur un ordinateur et un téléphone, sous Chromium et WebKit. Il relève ce qui cloche
// (une erreur, un refus de la politique de sécurité, un fichier introuvable) et en sort en échec ; il laisse une capture de
// chaque page dans banc/sortie/, à regarder.

import { readdirSync } from 'node:fs';
import { chromium, devices, webkit } from 'playwright';
import { servir } from './serveur.js';

const SORTIE = new URL('sortie/', import.meta.url).pathname;
const PORT = 8095;
/** La page introuvable se visite par une adresse qui ne mène à rien. */
const INTROUVABLE = '/cette-page-n-existe-pas';

const pages = readdirSync(new URL('../site/', import.meta.url))
  .filter((nom) => nom.endsWith('.html'))
  .map((nom) => (nom === 'index.html' ? '/' : nom === '404.html' ? INTROUVABLE : `/${nom.replace(/\.html$/, '')}`));

const APPAREILS = [
  { nom: 'ordinateur', navigateur: chromium, reglages: { viewport: { width: 1280, height: 800 } } },
  { nom: 'ordinateur', navigateur: webkit, reglages: { viewport: { width: 1280, height: 800 } } },
  { nom: 'telephone', navigateur: chromium, reglages: devices['Pixel 7'] },
  { nom: 'telephone', navigateur: webkit, reglages: devices['iPhone 15'] },
];

const { adresse, fermer } = await servir(PORT);
/** @type {string[]} */
const ennuis = [];
for (const { nom, navigateur, reglages } of APPAREILS) {
  const instance = await navigateur.launch();
  const contexte = await instance.newContext(reglages);
  for (const chemin of pages) {
    const page = await contexte.newPage();
    const ici = `${navigateur.name()} ${nom} ${chemin}`;
    // Pour sa capture, Playwright pose une feuille de style dans la page, que WebKit refuse au nom de la CSP : ce qui se dit
    // pendant la capture n'est pas le fait du site.
    let enCapture = false;
    page.on('console', (message) => {
      // La page introuvable répond 404 exprès : le navigateur le dit dans sa console.
      const attendue = enCapture || (chemin === INTROUVABLE && message.text().includes('404'));
      if (message.type() === 'error' && !attendue) ennuis.push(`${ici} : ${message.text()}`);
    });
    page.on('pageerror', (erreur) => ennuis.push(`${ici} : ${erreur.message}`));
    page.on('response', (reponse) => {
      const attendue = reponse.url() === adresse + INTROUVABLE;
      if (reponse.status() >= 400 && !attendue) ennuis.push(`${ici} : ${reponse.status()} ${reponse.url()}`);
    });
    await page.goto(adresse + chemin, { waitUntil: 'networkidle' });
    const nomDeCapture = chemin === '/' ? 'accueil' : chemin.slice(1);
    enCapture = true;
    await page.screenshot({ path: `${SORTIE}${navigateur.name()}-${nom}-${nomDeCapture}.png`, fullPage: true });
    await page.close();
  }
  await instance.close();
}
fermer();

console.log(`${pages.length} pages × ${APPAREILS.length} appareils, captures dans banc/sortie/.`);
if (ennuis.length > 0) {
  console.error(ennuis.join('\n'));
  process.exit(1);
}
