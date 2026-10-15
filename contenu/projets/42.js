// Les projets de 42, dont le code reste privé, et les deux game jams.

/** @type {import('../types.js').Projet} */
const ecole42 = {
  id: '42',
  titre: '42 et les game jams',
  accroche: "Les projets de l'école, en C, en Python et en système, et deux jeux faits en équipe.",
  etat: 'Code privé',
  teinte: 'corail',
  resume: [
    "À 42, on apprend projet après projet, sans cours ni professeurs. Tout s'écrit à la main, sans assistant, et chaque projet est corrigé par d'autres étudiants, qui font expliquer son code.",
    'En C : libft, ft_printf, get_next_line et push_swap. En Python : onze projets, des bases du langage à un Pac-Man jouable, en binôme. En système : Born2beRoot, Net_Practice et Inception. Le code de ces projets reste privé.',
    'En game jam, en équipe de quatre, sur GameMaker : Masquarade, un bal masqué entre quatre duchés, à la Global Game Jam 2026 ; et Sueurs chaudes, un robot mécanicien dans une usine steampunk, à la Jam Academy 2026.',
  ],
  pastilles: ['C', 'Python', 'Linux', 'GameMaker'],
  liens: [
    { texte: 'Sueurs chaudes sur itch.io', adresse: 'https://masalvad.itch.io/sueurs-chaudes' },
    { texte: 'La liste sur GitHub', adresse: 'https://github.com/SNZMTO' },
  ],
};

export default ecole42;
