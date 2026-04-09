# Browser Games

10 Spiele im Browser — von einfach bis komplex. Jedes Spiel ist in reinem HTML, CSS und JavaScript gebaut (keine Frameworks, keine Dependencies).

## Spiele

| Nr. | Spiel | Konzepte |
|-----|-------|----------|
| [01](./01-zahlenraten/) | Zahlenraten | Variablen, Funktionen, if/else, Events |
| [02](./02-stein-schere-papier/) | Stein-Schere-Papier | Arrays, Objekte, querySelectorAll, forEach |
| [03](./03-vier-gewinnt/) | Vier Gewinnt | 2D-Arrays, verschachtelte Schleifen, Gewinnprüfung |
| [04](./04-tic-tac-toe/) | Tic-Tac-Toe | Minimax-Algorithmus, Rekursion, KI-Gegner |
| [05](./05-dame/) | Dame | Spielzustand-Management, Schlagzwang, Mehrfachsprung |
| [06](./06-snake/) | Snake | Canvas API, Game Loop (setInterval), Kollisionserkennung |
| [07](./07-pong/) | Pong | requestAnimationFrame, Physik, Ball-Reflexion |
| [08](./08-breakout/) | Breakout | Objekte in Arrays, Powerups, Partikeleffekte |
| [09](./09-flappy-bird/) | Flappy Bird | Gravitation, Parallax-Scrolling, Sprite-Animation |
| [10](./10-schach/) | Schach | Komplexe Regeln, Rochade, En Passant, Schachmatt |

## Spielen

Jedes Spiel ist eine eigenständige Webseite. Einfach die `index.html` im Browser öffnen.

## Struktur

Jedes Spiel hat drei Dateien:

```
game/
├── index.html   → HTML-Gerüst & Layout
├── style.css    → Design & Animationen
└── game.js      → Spiellogik (kommentiert & erklärt)
```

Jede `game.js` beginnt mit einem Kommentarblock der erklärt welche neuen Programmierkonzepte in diesem Spiel eingeführt werden.
