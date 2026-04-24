/* ===================================================
   app.js — Initialisation et fonctions globales
   =================================================== */

const App = {
  _collisionTimeout: null,

  init() {
    Robot.reinitialiser(Salle);
    RendererTop.init('canvas-dessus');
    RendererFront.init('canvas-face');
    Controls.init();
    this.initFace();
    this.mettreAJourStatut();
  },

  /* Met à jour l'affichage de l'état du robot dans l'en-tête */
  mettreAJourStatut() {
    document.getElementById('info-position').textContent =
      `X: ${Math.round(Robot.x - Salle.largeur / 2)} | Y: ${Math.round(Salle.hauteur / 2 - Robot.y)}`;
    document.getElementById('info-angle').textContent =
      `Angle: ${Math.round(Robot.angle)}°`;
    document.getElementById('info-vitesse').textContent =
      `Vitesse: ${Robot.vitesse}%`;
    document.getElementById('slider-vitesse').value = Robot.vitesse;
    document.getElementById('valeur-vitesse').textContent = Robot.vitesse + '%';
  },

  /* Ajoute une ligne dans le journal */
  log(message, type = 'info') {
    const journal = document.getElementById('log-console');
    const ligne   = document.createElement('div');
    ligne.className  = `log-${type}`;
    const heure      = new Date().toLocaleTimeString('fr-FR');
    ligne.textContent = `[${heure}] ${message}`;
    journal.appendChild(ligne);
    journal.scrollTop = journal.scrollHeight;

    /* Limiter à 150 lignes */
    while (journal.children.length > 150) journal.removeChild(journal.firstChild);
  },

  /* Affiche brièvement le message de collision */
  signalerCollision() {
    const msg = document.getElementById('message-collision');
    msg.classList.add('visible');
    clearTimeout(this._collisionTimeout);
    this._collisionTimeout = setTimeout(() => msg.classList.remove('visible'), 1500);
  },

  /* Active/désactive les boutons de la console selon l'état d'exécution */
  mettreAJourBoutonsConsole(enExecution) {
    document.getElementById('btn-executer').disabled    =  enExecution;
    document.getElementById('btn-arreter-exec').disabled = !enExecution;
  },

  /* Initialise les contrôles de la vue de face */
  initFace() {
    document.getElementById('btn-cligner').addEventListener('click', () => this._cligner());

    document.getElementById('btn-oeil-g-ouvert').addEventListener('click', () => { RobotFace.oeilGauche = 100; });
    document.getElementById('btn-oeil-g-ferme').addEventListener('click',  () => { RobotFace.oeilGauche = 0;   });
    document.getElementById('btn-oeil-d-ouvert').addEventListener('click', () => { RobotFace.oeilDroit  = 100; });
    document.getElementById('btn-oeil-d-ferme').addEventListener('click',  () => { RobotFace.oeilDroit  = 0;   });

    const sliderG = document.getElementById('slider-bras-gauche');
    sliderG.addEventListener('input', () => {
      RobotFace.brasGauche = parseInt(sliderG.value);
      document.getElementById('valeur-bras-gauche').textContent = sliderG.value + '°';
    });

    const sliderD = document.getElementById('slider-bras-droit');
    sliderD.addEventListener('input', () => {
      RobotFace.brasDroit = parseInt(sliderD.value);
      document.getElementById('valeur-bras-droit').textContent = sliderD.value + '°';
    });
  },

  /* Synchronise les sliders bras avec l'état RobotFace (ex: après réinitialisation) */
  mettreAJourFace() {
    const sliderG = document.getElementById('slider-bras-gauche');
    const sliderD = document.getElementById('slider-bras-droit');
    sliderG.value = RobotFace.brasGauche;
    sliderD.value = RobotFace.brasDroit;
    document.getElementById('valeur-bras-gauche').textContent = Math.round(RobotFace.brasGauche) + '°';
    document.getElementById('valeur-bras-droit').textContent  = Math.round(RobotFace.brasDroit)  + '°';
  },

  /* Animation de clignement déclenchée par le bouton */
  _cligner() {
    const oG  = RobotFace.oeilGauche;
    const oD  = RobotFace.oeilDroit;
    const dur = 300;
    let debut = null;
    const tick = (ts) => {
      if (!debut) debut = ts;
      const t  = ts - debut;
      const mi = dur / 2;
      if (t < mi) {
        const ratio = 1 - (t / mi);
        RobotFace.oeilGauche = oG * ratio;
        RobotFace.oeilDroit  = oD * ratio;
      } else if (t < dur) {
        const ratio = (t - mi) / mi;
        RobotFace.oeilGauche = 100 * Math.min(ratio, 1);
        RobotFace.oeilDroit  = 100 * Math.min(ratio, 1);
      } else {
        RobotFace.oeilGauche = 100;
        RobotFace.oeilDroit  = 100;
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },
};

window.addEventListener('DOMContentLoaded', () => App.init());
