// Les nombres de réglage de la scène et de la page, tous ici : la caméra, les lumières, le rendu, les ressorts du survol, les
// durées. Les tailles et les places des objets sont dans leurs modèles (site/js/modeles/).

export const reglages = {
  camera: {
    /** Le champ vertical, en degrés. */
    champ: 33,
    proche: 0.1,
    loin: 60,
    /** Le point regardé au repos, au-dessus du centre du plateau. */
    regard: /** @type {const} */ ([0, 0.95, 0]),
    /** D'où elle regarde : de face, plongeant d'une vingtaine de degrés ; et de combien près, au plus. */
    direction: /** @type {const} */ ([0, 0.316, 0.949]),
    distance: 6.6,
    /** La demi-largeur qui doit tenir dans le cadre, l'établi et ses objets compris : un écran étroit recule la caméra. */
    demiLargeur: 3.05,
  },

  lumieres: {
    ciel: 0.46,
    soleil: {
      intensite: 0.72,
      position: /** @type {const} */ ([-5.5, 9, 4.5]),
      /** Le cadre de l'ombre portée : ses côtés, sa profondeur, la finesse de sa carte, ses biais. */
      ombre: { demiLargeur: 4.6, demiHauteur: 4.5, proche: 2, loin: 22, carte: 1024, biais: -0.0004, biaisNormal: 0.05 },
    },
    appoint: { intensite: 0.22, position: /** @type {const} */ ([4.5, 3, -3.5]) },
  },

  sol: {
    /** Le plan qui reçoit l'ombre de l'établi : sa taille, la force de l'ombre. */
    taille: /** @type {const} */ ([40, 26]),
    ombre: 0.26,
    /** Le halo sombre sous l'établi : sa taille, sa force au centre, sa finesse (en pixels de côté), sa hauteur. */
    halo: { taille: /** @type {const} */ ([8.2, 4.8]), force: 0.42, finesse: 64, hauteur: 0.006 },
  },

  rendu: {
    /** Les paliers du rendu en aplats (de 0 à 255) : de l'ombre à la pleine lumière. */
    paliers: [112, 168, 216, 255],
    /** La densité de pixels au plus, sur un grand écran et sur un petit. */
    densite: 2,
    densitePetitEcran: 1.5,
    /** En deçà de cette largeur ou de cette hauteur (en pixels), l'écran est petit. */
    petitEcran: 760,
  },

  formes: {
    /**
     * Le biseau d'une boîte arrondie : au plus, et au plus cette part de sa hauteur ; ses segments, ceux des coins ; le plus
     * petit rayon d'un coin, et ce qu'il laisse de droit à chaque côté.
     */
    biseau: { max: 0.03, part: 0.28, segments: 2, coins: 4, rayonMin: 0.004, marge: 0.002 },
    /** Les segments des bouts d'une capsule, et ses côtés. */
    capsule: { bouts: 3, cotes: 8 },
  },

  survol: {
    /** L'élan donné à un objet qu'on survole, ou qu'on touche. */
    elan: 2.4,
    elanToucher: 2,
    /** De combien il monte et grossit tant qu'on le survole. */
    hauteur: 0.05,
    echelle: 1.05,
    /** Les ressorts qui le ramènent : raideur et amortissement, pour la hauteur puis pour la taille. */
    raideur: 120,
    amorti: 9.5,
    raideurEchelle: 150,
    amortiEchelle: 11,
    /** Ce qu'il garde de sa vitesse quand il retombe sur le plateau. */
    rebond: 0.3,
    /** L'étiquette pend un peu au-dessus de son sommet. */
    etiquette: 0.12,
  },

  /** La caméra qui plonge sur un objet avant d'ouvrir son panneau, et qui revient quand il se ferme : en secondes. */
  plongee: { duree: 1.05, retour: 0.9 },

  /** La caméra suit un peu la souris : jusqu'où, et avec quel retard. */
  parallaxe: { x: 0.52, y: 0.3, limite: 1.5, lissage: 0.06 },

  /** Le pas des ressorts d'une image à l'autre, en secondes : borné, pour qu'une image lente ne les fasse pas sauter. */
  pas: { min: 0.001, max: 0.033 },
};
