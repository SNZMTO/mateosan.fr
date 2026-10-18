// DIciELa, le jeu de chaînes de production en prototype sous Unity (dépôt SNZMTO/DIciELa).

/** @type {import('../types.js').Projet} */
const diciela = {
  id: 'diciela',
  titre: 'DIciELa',
  accroche: 'Un jeu de chaînes de production, fantasy et cozy, en prototype sous Unity.',
  etat: 'Prototype',
  teinte: 'sauge',
  objet: 'cabane',
  resume: [
    "Une clairière, un tas de bois, un peu de pierre, et la Chimère. On installe le campement, la Chimère porte les matériaux, les cabanes montent planche par planche, puis arrivent les premiers habitants, chacun avec son métier. Aujourd'hui, la première journée se joue.",
    "La simulation est du C# sans MonoBehaviour, qui ne sait pas qu'elle est dessinée. Elle est découpée en assemblages dont un test vérifie les frontières, tout son contenu est une donnée, et aucun fichier C# ne dépasse 200 lignes.",
    "Le dépôt montre aussi le cadre qui tient l'assistant de code d'une session à l'autre : des règles courtes, des procédures écrites, un garde-fou avant chaque commande, et des décisions numérotées.",
  ],
  pastilles: ['C#', 'Unity', 'Simulation testée', 'Cadre pour Claude Code'],
  illustrations: [
    {
      fichier: 'diciela/toit-et-lierre.jpg',
      description: 'Une cabane coiffée de lierre, la Chimère qui s\'affaire à côté, le bois et la pierre du campement, et la prochaine construction en fantôme.',
      legende: 'une cabane coiffée de lierre, et la Chimère au travail',
      source: 'SNZMTO/DIciELa@1c1d345 Docs/Album/2026-10-02_etape-28_toit-et-lierre.jpg',
    },
    {
      fichier: 'diciela/creation.jpg',
      description: "L'écran de création de la Chimère, dans l'atelier : la mascotte, et le panneau de ses choix (la tête, le corps, la queue, les oreilles…).",
      legende: "la Chimère, dans l'atelier",
      source: 'SNZMTO/DIciELa@1c1d345 Docs/Album/2026-10-01_etape-18a_creation-bois-brun.jpg',
    },
    {
      fichier: 'diciela/chantier.jpg',
      description: 'Un chantier à mi-hauteur, et la fiche de la cabane en dessous.',
      legende: 'une cabane qui monte',
      source: 'SNZMTO/DIciELa@1c1d345 Docs/Album/2026-10-01_etape-19_chantier-a-mi-hauteur.jpg',
    },
    {
      fichier: 'diciela/premiers-habitants.jpg',
      description: 'La cabane bâtie, le campement, la Chimère et les deux premiers habitants.',
      legende: 'les premiers habitants',
      source: 'SNZMTO/DIciELa@1c1d345 Docs/Album/2026-10-02_etape-36_premiers-habitants.jpg',
    },
  ],
  sections: [
    {
      titre: 'Comment je le construis',
      paragraphes: [
        "DIciELa, c'est mon jeu : le design, les décisions et les essais en jeu. Le C# est écrit par Claude Code, dans le cadre que montre le dépôt : je conçois, je tranche, souvent sur ses recommandations, et je vérifie en jeu. Chaque choix y est numéroté, daté et justifié, et une règle de jeu qui manque, l'assistant la demande au lieu de la deviner.",
        "Repartir de zéro quand il le faut : un premier prototype empilait deux versions de chaque chose. Je l'ai arrêté, et cette version repart d'un projet neuf, avec ce qu'il m'a appris.",
        "L'art vient d'un pack acheté sous licence, POLYGON Fantasy Village de Synty Studios : il n'est pas publié, et il faut l'avoir pour voir le jeu.",
      ],
    },
  ],
  liens: [{ texte: 'Le code sur GitHub', adresse: 'https://github.com/SNZMTO/DIciELa' }],
};

export default diciela;
