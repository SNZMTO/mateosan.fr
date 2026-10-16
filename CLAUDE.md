# mateosan.fr, pour Claude

La vitrine des projets de Mateo, qui cherche une alternance de développeur (data, IA ou full-stack) : c'est ce qu'un recruteur
ouvre en premier. Le contenu vit dans `contenu/`, les pages en sont tirées dans `site/`, servi tel quel sur le VPS partagé
(`~/vps`, ses règles d'abord). On écrit en français, le code aussi (noms, commentaires, textes).

## Où lire

- `README.md` : le projet, ses dossiers, ses règles.
- `deploiement/LISEZMOI.md` : la mise en ligne, le conteneur, le timer.

## Commandes

```
npm ci                       # les outils (typescript, playwright sans navigateurs)
npm run pages                # site/*.html depuis contenu/ : à relancer après chaque changement du contenu ou d'outils/pages
npm test                     # les types, puis les règles, le contenu et les pages
sh banc/lancer.sh regard.js  # chaque page sous Chromium et WebKit, ordinateur et téléphone ; captures dans banc/sortie/
sh banc/lancer.sh icones.js  # site/images/apple-touch-icon.png, depuis la favicon
sh banc/lancer.sh partage.js # site/images/partage.png, l'image de partage : à relancer quand la scène change
```

## Les règles

`tests/` les vérifie : un test rouge, c'est une règle enfreinte, pas un test à changer.

- Les textes sont dans `contenu/`, nulle part ailleurs ; les pages de `site/` ne se retouchent jamais à la main.
- Les couleurs sont dans `site/css/palette.css`. Aucune ressource ne vient d'un autre site ; aucun style ni script en ligne.
- Chaque module commence par un commentaire qui dit son rôle ; aucun fichier de plus de 200 lignes.
- Les dépendances ne vont que dans un sens : `contenu/`, puis `outils/` ; dans `site/js/`, le socle (réglages, modèles), puis
  `scene/` et `page/`, puis `demarrage.js`. Pas de remplaçant, pas de « temporaire », pas de TODO.
- Une capture de projet se copie depuis son dépôt dans `site/images/projets/<id>/`, telle quelle, avec sa source dans le
  contenu ; jamais depuis un dépôt privé sans l'accord de Mateo.
- La scène lit tout dans la page et la palette : un objet est un fichier de données de `site/js/modeles/`, un nombre de réglage
  va dans `site/js/reglages.js`. three.js reste en 0.149.0 (le rendu de la scène d'origine) : on n'en change qu'avec une raison.

## Mettre en ligne

Un push sur `main` est en ligne dans les deux minutes : on travaille sur une branche, `main` ne la reçoit que quand Mateo a
validé. Un changement de `deploiement/` se pose avec `sudo sh deploiement/mettre-en-ligne.sh`, commité et poussé d'abord.
Créer un dépôt ou pousser vers GitHub : demander d'abord.

## Le VPS partagé

- Le frontal de `~/vps` appartient à la session du MCP de Honear : pour y toucher, le lui demander (`SendMessage`).
- Le banc d'essai tourne sur les deux cœurs du jeu en ligne : prévenir les autres sessions avant, et seulement quand
  `curl -s https://honear.fr/sante` dit `"telephones":0` (`banc/lancer.sh` le vérifie).
- Au début de chaque tour, `sh ~/vps/depots/synchroniser.sh` ; en fin de tour, pousser la branche.

## Comment Mateo veut qu'on travaille

- Un avis sincère, une option recommandée et son coût en une ligne ; avant un changement structurant, un plan court et son
  accord.
- 4 heures par tour au plus ; une seule passe de vérification (tests, types, un regard au banc) ; ni sous-agents ni workflows
  sans son accord ; pas de mesures de performance. Un outil qui bloque : s'arrêter et le dire.
- Les commits : en français, une phrase de titre qui dit ce qui change pour qui s'en sert, puis des puces ; auteur
  `Mateo Sanchez <221996800+SNZMTO@users.noreply.github.com>`.
- Le compte rendu : court. Ce qui est fait, ce qui est tranché (une ligne chacun), ce qui reste.
