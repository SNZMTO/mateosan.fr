// Mateo : l'en-tête de l'accueil (ce qu'un recruteur retient en trente secondes) et la page « qui je suis ».

/** @type {import('./types.js').Personne} */
const personne = {
  nom: 'Mateo Sanchez',
  surtitre: "L'Établi",
  accroche: 'Étudiant à 42 Marseille, je cherche une alternance de développeur, côté data, IA ou full-stack',
  debut: "à partir d'avril 2027",
  duree: 'pour deux ans',
  rythme: "deux semaines en entreprise, une semaine à l'école",
  preuve:
    "Mes projets sont tenus par leurs tests, et Honear, mon blind test multijoueur, se joue en ligne sur un serveur que j'administre.",
  enAnglais: {
    titre: 'In English',
    paragraphes: [
      "I'm a student at 42 Marseille, looking for a two-year apprenticeship as a developer (data, AI or full-stack), starting in April 2027: two weeks at the company, one week at school. My projects are held together by their tests, and Honear, my multiplayer music quiz, runs online on a server I administer. This site and the projects are in French; each project's page links to its code.",
    ],
  },
  teinte: 'noyer',
  objet: 'carte-de-visite',
  quiJeSuis: {
    titre: 'Qui je suis',
    accroche: "Passé par la vente avant le code : j'aime autant expliquer un outil que l'écrire.",
    sections: [
      {
        titre: "L'alternance que je cherche",
        paragraphes: [
          "Plutôt une petite équipe qu'un grand groupe : une équipe où ce que je livre sert dès les premières semaines, et avec qui j'aurais envie de continuer après l'alternance.",
        ],
      },
      {
        titre: 'Ma formation',
        paragraphes: [
          "Le tronc commun du cursus 42 Next, que j'aurai fini pour mon entrée en alternance.",
          "Ensuite, en alternance, le titre RNCP de niveau 6 « Concepteur développeur de solutions informatiques », option Développement d'application web et mobile (niveau Bac+3).",
        ],
      },
      {
        titre: 'Comment je travaille',
        paragraphes: [
          "À 42, tout se fait à la main : du C et du Python, sans assistant. Chaque projet est corrigé par d'autres étudiants, qui me font expliquer mon code.",
          "Sur mes projets personnels, je conçois, je découpe le code en couches, j'écris les règles et les tests qui les verrouillent, et j'utilise Claude Code pour écrire plus vite. Je relis, j'essaie sur de vrais appareils, et je tranche. Chaque projet dit qui a fait quoi.",
        ],
      },
      {
        titre: 'Hors code',
        paragraphes: [
          "J'adore voyager, et je lis beaucoup de fantasy et de science-fiction. Mes trois sagas préférées : Dungeon Crawler Carl, Red Rising et Shadow Slave.",
        ],
      },
    ],
  },
  contact: {
    adresse: 'contact@mateosan.fr',
    liens: [
      { texte: 'LinkedIn', adresse: 'https://www.linkedin.com/in/mat%C3%A9o-sanchez-2607883a0' },
      { texte: 'GitHub', adresse: 'https://github.com/SNZMTO' },
    ],
  },
};

export default personne;
