# mateosan.fr

La vitrine de mes projets, en ligne sur [mateosan.fr](https://mateosan.fr) : qui je suis en trente secondes, puis ce qui est
posé sur l'établi, chaque projet avec sa page.

> **In English.** The showcase of my projects, live at [mateosan.fr](https://mateosan.fr). The content lives in plain data
> files; the pages are written from it before each commit and served as-is by a hardened container, with no build step on the
> server, no third-party request and a strict Content Security Policy. Tests enforce the rules of the code itself. Code and docs
> are in French.

## Comment il est fait

- **Le contenu est une donnée.** Chaque projet est un fichier de `contenu/projets/` : son titre, son accroche, son état, son
  résumé, ses pastilles, ses liens et sa teinte. Ajouter un projet, c'est écrire ce fichier et l'ajouter à l'ordre de
  `contenu/projets.js`, sans toucher au code. Tous les textes du site sont dans `contenu/`, et leurs types dans
  `contenu/types.d.ts`.
- **Les pages en sont tirées, avant le commit.** `npm run pages` écrit `site/*.html` ; un test refuse une page qui n'est pas
  exactement ce que donne le contenu. Le serveur sert `site/` tel quel : il n'y a rien à construire, ni à exécuter, sur le VPS.
- **Lisible par tous.** Les pages sont du HTML simple, sans script, qui se lit avec un lecteur d'écran ou un vieux navigateur.
  Les textes tiennent un contraste de 4,5:1 sur leurs fonds, calculé par les tests depuis la palette.
- **Rien ne vient d'ailleurs.** Les polices sont servies par mateosan.fr, et la politique de sécurité du contenu
  ([`deploiement/Caddyfile`](deploiement/Caddyfile)) n'accepte ni style ni script écrit dans une page.
- **Du JavaScript vérifié** par TypeScript au plus strict (`tsc --checkJs --strict`, à partir des commentaires JSDoc), sans
  rien compiler.

## Les règles du code

[`tests/regles.test.js`](tests/regles.test.js) les vérifie sur les sources elles-mêmes : un test rouge, c'est une règle
enfreinte, pas un test à changer.

- Chaque module commence par un commentaire qui dit son rôle, et aucun fichier ne dépasse 200 lignes.
- Aucune couleur hors de [`site/css/palette.css`](site/css/palette.css), aucune ressource chargée d'un autre site, aucun style
  ni script écrit dans une page.
- Les textes ne s'écrivent que dans `contenu/` : un gabarit des outils n'a en dur que des balises.
- Les dépendances ne vont que dans un sens : `contenu/`, puis `outils/`.
- Rien en attente : pas de remplaçant entre crochets, pas de travail laissé « pour plus tard ».

[`tests/contenu.test.js`](tests/contenu.test.js) vérifie que chaque projet est complet, que ses teintes existent et que ses
liens sont sûrs, et que la seule adresse e-mail du site est celle de contact.

## Les dossiers

| Dossier | Ce qu'il tient |
| --- | --- |
| `contenu/` | Les textes : le site, l'interface, la personne, les projets, les pages légales. |
| `outils/pages/` | Ce qui écrit les pages de `site/` depuis le contenu (`npm run pages`). |
| `site/` | Ce qui est servi : les pages, les feuilles de style, les images, les polices et leurs licences. |
| `tests/` | Les règles, le contenu, les pages. |
| `banc/` | Le banc d'essai : chaque page sous Chromium et WebKit, sur ordinateur et téléphone, dans l'image Playwright. |
| `deploiement/` | Le conteneur, son serveur et le timer qui met `main` en ligne ([`LISEZMOI.md`](deploiement/LISEZMOI.md)). |

## Lancer en local

Il faut Node 24.

```sh
npm ci
npm test                         # les types, puis les tests
npm run pages                    # après un changement du contenu
python3 -m http.server -d site   # le site sur http://127.0.0.1:8000 (sans la CSP ni les adresses sans « .html »)
```

## Comment je l'ai construit

Ce site est le mien de bout en bout : ce qu'il dit, son allure, ses règles et son hébergement. Pour écrire le code, je travaille
avec un assistant de code, Claude Code, et les commits co-signés le montrent. Il écrit vite ; c'est moi qui pose le cadre, qui
tranche et qui vérifie.

<sub>© 2026 Mateo Sanchez, tous droits réservés : le code est public pour être lu, pas pour être réutilisé sans mon accord.
Les polices Fredoka et Nunito gardent leur licence, la SIL Open Font License 1.1 (dans
<code>site/dependances/polices/</code>).</sub>
