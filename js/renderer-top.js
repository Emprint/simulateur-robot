/* ===================================================
   renderer-top.js — Dessin de la vue de dessus
   =================================================== */

const RendererTop = {
  canvas:          null,
  ctx:             null,
  dernierTimestamp: 0,

  /* État des touches/boutons maintenus enfoncés */
  mouvements: {
    avancer: false,
    reculer: false,
    gauche:  false,
    droite:  false,
  },

  init(canvasId) {
    this.canvas        = document.getElementById(canvasId);
    this.canvas.width  = Salle.largeur;
    this.canvas.height = Salle.hauteur;
    this.ctx           = this.canvas.getContext('2d');

    requestAnimationFrame((ts) => this.boucle(ts));
  },

  /* Boucle d'animation principale */
  boucle(timestamp) {
    const dt = Math.min((timestamp - this.dernierTimestamp) / 1000, 0.1); // secondes, max 100 ms
    this.dernierTimestamp = timestamp;

    this.mettreAJour(dt);
    this.dessiner();

    requestAnimationFrame((ts) => this.boucle(ts));
  },

  mettreAJour(dt) {
    const m = this.mouvements;
    const deplacementActif = m.avancer || m.reculer || m.gauche || m.droite;

    if (deplacementActif) {
      /* Rotation */
      if (m.gauche)  Robot.angle = (Robot.angle - Robot.vitesseDeg() * dt + 360) % 360;
      if (m.droite)  Robot.angle = (Robot.angle + Robot.vitesseDeg() * dt)       % 360;

      /* Déplacement */
      if (m.avancer || m.reculer) {
        Robot.enregistrerPosition();
        const dir = m.avancer ? 1 : -1;
        const rad = (Robot.angle - 90) * Math.PI / 180;
        Robot.x  += Math.cos(rad) * Robot.vitessePx() * dt * dir;
        Robot.y  += Math.sin(rad) * Robot.vitessePx() * dt * dir;

        if (Salle.corrigerPosition(Robot)) App.signalerCollision();
      }

      App.mettreAJourStatut();
    }

    /* Mise à jour de l'interpréteur de commandes */
    Interpreter.mettreAJour(dt);
  },

  /* ---- Dessin ---------------------------------------- */
  dessiner() {
    const ctx = this.ctx;

    /* Sol */
    ctx.fillStyle = Salle.couleurSol;
    ctx.fillRect(0, 0, Salle.largeur, Salle.hauteur);

    /* Grille */
    ctx.strokeStyle = Salle.couleurGrille;
    ctx.lineWidth   = 1;
    for (let x = 0; x <= Salle.largeur; x += Salle.tailleCarre) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, Salle.hauteur); ctx.stroke();
    }
    for (let y = 0; y <= Salle.hauteur; y += Salle.tailleCarre) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(Salle.largeur, y); ctx.stroke();
    }

    /* Murs (bordure) */
    ctx.strokeStyle = Salle.couleurMur;
    ctx.lineWidth   = Salle.epaisseurMur * 2;
    ctx.strokeRect(0, 0, Salle.largeur, Salle.hauteur);

    /* Trace de déplacement */
    if (Robot.trace.length > 1) {
      ctx.beginPath();
      ctx.moveTo(Robot.trace[0].x, Robot.trace[0].y);
      for (let i = 1; i < Robot.trace.length; i++) {
        ctx.lineTo(Robot.trace[i].x, Robot.trace[i].y);
      }
      ctx.strokeStyle = 'rgba(204,34,0,0.5)';
      ctx.lineWidth   = 3;
      ctx.stroke();
    }

    /* Robot */
    this.dessinerRobot(ctx);
  },

  dessinerRobot(ctx) {
    ctx.save();
    ctx.translate(Robot.x, Robot.y);
    ctx.rotate(Robot.angle * Math.PI / 180); // angle 0 = vers le haut (nord)

    /* Halo lumineux */
    ctx.shadowColor = Robot.couleur;
    ctx.shadowBlur  = 16;

    /* Corps (cercle principal) */
    ctx.beginPath();
    ctx.arc(0, 0, Robot.rayon, 0, Math.PI * 2);
    ctx.fillStyle = Robot.couleur;
    ctx.fill();
    ctx.shadowBlur = 0;

    /* Intérieur sombre */
    ctx.beginPath();
    ctx.arc(0, 0, Robot.rayon * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fill();

    /* Triangle de direction (pointe vers l'avant) */
    ctx.beginPath();
    ctx.moveTo(0,               -(Robot.rayon * 0.85));
    ctx.lineTo(-(Robot.rayon * 0.35), -(Robot.rayon * 0.22));
    ctx.lineTo( (Robot.rayon * 0.35), -(Robot.rayon * 0.22));
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();

    /* Roues (rectangles sur les côtés) */
    const lRoue = 8, hRoue = 14;
    ctx.fillStyle = '#cc2200';
    ctx.fillRect(-(Robot.rayon + lRoue),  -hRoue / 2, lRoue, hRoue);
    ctx.fillRect(  Robot.rayon,           -hRoue / 2, lRoue, hRoue);

    ctx.restore();
  },
};
