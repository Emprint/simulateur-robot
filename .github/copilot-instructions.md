# Instructions Copilot — Simulateur de Robot

## Contexte du projet
Application web **vanilla** (HTML + CSS + JavaScript, sans framework, sans installation, sans build).
L'utilisateur ouvre `index.html` directement dans son navigateur.

L'utilisateur **ne connaît pas la programmation** — toutes les explications doivent être en **français**, claires et accessibles.

## Objectif
Simuler un robot à roues (Arduino/ESP32) :
- Vue de dessus : salle rectangulaire, déplacement animé, trace rouge
- Vue de face : yeux, bras, roues cylindriques
- Console de commandes texte interprétée (même langage que le micro-contrôleur)

## Architecture (ordre de chargement critique — pas d'ES modules)
```
robot.js → robot-face.js → room.js → renderer-top.js → renderer-front.js → interpreter.js → controls.js → app.js
```

## Conventions de code
- **Tout en français** : commentaires, labels UI, messages d'erreur, noms de variables explicites
- Pas de `import`/`export`, pas de `class` — objets littéraux (`const Robot = { ... }`)
- `const` partout sauf nécessité de `let`
- Commentaires courts, uniquement là où c'est utile

## Langage de commandes robot
```
avancer(100)        reculer(50)
tourner_gauche(90)  tourner_droite(45)
arreter()           vitesse(50)
oeil_gauche(v)      oeil_droit(v)   // v = 0–100 (% ouverture)
bras_gauche(angle)  bras_droit(angle) // -90=bas, 0=horizontal, +90=haut
cligner()           attendre(ms)
repeter(N) { ... }
```

## État actuel (phases complétées)
- ✅ Phase 1–5 : structure, vue dessus, contrôles, console, interpréteur
- ✅ Phase 6 : vue de face (yeux, bras animés, roues cylindriques avec dégradé)
- 🔲 Phase 7 : obstacles, capteurs simulés, import/export
- 🔲 Phase 8 : compatibilité micro-contrôleur (Arduino/ESP32)

## Points techniques importants
- Rotation dessin robot : `ctx.rotate(Robot.angle * Math.PI / 180)` (sans offset -90)
- Physique mouvement : `(Robot.angle - 90)` pour le bon quadrant trigonométrique
- Roues vue face : rectangles avec `createLinearGradient` horizontal + coins arrondis
- Bras : `endX = pivotX + dirX * cos(rad) * L`, `endY = pivotY - sin(rad) * L`
  - Bras gauche : `dirX = -1` (s'ouvre vers la gauche)
  - Bras droit : `dirX = +1` (s'ouvre vers la droite)
- Log console : `height: 160px; max-height: 160px; overflow-y: auto`
- Couleur roues/trace vue dessus : `#cc2200` / `rgba(204,34,0,0.5)`
