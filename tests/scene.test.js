// Les objets de l'établi se tiennent : chaque projet a le sien, et chacun ne sert qu'à un projet ; leurs couleurs sont dans la
// palette, les groupes qu'ils animent existent, et chacun tient sur le plateau sans toucher les autres.

import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { test } from 'node:test';
import projets from '../contenu/projets.js';
import personne from '../contenu/personne.js';
import { modeles } from '../site/js/modeles.js';
import etabli from '../site/js/modeles/etabli.js';
import { palette } from './depot.js';

const OBJETS = [...projets.map((projet) => projet.objet), personne.objet];
const MODELES = Object.entries(modeles);

/** Chaque pièce d'une liste de parties, à toute profondeur ; et chaque nom de groupe. @param {readonly import('../site/js/types.js').Partie[]} parties */
function deplier(parties) {
  /** @type {{ pieces: import('../site/js/types.js').Piece[], groupes: string[] }} */
  const vu = { pieces: [], groupes: [] };
  for (const partie of parties) {
    if ('groupe' in partie) {
      const dedans = deplier(partie.pieces);
      vu.groupes.push(partie.groupe, ...dedans.groupes);
      vu.pieces.push(...dedans.pieces);
    } else vu.pieces.push(partie);
  }
  return vu;
}

test("chaque objet nommé par le contenu a son modèle, chaque modèle sert à un seul projet, et chaque fichier de modèle est dans l'index", () => {
  for (const objet of OBJETS) assert.ok(objet in modeles, `${objet} n'est pas dans site/js/modeles.js`);
  assert.deepEqual([...OBJETS].sort(), Object.keys(modeles).sort(), 'un modèle sans projet, ou deux projets pour un modèle');
  const fichiers = readdirSync(new URL('../site/js/modeles/', import.meta.url)).filter((nom) => nom !== 'etabli.js');
  assert.equal(fichiers.length, MODELES.length, 'un fichier de site/js/modeles/ manque à site/js/modeles.js');
});

test('chaque couleur nommée par un modèle est une couleur de la scène, dans la palette ; seul un objet a une teinte', () => {
  const couleurs = palette();
  const nommees = [
    ...MODELES.flatMap(([nom, modele]) => deplier(modele.pieces).pieces.map((piece) => ({ nom, couleur: piece.matiere.couleur }))),
    ...deplier(etabli.pieces).pieces.map((piece) => ({ nom: 'etabli', couleur: piece.matiere.couleur })),
  ];
  for (const { nom, couleur } of nommees) {
    const permise = couleur === 'teinte' ? nom !== 'etabli' : couleurs.has(`scene-${couleur}`);
    assert.ok(permise, `${nom} : ${couleur} n'est pas une couleur de la scène (--scene-${couleur})`);
  }
});

test("chaque groupe qu'un modèle ouvre ou fait tourner existe, une seule fois", () => {
  for (const [nom, modele] of MODELES) {
    const { groupes } = deplier(modele.pieces);
    assert.equal(new Set(groupes).size, groupes.length, `${nom} : deux groupes du même nom`);
    for (const { groupe } of [...modele.ouverture, ...modele.mouvements]) assert.ok(groupes.includes(groupe), `${nom} : ${groupe}`);
  }
});

test('chaque objet tient sur le plateau, sans toucher les autres', () => {
  // La place de chaque objet sur le plateau, vue d'en haut : la boîte qui encadre sa prise, une fois tournée.
  const emprises = MODELES.map(([nom, { place, prise }]) => {
    const [cos, sin] = [Math.abs(Math.cos(place.rotation)), Math.abs(Math.sin(place.rotation))];
    const [largeur, , profondeur] = prise.taille;
    const [cx, , cz] = prise.centre;
    const x = place.x + cx * Math.cos(place.rotation) + cz * Math.sin(place.rotation);
    const z = place.z - cx * Math.sin(place.rotation) + cz * Math.cos(place.rotation);
    const [dx, dz] = [(cos * largeur + sin * profondeur) / 2, (sin * largeur + cos * profondeur) / 2];
    return { nom, gauche: x - dx, droite: x + dx, fond: z - dz, devant: z + dz };
  });
  const { largeur, profondeur } = etabli.plateau;
  for (const e of emprises) {
    assert.ok(e.gauche >= -largeur / 2 && e.droite <= largeur / 2 && e.fond >= -profondeur / 2 && e.devant <= profondeur / 2, `${e.nom} déborde du plateau`);
  }
  for (const [i, a] of emprises.entries()) {
    for (const b of emprises.slice(i + 1)) {
      const touche = a.gauche < b.droite && b.gauche < a.droite && a.fond < b.devant && b.fond < a.devant;
      assert.ok(!touche, `${a.nom} et ${b.nom} se touchent`);
    }
  }
});
