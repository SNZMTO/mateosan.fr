#!/bin/sh
# Met en ligne le dernier commit de SNZMTO/mateosan.fr (branche main), s'il ne l'est pas déjà : le lit sur GitHub sans compte (le
# dépôt est public : aucun secret sur le VPS), pose son dossier site/ tel quel à côté de la version en ligne, puis bascule d'un
# coup. Il n'y a rien à construire : les pages sont écrites et vérifiées avant le commit. Les trois dernières versions restent.
# Lancé toutes les deux minutes par mateosan-publier.timer, en tant que mateosan, qui n'écrit que là ; il n'exécute rien de ce
# qu'il lit sur GitHub.
#
#   sudo systemctl start mateosan-publier          (sans attendre le timer)
#   journalctl -u mateosan-publier -n 20           (ce qu'il a fait)
set -eu
ADRESSE=https://github.com/SNZMTO/mateosan.fr.git
DEPOT=/var/lib/mateosan/depot.git
PUBLIE=/srv/mateosan/publie
refus() { echo "$*" >&2; exit 1; }

[ -d "$DEPOT" ] || git init --quiet --bare "$DEPOT"
git -C "$DEPOT" fetch --quiet --no-tags "$ADRESSE" +refs/heads/main:refs/heads/main
VERSION="$(git -C "$DEPOT" rev-parse --short=12 main)"
[ "$(readlink "$PUBLIE/actuel" 2>/dev/null || true)" != "versions/$VERSION" ] || exit 0

if [ ! -d "$PUBLIE/versions/$VERSION" ]; then
  TRAVAIL="$(mktemp -d)"
  trap 'rm -rf "$TRAVAIL"' EXIT
  git -C "$DEPOT" archive main site | tar -x -C "$TRAVAIL"
  # Un commit cassé ne passe pas : la version d'avant reste en ligne.
  [ -f "$TRAVAIL/site/index.html" ] || refus "Le commit $VERSION n'a pas de site/index.html."
  # Un lien symbolique ferait servir un fichier hors du site : aucun n'est accepté.
  [ -z "$(find "$TRAVAIL/site" -type l)" ] || refus "Le commit $VERSION contient un lien symbolique dans site/."
  mkdir -p "$PUBLIE/versions"
  cp -R "$TRAVAIL/site" "$PUBLIE/versions/$VERSION.nouveau"
  mv "$PUBLIE/versions/$VERSION.nouveau" "$PUBLIE/versions/$VERSION"
fi
# La bascule : un lien qu'on remplace d'un coup ; le serveur lit la nouvelle version dès la requête suivante.
ln -sfn "versions/$VERSION" "$PUBLIE/actuel.nouveau"
mv -T "$PUBLIE/actuel.nouveau" "$PUBLIE/actuel"
touch "$PUBLIE/versions/$VERSION"
echo "En ligne : $VERSION"

# Le ménage : les trois dernières versions restent.
ls -1t "$PUBLIE/versions" | tail -n +4 | while read -r ancienne; do
  rm -rf "${PUBLIE:?}/versions/$ancienne"
done
