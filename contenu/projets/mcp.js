// Le MCP de Honear, en ligne sur mcp.honear.fr (dépôt de travail SNZMTO/honear-mcp-atelier), d'après le kit que sa session a
// écrit pour la vitrine.

/** @type {import('../types.js').Projet} */
const mcp = {
  id: 'mcp',
  titre: 'Le MCP de Honear',
  accroche:
    "Les playlists de blind test qu'aucun bac ne propose, faites par votre assistant, jouées sur honear.fr ou dans la conversation.",
  etat: 'En ligne',
  teinte: 'canard',
  objet: 'radio',
  resume: [
    "Un serveur MCP qui laisse un assistant (Claude, ChatGPT…) préparer une playlist de blind test sur n'importe quel thème, une occasion ou une capture d'écran. L'assistant choisit les titres ; le serveur les vérifie chez Deezer, écarte ce qui jouerait mal et enregistre la liste pour Honear, ou la fait jouer tout de suite dans une fenêtre de la conversation. Il n'appelle lui-même aucune IA.",
  ],
  pastilles: ['Python', 'SDK MCP', 'Pydantic', 'Docker'],
  illustrations: [
    {
      fichier: 'mcp/mini-blind-test-ecoute.webp',
      description:
        "Le mini blind test de Honear dans une conversation : le disque tourne pendant l'extrait, et une réponse vient d'être jugée juste.",
      legende: 'le mini blind test, dans la conversation',
      source: 'SNZMTO/honear-mcp-atelier@6c4e09b .github/captures/mini-blind-test-ecoute.webp',
    },
    {
      fichier: 'mcp/mini-blind-test-revelation.webp',
      description: "La révélation d'une piste : « Yellow » de Coldplay, sa pochette sur l'étiquette du disque, son anecdote et le score.",
      legende: "la révélation d'une piste",
      source: 'SNZMTO/honear-mcp-atelier@6c4e09b .github/captures/mini-blind-test-revelation.webp',
    },
  ],
  sections: [
    {
      titre: 'Ses points forts',
      paragraphes: [
        "Aucune IA payante : c'est l'assistant de la personne qui réfléchit ; le serveur vérifie, enregistre, sert et juge.",
        'Un blind test dans la conversation : une fenêtre MCP Apps aux couleurs de Honear, dont les réponses n\'atteignent jamais le modèle avant la révélation.',
        'Une seule vérité pour le jugement : celui du jeu, porté en Python et vérifié contre une table que le jeu exporte lui-même.',
        'Une architecture qui se vérifie seule : des couches et des règles de code tenues par un test, et un faux Deezer.',
        'En production, sobrement : conteneur durci, aucune adresse IP gardée, un registre RGPD, Deezer partagé avec le jeu.',
      ],
    },
    {
      titre: "Comment je l'ai construit",
      paragraphes: [
        "Je l'ai écrit avec Claude Code, phase après phase, dans le cadre que j'ai posé : le cahier de lancement, les six décisions, les règles du code, et chaque mise en ligne.",
      ],
    },
  ],
  liens: [{ texte: 'Le brancher, depuis mcp.honear.fr', adresse: 'https://mcp.honear.fr' }],
};

export default mcp;
