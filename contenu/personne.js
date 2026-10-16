// Mateo : l'en-tête de l'accueil (ce qu'un recruteur retient en trente secondes) et la page « qui je suis ».

/** @type {import('./types.js').Personne} */
const personne = {
  nom: 'Mateo Sanchez',
  surtitre: "L'Établi",
  accroche: "Étudiant à 42 Marseille, je cherche une alternance de développeur, côté full-stack ou IA, autour d'Aix-Marseille",
  debut: "à partir d'avril 2027",
  duree: 'pour deux ans',
  rythme: "deux semaines en entreprise, une semaine à l'école",
  preuve:
    "Mes projets sont tenus par leurs tests, et Honear, mon blind test multijoueur, se joue en ligne sur un serveur que j'administre.",
  enAnglais: {
    titre: 'In English',
    paragraphes: [
      "I'm a student at 42 Marseille, looking for a two-year apprenticeship as a full-stack or AI developer around Aix-Marseille, starting in April 2027: two weeks at the company, one week at school. My projects are held together by their tests, and Honear, my multiplayer music quiz, runs online on a server I administer. This site and the projects are in French; each personal project's page links to its code (42's school projects stay private, and I'm happy to show them in an interview).",
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
          "Le tronc commun de 42, commencé en novembre 2025, que j'aurai fini pour mon entrée en alternance.",
          "Ensuite, en alternance, le titre RNCP de niveau 6 « Concepteur développeur de solutions informatiques » (RNCP 39783), option Développement d'application web et mobile (niveau Bac+3).",
        ],
      },
      {
        titre: 'Comment je travaille',
        paragraphes: [
          "À 42, tout se fait à la main : du C et du Python, sans assistant. Chaque projet est corrigé par d'autres étudiants, qui me font expliquer mon code.",
          "Sur mes projets personnels, Claude Code écrit l'essentiel du code et des tests. Moi, je conçois, je découpe en couches, je fixe les règles que les tests vérifient, je tranche (souvent sur ses recommandations, et c'est noté dans les décisions) et j'essaie sur de vrais appareils. Chaque projet le dit, et ses commits sont co-signés.",
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
  cv: { texte: 'Mon CV (PDF)', fichier: '/cv-mateo-sanchez.pdf', nomDuFichier: 'CV Mateo Sanchez.pdf' },
  contact: {
    adresse: 'sanchezmateo@proton.me',
    liens: [
      { texte: 'LinkedIn', adresse: 'https://www.linkedin.com/in/mat%C3%A9o-sanchez-2607883a0' },
      { texte: 'GitHub', adresse: 'https://github.com/SNZMTO' },
    ],
  },
};

export default personne;
