# Simulateur de Robot — Instructions pour l'assistant IA

## Contexte
Application web **vanilla** (HTML + CSS + JavaScript pur, sans framework, sans installation).
L'utilisateur ouvre `index.html` directement dans un navigateur — aucun serveur requis.

L'utilisateur **ne connaît pas la programmation** — toutes les explications doivent être en **français**, claires et accessibles.

## Objectif du projet
Simuler un robot à roues (destiné à un Arduino/ESP32) :
- **Vue de dessus** : salle rectangulaire, déplacement animé, trace rouge au sol
- **Vue de face** : yeux, bras, roues cylindriques rouges
- **Console de commandes** : interpréteur du même langage que le micro-contrôleur

## Architecture des fichiers (ordre de chargement critique — pas d'ES modules)
```
index.html
style.css
js/
  robot.js          → état du robot (position, angle, vitesse, couleur)
  robot-face.js     → état vue de face (yeux, bras)
  room.js           → configuration de la salle
  renderer-top.js   → dessin vue dessus + boucle principale RAF
  renderer-front.js → dessin vue de face + boucle RAF indépendante
  interpreter.js    → parser et exécuteur de commandes (le plus complexe)
  controls.js       → boutons, clavier, sliders
  app.js            → initialisation de tous les modules
```
⚠️ L'ordre des balises `<script>` dans `index.html` est critique. Ne pas utiliser `import`/`export`.

## Conventions de code
- **Tout en français** : commentaires, labels UI, messages d'erreur, noms de variables
- Objets littéraux (`const Robot = { ... }`) — pas de `class`
- `const` partout sauf nécessité de `let`
- Commentaires courts, uniquement là où c'est utile

## Langage de commandes robot (déjà implémenté)
```
avancer(100)           reculer(50)
tourner_gauche(90)     tourner_droite(45)
arreter()              vitesse(50)
attendre(1000)
repeter(N) { ... }
oeil_gauche(v)         oeil_droit(v)    // v = 0–100 (% ouverture)
bras_gauche(angle)     bras_droit(angle) // -90=bas, 0=horizontal, +90=haut
cligner()
```

## Points techniques importants
- **Rotation dessin robot** : `ctx.rotate(Robot.angle * Math.PI / 180)` (sans offset)
- **Physique mouvement** : `(Robot.angle - 90)` pour le bon quadrant trigonométrique
- **Roues vue face** : rectangles avec `createLinearGradient` **vertical** + coins arrondis (5px)
  - Z-order : roues → bras → corps → tête
- **Bras** : `endX = pivotX + dirX * cos(rad) * L`, `endY = pivotY - sin(rad) * L`
  - Bras gauche `dirX = -1` (vers gauche), bras droit `dirX = +1` (vers droite)
- **Log console** : `height: 160px; max-height: 160px; overflow-y: auto`
- **Couleurs roues/trace vue dessus** : `#cc2200` / `rgba(204,34,0,0.5)`
- **Interpréteur** : une seule commande animée à la fois, état remis à zéro dans `arreter()`

## État d'avancement — voir TACHES.md
- ✅ Phases 1 à 6 terminées
- 🔲 Phase 7 : obstacles, capteur de distance simulé, import/export de programmes
- 🔲 Phase 8 : compatibilité Arduino/ESP32
