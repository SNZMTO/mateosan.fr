// La taille d'une image du site (JPEG ou WebP), lue dans son en-tête : la page la donne au navigateur, qui réserve sa place
// avant de l'avoir reçue, et rien ne saute pendant le chargement.

import { readFileSync } from 'node:fs';

const SITE = new URL('../../site/', import.meta.url);

/**
 * La taille d'un JPEG : celle de son premier en-tête d'image (un marqueur SOF).
 * @param {Buffer} octets
 */
function tailleJpeg(octets) {
  for (let i = 2; i + 9 < octets.length; ) {
    const marqueur = octets[i + 1] ?? 0;
    const longueur = octets.readUInt16BE(i + 2);
    const estUneImage = marqueur >= 0xc0 && marqueur <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marqueur);
    if (estUneImage) return { largeur: octets.readUInt16BE(i + 7), hauteur: octets.readUInt16BE(i + 5) };
    i += 2 + longueur;
  }
  throw new Error('JPEG sans en-tête d\'image');
}

/**
 * La taille d'un WebP, selon son codage : avec perte (VP8), sans perte (VP8L), ou étendu (VP8X).
 * @param {Buffer} octets
 */
function tailleWebp(octets) {
  const codage = octets.toString('ascii', 12, 16);
  if (codage === 'VP8 ') return { largeur: octets.readUInt16LE(26) & 0x3fff, hauteur: octets.readUInt16LE(28) & 0x3fff };
  if (codage === 'VP8L') {
    const bits = octets.readUInt32LE(21);
    return { largeur: (bits & 0x3fff) + 1, hauteur: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (codage === 'VP8X') return { largeur: octets.readUIntLE(24, 3) + 1, hauteur: octets.readUIntLE(27, 3) + 1 };
  throw new Error(`WebP au codage inconnu : ${codage}`);
}

/**
 * La largeur et la hauteur, en pixels, d'une image de site/.
 * @param {string} chemin Depuis site/ (images/projets/honear/piste.webp).
 */
export function tailleDImage(chemin) {
  const octets = readFileSync(new URL(chemin, SITE));
  if (octets.toString('ascii', 0, 4) === 'RIFF' && octets.toString('ascii', 8, 12) === 'WEBP') return tailleWebp(octets);
  if (octets[0] === 0xff && octets[1] === 0xd8) return tailleJpeg(octets);
  throw new Error(`${chemin} : ni JPEG ni WebP`);
}
