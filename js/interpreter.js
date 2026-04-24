/* ===================================================
   interpreter.js — Interpréteur du langage de commandes
   =================================================== */

const Interpreter = {
  fileCommandes:       [],   // commandes en attente
  commandeEnCours:     null,
  progressionDistance: 0,
  progressionAngle:    0,
  progressionTemps:    0,
  enExecution:         false,
  progressionBras:     0,
  brasDepart:          0,
  _oeilGaucheDepart:   100,
  _oeilDroitDepart:    100,

  /* --- Table des commandes reconnues ----------------- */
  commandes: {
    'avancer':        (args) => ({ type: 'avancer',        distance: Number(args[0]) || 0 }),
    'reculer':        (args) => ({ type: 'reculer',        distance: Number(args[0]) || 0 }),
    'tourner_gauche': (args) => ({ type: 'tourner_gauche', angle:    Number(args[0]) || 0 }),
    'tourner_droite': (args) => ({ type: 'tourner_droite', angle:    Number(args[0]) || 0 }),
    'arreter':        ()     => ({ type: 'arreter' }),
    'vitesse':        (args) => ({ type: 'vitesse',        valeur: Math.max(1, Math.min(100, Number(args[0]) || 50)) }),
    'attendre':       (args) => ({ type: 'attendre',       ms:     Number(args[0]) || 0 }),
    /* --- Vue de face --- */
    'oeil_gauche': (args) => ({ type: 'oeil_gauche', valeur: args.length ? Math.max(0, Math.min(100, Number(args[0]) || 0)) : 100 }),
    'oeil_droit':  (args) => ({ type: 'oeil_droit',  valeur: args.length ? Math.max(0, Math.min(100, Number(args[0]) || 0)) : 100 }),
    'bras_gauche': (args) => ({ type: 'bras_gauche', angle:  Math.max(-90, Math.min(90, Number(args[0]) || 0)) }),
    'bras_droit':  (args) => ({ type: 'bras_droit',  angle:  Math.max(-90, Math.min(90, Number(args[0]) || 0)) }),
    'cligner':     ()     => ({ type: 'cligner' }),
  },

  /* --- Parseur ---------------------------------------- */
  parser(texte) {
    const lignes  = texte.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
    const resultat = [];
    let i = 0;

    while (i < lignes.length) {
      const ligne = lignes[i];

      /* repeter(N) { ... } */
      const matchRep = ligne.match(/^repeter\s*\(\s*(\d+)\s*\)\s*\{?$/);
      if (matchRep) {
        const n    = parseInt(matchRep[1]);
        const corps = [];
        i++;
        if (i < lignes.length && lignes[i] === '{') i++; // accolade sur ligne séparée
        while (i < lignes.length && !lignes[i].match(/^\s*\}/)) {
          const cmd = this.parserLigne(lignes[i]);
          if (cmd) corps.push(cmd);
          i++;
        }
        for (let k = 0; k < n; k++) {
          resultat.push(...corps.map(c => ({ ...c })));
        }
        i++;
        continue;
      }

      const cmd = this.parserLigne(ligne);
      if (cmd) resultat.push(cmd);
      i++;
    }
    return resultat;
  },

  parserLigne(ligne) {
    if (!ligne) return null;
    const match = ligne.match(/^([a-zA-Z_]\w*)\s*\(\s*(.*?)\s*\)$/);
    if (!match) {
      App.log(`⚠️ Ligne non reconnue : "${ligne}"`, 'avertissement');
      return null;
    }
    const nom  = match[1].toLowerCase();
    const args = match[2] ? match[2].split(',').map(a => a.trim()) : [];

    if (!this.commandes[nom]) {
      App.log(`❌ Commande inconnue : "${nom}"`, 'erreur');
      return null;
    }
    return this.commandes[nom](args);
  },

  /* --- Exécution ------------------------------------- */
  executer(texte) {
    this.arreter();
    const cmds = this.parser(texte);
    if (cmds.length === 0) {
      App.log('⚠️ Aucune commande valide trouvée.', 'avertissement');
      return;
    }
    this.fileCommandes = cmds;
    this.enExecution   = true;
    App.log(`▶ Exécution de ${cmds.length} commande(s)…`, 'info');
    App.mettreAJourBoutonsConsole(true);
    this.debuterProchaine();
  },

  arreter() {
    this.fileCommandes   = [];
    this.commandeEnCours = null;
    this.enExecution     = false;
    this.progressionBras = 0;
    App.mettreAJourBoutonsConsole(false);
  },

  debuterProchaine() {
    if (this.fileCommandes.length === 0) {
      App.log('✅ Programme terminé.', 'succes');
      this.arreter();
      return;
    }
    this.commandeEnCours     = this.fileCommandes.shift();
    this.progressionDistance = 0;
    this.progressionAngle    = 0;
    this.progressionTemps    = 0;

    const cmd = this.commandeEnCours;

    /* Commandes instantanées */
    if (cmd.type === 'arreter') {
      App.log('⏹ Arrêt.', 'commande');
      this.commandeEnCours = null;
      this.debuterProchaine();
    } else if (cmd.type === 'vitesse') {
      Robot.vitesse = cmd.valeur;
      App.mettreAJourStatut();
      App.log(`⚡ Vitesse → ${cmd.valeur}%`, 'commande');
      this.commandeEnCours = null;
      this.debuterProchaine();
    } else if (cmd.type === 'oeil_gauche') {
      RobotFace.oeilGauche = cmd.valeur;
      App.log(`👁 oeil_gauche(${cmd.valeur})`, 'commande');
      this.commandeEnCours = null;
      this.debuterProchaine();
    } else if (cmd.type === 'oeil_droit') {
      RobotFace.oeilDroit = cmd.valeur;
      App.log(`👁 oeil_droit(${cmd.valeur})`, 'commande');
      this.commandeEnCours = null;
      this.debuterProchaine();
    } else {
      /* Commandes animées : initialisation de l'état et log */
      if (cmd.type === 'bras_gauche') {
        this.brasDepart      = RobotFace.brasGauche;
        this.progressionBras = 0;
        App.log(`💪 bras_gauche(${cmd.angle}°)`, 'commande');
      } else if (cmd.type === 'bras_droit') {
        this.brasDepart      = RobotFace.brasDroit;
        this.progressionBras = 0;
        App.log(`💪 bras_droit(${cmd.angle}°)`, 'commande');
      } else if (cmd.type === 'cligner') {
        this._oeilGaucheDepart = RobotFace.oeilGauche;
        this._oeilDroitDepart  = RobotFace.oeilDroit;
        App.log('😉 cligner()', 'commande');
      } else {
        const labels = {
          avancer:        `→ avancer(${cmd.distance})`,
          reculer:        `← reculer(${cmd.distance})`,
          tourner_gauche: `↺ tourner_gauche(${cmd.angle}°)`,
          tourner_droite: `↻ tourner_droite(${cmd.angle}°)`,
          attendre:       `⏳ attendre(${cmd.ms} ms)`,
        };
        App.log(labels[cmd.type] || cmd.type, 'commande');
      }
    }
  },

  /* Appelé à chaque frame par le renderer */
  mettreAJour(dt) {
    if (!this.enExecution || !this.commandeEnCours) return;

    const cmd       = this.commandeEnCours;
    const vitessePx = Robot.vitessePx();
    const vitesseDeg = Robot.vitesseDeg();

    if (cmd.type === 'avancer' || cmd.type === 'reculer') {
      const dir      = cmd.type === 'avancer' ? 1 : -1;
      const restant  = cmd.distance - this.progressionDistance;
      const step     = Math.min(vitessePx * dt, restant);

      Robot.enregistrerPosition();
      const rad = (Robot.angle - 90) * Math.PI / 180;
      Robot.x  += Math.cos(rad) * step * dir;
      Robot.y  += Math.sin(rad) * step * dir;

      if (Salle.corrigerPosition(Robot)) App.signalerCollision();

      this.progressionDistance += step;
      App.mettreAJourStatut();

      if (this.progressionDistance >= cmd.distance) {
        this.commandeEnCours = null;
        this.debuterProchaine();
      }

    } else if (cmd.type === 'tourner_gauche' || cmd.type === 'tourner_droite') {
      const dir     = cmd.type === 'tourner_gauche' ? -1 : 1;
      const restant = cmd.angle - this.progressionAngle;
      const step    = Math.min(vitesseDeg * dt, restant);

      Robot.angle = (Robot.angle + step * dir + 360) % 360;
      this.progressionAngle += step;
      App.mettreAJourStatut();

      if (this.progressionAngle >= cmd.angle) {
        this.commandeEnCours = null;
        this.debuterProchaine();
      }

    } else if (cmd.type === 'attendre') {
      this.progressionTemps += dt * 1000;
      if (this.progressionTemps >= cmd.ms) {
        this.commandeEnCours = null;
        this.debuterProchaine();
      }
    } else if (cmd.type === 'bras_gauche' || cmd.type === 'bras_droit') {
      const cible  = cmd.angle;
      const depart = this.brasDepart;
      const total  = Math.abs(cible - depart);

      if (total < 0.5) {
        if (cmd.type === 'bras_gauche') RobotFace.brasGauche = cible;
        else                            RobotFace.brasDroit  = cible;
        this.commandeEnCours = null;
        this.debuterProchaine();
        return;
      }

      const dir  = cible >= depart ? 1 : -1;
      const step = Math.min(Robot.vitesseDeg() * dt, total - this.progressionBras);
      this.progressionBras += step;
      const val  = depart + this.progressionBras * dir;
      if (cmd.type === 'bras_gauche') RobotFace.brasGauche = val;
      else                            RobotFace.brasDroit  = val;

      if (this.progressionBras >= total) {
        if (cmd.type === 'bras_gauche') RobotFace.brasGauche = cible;
        else                            RobotFace.brasDroit  = cible;
        this.commandeEnCours = null;
        this.debuterProchaine();
      }
    } else if (cmd.type === 'cligner') {
      this.progressionTemps += dt * 1000;
      const duree = 300; // ms total : 150 fermeture + 150 ouverture
      const mi    = duree / 2;
      const t     = this.progressionTemps;

      if (t < mi) {
        const ratio = 1 - (t / mi);
        RobotFace.oeilGauche = this._oeilGaucheDepart * ratio;
        RobotFace.oeilDroit  = this._oeilDroitDepart  * ratio;
      } else {
        const ratio = Math.min((t - mi) / mi, 1);
        RobotFace.oeilGauche = 100 * ratio;
        RobotFace.oeilDroit  = 100 * ratio;
      }

      if (t >= duree) {
        RobotFace.oeilGauche = 100;
        RobotFace.oeilDroit  = 100;
        this.commandeEnCours = null;
        this.debuterProchaine();
      }
    }
  },
};
