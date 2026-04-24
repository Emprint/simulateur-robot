# 🤖 Simulateur de Robot

Application web interactive pour simuler un robot à roues, conçue pour tester le code d'un micro-contrôleur (Arduino / ESP32) avant de le déployer sur le vrai robot.

**👉 [Ouvrir le simulateur](https://emprint.github.io/simulateur-robot/)**

---

## Fonctionnalités

- **Vue de dessus** : salle rectangulaire, déplacement animé du robot, trace rouge au sol
- **Vue de face** : yeux animés, bras articulés, roues cylindriques
- **Boutons de contrôle** : avancer, reculer, tourner, vitesse
- **Console de commandes** : écrire et exécuter un programme robot

## Utilisation

Aucune installation nécessaire. Téléchargez le dossier et ouvrez `index.html` dans votre navigateur.

## Langage de commandes

```
avancer(100)           // avance de 100 unités
reculer(50)            // recule
tourner_gauche(90)     // pivote de 90° à gauche
tourner_droite(45)     // pivote à droite
arreter()              // stoppe le robot
vitesse(75)            // règle la vitesse (0–100)
attendre(1000)         // pause de 1000 ms
repeter(3) {           // répète 3 fois
  avancer(100)
  tourner_droite(90)
}
oeil_gauche(100)       // ouvre l'œil gauche (0=fermé, 100=ouvert)
cligner()              // clignement des yeux
bras_gauche(90)        // lève le bras gauche (-90=bas, 0=horizontal, +90=haut)
```

## Avancement

Voir [TACHES.md](TACHES.md) pour le suivi détaillé.

| Phase | Description | État |
|-------|-------------|------|
| 1 | Structure de base | ✅ |
| 2 | Vue de dessus (Canvas) | ✅ |
| 3 | Boutons de contrôle | ✅ |
| 4 | Console de commandes | ✅ |
| 5 | Interpréteur de commandes | ✅ |
| 6 | Vue de face du robot | ✅ |
| 7 | Fonctionnalités avancées | 🔲 |
| 8 | Compatibilité micro-contrôleur | 🔲 |
