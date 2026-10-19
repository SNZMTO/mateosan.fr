// Le serveur du banc : sert site/ comme le fait Caddy en ligne (deploiement/Caddyfile) — même politique de sécurité du contenu,
// lue dans ce fichier, mêmes adresses sans « .html », même page introuvable — pour que le banc voie ce que verra un visiteur.
// Lancé seul (node banc/serveur.js), il sert le site en local, sur http://127.0.0.1:8000.

import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, posix, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = fileURLToPath(new URL('..', import.meta.url));
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

/**
 * Le fichier qui répond à une adresse, comme try_files {path} {path}.html ; null si l'adresse ne se décode pas (un « % » sans
 * ses deux chiffres hexadécimaux).
 * @param {string} chemin
 */
function fichierDe(chemin) {
  let decode;
  try {
    decode = decodeURIComponent(chemin);
  } catch {
    return null;
  }
  // Un chemin d'adresse s'écrit avec des « / », même sous Windows, où path.normalize les changerait en « \ ».
  const demande = posix.normalize(decode).replace(/^(\.\.[/\\])+/, '');
  for (const essai of [demande.endsWith('/') ? `${demande}index.html` : demande, `${demande}.html`]) {
    const complet = join(SITE, essai);
    // Rien hors de site/, pas même un dossier voisin qui commencerait par « site » : sous Windows, un « %5C » décodé sépare.
    if (complet.startsWith(SITE + sep) && statSync(complet, { throwIfNoEntry: false })?.isFile()) return complet;
  }
  return undefined;
}

/** @param {number} port @returns {Promise<{ adresse: string, fermer: () => void }>} */
export function servir(port) {
  const serveur = createServer((requete, reponse) => {
    const chemin = new URL(requete.url ?? '/', 'http://banc').pathname;
    const fichier = fichierDe(chemin);
    const securite = { 'Content-Security-Policy': CSP, 'X-Content-Type-Options': 'nosniff' };
    // Une adresse mal formée : une réponse 400, comme en ligne, plutôt qu'une exception qui arrêterait le serveur.
    if (fichier === null) {
      reponse.writeHead(400, securite).end();
      return;
    }
    const servi = fichier ?? join(SITE, '404.html');
    reponse.writeHead(fichier === undefined ? 404 : 200, {
      'Content-Type': TYPES[extname(servi)] ?? 'application/octet-stream',
      ...securite,
    });
    reponse.end(readFileSync(servi));
  });
  return new Promise((resoudre) => {
    serveur.listen(port, '127.0.0.1', () => resoudre({ adresse: `http://127.0.0.1:${port}`, fermer: () => serveur.close() }));
  });
}

if (import.meta.main) {
  const { adresse } = await servir(8000);
  console.log(`site/ servi comme en ligne sur ${adresse} ; Ctrl+C pour l'arrêter.`);
}
