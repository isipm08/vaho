const lanes = [84, 160, 236];
const trapLanes = [1, 0, 2, 1, 2, 0, 1, 2, 0, 2, 1, 0, 2, 0, 1, 2, 1];
const trapSpeed = 94;
const towerRunDuration = 16.5;
const ladderX = 144;
const walkStartX = 36;
let tower = null;

function startTower() {
  if (phase !== 'flightWon' && phase !== 'towerLost') return;
  tower = { lane: 1, time: 0, hearts: 3, started: false, walkX: walkStartX, climb: 0, ending: 0, hit: 0,
    traps: trapLanes.map((lane, index) => ({ lane, start: .4 + index * .86, checked: false })) };
  phase = 'towerRun';
  $('#nextTower').hidden = true;
  retryStage.hidden = true;
  $('#runnerMessage').hidden = false;
  $('#runnerMessage').textContent = 'Desliza para esquivar';
  progress.value = 0;
  progress.setAttribute('aria-label', 'Progreso hacia la torre');
  phaseLabel.textContent = 'Etapa 3 · ♥♥♥ · Esquiva las rocas';
  drawTowerRoute();
  publishMode();
}

function towerGesture(direction, amount = .12) {
  if (phase === 'towerRun' && ['left', 'right'].includes(direction)) {
    tower.started = true;
    const previousLane = tower.lane;
    tower.lane = Math.max(0, Math.min(2, tower.lane + (direction === 'left' ? -1 : 1)));
    if (tower.lane !== previousLane) playEffect('slide');
    $('#runnerMessage').hidden = true;
    drawTowerRoute();
  } else if (phase === 'towerWalk' && direction === 'right' && Number.isFinite(amount) && amount > 0) {
    const previousX = tower.walkX;
    tower.walkX = Math.min(ladderX, tower.walkX + Math.min(.18, amount)*(ladderX-walkStartX));
    if (tower.walkX > previousX) playTowerStep();
    progress.value = (tower.walkX-walkStartX)/(ladderX-walkStartX)*100;
    if (tower.walkX === ladderX) {
      phase = 'towerClimb';
      progress.value = 0;
      progress.setAttribute('aria-label', 'Ascenso a la torre');
      phaseLabel.textContent = 'Etapa final · Desliza hacia arriba para subir';
      publishMode();
    }
    drawTower();
  } else if (phase === 'towerClimb' && direction === 'up' && Number.isFinite(amount) && amount > 0) {
    const previousClimb = tower.climb;
    tower.climb = Math.min(1, tower.climb + Math.min(.18, amount));
    if (tower.climb > previousClimb) playTowerStep();
    progress.value = tower.climb * 100;
    if (tower.climb === 1) {
      phase = 'ending';
      stopEffect('step');
      playEffect('kiss');
      phaseLabel.textContent = 'Aventura completada ♥';
      publishMode();
    }
    drawTower();
  }
}

function playTowerStep() {
  const now = performance.now();
  if (now - (tower.lastStep ?? -Infinity) < 160) return;
  tower.lastStep = now;
  playEffect('step');
}

function updateTower(dt) {
  if (phase === 'towerRun' && tower.started) {
    tower.time += dt;
    tower.hit = Math.max(0, tower.hit-dt);
    for (const trap of tower.traps) {
      const y = rockY(trap);
      if (!trap.checked && y >= 116 && y <= 149 && tower.lane === trap.lane) {
        trap.checked = true;
        tower.hearts--;
        tower.hit = .3;
      }
    }
    progress.value = Math.min(100, tower.time / towerRunDuration * 100);
    phaseLabel.textContent = `Etapa 3 · ${'♥'.repeat(tower.hearts)}${'♡'.repeat(3-tower.hearts)} · Camino a la torre`;
    drawTowerRoute();
    if (!tower.hearts) {
      phase = 'towerLost';
      showCrashMessage();
      $('#runnerMessage').hidden = false;
      retryStage.hidden = false;
      publishMode();
    } else if (tower.time >= towerRunDuration) {
      phase = 'towerWalk';
      progress.value = 0;
      progress.setAttribute('aria-label', 'Camino a la escalera');
      phaseLabel.textContent = 'Etapa final · Desliza a la derecha para caminar';
      drawTower();
      publishMode();
    }
  } else if (phase === 'ending') {
    tower.ending += dt;
    drawTower();
    if (tower.ending >= 2.2) {
      const fog = $('#endingFog');
      fog.hidden = false;
      fog.style.opacity = Math.min(1, (tower.ending-2.2)/1.8);
    }
    if (tower.ending >= 4.25) resetJourney();
  }
}

