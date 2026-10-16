# mateosan.fr sur le VPS

Le site vit sur le VPS OVH, à côté d'autres sites (honear.fr). La machine durcie et le frontal Caddy, partagés, sont dans le dépôt
`vps` (`~/vps` sur le VPS) ; ce dossier-ci ne tient que ce qui est propre à mateosan.fr.

```
contenu/ ──npm run pages──▶ site/ ──commit, push sur main──▶ GitHub ──toutes les 2 min──▶ /srv/mateosan/publie/actuel
                                                                                              ▲ conteneur « mateosan »
                                         internet ──HTTPS──▶ frontal (Caddy, dépôt vps) ──────┘ réseau « mateosan »
```

## Ce qui est en ligne

- **Le site** est le dossier `site/` du dernier commit de `main`, tel quel : des pages HTML écrites depuis `contenu/` avant le
  commit (et vérifiées par les tests), leurs feuilles de style, les scripts de l'établi en 3D, leurs images, leurs polices et
  three.js. Il n'y a rien à construire sur le
  VPS. Le site ne charge rien d'ailleurs : aucun visiteur ne donne son adresse IP à un tiers, et la page « Confidentialité »
  peut le dire.
- **Le conteneur** sert le site : le Caddy du frontal, sans capacité, en tant que `nobody`, en lecture seule, sans port publié.
  Il pose la politique de sécurité du contenu (CSP) du site, sans `'unsafe-inline'` ni `'unsafe-eval'` : aucune page n'écrit de
  style ni de script en ligne. Le frontal tient le HTTPS et les en-têtes de sécurité communs.
- **Le déploiement** : le VPS tire, rien ne pousse vers lui. Le timer `mateosan-publier` regarde GitHub toutes les deux minutes,
  en tant que `mateosan` (sans shell ni droits, qui n'écrit que dans son dépôt et dans le site), pose le nouveau `site/` à côté
  de la version en ligne et bascule d'un coup. Il n'exécute rien de ce qu'il lit sur GitHub : son outil, `publier.sh`, est posé
  par `mettre-en-ligne.sh`. Un commit sans `site/index.html`, ou avec un lien symbolique, ne passe pas : la version d'avant
  reste en ligne.

## Au quotidien

Un push sur `main` est en ligne dans les deux minutes : on travaille sur une branche, et `main` ne la reçoit qu'une fois
validée.

- **Si la publication ne vient pas** : `journalctl -u mateosan-publier -n 20` sur le VPS dit pourquoi.
- **Revenir en arrière** : `git revert` du commit fautif, puis pousser.

## Sur le VPS

| Fichier | Rôle |
| --- | --- |
| `mettre-en-ligne.sh` | `sudo sh deploiement/mettre-en-ligne.sh` : la première fois, et après chaque changement de ce dossier (commité et poussé). |
| `publier.sh`, `systemd/` | Le timer et ce qu'il fait ; posés dans `/usr/local/lib/mateosan` et `/etc/systemd/system`. |
| `Dockerfile`, `compose.yaml`, `Caddyfile` | Le conteneur et son serveur ; posés dans `/srv/mateosan`. Le banc d'essai lit la même CSP. |

- `systemctl list-timers mateosan-publier` : le prochain passage ; `sudo systemctl start mateosan-publier` : tout de suite.
- `sudo docker compose --project-directory /srv/mateosan ps` : l'état du conteneur.
- `ls -l /srv/mateosan/publie` : la version en ligne (`actuel`) et les deux d'avant.
