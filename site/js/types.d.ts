// La forme des données de la scène : l'établi et les objets qu'on y pose (site/js/modeles/), décrits pièce par pièce, et les
// réglages (site/js/reglages.js). Les longueurs sont en unités de la scène (le plateau fait 5 de long), les angles en radians.
// Vérifiée par npm run types ; le navigateur ne la lit jamais.

export type Triplet = readonly [number, number, number];

/**
 * La couleur d'une pièce : la teinte de l'objet (celle de son projet), ou une couleur de la scène (--scene-<nom>, dans
 * site/css/palette.css), éclaircie ou foncée.
 */
export interface Matiere {
  /** « teinte », ou le nom d'une couleur de la scène. */
  readonly couleur: string;
  /** Un décalage de clarté, de -1 à 1. */
  readonly clarte?: number;
  /** Un décalage de saturation, de -1 à 1. */
  readonly saturation?: number;
  /** De 0 (invisible) à 1 : une vitre. */
  readonly opacite?: number;
  /** Une pièce plate, posée sur une autre, ne porte pas d'ombre. */
  readonly sansOmbre?: boolean;
}

export type Forme =
  | { readonly forme: 'boite'; readonly taille: Triplet }
  /** Une boîte aux arêtes arrondies. */
  | { readonly forme: 'boite-arrondie'; readonly taille: Triplet; readonly rayon: number }
  /** Debout ; ses rayons en haut puis en bas. Peu de côtés en font un prisme, un rayon nul un cône. */
  | { readonly forme: 'cylindre'; readonly rayons: readonly [number, number]; readonly hauteur: number; readonly cotes: number }
  /** Debout ; sa longueur est celle de la partie droite. */
  | { readonly forme: 'capsule'; readonly rayon: number; readonly longueur: number }
  /** Un anneau, debout face à la caméra ; un arc plus court que le tour en fait une anse. */
  | { readonly forme: 'tore'; readonly rayon: number; readonly tube: number; readonly cotes: readonly [number, number]; readonly arc?: number }
  /** Une boule à facettes : 0 détail en donne vingt. */
  | { readonly forme: 'boule'; readonly rayon: number; readonly details: number }
  /** Un toit à deux pans : sa longueur (x), sa hauteur au faîte (y), sa largeur au pied (z). */
  | { readonly forme: 'prisme'; readonly taille: Triplet }
  /** Une feuille posée à plat : sa largeur (x) et sa profondeur (z). */
  | { readonly forme: 'feuille'; readonly taille: readonly [number, number] };

/** Où se pose une pièce ou un groupe, dans le repère de ce qui la porte. */
export interface Placement {
  readonly position?: Triplet;
  readonly rotation?: Triplet;
  readonly echelle?: Triplet;
}

/** Une pièce : sa forme, sa matière, sa place ; répétée, elle se pose plusieurs fois, décalée d'un même pas. */
export type Piece = Forme &
  Placement & {
    readonly matiere: Matiere;
    readonly repetition?: { readonly fois: number; readonly pas: Triplet };
  };

/** Des pièces qui bougent ensemble (un couvercle, un bras) : leur nom sert à l'ouverture et aux mouvements de repos. */
export interface Groupe extends Placement {
  readonly groupe: string;
  readonly pieces: readonly Partie[];
}

export type Partie = Piece | Groupe;

/** Ce que fait un groupe quand l'objet s'ouvre : de combien il se déplace et tourne. */
export interface Ouverture {
  readonly groupe: string;
  readonly position?: Triplet;
  readonly rotation?: Triplet;
}

/** Ce que fait un groupe au repos, sauf pour qui demande moins de mouvement : il tourne sans fin, en radians par seconde. */
export interface Mouvement {
  readonly groupe: string;
  readonly tourne: Triplet;
}

/** Un objet de l'établi. Le contenu le nomme (objet: 'platine') ; aucun objet ne sert à deux projets. */
export interface Modele {
  /** Sa place sur le plateau, depuis son centre : x vers la droite, z vers le devant ; et son orientation. */
  readonly place: { readonly x: number; readonly z: number; readonly rotation: number };
  readonly pieces: readonly Partie[];
  /** La boîte qui répond au pointeur : sa taille, et son centre depuis le pied de l'objet. Elle tient sur le plateau. */
  readonly prise: { readonly taille: Triplet; readonly centre: Triplet };
  /** Où pend son étiquette, au-dessus de son pied. */
  readonly sommet: number;
  readonly ouverture: readonly Ouverture[];
  readonly mouvements: readonly Mouvement[];
  /** La caméra qui plonge sur lui : où elle regarde (depuis son pied), à quelle distance, et depuis où (une direction). */
  readonly plongee: { readonly regard: Triplet; readonly distance: number; readonly direction: Triplet };
}

/** L'établi : la hauteur et la taille de son plateau, et ses pièces. */
export interface Etabli {
  readonly hauteur: number;
  readonly plateau: { readonly largeur: number; readonly profondeur: number };
  readonly pieces: readonly Partie[];
}
