/* ===================================================
   renderer-front.js — Dessin de la vue de face
   =================================================== */

const RendererFront = {
  canvas: null,
  ctx:    null,

  /* Géométrie (pixels) */
  CX:      140,
  TETE_Y:  128,
  TETE_R:  50,
  CORPS_Y: 228,
  CORPS_W: 112,
  CORPS_H: 100,
  CORPS_R: 16,
  BRAS_Y:  178,
  BRAS_L:  68,

  init(canvasId) {
    this.canvas        = document.getElementById(canvasId);
    this.canvas.width  = 280;
    this.canvas.height = 330;
    this.ctx           = this.canvas.getContext('2d');
    requestAnimationFrame(() => this._boucle());
  },

  _boucle() {
    this.dessiner();
    requestAnimationFrame(() => this._boucle());
  },

  dessiner() {
    const ctx = this.ctx;
    const { CX, TETE_Y, TETE_R, CORPS_Y, CORPS_W, CORPS_H, CORPS_R, BRAS_Y, BRAS_L } = this;
    const W = this.canvas.width;
    const H = this.canvas.height;

    /* Fond (même couleur que la salle) */
    ctx.fillStyle = Salle.couleurSol;
    ctx.fillRect(0, 0, W, H);

    /* Roues — dessinées en premier (derrière tout le reste) */
    const roueW = 26, roueH = 64;
    const roueTop = CORPS_Y + CORPS_H / 2 - roueH + 18;
    this._dessinerRoue(ctx, CX - CORPS_W / 2 - roueW, roueTop, roueW, roueH);
    this._dessinerRoue(ctx, CX + CORPS_W / 2,          roueTop, roueW, roueH);

    /* Bras — dessinés DERRIÈRE le corps, devant les roues */
    this._dessinerBras(ctx, CX - CORPS_W / 2, BRAS_Y, RobotFace.brasGauche, -1);
    this._dessinerBras(ctx, CX + CORPS_W / 2, BRAS_Y, RobotFace.brasDroit,  +1);

    /* Corps */
    ctx.shadowColor = Robot.couleur;
    ctx.shadowBlur  = 14;
    ctx.fillStyle   = Robot.couleur;
    this._rectArrondi(ctx, CX - CORPS_W / 2, CORPS_Y - CORPS_H / 2, CORPS_W, CORPS_H, CORPS_R);
    ctx.fill();
    ctx.shadowBlur = 0;

    /* Panneau central sombre */
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    this._rectArrondi(ctx, CX - 20, CORPS_Y - 30, 40, 60, 8);
    ctx.fill();

    /* Voyant LED */
    ctx.fillStyle   = '#ffcc00';
    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur  = 8;
    ctx.beginPath();
    ctx.arc(CX, CORPS_Y + 12, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    /* Tête */
    ctx.shadowColor = Robot.couleur;
    ctx.shadowBlur  = 14;
    ctx.fillStyle   = Robot.couleur;
    ctx.beginPath();
    ctx.arc(CX, TETE_Y, TETE_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    /* Antenne */
    ctx.strokeStyle = Robot.couleur;
    ctx.lineWidth   = 4;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(CX, TETE_Y - TETE_R);
    ctx.lineTo(CX, TETE_Y - TETE_R - 20);
    ctx.stroke();

    ctx.fillStyle   = '#ffcc00';
    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur  = 10;
    ctx.beginPath();
    ctx.arc(CX, TETE_Y - TETE_R - 27, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    /* Yeux */
    this._dessinerOeil(ctx, CX - 17, TETE_Y - 7, RobotFace.oeilGauche);
    this._dessinerOeil(ctx, CX + 17, TETE_Y - 7, RobotFace.oeilDroit);

    /* Bouche (rangée de petits points) */
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    [-14, -7, 0, 7, 14].forEach(dx => {
      ctx.beginPath();
      ctx.arc(CX + dx, TETE_Y + 24, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  },

  _dessinerOeil(ctx, x, y, ouverture) {
    const rX = 14;
    const rY = Math.max(1, rX * (ouverture / 100));
    ctx.save();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x, y, rX, rY, 0, 0, Math.PI * 2);
    ctx.fill();

    if (ouverture > 5) {
      /* Pupille */
      ctx.fillStyle = '#001133';
      ctx.beginPath();
      ctx.ellipse(x, y, rX * 0.5, rY * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      /* Reflet */
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.beginPath();
      ctx.arc(x - 4, y - rY * 0.25, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },

  _dessinerBras(ctx, pivotX, pivotY, angle, dirX) {
    /* angle : -90 = bras en bas, 0 = horizontal vers le centre, +90 = bras en haut
       dirX  : +1 pour bras gauche, -1 pour bras droit */
    const rad  = angle * Math.PI / 180;
    const endX = pivotX + dirX * Math.cos(rad) * this.BRAS_L;
    const endY = pivotY - Math.sin(rad) * this.BRAS_L;

    ctx.save();
    ctx.strokeStyle = Robot.couleur;
    ctx.lineWidth   = 14;
    ctx.lineCap     = 'round';
    ctx.shadowColor = Robot.couleur;
    ctx.shadowBlur  = 10;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    /* Main */
    ctx.fillStyle   = '#009ab0';
    ctx.shadowColor = Robot.couleur;
    ctx.shadowBlur  = 6;
    ctx.beginPath();
    ctx.arc(endX, endY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  _dessinerRoue(ctx, x, y, w, h) {
    /* Rectangle avec dégradé VERTICAL pour simuler un cylindre horizontal vu de côté */
    ctx.save();

    /* Dégradé : bords sombres (haut/bas), reflet clair au centre */
    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0,    '#4a0800');
    grad.addColorStop(0.30, '#cc2200');
    grad.addColorStop(0.50, '#ff5533');
    grad.addColorStop(0.70, '#cc2200');
    grad.addColorStop(1,    '#4a0800');

    ctx.fillStyle   = grad;
    ctx.shadowColor = '#cc2200';
    ctx.shadowBlur  = 8;
    this._rectArrondi(ctx, x, y, w, h, 5);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  },

  _rectArrondi(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },
};
