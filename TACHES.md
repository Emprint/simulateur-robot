# 📋 Simulateur de Robot — Liste des Tâches

> Suivi d'avancement du projet. Mettre ✅ devant une tâche quand elle est terminée.

---

## ✅ Phase 1 — Structure de base
- [x] Créer `index.html` (squelette HTML avec les zones : vue dessus, contrôles, console)
- [x] Créer `style.css` (mise en page, thème, responsive)
- [x] Créer `app.js` (initialisation générale)
- [x] Créer `robot.js` (état du robot : position, angle, vitesse)
- [x] Créer `room.js` (configuration de la salle : taille, obstacles)

## ✅ Phase 2 — Vue de dessus (Canvas)
- [x] Dessiner la salle rectangulaire sur un Canvas 2D
- [x] Dessiner le robot (cercle + triangle de direction)
- [x] Animer le déplacement du robot (fluide)
- [x] Détecter les collisions avec les murs
- [x] Afficher la trace de déplacement au sol (rouge)

## ✅ Phase 3 — Boutons de contrôle
- [x] Boutons directionnels : Avancer, Reculer, Tourner Gauche, Tourner Droite
- [x] Bouton Arrêter
- [x] Slider de vitesse (0 à 100%)
- [x] Contrôle au clavier (touches fléchées)
- [x] Retour visuel sur les boutons actifs (appui maintenu)

## ✅ Phase 4 — Console de commandes
- [x] Zone de saisie multi-lignes (textarea)
- [x] Bouton "Exécuter"
- [x] Console de sortie (affichage logs, erreurs, résultats) avec hauteur max et ascenseur
- [x] Historique des commandes (navigable avec flèche haut/bas)

## ✅ Phase 5 — Interpréteur de commandes
- [x] Parser du langage de commandes robot
- [x] Commandes de base : `avancer(n)`, `reculer(n)`, `tourner_gauche(angle)`, `tourner_droite(angle)`, `arreter()`
- [x] Commandes avancées : `vitesse(n)`, `attendre(ms)`, `repeter(N) { ... }`
- [x] Gestion des erreurs (commande inconnue, paramètre manquant)
- [x] Exécution séquentielle avec animations

## ✅ Phase 6 — Vue de face du robot
- [x] Panneau / Canvas secondaire pour la vue de face
- [x] Dessin du robot de face (corps, roues cylindriques rouges, tête collée au corps)
- [x] Yeux animés : `oeil_gauche(v)`, `oeil_droit(v)`, `cligner()`
- [x] Bras avec angle : `bras_gauche(angle)`, `bras_droit(angle)` (-90=bas, 0=horizontal, +90=haut)
- [x] Bouche (rangée de points), voyant LED, antenne

## 🔲 Phase 7 — Fonctionnalités avancées
- [ ] Ajouter des obstacles dans la salle (murs intérieurs, boîtes)
- [ ] Capteur de distance simulé (sonar frontal)
- [ ] Import/export de programmes robot (fichier .txt ou .robot)
- [ ] Mode pas-à-pas avec contrôle de vitesse d'exécution

## 🔲 Phase 8 — Compatibilité micro-contrôleur
- [ ] Documentation complète du langage de commandes
- [ ] Bibliothèque Arduino/ESP32 avec les mêmes fonctions
- [ ] Guide de connexion simulateur ↔ vrai robot (USB série / Wi-Fi)
- [ ] (Optionnel) Connexion en temps réel via WebSocket ou port série Web

---

## 📝 Langage de commandes implémenté

```
avancer(100)           // avance de 100 unités
reculer(50)            // recule
tourner_gauche(90)     // pivote de 90° à gauche
tourner_droite(45)     // pivote à droite
arreter()              // stoppe le robot
vitesse(75)            // règle la vitesse (0-100)
attendre(1000)         // pause de 1000 ms
repeter(3) {           // répète 3 fois
  avancer(100)
  tourner_droite(90)
}
oeil_gauche(100)       // ouvre l'oeil gauche (0=fermé, 100=ouvert)
oeil_droit(0)          // ferme l'oeil droit
cligner()              // clignement des deux yeux
bras_gauche(45)        // lève le bras gauche à 45° (-90=bas, +90=haut)
bras_droit(-90)        // bras droit en bas
```

---

## 🗓️ Ordre d'implémentation

1. ✅ **Phase 1** (base) → **Phase 2** (vue dessus) → **Phase 3** (boutons)
2. ✅ **Phase 4** (console) → **Phase 5** (interpréteur)
3. ✅ **Phase 6** (vue de face)
4. 🔲 **Phase 7** → **Phase 8** (avancé + micro-contrôleur)
