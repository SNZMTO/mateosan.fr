// Le regard du banc : chaque page du site sur un ordinateur et un téléphone, sous Chromium et WebKit, servie comme en ligne.
// Il relève ce qui cloche (une erreur, un refus de la politique de sécurité, un fichier introuvable, une page plus large que
// l'écran, un établi qui ne se pose pas) et laisse une capture de chaque page dans banc/sortie/, à regarder. Ce que l'établi
// fait de ses objets, au clavier, au doigt, sans 3D, se regarde avec banc/etabli.js.

import { readdirSync } from 'node:fs';
import { servir } from './serveur.js';
import { APPAREILS, conclure, exiger, INTROUVABLE, POSE, surveiller } from './surveillance.js';

const pages = readdirSync(new URL('../site/', import.meta.url))
  .filter((nom) => nom.endsWith('.html'))
  .map((nom) => (nom === 'index.html' ? '/' : nom === '404.html' ? INTROUVABLE : `/${nom.replace(/\.html$/, '')}`));

const { adresse, fermer } = await servir(8095);
for (const { nom, navigateur, reglages } of APPAREILS) {
  const instance = await navigateur.launch();
  const contexte = await instance.newContext(reglages);
  for (const chemin of pages) {
    const page = await contexte.newPage();
    const ici = `${navigateur.name()} ${nom} ${chemin}`;
    const { capturer } = surveiller(page, ici);
    await page.goto(adresse + chemin, { waitUntil: 'networkidle' });
    if (chemin === '/') {
      const pose = await page.waitForSelector('.scene canvas', { timeout: POSE * 5 }).then(() => true, () => false);
      exiger(pose, `${ici} : l'établi ne s'est pas posé`);
      await page.waitForTimeout(POSE);
    }
    const debord = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    exiger(debord <= 0, `${ici} : la page déborde de ${debord} px sur le côté`);
    await capturer(`${navigateur.name()}-${nom}-${chemin === '/' ? 'accueil' : chemin.slice(1)}`, true);
    await page.close();
  }
  await instance.close();
}
fermer();

conclure(`${pages.length} pages × ${APPAREILS.length} appareils, captures dans banc/sortie/.`);
