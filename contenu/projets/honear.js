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
    "L'hôte ouvre honear.fr sur un ordinateur ou une télé, chacun rejoint le salon avec son téléphone, se fait une pochette, et devine le titre et l'artiste en trente secondes d'extrait. Les playlists viennent de Deezer : des thèmes prêts, n'importe quelle playlist publique, ou une liste faite sur mesure par un assistant, avec le MCP de Honear.",
    "Un serveur Node tient les parties, avec une seule horloge pour tous les téléphones : chacun entend et voit la même chose au même moment, et ne reçoit que ce qu'il a le droit de savoir. Tout ce qu'on voit, du meuble hi-fi aux pochettes des joueurs, est dessiné par le code, en low-poly ; seules les pochettes des albums viennent de Deezer.",
    "Le code est en TypeScript strict, découpé en couches, et des tests vérifient l'architecture elle-même. Le jeu tourne dans un conteneur Docker durci, et les comptes des joueurs ont leur registre RGPD.",
  ],
  pastilles: ['TypeScript strict', 'Node et WebSocket', 'Docker durci', 'RGPD'],
  illustrations: [
    {
      fichier: 'honear/piste.webp',
      description: 'Une piste en cours : la platine tourne, les pochettes des joueurs devant, le disque mystère à droite.',
      legende: 'une piste en cours, sur l\'écran de la tablée',
      source: 'SNZMTO/honear@e61ec79 .github/captures/piste.webp',
    },
    {
      fichier: 'honear/accueil.webp',
      description: "L'accueil de honear.fr : le bac des thèmes, la platine, l'ampli, et le bouton « On pose un disque ? ».",
      legende: "l'accueil, sur honear.fr",
      source: 'SNZMTO/honear@e61ec79 .github/captures/accueil.webp',
    },
    {
      fichier: 'honear/revelation.webp',
      description: 'La révélation : le titre, « Les Démons de minuit », sur le disque, et les points gagnés sous la pochette de chaque joueur.',
      legende: 'la révélation et les points',
      source: 'SNZMTO/honear@e61ec79 .github/captures/revelation.webp',
    },
  ],
  sections: [
    {
      titre: "Comment je l'ai construit",
      paragraphes: [
        "Honear est mon projet de bout en bout : l'idée, le meuble et son style, le découpage en couches, les règles du code, la sécurité et l'hébergement. Claude Code en a écrit l'essentiel du code et des tests, et les commits co-signés le montrent. Moi, je pose le cadre, je fixe les règles que les tests vérifient, et je tranche.",
        "Le jeu est passé par sept étapes, chacune validée sur des planches avant la suivante, jusqu'à un prototype jouable contre un serveur simulé. Chaque règle d'architecture est un test, si bien que le code ne peut pas dériver sans que ça se voie. Et il s'essaie sur de vrais téléphones : plusieurs bugs ne se voyaient que sur iPhone.",
      ],
    },
  ],
  liens: [
    { texte: 'Jouer sur honear.fr', adresse: 'https://honear.fr' },
    { texte: 'Le code sur GitHub', adresse: 'https://github.com/SNZMTO/honear' },
  ],
};

export default honear;
