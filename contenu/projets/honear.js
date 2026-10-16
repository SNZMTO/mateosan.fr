// Honear, le blind test multijoueur en ligne sur honear.fr (dépôt SNZMTO/honear).

/** @type {import('../types.js').Projet} */
const honear = {
  id: 'honear',
  titre: 'Honear',
  accroche: 'Un blind test multijoueur, en ligne : un écran pour la tablée, un téléphone chacun.',
  etat: 'En ligne',
  teinte: 'moutarde',
  objet: 'platine',
  resume: [
    "L'hôte ouvre honear.fr sur un ordinateur ou une télé, chacun rejoint le salon avec son téléphone, se fait une pochette, et devine le titre et l'artiste en trente secondes d'extrait. Les playlists viennent de Deezer ou de Spotify.",
    "Un serveur Node tient les parties, avec une seule horloge pour tous les téléphones : chacun entend et voit la même chose au même moment, et ne reçoit que ce qu'il a le droit de savoir. Tout ce qu'on voit, du meuble hi-fi aux pochettes, est dessiné par le code, en low-poly.",
    "Le code est en TypeScript strict, découpé en couches, et des tests vérifient l'architecture elle-même. Le jeu tourne dans un conteneur Docker durci, et les comptes des joueurs ont leur registre RGPD.",
  ],
  pastilles: ['TypeScript strict', 'Node et WebSocket', 'Docker durci', 'RGPD'],
  liens: [
    { texte: 'Jouer sur honear.fr', adresse: 'https://honear.fr' },
    { texte: 'Le code sur GitHub', adresse: 'https://github.com/SNZMTO/honear' },
  ],
};

export default honear;
