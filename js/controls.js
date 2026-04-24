/* ===================================================
   controls.js — Boutons et clavier
   =================================================== */

const Controls = {
  init() {
    /* Boutons directionnels (maintien du clic) */
    this.initBoutonMaintenu('btn-avancer', 'avancer');
    this.initBoutonMaintenu('btn-reculer', 'reculer');
    this.initBoutonMaintenu('btn-gauche',  'gauche');
    this.initBoutonMaintenu('btn-droite',  'droite');

    /* Bouton Stop */
    document.getElementById('btn-arreter').addEventListener('click', () => {
      this.toutArreter();
    });

    /* Bouton Réinitialiser */
    document.getElementById('btn-reinitialiser').addEventListener('click', () => {
      Interpreter.arreter();
      this.toutArreter();
      Robot.reinitialiser(Salle);
      RobotFace.reinitialiser();
      App.mettreAJourFace();
      App.mettreAJourStatut();
      App.log('🔄 Robot réinitialisé au centre.', 'info');
    });

    /* Slider vitesse */
    const slider = document.getElementById('slider-vitesse');
    slider.addEventListener('input', () => {
      Robot.vitesse = parseInt(slider.value);
      document.getElementById('valeur-vitesse').textContent = Robot.vitesse + '%';
      App.mettreAJourStatut();
    });

    /* Console — Exécuter */
    document.getElementById('btn-executer').addEventListener('click', () => {
      const texte = document.getElementById('zone-saisie').value.trim();
      if (!texte) { App.log('⚠️ Zone vide.', 'avertissement'); return; }
      Interpreter.executer(texte);
    });

    /* Console — Arrêter l'exécution */
    document.getElementById('btn-arreter-exec').addEventListener('click', () => {
      Interpreter.arreter();
      App.log('⏹ Exécution interrompue.', 'avertissement');
    });

    /* Console — Effacer la saisie */
    document.getElementById('btn-effacer').addEventListener('click', () => {
      document.getElementById('zone-saisie').value = '';
    });

    /* Journal — Vider */
    document.getElementById('btn-vider-log').addEventListener('click', () => {
      document.getElementById('log-console').innerHTML = '';
    });

    /* Exécuter aussi avec Ctrl+Entrée dans la zone de saisie */
    document.getElementById('zone-saisie').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        document.getElementById('btn-executer').click();
      }
    });

    /* Clavier — touches fléchées */
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      switch (e.key) {
        case 'ArrowUp':    e.preventDefault(); this.activer('avancer'); break;
        case 'ArrowDown':  e.preventDefault(); this.activer('reculer'); break;
        case 'ArrowLeft':  e.preventDefault(); this.activer('gauche');  break;
        case 'ArrowRight': e.preventDefault(); this.activer('droite');  break;
        case ' ':          e.preventDefault(); this.toutArreter();      break;
      }
    });

    document.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowUp':    this.desactiver('avancer'); break;
        case 'ArrowDown':  this.desactiver('reculer'); break;
        case 'ArrowLeft':  this.desactiver('gauche');  break;
        case 'ArrowRight': this.desactiver('droite');  break;
      }
    });
  },

  /* Gère un bouton avec comportement "maintenu" (souris + tactile) */
  initBoutonMaintenu(id, direction) {
    const btn = document.getElementById(id);
    btn.addEventListener('mousedown',  () => this.activer(direction));
    btn.addEventListener('mouseup',    () => this.desactiver(direction));
    btn.addEventListener('mouseleave', () => this.desactiver(direction));
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); this.activer(direction); });
    btn.addEventListener('touchend',   (e) => { e.preventDefault(); this.desactiver(direction); });
  },

  activer(direction) {
    RendererTop.mouvements[direction] = true;
    document.getElementById(this._idBouton(direction))?.classList.add('actif');
  },

  desactiver(direction) {
    RendererTop.mouvements[direction] = false;
    document.getElementById(this._idBouton(direction))?.classList.remove('actif');
  },

  toutArreter() {
    ['avancer', 'reculer', 'gauche', 'droite'].forEach(d => this.desactiver(d));
  },

  _idBouton(direction) {
    return { avancer: 'btn-avancer', reculer: 'btn-reculer', gauche: 'btn-gauche', droite: 'btn-droite' }[direction];
  },
};
