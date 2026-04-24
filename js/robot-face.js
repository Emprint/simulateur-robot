/* ===================================================
   robot-face.js — État de la vue de face du robot
   =================================================== */

const RobotFace = {
  oeilGauche: 100,  // 0 = fermé, 100 = grand ouvert
  oeilDroit:  100,
  brasGauche: -90,  // -90 = en bas, 0 = horizontal, +90 = en haut
  brasDroit:  -90,

  reinitialiser() {
    this.oeilGauche = 100;
    this.oeilDroit  = 100;
    this.brasGauche = -90;
    this.brasDroit  = -90;
  },
};
