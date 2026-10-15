// Le homelab : le VPS durci qui héberge ce site et Honear (dépôt SNZMTO/homelab).

/** @type {import('../types.js').Projet} */
const homelab = {
  id: 'homelab',
  titre: 'Le homelab',
  accroche: 'Un vrai serveur exposé à internet, durci pas à pas, qui héberge ce site et Honear.',
  etat: 'En ligne',
  teinte: 'orange',
  resume: [
    "Un VPS chez OVH, sous Debian, scanné par des robots dès sa mise en ligne. Chaque protection répond à ce que montrent ses journaux : SSH par clé seulement et sans root, un pare-feu qui refuse tout par défaut, fail2ban et ses bannissements progressifs, les mises à jour de sécurité automatiques.",
    "Les sites tournent dans des conteneurs Docker sans droits, derrière un frontal Caddy qui tient le HTTPS. Ce site se met en ligne seul : le serveur tire chaque nouveau commit de GitHub, le pose à côté de la version en ligne et bascule d'un coup, sans accès entrant ni secret sur la machine.",
    'Chaque étape est notée dans le dépôt, avec ses commandes, ses pièges et ses raisons.',
  ],
  pastilles: ['Debian', 'Docker', 'Caddy', 'Déploiement continu'],
  liens: [{ texte: 'Le journal sur GitHub', adresse: 'https://github.com/SNZMTO/homelab' }],
};

export default homelab;
