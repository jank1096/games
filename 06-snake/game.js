/*
  Snake — Der Klassiker!

  Neue Konzepte:

  - CANVAS & 2D-KONTEXT:
    ==========================================
    <canvas> ist ein HTML-Element zum Zeichnen.
    ctx = canvas.getContext('2d') gibt uns den "Pinsel".

    Damit können wir:
    ctx.fillRect(x, y, breite, höhe)  → Rechteck zeichnen
    ctx.arc(x, y, radius, 0, 2*PI)   → Kreis zeichnen
    ctx.fillStyle = '#ff0000'         → Farbe setzen

  - GAME LOOP mit setInterval():
    ==========================================
    setInterval(funktion, millisekunden) ruft eine Funktion
    immer wieder auf — z.B. alle 130ms.
    Das erzeugt die Spielschleife: update → draw → update → draw...

    Je kleiner die Zahl, desto schneller das Spiel.
    Wir starten bei 130ms und werden bei jedem Essen schneller (bis 60ms).

  - SCHLANGE ALS ARRAY:
    ==========================================
    Die Schlange ist ein Array von {x, y}-Objekten.
    snake[0] = Kopf, snake[snake.length-1] = Schwanz.

    Bewegung:
    1. Neuen Kopf vorne einfügen (unshift)
    2. Letztes Segment hinten entfernen (pop)
    → Die Schlange "kriecht" über das Feld!

    Beim Essen: pop() wird übersprungen → Schlange wird länger.

  - KOLLISIONSERKENNUNG:
    ==========================================
    Wand: Kopf außerhalb des Grids? → Game Over
    Selbst: Kopf auf einem eigenen Segment? → Game Over
    Essen: Kopf auf dem Essen? → Punkt + wachsen

  - RICHTUNGSPUFFER (nextDirection):
    ==========================================
    Problem: Wenn der Spieler schneller tippt als das Spiel updatet,
    könnte die Schlange sich in sich selbst drehen (z.B. rechts → links).
    Lösung: Wir speichern die NÄCHSTE Richtung und wenden sie erst
    beim nächsten Update an. So wird immer nur ein Richtungswechsel pro Frame verarbeitet.
*/

