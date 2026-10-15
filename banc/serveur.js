// Le serveur du banc : sert site/ comme le fait Caddy en ligne (deploiement/Caddyfile) — même politique de sécurité du contenu,
// lue dans ce fichier, mêmes adresses sans « .html », même page introuvable — pour que le banc voie ce que verra un visiteur.

import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const RACINE = new URL('..', import.meta.url).pathname;
const SITE = join(RACINE, 'site');

const CSP = readFileSync(join(RACINE, 'deploiement/Caddyfile'), 'utf8').match(/header Content-Security-Policy "([^"]+)"/)?.[1];
if (CSP === undefined) throw new Error('deploiement/Caddyfile ne pose pas de Content-Security-Policy.');

/** @type {Record<string, string>} */
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

/** Le fichier qui répond à une adresse, comme try_files {path} {path}.html. @param {string} chemin */
function fichierDe(chemin) {
  const demande = normalize(decodeURIComponent(chemin)).replace(/^(\.\.[/\\])+/, '');
  for (const essai of [demande.endsWith('/') ? `${demande}index.html` : demande, `${demande}.html`]) {
    const complet = join(SITE, essai);
    if (complet.startsWith(SITE) && statSync(complet, { throwIfNoEntry: false })?.isFile()) return complet;
  }
  return undefined;
}

/** @param {number} port @returns {Promise<{ adresse: string, fermer: () => void }>} */
export function servir(port) {
  const serveur = createServer((requete, reponse) => {
    const chemin = new URL(requete.url ?? '/', 'http://banc').pathname;
    const fichier = fichierDe(chemin);
    const servi = fichier ?? join(SITE, '404.html');
    reponse.writeHead(fichier === undefined ? 404 : 200, {
      'Content-Type': TYPES[extname(servi)] ?? 'application/octet-stream',
      'Content-Security-Policy': CSP,
      'X-Content-Type-Options': 'nosniff',
    });
    reponse.end(readFileSync(servi));
  });
  return new Promise((resoudre) => {
    serveur.listen(port, '127.0.0.1', () => resoudre({ adresse: `http://127.0.0.1:${port}`, fermer: () => serveur.close() }));
  });
}
