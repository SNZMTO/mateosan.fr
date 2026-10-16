// La forme du contenu de mateosan.fr : ce que dit chaque fichier de contenu/, vérifié par npm run types. Une teinte est le nom
// d'une classe .teinte-<nom> de site/css/palette.css, un objet celui d'un modèle de site/js/modeles.js (tests/contenu.test.js
// le vérifie).

/** Un lien vers une autre page, sur le site ou ailleurs. */
export interface Lien {
  readonly texte: string;
  /** Une adresse en https://, ou mailto:. */
  readonly adresse: string;
}

/** Un titre et ses paragraphes. */
export interface Section {
  readonly titre: string;
  readonly paragraphes: readonly string[];
}

/** Le site lui-même : son adresse, sa langue. */
export interface Site {
  /** Le nom court, à la fin des titres d'onglet. */
  readonly nom: string;
  /** L'adresse publique, sans barre finale. */
  readonly adresse: string;
  readonly langue: string;
  /** La langue pour OpenGraph (fr_FR). */
  readonly locale: string;
  /** L'image d'un lien partagé : l'établi, que banc/partage.js dessine à cette taille. */
  readonly partage: {
    readonly image: string;
    readonly largeur: number;
    readonly hauteur: number;
    /** Ce qu'elle montre, pour qui ne la voit pas. */
    readonly description: string;
  };
}

/** Les libellés de l'interface, communs à toutes les pages. */
export interface Interface {
  /** Entre le titre d'une page et le nom du site, dans l'onglet. */
  readonly separateur: string;
  readonly retour: string;
  readonly ecrire: string;
  readonly etabli: {
    readonly titre: string;
    readonly intro: string;
    /** Sous la scène, ce qu'on peut faire de ses objets, à la souris puis au doigt. */
    readonly consigneSouris: string;
    readonly consigneDoigt: string;
  };
  readonly liensDuProjet: string;
  readonly joindre: string;
  readonly navigationLegale: string;
  readonly introuvable: { readonly titre: string; readonly description: string };
}

/** Mateo : l'en-tête de l'accueil et la page « qui je suis ». */
export interface Personne {
  readonly nom: string;
  readonly surtitre: string;
  /** La phrase des trente secondes, sans ponctuation finale. */
  readonly accroche: string;
  /** Quand l'alternance commence, avec sa préposition (« à partir de septembre 2027 ») ; absent, la phrase s'en passe. */
  readonly debut?: string;
  /** Sa durée, avec sa préposition (« pour deux ans »). */
  readonly duree?: string;
  /** Où (« à Marseille ou à distance »). */
  readonly zone?: string;
  /** Le rythme de l'alternance, qui clôt la phrase. */
  readonly rythme: string;
  /** Une phrase qui dit ce que montrent les projets. */
  readonly preuve: string;
  readonly enAnglais: Section;
  /** La carte « qui je suis » sur l'établi : sa teinte, son objet. */
  readonly teinte: string;
  readonly objet: string;
  readonly quiJeSuis: {
    readonly titre: string;
    readonly accroche: string;
    readonly sections: readonly Section[];
  };
  /** Le CV, en PDF : sa version publique, sans téléphone, qui ne donne que l'adresse de contact. */
  readonly cv: {
    readonly texte: string;
    /** Son chemin sur le site (/cv-mateo-sanchez.pdf). */
    readonly fichier: string;
    /** Le nom sous lequel il s'enregistre. */
    readonly nomDuFichier: string;
  };
  readonly contact: {
    /** La seule adresse que le site et le CV donnent : le pied de page, le bouton « M'écrire », les pages légales, le CV. */
    readonly adresse: string;
    readonly liens: readonly Lien[];
  };
}

/** Une capture d'un projet, copiée depuis son dépôt dans site/images/projets/. */
export interface Illustration {
  /** Son chemin sous site/images/projets/ (honear/piste.webp). */
  readonly fichier: string;
  /** Ce qu'elle montre, pour qui ne la voit pas (son texte alternatif). */
  readonly description: string;
  /** Ce qu'on écrit dessous, à la main. */
  readonly legende: string;
  /** D'où elle vient : le dépôt, le commit et le chemin (SNZMTO/honear@e61ec79 .github/captures/piste.webp). */
  readonly source: string;
}

/** Un projet posé sur l'établi, et sa page. */
export interface Projet {
  /** Son adresse sur le site (/honear) : des minuscules, des chiffres et des tirets. */
  readonly id: string;
  readonly titre: string;
  /** Une phrase : la carte de l'accueil, la description de sa page et de son partage. */
  readonly accroche: string;
  /** En ligne, prototype, code privé… */
  readonly etat: string;
  readonly teinte: string;
  /** Ce qui le représente sur l'établi, dans la scène en 3D : le nom d'un modèle, qui ne sert qu'à lui. */
  readonly objet: string;
  readonly resume: readonly string[];
  readonly pastilles: readonly string[];
  /** Ses captures : la première ouvre sa page, les autres suivent le résumé. */
  readonly illustrations?: readonly Illustration[];
  /** Ce qui suit le résumé : comment il est construit, ce qui vient ensuite. */
  readonly sections?: readonly Section[];
  readonly liens: readonly Lien[];
}

/** Une page légale : son corps est contenu/legal/<id>.html. */
export interface PageLegale {
  readonly id: string;
  readonly titre: string;
  readonly description: string;
}
