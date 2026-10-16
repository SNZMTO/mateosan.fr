// Le regard du banc : chaque page du site sur un ordinateur et un téléphone, sous Chromium et WebKit. Il relève ce qui cloche
// (une erreur, un refus de la politique de sécurité, un fichier introuvable, un établi qui ne se pose pas, ne répond pas au
// clavier ou n'ouvre pas ses panneaux) et en sort en échec ; il laisse une capture de chaque page dans banc/sortie/, à regarder. Il regarde aussi l'accueil
// d'un navigateur qui ne dessine pas en 3D : la liste y suffit.

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

/** Le temps que l'établi se pose et que ses ressorts se calment, sous un rendu sans carte graphique. */
const POSE = 2000;

const { adresse, fermer } = await servir(PORT);
/** @type {string[]} */
const ennuis = [];

/**
 * L'établi s'est posé ; donner le focus au lien d'une carte montre l'étiquette de son objet, Entrée ouvre son panneau à son
 * adresse, et Échap le referme, rendant l'adresse de l'accueil.
 * @param {import('playwright').Page} page
 * @param {string} ici
 * @param {{ enCours: boolean }} capture Pendant qu'on prend la capture du panneau, ce que dit la console n'est pas le fait du site.
 * @param {string} fichier Où la ranger.
 */
async function regarderLEtabli(page, ici, capture, fichier) {
  const pose = await page.waitForSelector('.scene canvas', { timeout: POSE * 5 }).then(() => true, () => false);
  if (!pose) {
    ennuis.push(`${ici} : l'établi ne s'est pas posé`);
    return;
  }
  await page.waitForTimeout(POSE);
  const lien = page.locator('.objet a').first();
  await lien.focus();
  const titre = (await lien.textContent())?.trim();
  const etiquette = await page.locator('.etiquette.visible').textContent({ timeout: POSE }).catch(() => null);
  if (etiquette?.trim() !== titre) ennuis.push(`${ici} : le focus sur « ${titre} » ne montre pas son étiquette (${etiquette})`);
  const adresse = await lien.getAttribute('href');
  await page.keyboard.press('Enter');
  const panneau = await page.locator('.panneau[open] h1').textContent({ timeout: POSE * 5 }).catch(() => null);
  if (panneau?.trim() !== titre || new URL(page.url()).pathname !== adresse) {
    ennuis.push(`${ici} : Entrée sur « ${titre} » n'ouvre pas son panneau à ${adresse} (${panneau}, ${page.url()})`);
  }
  await page.waitForTimeout(POSE);
  capture.enCours = true;
  await page.screenshot({ path: fichier });
  capture.enCours = false;
  await page.keyboard.press('Escape');
  await page.waitForURL((url) => url.pathname === '/', { timeout: POSE * 2 }).catch(() => ennuis.push(`${ici} : Échap ne rend pas l'accueil`));
  if ((await page.locator('.panneau[open]').count()) > 0) ennuis.push(`${ici} : Échap ne ferme pas le panneau`);
  await page.waitForTimeout(POSE);
  await lien.blur();
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(POSE / 4);
}

for (const { nom, navigateur, reglages } of APPAREILS) {
  const instance = await navigateur.launch();
  const contexte = await instance.newContext(reglages);
  for (const chemin of pages) {
    const page = await contexte.newPage();
    const ici = `${navigateur.name()} ${nom} ${chemin}`;
    // Pour sa capture, Playwright pose une feuille de style dans la page, que WebKit refuse au nom de la CSP : ce qui se dit
    // pendant la capture n'est pas le fait du site.
    const capture = { enCours: false };
    page.on('console', (message) => {
      // La page introuvable répond 404 exprès : le navigateur le dit dans sa console.
      const attendue = capture.enCours || (chemin === INTROUVABLE && message.text().includes('404'));
      if (message.type() === 'error' && !attendue) ennuis.push(`${ici} : ${message.text()}`);
    });
    page.on('pageerror', (erreur) => ennuis.push(`${ici} : ${erreur.message}`));
    page.on('response', (reponse) => {
      const attendue = reponse.url() === adresse + INTROUVABLE;
      if (reponse.status() >= 400 && !attendue) ennuis.push(`${ici} : ${reponse.status()} ${reponse.url()}`);
    });
    await page.goto(adresse + chemin, { waitUntil: 'networkidle' });
    const nomDeCapture = chemin === '/' ? 'accueil' : chemin.slice(1);
    if (chemin === '/') await regarderLEtabli(page, ici, capture, `${SORTIE}${navigateur.name()}-${nom}-panneau.png`);
    capture.enCours = true;
    await page.screenshot({ path: `${SORTIE}${navigateur.name()}-${nom}-${nomDeCapture}.png`, fullPage: true });
    await page.close();
  }
  await instance.close();
}

// Sans 3D : pas de scène, pas d'erreur, la liste des objets.
const sans3D = await chromium.launch({ args: ['--disable-webgl', '--disable-3d-apis'] });
const page = await sans3D.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', (message) => message.type() === 'error' && ennuis.push(`sans 3D : ${message.text()}`));
page.on('pageerror', (erreur) => ennuis.push(`sans 3D : ${erreur.message}`));
await page.goto(`${adresse}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(POSE);
if ((await page.locator('.scene').count()) > 0) ennuis.push("sans 3D : l'établi s'est posé quand même");
if (!(await page.locator('.objet a').first().isVisible())) ennuis.push('sans 3D : la liste des objets ne se voit pas');
await page.screenshot({ path: `${SORTIE}chromium-ordinateur-accueil-sans-3d.png`, fullPage: true });
await sans3D.close();
fermer();

console.log(`${pages.length} pages × ${APPAREILS.length} appareils, captures dans banc/sortie/.`);
if (ennuis.length > 0) {
  console.error(ennuis.join('\n'));
  process.exit(1);
}
