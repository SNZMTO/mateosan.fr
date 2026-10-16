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
    "La simulation est du C# pur, qui ne sait pas qu'elle est dessinée. Elle est découpée en assemblages dont un test vérifie les frontières, tout son contenu est une donnée, et aucun fichier ne dépasse 200 lignes.",
    "Le dépôt montre aussi le cadre qui tient l'assistant de code d'une session à l'autre : des règles courtes, des procédures écrites, un garde-fou avant chaque commande, et des décisions numérotées.",
  ],
  pastilles: ['C#', 'Unity', 'Simulation testée', 'Cadre pour Claude Code'],
  liens: [{ texte: 'Le code sur GitHub', adresse: 'https://github.com/SNZMTO/DIciELa' }],
};

export default diciela;
