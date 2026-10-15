#!/bin/sh
# Lance un script du banc dans l'image Playwright du VPS (Chromium et WebKit), contre site/ servi comme en ligne (banc/serveur.js).
#   sh banc/lancer.sh regard.js     chaque page sur ordinateur et téléphone ; les captures vont dans banc/sortie/
#   sh banc/lancer.sh icones.js     l'icône d'écran d'accueil, tirée de la favicon
# Le VPS sert aussi Honear : le banc ne part que si personne ne joue, et prend 1,5 cœur au plus.
set -eu
RACINE="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$RACINE/banc/${1:-}" ] || { echo "Quel script du banc ? (regard.js, icones.js)"; exit 1; }
curl -fsS --max-time 10 https://honear.fr/sante | grep -q '"telephones":0' || {
  echo "Des téléphones jouent à Honear : le banc attend que la partie soit finie."
  exit 1
}
mkdir -p "$RACINE/banc/sortie"
exec sudo -n docker run --rm --name "mateosan-banc-$$" --memory=1500m --cpus=1.5 --shm-size=512m \
  --user "$(id -u):$(id -g)" -e HOME=/tmp -v "$RACINE":/depot -w /depot \
  mcr.microsoft.com/playwright:v1.63.0-noble node "banc/$1"
