// Le gabarit de toutes les pages : l'en-tête du document (titre, description, partage, favicon, styles) et le pied de page.

import site from '../../contenu/site.js';
import libelles from '../../contenu/interface.js';
import personne from '../../contenu/personne.js';
import legal from '../../contenu/legal.js';
import { html } from './html.js';

const STYLES = ['/css/polices.css', '/css/palette.css', '/css/page.css', '/css/accueil.css', '/css/fiches.css'];

/**
 * @typedef {object} Description
 * @property {string} titre Le titre de l'onglet et du partage.
 * @property {string} description
 * @property {string | undefined} chemin Son adresse sur le site (/honear) ; absente, la page n'est pas indexée (la 404).
 * @property {import('./html.js').Html} corps Ce qui va dans <body>, avant le pied de page.
 */

/** @param {Description} page */
export function documentComplet({ titre, description, chemin, corps }) {
  const adresse = chemin === undefined ? undefined : site.adresse + chemin;
  return html`<!doctype html>
<html lang="${site.langue}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titre}</title>
<meta name="description" content="${description}">
${adresse === undefined ? html`<meta name="robots" content="noindex">` : canonique(adresse, titre, description)}
<link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
${STYLES.map((feuille) => html`<link rel="stylesheet" href="${feuille}">
`)}</head>
<body>
${corps}
${piedDePage()}
</body>
</html>
`.texte;
}

/** @param {string} adresse @param {string} titre @param {string} description */
function canonique(adresse, titre, description) {
  return html`<link rel="canonical" href="${adresse}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${site.locale}">
<meta property="og:site_name" content="${site.nom}">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${adresse}">`;
}

function piedDePage() {
  return html`<footer class="pied">
  <p><a href="mailto:${personne.contact.adresse}">${personne.contact.adresse}</a></p>
  <nav aria-label="${libelles.navigationLegale}">
    <ul>
${legal.map((page) => html`      <li><a href="/${page.id}">${page.titre}</a></li>
`)}    </ul>
  </nav>
</footer>`;
}

/** Le lien du retour à l'accueil, en haut des pages. */
export function retour() {
  return html`<nav class="retour"><a href="/"><span aria-hidden="true">←</span> ${libelles.retour}</a></nav>`;
}

/**
 * Le titre d'onglet d'une page : son titre, puis un nom.
 * @param {string} titre
 * @param {string} nom
 */
export function titreDOnglet(titre, nom) {
  return titre + libelles.separateur + nom;
}
