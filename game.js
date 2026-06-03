const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const W = canvas.width;
const H = canvas.height;
const GROUND_Y = H - 50;
const GRAVITY = 0.55;
const JUMP_FORCE = -13;
const BASE_SPEED = 5;
const SPEED_INCREMENT = 0.4;
const SCORE_MILESTONE = 500;

// ─── DOM refs ────────────────────────────────────────────────────
const scoreEl      = document.getElementById('score');
const hiScoreEl    = document.getElementById('hi-score');
const homeOverlay  = document.getElementById('home-overlay');
const charOverlay  = document.getElementById('character-overlay');
const pauseOverlay = document.getElementById('pause-overlay');
const nameOverlay  = document.getElementById('name-overlay');
const sbOverlay    = document.getElementById('scoreboard-overlay');
const gameoverEl   = document.getElementById('gameover-overlay');
const goScoreEl    = document.getElementById('gameover-score');
const nameInput    = document.getElementById('name-input');
const scoreList    = document.getElementById('score-list');
const btnPause     = document.getElementById('btn-pause');

// ─── Character draw functions ────────────────────────────────────

function drawTao(c, px, py, w, h) {
  const legOffset = Math.sin(Date.now() / 80) * 6;
  c.fillStyle = '#5a3e1b';
  c.fillRect(px + 5,  py + h - 14, 8, 14 + legOffset);
  c.fillRect(px + 17, py + h - 14, 8, 14 - legOffset);

  c.fillStyle = '#c87941';
  c.fillRect(px, py + 18, w, h - 22);

  c.fillStyle = '#e8a96a';
  c.beginPath();
  c.ellipse(px + w / 2, py + 12, 13, 14, 0, 0, Math.PI * 2);
  c.fill();

  c.fillStyle = '#1a1a2e';
  c.beginPath();
  c.arc(px + w / 2 + 4, py + 10, 3, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#fff';
  c.beginPath();
  c.arc(px + w / 2 + 5, py + 9, 1, 0, Math.PI * 2);
  c.fill();

  c.strokeStyle = '#c87941';
  c.lineWidth = 5;
  c.lineCap = 'round';
  const armSwing = Math.sin(Date.now() / 80) * 8;
  c.beginPath();
  c.moveTo(px + 2, py + 24);
  c.lineTo(px - 8, py + 32 + armSwing);
  c.stroke();
  c.beginPath();
  c.moveTo(px + w - 2, py + 24);
  c.lineTo(px + w + 8, py + 32 - armSwing);
  c.stroke();
}

function drawMandirigma(c, px, py, w, h) {
  const legOffset = Math.sin(Date.now() / 80) * 6;
  // Legs with armor boots
  c.fillStyle = '#4a1010';
  c.fillRect(px + 4,  py + h - 14, 9, 14 + legOffset);
  c.fillRect(px + 17, py + h - 14, 9, 14 - legOffset);
  c.fillStyle = '#7a1515';
  c.fillRect(px + 4,  py + h - 6, 9, 6);
  c.fillRect(px + 17, py + h - 6, 9, 6);

  // Body armor
  c.fillStyle = '#8b1a1a';
  c.fillRect(px, py + 18, w, h - 22);
  c.fillStyle = '#c0392b';
  c.fillRect(px + 4, py + 20, w - 8, 6);

  // Neck
  c.fillStyle = '#c87941';
  c.fillRect(px + 10, py + 14, 10, 6);

  // Helmet
  c.fillStyle = '#5a5a5a';
  c.beginPath();
  c.ellipse(px + w / 2, py + 10, 14, 13, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#888';
  c.fillRect(px + 2, py + 6, w - 4, 5);
  // Visor slit
  c.fillStyle = '#ff4444';
  c.fillRect(px + 5, py + 9, w - 10, 3);

  // Helmet horns
  c.fillStyle = '#aaa';
  c.beginPath();
  c.moveTo(px + 4, py + 5);
  c.lineTo(px, py - 4);
  c.lineTo(px + 8, py + 3);
  c.fill();
  c.beginPath();
  c.moveTo(px + w - 4, py + 5);
  c.lineTo(px + w, py - 4);
  c.lineTo(px + w - 8, py + 3);
  c.fill();

  // Arms + shield
  c.strokeStyle = '#8b1a1a';
  c.lineWidth = 6;
  c.lineCap = 'round';
  const armSwing = Math.sin(Date.now() / 80) * 8;
  c.beginPath();
  c.moveTo(px + 2, py + 24);
  c.lineTo(px - 8, py + 32 + armSwing);
  c.stroke();
  c.beginPath();
  c.moveTo(px + w - 2, py + 24);
  c.lineTo(px + w + 8, py + 32 - armSwing);
  c.stroke();
  // Shield on left arm
  c.fillStyle = '#7a1515';
  c.fillRect(px - 14, py + 26 + armSwing, 10, 14);
  c.strokeStyle = '#c0392b';
  c.lineWidth = 1;
  c.strokeRect(px - 14, py + 26 + armSwing, 10, 14);
}

function drawEngkanto(c, px, py, w, h) {
  const legOffset = Math.sin(Date.now() / 80) * 6;
  // Legs
  c.fillStyle = '#1a4a2a';
  c.fillRect(px + 5,  py + h - 14, 8, 14 + legOffset);
  c.fillRect(px + 17, py + h - 14, 8, 14 - legOffset);

  // Body (robe)
  c.fillStyle = '#2d6e3f';
  c.fillRect(px - 2, py + 18, w + 4, h - 22);

  // Leaf details on body
  c.fillStyle = '#45a060';
  c.beginPath();
  c.ellipse(px + 8, py + 26, 5, 3, -0.4, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.ellipse(px + w - 6, py + 30, 5, 3, 0.4, 0, Math.PI * 2);
  c.fill();

  // Head
  c.fillStyle = '#a8d8a0';
  c.beginPath();
  c.ellipse(px + w / 2, py + 12, 13, 14, 0, 0, Math.PI * 2);
  c.fill();

  // Pointed ears
  c.fillStyle = '#a8d8a0';
  c.beginPath();
  c.moveTo(px + 2, py + 8);
  c.lineTo(px - 6, py + 1);
  c.lineTo(px + 6, py + 10);
  c.fill();
  c.beginPath();
  c.moveTo(px + w - 2, py + 8);
  c.lineTo(px + w + 6, py + 1);
  c.lineTo(px + w - 6, py + 10);
  c.fill();

  // Glowing eyes
  c.fillStyle = '#00ff88';
  c.shadowColor = '#00ff88';
  c.shadowBlur = 8;
  c.beginPath();
  c.ellipse(px + w / 2 - 3, py + 11, 3, 3, 0, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.ellipse(px + w / 2 + 5, py + 11, 3, 3, 0, 0, Math.PI * 2);
  c.fill();
  c.shadowBlur = 0;

  // Hair/leaves on head
  c.fillStyle = '#1a4a2a';
  for (let i = 0; i < 4; i++) {
    c.beginPath();
    c.ellipse(px + 6 + i * 6, py + 1, 4, 7, -0.2 + i * 0.15, 0, Math.PI * 2);
    c.fill();
  }

  // Arms with glow
  c.strokeStyle = '#2d6e3f';
  c.lineWidth = 5;
  c.lineCap = 'round';
  const armSwing = Math.sin(Date.now() / 80) * 8;
  c.beginPath();
  c.moveTo(px + 2, py + 24);
  c.lineTo(px - 8, py + 32 + armSwing);
  c.stroke();
  c.beginPath();
  c.moveTo(px + w - 2, py + 24);
  c.lineTo(px + w + 8, py + 32 - armSwing);
  c.stroke();
  // Sparkles at hands
  c.fillStyle = '#00ff88';
  c.shadowColor = '#00ff88';
  c.shadowBlur = 6;
  c.beginPath();
  c.arc(px - 8, py + 32 + armSwing, 3, 0, Math.PI * 2);
  c.fill();
  c.shadowBlur = 0;
}

function drawRoboto(c, px, py, w, h) {
  const legOffset = Math.sin(Date.now() / 80) * 6;
  // Mechanical legs
  c.fillStyle = '#555';
  c.fillRect(px + 4,  py + h - 14, 10, 14 + legOffset);
  c.fillRect(px + 16, py + h - 14, 10, 14 - legOffset);
  c.fillStyle = '#777';
  c.fillRect(px + 6,  py + h - 8, 6, 8 + legOffset);
  c.fillRect(px + 18, py + h - 8, 6, 8 - legOffset);

  // Body (rectangular chassis)
  c.fillStyle = '#4a4a5a';
  c.fillRect(px, py + 18, w, h - 22);
  c.fillStyle = '#606070';
  c.fillRect(px + 2, py + 20, w - 4, 3);
  // Panel lines
  c.strokeStyle = '#888';
  c.lineWidth = 1;
  c.strokeRect(px + 4, py + 25, w - 8, 10);
  // Chest LED
  c.fillStyle = '#00cfff';
  c.shadowColor = '#00cfff';
  c.shadowBlur = 8;
  c.fillRect(px + 11, py + 27, 8, 6);
  c.shadowBlur = 0;

  // Neck
  c.fillStyle = '#555';
  c.fillRect(px + 10, py + 14, 10, 6);

  // Head (square)
  c.fillStyle = '#4a4a5a';
  c.fillRect(px + 2, py + 1, w - 4, 15);
  c.fillStyle = '#606070';
  c.fillRect(px + 2, py + 1, w - 4, 3);

  // Antennae
  c.strokeStyle = '#888';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(px + 8, py + 2);
  c.lineTo(px + 5, py - 7);
  c.stroke();
  c.beginPath();
  c.moveTo(px + w - 8, py + 2);
  c.lineTo(px + w - 5, py - 7);
  c.stroke();
  c.fillStyle = '#00cfff';
  c.shadowColor = '#00cfff';
  c.shadowBlur = 6;
  c.beginPath();
  c.arc(px + 5, py - 7, 3, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.arc(px + w - 5, py - 7, 3, 0, Math.PI * 2);
  c.fill();
  c.shadowBlur = 0;

  // Eyes (LED panels)
  c.fillStyle = '#00cfff';
  c.shadowColor = '#00cfff';
  c.shadowBlur = 8;
  c.fillRect(px + 5, py + 6, 7, 5);
  c.fillRect(px + w - 12, py + 6, 7, 5);
  c.shadowBlur = 0;

  // Arms (mechanical)
  c.strokeStyle = '#555';
  c.lineWidth = 7;
  c.lineCap = 'square';
  const armSwing = Math.sin(Date.now() / 80) * 8;
  c.beginPath();
  c.moveTo(px + 2, py + 22);
  c.lineTo(px - 8, py + 30 + armSwing);
  c.stroke();
  c.beginPath();
  c.moveTo(px + w - 2, py + 22);
  c.lineTo(px + w + 8, py + 30 - armSwing);
  c.stroke();
}

function drawAswang(c, px, py, w, h) {
  const legOffset = Math.sin(Date.now() / 80) * 6;
  // Clawed legs
  c.fillStyle = '#2a1040';
  c.fillRect(px + 5,  py + h - 14, 8, 14 + legOffset);
  c.fillRect(px + 17, py + h - 14, 8, 14 - legOffset);
  // Claws
  c.strokeStyle = '#6a30a0';
  c.lineWidth = 2;
  c.lineCap = 'round';
  [px + 5, px + 9, px + 13].forEach(cx => {
    c.beginPath();
    c.moveTo(cx, py + h);
    c.lineTo(cx - 2, py + h + 5);
    c.stroke();
  });
  [px + 17, px + 21, px + 25].forEach(cx => {
    c.beginPath();
    c.moveTo(cx, py + h);
    c.lineTo(cx - 2, py + h + 5);
    c.stroke();
  });

  // Body (tattered robe)
  c.fillStyle = '#3a1060';
  c.fillRect(px - 2, py + 18, w + 4, h - 22);
  // Tattered edges
  c.fillStyle = '#2a1040';
  for (let i = 0; i < 5; i++) {
    c.beginPath();
    c.moveTo(px - 2 + i * 8, py + h - 8);
    c.lineTo(px + i * 8 + 2, py + h + 4);
    c.lineTo(px + 6 + i * 7, py + h - 8);
    c.fill();
  }

  // Dark aura
  c.fillStyle = '#6a30a022';
  c.beginPath();
  c.ellipse(px + w / 2, py + h / 2, w, h / 2, 0, 0, Math.PI * 2);
  c.fill();

  // Head
  c.fillStyle = '#5a2080';
  c.beginPath();
  c.ellipse(px + w / 2, py + 12, 14, 15, 0, 0, Math.PI * 2);
  c.fill();

  // Glowing red eyes
  c.fillStyle = '#ff1a1a';
  c.shadowColor = '#ff1a1a';
  c.shadowBlur = 10;
  c.beginPath();
  c.ellipse(px + w / 2 - 4, py + 10, 4, 3, 0.2, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.ellipse(px + w / 2 + 6, py + 10, 4, 3, -0.2, 0, Math.PI * 2);
  c.fill();
  c.shadowBlur = 0;

  // Fangs
  c.fillStyle = '#e0d0ff';
  c.beginPath();
  c.moveTo(px + w / 2 - 4, py + 18);
  c.lineTo(px + w / 2 - 2, py + 23);
  c.lineTo(px + w / 2,     py + 18);
  c.fill();
  c.beginPath();
  c.moveTo(px + w / 2 + 2, py + 18);
  c.lineTo(px + w / 2 + 4, py + 23);
  c.lineTo(px + w / 2 + 6, py + 18);
  c.fill();

  // Wings
  const wingFlap = Math.sin(Date.now() / 120) * 12;
  c.fillStyle = '#2a1040cc';
  c.beginPath();
  c.moveTo(px + 4, py + 22);
  c.quadraticCurveTo(px - 20, py + 10 - wingFlap, px - 30, py + 28);
  c.quadraticCurveTo(px - 15, py + 32, px + 4, py + 30);
  c.fill();
  c.beginPath();
  c.moveTo(px + w - 4, py + 22);
  c.quadraticCurveTo(px + w + 20, py + 10 - wingFlap, px + w + 30, py + 28);
  c.quadraticCurveTo(px + w + 15, py + 32, px + w - 4, py + 30);
  c.fill();
}

// ─── Characters registry ─────────────────────────────────────────
const CHARACTERS = [
  { name: 'Tao',        draw: drawTao },
  { name: 'Mandirigma', draw: drawMandirigma },
  { name: 'Engkanto',   draw: drawEngkanto },
  { name: 'Roboto',     draw: drawRoboto },
  { name: 'Aswang',     draw: drawAswang },
];

let selectedCharacter = parseInt(localStorage.getItem('batoCharacter') || '0');

// ─── Player ──────────────────────────────────────────────────────
const player = {
  x: 80,
  y: GROUND_Y,
  w: 30,
  h: 50,
  vy: 0,
  onGround: true,
  jumpsLeft: 2,

  jump() {
    if (this.jumpsLeft > 0) {
      this.vy = JUMP_FORCE;
      this.onGround = false;
      this.jumpsLeft--;
    }
  },

  update() {
    this.vy += GRAVITY;
    this.y += this.vy;
    if (this.y >= GROUND_Y) {
      this.y = GROUND_Y;
      this.vy = 0;
      this.onGround = true;
      this.jumpsLeft = 2;
    }
  },

  draw() {
    CHARACTERS[selectedCharacter].draw(ctx, this.x, this.y - this.h, this.w, this.h);
  },

  getBounds() {
    return { x: this.x + 4, y: this.y - this.h + 4, w: this.w - 8, h: this.h - 4 };
  }
};

// ─── Rock ─────────────────────────────────────────────────────────
const ROCK_SIZES = [
  { w: 28, h: 32 },
  { w: 40, h: 48 },
  { w: 55, h: 60 },
];

class Rock {
  constructor(speed) {
    const size = ROCK_SIZES[Math.floor(Math.random() * ROCK_SIZES.length)];
    this.w = size.w + Math.random() * 10 | 0;
    this.h = size.h + Math.random() * 10 | 0;
    this.x = W + 20;
    this.y = GROUND_Y;
    this.speed = speed;
    this._buildShape();
  }

  _buildShape() {
    this.pts = [];
    const cx = this.w / 2, cy = this.h / 2;
    const sides = 7 + (Math.random() * 3 | 0);
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const r = (0.65 + Math.random() * 0.35) * Math.min(cx, cy);
      this.pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
  }

  update() { this.x -= this.speed; }

  offscreen() { return this.x + this.w < 0; }

  draw() {
    const ox = this.x, oy = this.y - this.h;
    ctx.save();
    ctx.translate(ox, oy);

    ctx.beginPath();
    ctx.moveTo(this.pts[0].x, this.pts[0].y);
    for (let i = 1; i < this.pts.length; i++) ctx.lineTo(this.pts[i].x, this.pts[i].y);
    ctx.closePath();

    ctx.fillStyle = '#6b6b6b';
    ctx.fill();
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = '#9a9a9a55';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.pts[1].x, this.pts[1].y);
    ctx.lineTo(this.pts[3].x, this.pts[3].y);
    ctx.stroke();

    ctx.restore();
  }

  getBounds() {
    return { x: this.x + 4, y: this.y - this.h + 4, w: this.w - 8, h: this.h - 4 };
  }
}

// ─── Ground & Background ─────────────────────────────────────────
const pebbles = Array.from({ length: 20 }, () => ({
  x: Math.random() * W,
  r: 2 + Math.random() * 3,
  y: GROUND_Y + 4 + Math.random() * 10,
}));

function drawGround(speed) {
  pebbles.forEach(p => {
    p.x -= speed * 0.4;
    if (p.x < -10) p.x = W + 10;
  });
  ctx.fillStyle = '#3d2b1a';
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  ctx.strokeStyle = '#e0c97f44';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(W, GROUND_Y);
  ctx.stroke();
  ctx.fillStyle = '#5a4030';
  pebbles.forEach(p => {
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

const stars = Array.from({ length: 60 }, () => ({
  x: Math.random() * W,
  y: Math.random() * GROUND_Y * 0.9,
  r: Math.random() * 1.5,
  speed: 0.2 + Math.random() * 0.3,
}));

function drawBackground(speed) {
  ctx.fillStyle = '#0f0f1a';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff88';
  stars.forEach(s => {
    s.x -= s.speed * (speed / BASE_SPEED);
    if (s.x < 0) s.x = W;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ─── Collision ───────────────────────────────────────────────────
function collides(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

// ─── Game state ───────────────────────────────────────────────────
let state = 'home';
let rocks = [];
let score = 0;
let speed = BASE_SPEED;
let spawnTimer = 0;
let spawnInterval = 90;
let frameId = null;
let lastMilestone = 0;

let playerName = localStorage.getItem('batoPlayerName') || '';
let scores = JSON.parse(localStorage.getItem('batoScores') || '[]');
let hiScore = scores.length ? scores[0].score : 0;

hiScoreEl.textContent = hiScore;

// ─── Navigation ──────────────────────────────────────────────────
function hideAll() {
  homeOverlay.classList.remove('visible');
  charOverlay.classList.remove('visible');
  pauseOverlay.classList.remove('visible');
  nameOverlay.classList.remove('visible');
  sbOverlay.classList.remove('visible');
  gameoverEl.classList.remove('visible');
}

function togglePause() {
  if (state === 'running') {
    state = 'paused';
    pauseOverlay.classList.add('visible');
    btnPause.textContent = '▶';
  } else if (state === 'paused') {
    state = 'running';
    pauseOverlay.classList.remove('visible');
    btnPause.textContent = '⏸';
  }
}

function goHome() {
  hideAll();
  state = 'home';
  homeOverlay.classList.add('visible');
  btnPause.classList.add('hidden');
  renderPreviewsIfNeeded();
}

function showNameInput() {
  hideAll();
  state = 'name_input';
  nameInput.value = playerName;
  nameOverlay.classList.add('visible');
  setTimeout(() => nameInput.focus(), 50);
}

function showScoreboard() {
  hideAll();
  state = 'scoreboard';
  scoreList.innerHTML = '';
  const medals = ['#1', '#2', '#3', '#4', '#5'];
  for (let i = 0; i < 5; i++) {
    const li = document.createElement('li');
    if (scores[i]) {
      li.innerHTML = `<span class="rank">${medals[i]}</span><span class="name">${scores[i].name}</span><span class="pts">${scores[i].score}</span>`;
      if (i < 3) li.classList.add(`rank-${i + 1}`);
    } else {
      li.classList.add('empty');
      li.textContent = '- - -';
    }
    scoreList.appendChild(li);
  }
  sbOverlay.classList.add('visible');
}

function showCharacterSelect() {
  hideAll();
  state = 'character_select';
  charOverlay.classList.add('visible');
  updateCardHighlight();
}

function resetGame() {
  rocks = [];
  score = 0;
  speed = BASE_SPEED;
  spawnTimer = 0;
  spawnInterval = 90;
  lastMilestone = 0;
  player.y = GROUND_Y;
  player.vy = 0;
  player.onGround = true;
  player.jumpsLeft = 2;
  scoreEl.textContent = '0';
}

function startGame() {
  playerName = nameInput.value.trim().toUpperCase() || 'PLAYER';
  localStorage.setItem('batoPlayerName', playerName);
  resetGame();
  hideAll();
  state = 'running';
  btnPause.classList.remove('hidden');
  btnPause.textContent = '⏸';
  if (frameId) cancelAnimationFrame(frameId);
  loop();
}

function saveScore(name, sc) {
  scores.push({ name, score: sc });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 5);
  localStorage.setItem('batoScores', JSON.stringify(scores));
  hiScore = scores[0].score;
  hiScoreEl.textContent = hiScore;
}

function endGame() {
  state = 'over';
  btnPause.classList.add('hidden');
  saveScore(playerName, score);
  goScoreEl.textContent = `${playerName}: ${score}   BEST: ${hiScore}`;
  gameoverEl.classList.add('visible');
}

// ─── Main loop ───────────────────────────────────────────────────
function loop() {
  frameId = requestAnimationFrame(loop);

  if (state === 'running') {
    score++;
    scoreEl.textContent = score;

    const milestone = Math.floor(score / SCORE_MILESTONE);
    if (milestone > lastMilestone) {
      lastMilestone = milestone;
      speed += SPEED_INCREMENT;
      spawnInterval = Math.max(40, spawnInterval - 5);
      rocks.forEach(r => r.speed = speed);
    }

    player.update();

    spawnTimer++;
    if (spawnTimer >= spawnInterval + (Math.random() * 30 | 0)) {
      spawnTimer = 0;
      rocks.push(new Rock(speed));
    }

    rocks.forEach(r => r.update());
    rocks = rocks.filter(r => !r.offscreen());

    const pb = player.getBounds();
    for (const rock of rocks) {
      if (collides(pb, rock.getBounds())) {
        endGame();
        break;
      }
    }
  }

  const bgSpeed = state === 'running' ? speed : (state === 'paused' ? 0 : BASE_SPEED);
  drawBackground(bgSpeed);
  drawGround(state === 'running' ? speed : 0);
  rocks.forEach(r => r.draw());
  player.draw();
}

// ─── Input (keyboard/touch only for jump during gameplay) ────────
document.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    if (state === 'running') player.jump();
    else if (state === 'paused') togglePause();
  }
  if (e.code === 'KeyP' && (state === 'running' || state === 'paused')) togglePause();
  if (e.code === 'Escape') {
    if (state === 'character_select' || state === 'name_input' || state === 'scoreboard') goHome();
    else if (state === 'running' || state === 'paused') togglePause();
  }
});

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  if (state === 'running') player.jump();
}, { passive: false });

// ─── Button events ────────────────────────────────────────────────
document.getElementById('btn-start').addEventListener('click', showNameInput);
document.getElementById('btn-choose').addEventListener('click', showCharacterSelect);
document.getElementById('btn-scoreboard').addEventListener('click', showScoreboard);
document.getElementById('btn-back').addEventListener('click', goHome);
document.getElementById('btn-retry').addEventListener('click', showNameInput);
document.getElementById('btn-home').addEventListener('click', goHome);
document.getElementById('btn-resume').addEventListener('click', togglePause);
document.getElementById('btn-play').addEventListener('click', startGame);
document.getElementById('btn-name-back').addEventListener('click', goHome);
document.getElementById('btn-score-back').addEventListener('click', goHome);
nameInput.addEventListener('keydown', e => { if (e.code === 'Enter') startGame(); });
btnPause.addEventListener('click', togglePause);
btnPause.classList.add('hidden');

// ─── Character selection cards ────────────────────────────────────
function updateCardHighlight() {
  document.querySelectorAll('.char-card').forEach(card => {
    card.classList.toggle('selected', parseInt(card.dataset.id) === selectedCharacter);
  });
}

document.querySelectorAll('.char-card').forEach(card => {
  card.addEventListener('click', () => {
    selectedCharacter = parseInt(card.dataset.id);
    localStorage.setItem('batoCharacter', selectedCharacter);
    updateCardHighlight();
    setTimeout(goHome, 200);
  });
});

// ─── Preview canvases ─────────────────────────────────────────────
let previewsRendered = false;

function renderPreviewsIfNeeded() {
  if (previewsRendered) return;
  previewsRendered = true;

  document.querySelectorAll('.char-preview').forEach(previewCanvas => {
    const id = parseInt(previewCanvas.closest('.char-card').dataset.id);
    const pctx = previewCanvas.getContext('2d');
    const pw = previewCanvas.width;
    const ph = previewCanvas.height;
    const charW = 30, charH = 50;
    const px = (pw - charW) / 2;
    const py = ph - charH - 10;

    CHARACTERS[id].draw(pctx, px, py, charW, charH);
  });
}

// ─── Boot ─────────────────────────────────────────────────────────
updateCardHighlight();
loop();
