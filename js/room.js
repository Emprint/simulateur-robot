/* ===================================================
   room.js — Configuration de la salle
   =================================================== */

const Salle = {
  largeur:      560,
  hauteur:      400,
  epaisseurMur: 4,
  tailleCarre:  40,    // taille des carreaux de la grille

  /* Couleurs */
  couleurSol:    '#1a3352',
  couleurMur:    '#0d1b2a',
  couleurGrille: 'rgba(100,160,220,0.06)',

  /**
   * Corrige la position du robot s'il touche un mur.
   * Retourne true si une collision a eu lieu.
   */
  corrigerPosition(robot) {
    const marge = robot.rayon + this.epaisseurMur;
    let collision = false;

    if (robot.x < marge)                    { robot.x = marge;                    collision = true; }
    if (robot.x > this.largeur - marge)     { robot.x = this.largeur - marge;     collision = true; }
    if (robot.y < marge)                    { robot.y = marge;                    collision = true; }
    if (robot.y > this.hauteur - marge)     { robot.y = this.hauteur - marge;     collision = true; }

    return collision;
  },
};
