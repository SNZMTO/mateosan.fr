// Le banc de l'établi : ce que l'accueil fait de ses objets, pour chaque façon de le visiter.
// - Au clavier seul : Tab atteint chaque objet, dans l'ordre de la liste, en montrant son étiquette et son focus ; Entrée ouvre
//   son panneau, à son adresse ; le focus n'en sort pas vers la page dessous ; Échap rend l'accueil et le focus à la carte.
// - Au doigt : un toucher sur un objet montre son étiquette, un second ouvre son panneau, son retour le referme.
// - Pour qui demande moins de mouvement : le panneau s'ouvre sans plongée (l'horloge de la page arrêtée, la caméra ne pourrait
//   pas plonger) et sans animation.
// - Sans 3D, puis sans JavaScript : pas de scène, pas d'erreur, et les cartes mènent aux pages.

import { chromium, webkit } from 'playwright';
import { servir } from './serveur.js';
import { conclure, exiger, ORDINATEUR, POSE, surveiller, TELEPHONES } from './surveillance.js';

/** Assez de tabulations pour traverser l'en-tête et toutes les cartes. */
const TABULATIONS = 20;
/** Au-dessous de l'étiquette d'un objet, son corps : là où le doigt le touche. */
const SOUS_L_ETIQUETTE = 20;

const { adresse, fermer } = await servir(8099);

/** @param {import('playwright').Page} page @param {string} ici */
async function attendreLEtabli(page, ici) {
  await page.goto(`${adresse}/`, { waitUntil: 'networkidle' });
  const pose = await page.waitForSelector('.scene canvas', { timeout: POSE * 5 }).then(() => true, () => false);
  exiger(pose, `${ici} : l'établi ne s'est pas posé`);
  await page.waitForTimeout(POSE);
  return pose;
}

/** @param {import('playwright').Page} page */
const etiquette = (page) => page.locator('.etiquette.visible').textContent({ timeout: POSE }).then((texte) => texte?.trim() ?? null, () => null);
/** @param {import('playwright').Page} page */
const titreDuPanneau = (page) => page.locator('.panneau[open] h1').textContent({ timeout: POSE * 5 }).then((texte) => texte?.trim() ?? null, () => null);
/** @param {import('playwright').Page} page */
const chemin = (page) => new URL(page.url()).pathname;

/** @param {import('playwright').BrowserType} navigateur */
async function auClavier(navigateur) {
  const ici = `${navigateur.name()} clavier`;
  const instance = await navigateur.launch();
  const page = await instance.newPage(ORDINATEUR);
  const { capturer } = surveiller(page, ici);
  if (await attendreLEtabli(page, ici)) {
    const titres = (await page.locator('.objet a').allTextContents()).map((titre) => titre.trim());
    /** @type {string[]} */
    const atteints = [];
    for (let i = 0; i < TABULATIONS && atteints.length < titres.length; i++) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const carte = document.activeElement?.closest('.objet');
        return carte ? { titre: document.activeElement?.textContent?.trim() ?? '', contour: getComputedStyle(carte).outlineStyle } : null;
      });
      if (focus === null) continue;
      atteints.push(focus.titre);
      exiger((await etiquette(page)) === focus.titre, `${ici} : le focus sur « ${focus.titre} » ne montre pas son étiquette`);
      exiger(focus.contour !== 'none', `${ici} : la carte de « ${focus.titre} » ne montre pas son focus`);
    }
    exiger(atteints.join() === titres.join(), `${ici} : Tab atteint « ${atteints.join(', ')} », pas « ${titres.join(', ')} »`);

    const titre = atteints.at(-1) ?? '';
    const adresseDuLien = await page.evaluate(() => document.activeElement?.getAttribute('href'));
    await page.keyboard.press('Enter');
    exiger((await titreDuPanneau(page)) === titre && chemin(page) === adresseDuLien, `${ici} : Entrée n'ouvre pas le panneau de « ${titre} »`);
    for (let i = 0; i < TABULATIONS; i++) {
      await page.keyboard.press('Tab');
      const dehors = await page.evaluate(() => {
        const actif = document.activeElement;
        return actif !== null && actif !== document.body && actif.closest('.panneau') === null;
      });
      exiger(!dehors, `${ici} : Tab sort du panneau vers la page dessous`);
    }
    await page.waitForTimeout(POSE);
    await capturer(`${navigateur.name()}-clavier-panneau`);
    await page.keyboard.press('Escape');
    await page.waitForURL((url) => url.pathname === '/', { timeout: POSE * 2 }).catch(() => undefined);
    const rendu = await page.evaluate(() => document.activeElement?.getAttribute('href'));
    exiger(chemin(page) === '/' && (await page.locator('.panneau[open]').count()) === 0, `${ici} : Échap ne rend pas l'accueil`);
    exiger(rendu === adresseDuLien, `${ici} : après Échap, le focus n'est pas revenu à la carte de « ${titre} » (${rendu})`);
  }
  await instance.close();
}