(function () {
    // ===== SCHRITT 1: HTML-Elemente & Canvas holen =====
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');       // 2D-Zeichenkontext ("der Pinsel")
    const scoreEl = document.getElementById('score');
    const highscoreEl = document.getElementById('highscore');
    const overlay = document.getElementById('overlay');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayMessage = document.getElementById('overlayMessage');

    // ===== SCHRITT 2: Spielfeld-Konstanten =====
    const GRID = 20;                          // 20x20 Felder
    const TILE = canvas.width / GRID;         // Pixelgröße pro Feld

    // ===== SCHRITT 3: Spielvariablen =====
    let snake;              // Array von {x,y}-Segmenten — die Schlange
    let direction;          // Aktuelle Richtung {x,y} — z.B. {x:1, y:0} = rechts
    let nextDirection;      // Gepufferte nächste Richtung (verhindert 180°-Drehung)
    let food;               // Position des Essens {x,y}
    let score;              // Aktuelle Punkte
    let highscore;          // Bester Score (wird in localStorage gespeichert)
    let speed;              // Millisekunden pro Update (kleiner = schneller)
    let gameLoop;           // Referenz auf setInterval (zum Stoppen)
    let running;            // Läuft das Spiel gerade?

    // Highscore aus dem Browser-Speicher laden (oder 0 wenn keiner existiert)
    highscore = parseInt(localStorage.getItem('snakeHighscore')) || 0;
    highscoreEl.textContent = highscore;

    // ===== SCHRITT 4: Spiel initialisieren =====
    function init() {
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        score = 0;
        speed = 130;
        scoreEl.textContent = score;
        placeFood();
    }

    // Essen auf ein zufälliges freies Feld setzen
    function placeFood() {
        let pos;
        do {
            pos = {
                x: Math.floor(Math.random() * GRID),
                y: Math.floor(Math.random() * GRID)
            };
        } while (snake.some(s => s.x === pos.x && s.y === pos.y));
        food = pos;
    }

    // ===== SCHRITT 5: Spiellogik (wird jeden Frame aufgerufen) =====
    function update() {
        // Gepufferte Richtung übernehmen
        direction = nextDirection;

        // Neuen Kopf berechnen (alten Kopf + Richtung)
        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        // Wandkollision
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
            return gameOver();
        }

        // Selbstkollision
        if (snake.some(s => s.x === head.x && s.y === head.y)) {
            return gameOver();
        }

        // Neuen Kopf vorne einfügen
        snake.unshift(head);

        // Essen gefressen? → Punkte, neues Essen, schneller werden
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreEl.textContent = score;
            placeFood();
            // Schneller werden
            if (speed > 60) {
                speed -= 2;
            }
            clearInterval(gameLoop);
            gameLoop = setInterval(update, speed);
        } else {
            // Kein Essen → letztes Segment entfernen (Schlange bewegt sich)
            snake.pop();
        }

        draw();
    }

    // ===== SCHRITT 6: Zeichnen (Canvas) =====
    function draw() {
        // Hintergrund
        ctx.fillStyle = '#0f0f23';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gitter (subtil)
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < GRID; i++) {
            ctx.beginPath();
            ctx.moveTo(i * TILE, 0);
            ctx.lineTo(i * TILE, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * TILE);
            ctx.lineTo(canvas.width, i * TILE);
            ctx.stroke();
        }

        // Schlange
        snake.forEach(function (seg, i) {
            const ratio = 1 - i / snake.length;
            const green = Math.floor(180 + 75 * ratio);
            ctx.fillStyle = 'rgb(0,' + green + ',80)';
            ctx.shadowColor = i === 0 ? 'rgba(0,255,136,0.6)' : 'transparent';
            ctx.shadowBlur = i === 0 ? 10 : 0;
            roundRect(ctx, seg.x * TILE + 1, seg.y * TILE + 1, TILE - 2, TILE - 2, 4);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Augen auf dem Kopf
        var head = snake[0];
        ctx.fillStyle = '#fff';
        var eyeSize = 3;
        var eyeOffsetX = direction.x === 0 ? 5 : (direction.x > 0 ? 11 : 3);
        var eyeOffsetY = direction.y === 0 ? 5 : (direction.y > 0 ? 11 : 3);

        if (direction.x !== 0) {
            ctx.beginPath();
            ctx.arc(head.x * TILE + eyeOffsetX, head.y * TILE + 6, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(head.x * TILE + eyeOffsetX, head.y * TILE + 14, eyeSize, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(head.x * TILE + 6, head.y * TILE + eyeOffsetY, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(head.x * TILE + 14, head.y * TILE + eyeOffsetY, eyeSize, 0, Math.PI * 2);
            ctx.fill();
        }

        // Essen
        ctx.shadowColor = 'rgba(255,50,50,0.7)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(food.x * TILE + TILE / 2, food.y * TILE + TILE / 2, TILE / 2 - 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // Hilfsfunktion: Rechteck mit abgerundeten Ecken zeichnen
    function roundRect(ctx, x, y, w, h, r) {
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
    }

    // ===== SCHRITT 7: Game Over =====
    function gameOver() {
        running = false;
        clearInterval(gameLoop);

        if (score > highscore) {
            highscore = score;
            localStorage.setItem('snakeHighscore', highscore);
            highscoreEl.textContent = highscore;
        }

        overlayTitle.textContent = 'Game Over';
        overlayMessage.textContent = 'Score: ' + score + ' — Nochmal spielen?';
        overlay.classList.remove('hidden');
    }

    function start() {
        if (running) return;
        running = true;
        overlay.classList.add('hidden');
        init();
        draw();
        gameLoop = setInterval(update, speed);
    }

    // ===== SCHRITT 8: Steuerung (Tastatur, Touch, Mobile Buttons) =====
    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (direction.y === 0) nextDirection = { x: 0, y: -1 };
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (direction.y === 0) nextDirection = { x: 0, y: 1 };
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (direction.x === 0) nextDirection = { x: -1, y: 0 };
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (direction.x === 0) nextDirection = { x: 1, y: 0 };
                e.preventDefault();
                break;
            case ' ':
                if (!running) start();
                e.preventDefault();
                break;
        }
    });

    // Touch/Klick zum Starten
    overlay.addEventListener('click', function () {
        if (!running) start();
    });

    // Mobile Buttons
    document.getElementById('btnUp').addEventListener('click', function () {
        if (!running) { start(); return; }
        if (direction.y === 0) nextDirection = { x: 0, y: -1 };
    });
    document.getElementById('btnDown').addEventListener('click', function () {
        if (!running) { start(); return; }
        if (direction.y === 0) nextDirection = { x: 0, y: 1 };
    });
    document.getElementById('btnLeft').addEventListener('click', function () {
        if (!running) { start(); return; }
        if (direction.x === 0) nextDirection = { x: -1, y: 0 };
    });
    document.getElementById('btnRight').addEventListener('click', function () {
        if (!running) { start(); return; }
        if (direction.x === 0) nextDirection = { x: 1, y: 0 };
    });

    // Swipe-Steuerung
    var touchStartX = 0;
    var touchStartY = 0;

    canvas.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        if (!running) start();
    }, { passive: true });

    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;

        if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && direction.x === 0) nextDirection = { x: 1, y: 0 };
            else if (dx < 0 && direction.x === 0) nextDirection = { x: -1, y: 0 };
        } else {
            if (dy > 0 && direction.y === 0) nextDirection = { x: 0, y: 1 };
            else if (dy < 0 && direction.y === 0) nextDirection = { x: 0, y: -1 };
        }
    }, { passive: true });

    // Initial draw
    init();
    draw();
})();