function rockY(trap) { return (tower.time-trap.start)*trapSpeed - 12; }

function drawTowerBackdrop() {
  block('#8bd8ee', 0, 0, 320, 180);
  const image = $('#window img');
  if (image.complete && image.naturalWidth) pixel.drawImage(image, 0, 0, 320, 180);
}

function drawTowerRoute() {
  drawTowerBackdrop();
  block('#d4b784', 47, 0, 226, 180);
  block('#a48759', 47, 0, 4, 180);
  block('#a48759', 269, 0, 4, 180);
  const offset = Math.floor(tower.time*trapSpeed) % 24;
  for (let y = offset-24; y < 180; y += 24) {
    block('#f5dcad', 121, y, 3, 13);
    block('#f5dcad', 197, y, 3, 13);
  }
  for (const trap of tower.traps) {
    const y = rockY(trap);
    if (y < -16 || y > 180) continue;
    const x = lanes[trap.lane];
    block('#625d50', x-10, y+3, 20, 13);
    block('#8b8975', x-7, y, 14, 9);
    block('#b8ae94', x-5, y+2, 5, 3);
  }
  if (!tower.hit || Math.floor(tower.hit*18)%2) drawHero(lanes[tower.lane]-7, 153, Math.floor(tower.time*9)%2);
}

function drawTower() {
  drawTowerBackdrop();
  block('#5f9e4b', 0, 154, 320, 26);
  block('#768171', 123, 39, 78, 119);
  for (let y = 44; y < 152; y += 10) {
    for (let x = 126 + (y % 20 === 4 ? 9 : 0); x < 188; x += 18) block('#aab5a0', x, y, 15, 6);
  }
  block('#596c60', 115, 31, 94, 12);
  for (let x = 115; x < 205; x += 19) block('#596c60', x, 22, 13, 13);
  block('#5e432c', 141, 42, 4, 115);
  block('#5e432c', 156, 42, 4, 115);
  for (let y = 45; y < 156; y += 8) block('#b0864d', 142, y, 16, 3);
  // Princess sprite and crown.
  block('#824940', 172, 14, 13, 18);
  block('#ffd3a7', 174, 16, 9, 8);
  block('#e17a99', 173, 24, 11, 8);
  block('#f28fab', 170, 30, 17, 7);
  block('#f9d36a', 173, 10, 11, 5);
  block('#f9d36a', 173, 7, 3, 4);
  block('#f9d36a', 181, 7, 3, 4);
  const step = phase === 'towerWalk' ? Math.floor(tower.walkX/7)%2 : Math.floor(tower.climb*20)%2;
  drawHero(tower.walkX, 155 - tower.climb*118, step);
  if (phase === 'ending') {
    for (let i = 0; i < 3; i++) {
      const x = 139+i*17;
      const y = 11+(i%2)*6-Math.floor(tower.ending*6);
      block('#e45e7d', x, y, 3, 4);
      block('#e45e7d', x+6, y, 3, 4);
      block('#e45e7d', x, y+2, 9, 4);
      block('#e45e7d', x+2, y+6, 5, 2);
      block('#e45e7d', x+4, y+8, 2, 2);
    }
  }
}

window.addEventListener('keydown', event => {
  if (!['towerRun', 'towerWalk', 'towerClimb'].includes(phase) || event.target.closest('input, dialog')) return;
  const direction = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up' }[event.key];
  if (direction) {
    event.preventDefault();
    if (phase !== 'towerRun' || !event.repeat) towerGesture(direction);
  }
});