/** @param {{ navigateur: import('playwright').BrowserType, reglages: import('playwright').BrowserContextOptions }} telephone */
async function auDoigt({ navigateur, reglages }) {
  const ici = `${navigateur.name()} doigt`;
  const instance = await navigateur.launch();
  const page = await instance.newPage(reglages);
  const { capturer } = surveiller(page, ici);
  if (await attendreLEtabli(page, ici)) {
    // Où est le premier objet ? Là où la scène pend son étiquette quand sa carte a le focus.
    const titre = (await page.locator('.objet a').first().textContent())?.trim();
    await page.evaluate(() => {
      const lien = document.querySelector('.objet a');
      if (lien instanceof HTMLElement) lien.focus({ preventScroll: true });
    });
    await page.waitForTimeout(POSE / 2);
    const accroche = await page.evaluate(() => {
      const point = document.querySelector('.etiquette.visible')?.getBoundingClientRect();
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      return point === undefined ? null : { x: point.x, y: point.y };
    });
    await page.waitForTimeout(POSE / 2);
    if (accroche === null) exiger(false, `${ici} : pas d'étiquette pour trouver « ${titre} »`);
    else {
      const [x, y] = [accroche.x, accroche.y + SOUS_L_ETIQUETTE];
      await page.touchscreen.tap(x, y);
      exiger((await etiquette(page)) === titre, `${ici} : un toucher sur « ${titre} » ne montre pas son étiquette`);
      await capturer(`${navigateur.name()}-doigt-etiquette`);
      await page.touchscreen.tap(x, y);
      exiger((await titreDuPanneau(page)) === titre, `${ici} : un second toucher n'ouvre pas le panneau de « ${titre} »`);
      await page.locator('.panneau[open] .retour a').tap();
      await page.waitForURL((url) => url.pathname === '/', { timeout: POSE * 2 }).catch(() => undefined);
      exiger(chemin(page) === '/' && (await page.locator('.panneau[open]').count()) === 0, `${ici} : le retour ne ferme pas le panneau`);
    }
  }
  await instance.close();
}

/** @param {import('playwright').BrowserType} navigateur */
async function auCalme(navigateur) {
  const ici = `${navigateur.name()} calme`;
  const instance = await navigateur.launch();
  const page = await instance.newPage({ ...ORDINATEUR, reducedMotion: 'reduce' });
  surveiller(page, ici);
  await page.clock.install();
  if (await attendreLEtabli(page, ici)) {
    await page.clock.runFor(POSE);
    await page.clock.pauseAt(Date.now() + POSE * 10);
    await page.focus('.objet a');
    await page.keyboard.press('Enter');
    exiger((await titreDuPanneau(page)) !== null, `${ici} : le panneau attend une plongée`);
    const animation = await page.evaluate(() => getComputedStyle(document.querySelector('.panneau') ?? document.body).animationName);
    exiger(animation === 'none', `${ici} : le panneau s'anime (${animation})`);
  }
  await instance.close();
}

/** @param {import('playwright').BrowserType} navigateur @param {'sans-3d' | 'sans-js'} cas */
async function sansLaScene(navigateur, cas) {
  const ici = `${navigateur.name()} ${cas}`;
  const instance = await navigateur.launch();
  const contexte = await instance.newContext({ ...ORDINATEUR, javaScriptEnabled: cas !== 'sans-js' });
  await contexte.addInitScript(() => {
    const dessiner = HTMLCanvasElement.prototype.getContext;
    // @ts-expect-error -- le navigateur, ici, ne sait plus dessiner en 3D.
    HTMLCanvasElement.prototype.getContext = function (type, ...reste) {
      return /webgl/.test(type) ? null : dessiner.call(this, type, ...reste);
    };
  });
  const page = await contexte.newPage();
  const { capturer } = surveiller(page, ici);
  await page.goto(`${adresse}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(POSE);
  exiger((await page.locator('.scene').count()) === 0, `${ici} : l'établi s'est posé quand même`);
  await capturer(`${navigateur.name()}-${cas}`, true);
  const lien = page.locator('.objet a').first();
  const adresseDuLien = await lien.getAttribute('href');
  await lien.click();
  await page.waitForURL((url) => url.pathname === adresseDuLien, { timeout: POSE * 2 }).catch(() => undefined);
  exiger(chemin(page) === adresseDuLien && (await page.locator('main.fiche h1').count()) === 1, `${ici} : la carte ne mène pas à sa page`);
  await instance.close();
}

for (const navigateur of [chromium, webkit]) {
  await auClavier(navigateur);
  await auCalme(navigateur);
  await sansLaScene(navigateur, 'sans-3d');
  await sansLaScene(navigateur, 'sans-js');
}
for (const telephone of TELEPHONES) await auDoigt(telephone);
fermer();

conclure("L'établi au clavier, au doigt, au calme, sans 3D et sans JavaScript, sous Chromium et WebKit.");
