# mateosan.fr

La vitrine de mes projets, en ligne sur [mateosan.fr](https://mateosan.fr) : qui je suis en trente secondes, puis ce qui est
posé sur l'établi, chaque projet avec sa page.

> **In English.** The showcase of my projects, live at [mateosan.fr](https://mateosan.fr): a low-poly 3D workbench (three.js)
> where each project is an object, on top of plain HTML pages that work without it. The content lives in plain data files; the
> pages are written from it before each commit and served as-is by a hardened container, with no build step on the server, no
> third-party request and a strict Content Security Policy. Tests enforce the rules of the code itself. Code and docs are in
> French.

## Comment il est fait

- **Le contenu est une donnée.** Chaque projet est un fichier de `contenu/projets/` : son titre, son accroche, son état, son
  résumé, ses pastilles, ses captures, ses sections, ses liens, sa teinte et son objet sur l'établi. Ajouter un projet, c'est
  écrire ce fichier et l'ajouter à l'ordre de `contenu/projets.js`, sans toucher au code. Une capture est copiée depuis le dépôt
  du projet dans `site/images/projets/`, et le contenu note d'où elle vient (le dépôt, le commit, le chemin). Tous les textes
  du site sont dans `contenu/`, et leurs types dans `contenu/types.d.ts`.
- **Le CV en version publique.** `site/cv-mateo-sanchez.pdf` est mon CV, sans mon téléphone : un test vérifie qu'il donne
  l'adresse de contact du site, et aucune autre.
- **Les pages en sont tirées, avant le commit.** `npm run pages` écrit `site/*.html` ; un test refuse une page qui n'est pas
  exactement ce que donne le contenu. Le serveur sert `site/` tel quel : il n'y a rien à construire, ni à exécuter, sur le VPS.
- **Lisible par tous.** Les pages sont du HTML simple, qui se lit sans JavaScript, avec un lecteur d'écran ou un vieux
  navigateur. Les textes tiennent un contraste de 4,5:1 sur leurs fonds, calculé par les tests depuis la palette.
- **L'établi par-dessus.** Sur l'accueil, si le navigateur dessine en 3D, `site/js/demarrage.js` pose l'établi en tête de la
  liste des projets : un objet par projet, dont on lit le nom au survol et qui s'ouvre au clic, au doigt (un toucher pour voir,
  un second pour ouvrir) comme au clavier (le focus sur une carte fait sauter son objet). Choisir un objet y plonge, puis ouvre
  sa page dans un panneau, sans quitter l'accueil : l'adresse suit, Échap ou le retour du navigateur le referme, et la caméra
  revient. La scène lit tout dans la page : quels objets poser (`data-objet`), leurs noms, leurs teintes. Les objets sont des
  données (`site/js/modeles/`, pièce par pièce), tous les nombres de réglage sont dans `site/js/reglages.js`, et les couleurs
  dans la palette. Pour qui demande moins de mouvement, la scène se tient tranquille : ni ressort, ni plongée, ni animation.
  Sans 3D ou sans JavaScript, la liste et ses pages suffisent ; three.js (0.149.0, servi par le site) n'est téléchargé que s'il
  sert. Il reste à cette version, celle de la scène d'origine, pour en garder le rendu : on n'en change qu'avec une raison.
- **Rien ne vient d'ailleurs.** Les polices sont servies par mateosan.fr, et la politique de sécurité du contenu
  ([`deploiement/Caddyfile`](deploiement/Caddyfile)) n'accepte ni style ni script écrit dans une page.
- **Du JavaScript vérifié** par TypeScript au plus strict (`tsc --checkJs --strict`, à partir des commentaires JSDoc), sans
  rien compiler : les outils, les tests et les scripts du site, que le navigateur lit tels quels.

## Les règles du code

[`tests/regles.test.js`](tests/regles.test.js) les vérifie sur les sources elles-mêmes : un test rouge, c'est une règle
enfreinte, pas un test à changer.

- Chaque module commence par un commentaire qui dit son rôle, et aucun fichier écrit à la main ne dépasse 200 lignes.
- Aucune couleur hors de [`site/css/palette.css`](site/css/palette.css), aucune ressource chargée d'un autre site, aucun style
  ni script écrit dans une page.
- Les textes ne s'écrivent que dans `contenu/` : un gabarit des outils n'a en dur que des balises, et un script du site
  n'affiche que ce qu'il lit dans la page.
- Aucun nombre de réglage dans les scripts du site, hors de `site/js/reglages.js` et des modèles.
- Les dépendances ne vont que dans un sens : `contenu/`, puis `outils/` ; dans `site/js/`, les réglages et les modèles, puis la
  scène et la page, qui s'ignorent, puis le démarrage.
- Rien en attente : pas de remplaçant entre crochets, pas de travail laissé « pour plus tard ».

[`tests/contenu.test.js`](tests/contenu.test.js) vérifie que chaque projet est complet, que ses teintes existent et que ses
liens sont sûrs, et que le site comme le CV n'écrivent qu'à une seule adresse ; [`tests/scene.test.js`](tests/scene.test.js), que
chaque projet a son objet, que les couleurs des objets sont dans la palette, et que chacun tient sur l'établi sans toucher les
autres.

## Les dossiers

| Dossier | Ce qu'il tient |
| --- | --- |
| `contenu/` | Les textes : le site, l'interface, la personne, les projets, les pages légales. |
| `outils/pages/` | Ce qui écrit les pages de `site/` depuis le contenu (`npm run pages`). |
| `site/` | Ce qui est servi : les pages, le CV, les feuilles de style, les scripts de l'établi (`site/js/`), les images, et ce qui vient d'ailleurs avec sa licence (`site/dependances/` : les polices, three.js). |
| `tests/` | Les règles, le contenu, les pages. |
| `banc/` | Le banc d'essai, dans l'image Playwright : chaque page sous Chromium et WebKit, sur ordinateur et téléphone (`regard.js`) ; l'établi au clavier seul, au doigt, avec moins de mouvement, sans 3D et sans JavaScript (`etabli.js`). Il dessine aussi l'image de partage. |
| `deploiement/` | Le conteneur, son serveur et le timer qui met `main` en ligne ([`LISEZMOI.md`](deploiement/LISEZMOI.md)). |

## Lancer en local

Il faut Node 24, et rien d'autre.

```sh
npm ci
npm test                         # les types, puis les tests
npm run pages                    # après un changement du contenu
node banc/serveur.js             # le site sur http://127.0.0.1:8000, comme en ligne : la CSP, les adresses sans « .html »
```

Un serveur de fichiers ordinaire (`python3 -m http.server`) ne suffit pas : les liens du site n'ont pas de « .html », et
`/honear` y répondrait 404.

## Comment je l'ai construit

Ce site est le mien de bout en bout : ce qu'il dit, son allure, ses règles et son hébergement. Claude Code en a écrit
l'essentiel du code, et les commits co-signés le montrent. Moi, je décide de ce qu'il montre, je fixe les règles que les tests
vérifient, et je passe chaque page au banc d'essai avant de la mettre en ligne.

<sub>© 2026 Mateo Sanchez, tous droits réservés : le code est public pour être lu, pas pour être réutilisé sans mon accord.
Les polices Fredoka, Nunito et Caveat gardent leur licence, la SIL Open Font License 1.1 (dans
<code>site/dependances/polices/</code>), et three.js la sienne, la licence MIT (dans <code>site/dependances/three-0.149.0/</code>).
Les captures de DIciELa montrent l'art du pack POLYGON Fantasy Village, qui reste la propriété de Synty Studios ; une capture
du MCP de Honear, la pochette de l'album « Parachutes » de Coldplay, qui reste celle de ses ayants droit.</sub>
