/*
  Coin Flip — A simple coin toss utility

  Concepts:

  - CSS 3D TRANSFORMS:
    ==========================================
    The coin uses rotateY() to spin around its vertical axis.
    backface-visibility: hidden ensures only one side shows at a time.

    perspective: 800px on the parent creates the 3D depth effect —
    lower values = more dramatic 3D, higher = flatter.

  - CSS ANIMATIONS vs TRANSITIONS:
    ==========================================
    Transitions: smooth change between two states (hover effects).
    Animations: multi-step sequences with @keyframes.

    The coin flip uses @keyframes because it needs multiple stages:
    spin up → peak height → spin down → land.

  - EVENT-DRIVEN STATE:
    ==========================================
    Each flip updates: heads/tails count, total flips, streak.
    The streak tracks consecutive same-side results.
    All state lives in simple variables — no frameworks needed.
*/

// ===== STEP 1: Grab DOM elements =====
const coin = document.getElementById('coin');
const resultEl = document.getElementById('result');
const headsCountEl = document.getElementById('headsCount');
const tailsCountEl = document.getElementById('tailsCount');
const totalFlipsEl = document.getElementById('totalFlips');
const streakEl = document.getElementById('streak');
const resetBtn = document.getElementById('resetBtn');

// ===== STEP 2: Game state =====
let heads = 0;
let tails = 0;
let total = 0;
let streak = 0;
let lastResult = null;   // Track last result for streak counting
let isFlipping = false;  // Prevent double-clicks during animation

// ===== STEP 3: Flip the coin =====
function flip() {
    if (isFlipping) return;
    isFlipping = true;

    // Random result: true = heads, false = tails
    const isHeads = Math.random() < 0.5;

    // Remove previous animation classes
    coin.classList.remove('flipping', 'flipping-tails');

    // Force browser to recalculate styles (needed to restart animation)
    void coin.offsetWidth;

    // Apply the correct animation
    // Heads: lands at 1800deg (= 5 full rotations, back to front)
    // Tails: lands at 1980deg (= 5.5 rotations, showing back)
    coin.classList.add(isHeads ? 'flipping' : 'flipping-tails');

    // Hide result during flip
    resultEl.classList.remove('show');

    // Wait for animation to finish (800ms matches CSS duration)
    setTimeout(function () {
        // Update counters
        total++;
        if (isHeads) {
            heads++;
        } else {
            tails++;
        }

        // Update streak
        const currentResult = isHeads ? 'heads' : 'tails';
        if (currentResult === lastResult) {
            streak++;
        } else {
            streak = 1;
        }
        lastResult = currentResult;

        // Update display
        headsCountEl.textContent = heads;
        tailsCountEl.textContent = tails;
        totalFlipsEl.textContent = total;
        streakEl.textContent = streak;

        // Show result text
        resultEl.textContent = isHeads ? 'Heads!' : 'Tails!';
        resultEl.classList.add('show');

        // Streak animation (3+ in a row)
        if (streak >= 3) {
            streakEl.classList.add('streak-pop');
            setTimeout(function () {
                streakEl.classList.remove('streak-pop');
            }, 300);
        }

        isFlipping = false;
    }, 800);
}

// ===== STEP 4: Reset =====
function reset() {
    heads = 0;
    tails = 0;
    total = 0;
    streak = 0;
    lastResult = null;

    headsCountEl.textContent = '0';
    tailsCountEl.textContent = '0';
    totalFlipsEl.textContent = '0';
    streakEl.textContent = '0';
    resultEl.classList.remove('show');

    coin.classList.remove('flipping', 'flipping-tails');
}

// ===== STEP 5: Event listeners =====
// Click/tap the coin to flip
coin.parentElement.addEventListener('click', flip);

// Spacebar to flip
document.addEventListener('keydown', function (e) {
    if (e.key === ' ') {
        e.preventDefault();
        flip();
    }
});

// Reset button
resetBtn.addEventListener('click', reset);
