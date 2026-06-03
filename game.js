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
const scoreEl    = document.getElementById('score');
const hiScoreEl  = document.getElementById('hi-score');
const overlay    = document.getElementById('overlay');
const gameoverEl = document.getElementById('gameover-overlay');
const goScoreEl  = document.getElementById('gameover-score');

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
    const px = this.x;
    const py = this.y - this.h;

    // Legs (animated)
    const legOffset = Math.sin(Date.now() / 80) * 6;
    ctx.fillStyle = '#5a3e1b';
    ctx.fillRect(px + 5,  py + this.h - 14, 8, 14 + legOffset);
    ctx.fillRect(px + 17, py + this.h - 14, 8, 14 - legOffset);

    // Body
    ctx.fillStyle = '#c87941';
    ctx.fillRect(px, py + 18, this.w, this.h - 22);

    // Head
    ctx.fillStyle = '#e8a96a';
    ctx.beginPath();
    ctx.ellipse(px + this.w / 2, py + 12, 13, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(px + this.w / 2 + 4, py + 10, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(px + this.w / 2 + 5, py + 9, 1, 0, Math.PI * 2);
    ctx.fill();

    // Arms
    ctx.strokeStyle = '#c87941';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const armSwing = Math.sin(Date.now() / 80) * 8;
    ctx.beginPath();
    ctx.moveTo(px + 2, py + 24);
    ctx.lineTo(px - 8, py + 32 + armSwing);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px + this.w - 2, py + 24);
    ctx.lineTo(px + this.w + 8, py + 32 - armSwing);
    ctx.stroke();
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

    // Highlight crack
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

// ─── Ground decoration ───────────────────────────────────────────
const pebbles = Array.from({ length: 20 }, () => ({
  x: Math.random() * W,
  r: 2 + Math.random() * 3,
  y: GROUND_Y + 4 + Math.random() * 10,
}));

function drawGround(speed) {
  // Scroll pebbles
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

// ─── Stars background ─────────────────────────────────────────────
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

// ─── AABB collision ───────────────────────────────────────────────
function collides(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

// ─── Game state ───────────────────────────────────────────────────
let state = 'idle';
let rocks = [];
let score = 0;
let hiScore = parseInt(localStorage.getItem('batoHiScore') || '0');
let speed = BASE_SPEED;
let spawnTimer = 0;
let spawnInterval = 90;
let frameId = null;
let lastMilestone = 0;

hiScoreEl.textContent = hiScore;

function spawnRock() {
  rocks.push(new Rock(speed));
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
  resetGame();
  state = 'running';
  overlay.classList.remove('visible');
  gameoverEl.classList.remove('visible');
  if (frameId) cancelAnimationFrame(frameId);
  loop();
}

function endGame() {
  state = 'over';
  if (score > hiScore) {
    hiScore = score;
    localStorage.setItem('batoHiScore', hiScore);
    hiScoreEl.textContent = hiScore;
  }
  goScoreEl.textContent = `Score: ${score}   Best: ${hiScore}`;
  gameoverEl.classList.add('visible');
}

// ─── Main loop ───────────────────────────────────────────────────
function loop() {
  frameId = requestAnimationFrame(loop);

  // Update
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
      spawnRock();
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

  // Render
  drawBackground(speed);
  drawGround(state === 'running' ? speed : 0);
  rocks.forEach(r => r.draw());
  player.draw();
}

// ─── Input ────────────────────────────────────────────────────────
function handleInput() {
  if (state === 'idle' || state === 'over') {
    startGame();
  } else if (state === 'running') {
    player.jump();
  }
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    handleInput();
  }
});

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  handleInput();
}, { passive: false });

document.getElementById('overlay').addEventListener('click', handleInput);
document.getElementById('gameover-overlay').addEventListener('click', handleInput);

// ─── Initial render (idle frame) ─────────────────────────────────
drawBackground(BASE_SPEED);
drawGround(0);
player.draw();
