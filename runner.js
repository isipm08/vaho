const runnerCanvas = $('#runner');
const pixel = runnerCanvas.getContext('2d');
pixel.imageSmoothingEnabled = false;

const ground = 143;
const playerX = 51;
const routeLength = 2850;
const forest = { earth: '#bd8b54', grass: '#7bc45e', ground: 'tronco', air: 'rama', color: '#c79455' };

let runner = null;

function startRunner() {
  const pattern = ['ground', 'air', 'ground', 'air', 'air', 'ground', 'air', 'ground', 'ground', 'air',
    'ground', 'air', 'ground', 'air', 'air'];
  const obstacles = pattern.map((kind, i) => ({
    distance: 275 + i * 169,
    kind,
    checked: false,
  }));
  runner = { distance: 0, y: 0, velocity: 0, slide: 0, shields: 3, countdown: 3, hit: 0, obstacles };
  drawRunner();
}

function runnerAction(direction) {
  if (phase !== 'game' || !runner || runner.countdown > 0) return;
  if (direction === 'up' && runner.y === 0) {
    runner.slide = 0;
    runner.velocity = 166;
    playEffect('jump');
  } else if (direction === 'down') {
    runner.slide = .7;
    runner.velocity = Math.min(runner.velocity, -180);
    playEffect('duck');
  }
}

function finishRunner(won) {
  phase = won ? 'done' : 'runnerLost';
  phaseLabel.textContent = won ? 'Etapa 1 completada · Llegaste a la puerta' : 'Te quedaste sin corazones.';
  retryStage.hidden = won;
  $('#runnerMessage').hidden = true;
  $('#nextStage').hidden = !won;
  publishMode();
}

function updateRunner(dt) {
  if (phase !== 'game' || !runner) return;
  const r = runner;
  if (r.countdown > 0) {
    r.countdown = Math.max(0, r.countdown - dt);
    $('#runnerMessage').textContent = Math.ceil(r.countdown) || '¡Corre!';
    $('#runnerMessage').hidden = r.countdown === 0;
    drawRunner();
    return;
  }
  r.distance += (94 + r.distance / 105) * dt;
  r.slide = Math.max(0, r.slide - dt);
  r.hit = Math.max(0, r.hit - dt);
  if (r.velocity !== 0 || r.y > 0) {
    r.y = Math.max(0, r.y + r.velocity * dt);
    r.velocity = r.y ? r.velocity - 415 * dt : 0;
  }
  for (const obstacle of r.obstacles) {
    const x = playerX + obstacle.distance - r.distance;
    if (obstacle.checked || x > playerX + 11 || x + 19 < playerX) continue;
    const height = r.slide > 0 ? 9 : 24;
    const overlaps = obstacle.kind === 'ground' ? r.y < 17 : r.y + height > 13 && r.y < 35;
    if (overlaps) {
      obstacle.checked = true;
      r.shields--;
      r.hit = .48;
      if (!r.shields) finishRunner(false);
    }
  }
  progress.value = Math.min(100, Math.floor(r.distance / routeLength * 100));
  if (phase === 'game') {
    phaseLabel.textContent = `Etapa 1 · ${'♥'.repeat(r.shields)}${'♡'.repeat(3-r.shields)} · ${progress.value}% de la ruta`;
    if (r.distance >= routeLength) finishRunner(true);
  }
  drawRunner();
}

function block(color, x, y, width, height) {
  pixel.fillStyle = color;
  pixel.fillRect(Math.round(x), Math.round(y), width, height);
}

function drawObstacle(obstacle, x, biome) {
  const shape = sprites[biome[obstacle.kind]];
  const y = obstacle.kind === 'ground' ? ground-17 : ground-35;
  const colors = { o: '#222237', x: biome.color, d: biome.earth, h: '#fff1cf' };
  shape.forEach((row, dy) => {
    [...row].forEach((shade, dx) => {
      if (colors[shade]) block(colors[shade], x+dx*3, y+dy*3, 3, 3);
    });
  });
}

const sprites = {
  tronco: ['.ooooo.', 'oxxxxxo', 'oxddhho', 'oxdhdho', 'oxdhhho', '.ooooo.'],
  rama: ['oo.....', 'dxoo...', '.ddxooo', '..dxddo', '...o.d.', '...d...'],
};

function drawDoor(x) {
  const y = ground - 51;
  block('#263327', x-6, y+13, 39, 38);
  block('#394b37', x-2, y+6, 31, 45);
  block('#566947', x+4, y, 19, 9);
  block('#a67843', x+2, y+13, 25, 38);
  block('#69452c', x+6, y+17, 17, 34);
  for (const offset of [9, 14, 19]) block('#8b5c36', x+offset, y+18, 2, 31);
  block('#ffe07d', x+18, y+34, 3, 3);
  block('#94ac54', x-6, y+13, 7, 3);
  block('#94ac54', x+23, y+6, 7, 3);
  block('#788165', x-8, ground-3, 42, 3);
}

function drawRunner() {
  const r = runner;
  const biome = forest;
  const img = $('#window img');
  block('#78c9ec', 0, 0, 320, 180);
  if (img.complete && img.naturalWidth) {
    const offset = Math.floor(r.distance / 7) % 320;
    pixel.drawImage(img, -offset, 0, 320, 154);
    pixel.drawImage(img, 320-offset, 0, 320, 154);
  }
  block(biome.earth, 0, ground, 320, 37);
  block(biome.grass, 0, ground, 320, 5);
  const tileOffset = Math.floor(r.distance) % 18;
  for (let x = -tileOffset; x < 320; x += 18) {
    block('#18202b50', x+4, ground+10, 7, 3);
    block('#f4d09835', x+10, ground+22, 4, 3);
  }
  for (const obstacle of r.obstacles) {
    const x = playerX + obstacle.distance - r.distance;
    if (x > -25 && x < 320) drawObstacle(obstacle, x, biome);
  }
  const finishX = playerX + routeLength - r.distance;
  if (finishX < 320) drawDoor(finishX);
  if (r.hit && Math.floor(r.hit * 18) % 2) return;
  const y = ground - r.y;
  if (r.slide > 0) {
    block('#222439', playerX-3, y-10, 22, 10);
    block('#7fbd90', playerX-1, y-7, 15, 5);
    block('#f7c99d', playerX+13, y-9, 6, 6);
  } else {
    const step = Math.floor(r.distance / 9) % 2;
    drawHero(playerX, y, step);
  }
}

function drawHero(x, y, step = 0) {
  block('#222439', x, y-25, 14, 23);
  block('#f7c99d', x+3, y-21, 10, 8);
  block('#513442', x+1, y-25, 14, 5);
  block('#7fbd90', x+2, y-13, 10, 8);
  block('#2b3047', x+2, y-6+step*2, 4, 5);
  block('#2b3047', x+9, y-4-step*2, 4, 5);
}

window.addEventListener('keydown', event => {
  if (phase !== 'game' || event.repeat) return;
  if (event.target.closest('input, textarea, select, dialog')) return;
  const direction = { ArrowUp: 'up', ArrowDown: 'down' }[event.key];
  if (direction) {
    event.preventDefault();
    runnerAction(direction);
  }
});
