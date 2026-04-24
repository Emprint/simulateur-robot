/* ===================================================
   robot.js — État et logique du robot
   =================================================== */

const Robot = {
  x:       0,
  y:       0,
  angle:   0,      // degrés, 0 = vers le haut
  vitesse: 50,     // pourcentage 1-100
  rayon:   18,     // rayon en pixels sur le canvas
  couleur: '#00d4ff',
  trace:   [],     // historique des positions (pour tracer le chemin)
  maxTrace: 300,

  reinitialiser(salle) {
    this.x     = salle.largeur / 2;
    this.y     = salle.hauteur / 2;
    this.angle = 0;
    this.trace = [];
  },

  /* Vitesse de déplacement en pixels/seconde */
  vitessePx() {
    return (this.vitesse / 100) * 250;
  },

  /* Vitesse de rotation en degrés/seconde */
  vitesseDeg() {
    return (this.vitesse / 100) * 200;
  },

  /* Enregistre la position courante dans la trace */
  enregistrerPosition() {
    this.trace.push({ x: this.x, y: this.y });
    if (this.trace.length > this.maxTrace) this.trace.shift();
  },
};
