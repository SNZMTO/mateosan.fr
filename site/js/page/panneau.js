// Le panneau : la page d'un objet, ouverte par-dessus l'accueil sans le quitter. Il lit cette page (celle qu'on ouvre aussi
// sans la scène), en prend le retour et le contenu, et les montre dans une fenêtre modale : le focus y entre et y reste, Échap
// ou le lien du retour la ferment. Son allure est dans site/css/panneau.css.

export class Panneau {
  /** @param {() => void} quandIlSeFerme Le panneau s'est fermé, quelle qu'en soit la raison. */
  constructor(quandIlSeFerme) {
    this.fenetre = document.createElement('dialog');
    this.fenetre.className = 'panneau';
    this.titreDeLAccueil = document.title;
    document.body.append(this.fenetre);
    this.fenetre.addEventListener('click', (evenement) => {
      const lien = evenement.target instanceof Element ? evenement.target.closest('a') : null;
      if (lien?.getAttribute('href') !== '/') return;
      evenement.preventDefault();
      this.fermer();
    });
    this.fenetre.addEventListener('close', () => {
      document.title = this.titreDeLAccueil;
      quandIlSeFerme();
    });
  }

  get ouvert() {
    return this.fenetre.open;
  }

  /**
   * Lit la page d'un objet et l'ouvre ; échoue si la page ne vient pas.
   * @param {string} adresse Son chemin sur le site (/honear).
   */
  async ouvrir(adresse) {
    const reponse = await fetch(adresse);
    if (!reponse.ok) throw new Error(`${adresse} : ${reponse.status}`);
    const page = new DOMParser().parseFromString(await reponse.text(), 'text/html');
    const parties = [page.querySelector('.retour'), page.querySelector('main')].flatMap((partie) => (partie === null ? [] : [partie]));
    this.fenetre.replaceChildren(...parties.map((partie) => document.importNode(partie, true)));
    const titre = this.fenetre.querySelector('h1');
    if (titre !== null) {
      titre.id = 'titre-du-panneau';
      this.fenetre.setAttribute('aria-labelledby', titre.id);
    }
    document.title = page.title;
    this.fenetre.showModal();
    this.fenetre.scrollTop = 0;
  }

  fermer() {
    if (this.fenetre.open) this.fenetre.close();
  }
}
