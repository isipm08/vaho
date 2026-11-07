const stage = $('#window');
const progress = $('#unlockProgress');
const phaseLabel = $('#phaseLabel');
const hand = $('#hand');
const retryStage = $('#retryStage');
const visited = new Set();
const gridSize = 16;
const unlockPercent = 60;
const unlockCells = Math.ceil(gridSize * gridSize * unlockPercent / 100);
let phase = 'reveal';
const localPreview = typeof BroadcastChannel === 'function'
  ? new BroadcastChannel('vaho-preview-' + tacto.sala) : null;
const previewUrl = new URL(phone);
previewUrl.searchParams.set('preview', '1');
$('#previewLink').href = previewUrl.href;
$('#previewLink').onclick = () => $('#pair').close();

function showCrashMessage() {
  $('#runnerMessage').innerHTML = '<span class="screen-reader-only">¡</span><span class="arcade-inverted" aria-hidden="true">!</span>Choque!';
}

function resetJourney() {
  stopEffect('countdown');
  stopEffect('step');
  stopEffect('slide');
  stopEffect('kiss');
  phase = 'reveal';
  visited.clear();
  runner = null;
  flight = null;
  tower = null;
  $('#runnerMessage').hidden = true;
  retryStage.hidden = true;
  $('#nextStage').hidden = true;
  $('#nextTower').hidden = true;
  $('#endingFog').hidden = true;
  $('#endingFog').style.opacity = 0;
  $('#hint').style.opacity = 1;
  progress.value = 0;
  progress.max = unlockPercent;
  progress.setAttribute('aria-label', 'Superficie despejada para iniciar el recorrido');
  progress.hidden = false;
  phaseLabel.textContent = `01 · Vidrio despejado · 0% / ${unlockPercent}%`;
  stage.classList.remove('game', 'revealed');
  $('#adventureGate').hidden = true;
  hand.hidden = true;
  resetRemotePointer();
  previous.clear();
  points.clear();
  remote = null;
  lastMotion = -Infinity;
  fill();
  publishMode();
}

function publishMode() {
  const message = { phase, audioEnabled };
  localPreview?.postMessage({ kind: 'mode', message });
  if (tacto.client?.connected) {
    tacto.client.publish(`tacto/${tacto.sala}/stage/mode`, JSON.stringify(message));
  }
}

function beginGame() {
  if (phase !== 'ready' && phase !== 'runnerLost') return;
  $('#adventureGate').hidden = true;
  phase = 'game';
  stage.classList.add('game');
  hand.hidden = true;
  progress.value = 0;
  progress.max = 100;
  progress.setAttribute('aria-label', 'Progreso del recorrido');
  phaseLabel.textContent = 'Etapa 1 · ↑ Salta · ↓ Agáchate';
  retryStage.hidden = true;
  $('#runnerMessage').hidden = false;
  $('#runnerMessage').textContent = '3';
  startRunner();
  playEffect('countdown', runner.countdown);
  publishMode();
}

function showAdventureGate() {
  phase = 'ready';
  stage.classList.add('revealed');
  hand.hidden = true;
  progress.value = unlockPercent;
  phaseLabel.textContent = 'Bosque descubierto';
  $('#adventureGate').hidden = false;
  publishMode();
}

function followTouch(x, y, radius) {
  if (phase !== 'reveal') return;
  hand.hidden = false;
  hand.style.left = `${x * 100}%`;
  hand.style.top = `${y * 100}%`;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const dx = ((col + .5) / gridSize - x) * w;
      const dy = ((row + .5) / gridSize - y) * h;
      if (Math.hypot(dx, dy) <= radius) visited.add(row * gridSize + col);
    }
  }
  const percent = Math.min(unlockPercent, Math.floor(100 * visited.size / (gridSize * gridSize)));
  progress.value = percent;
  phaseLabel.textContent = `01 · Vidrio despejado · ${percent}% / ${unlockPercent}%`;
  if (visited.size >= unlockCells) showAdventureGate();
}

$('#startAdventure').onclick = beginGame;
$('#nextStage').onclick = startFlight;
$('#nextTower').onclick = startTower;
retryStage.onclick = () => {
  const restart = { runnerLost: beginGame, flightLost: startFlight, towerLost: startTower }[phase];
  restart?.();
};
tacto.on('estado', status => { if (status === 'conectado') publishMode(); });
function handleRemoteInput(kind, message) {
  if (kind === 'hello') {
    $('#pair').close();
    publishMode();
  }
  if (kind === 'touch' && phase === 'reveal' && Array.isArray(message?.p)) {
    const points = message.p;
    if (points.length && $('#pair').open) $('#pair').close();
    if (points.length) remotePointer.hidden = true;
    remote = { p: points, at: performance.now() };
    if (!points.length) previous.delete('remote');
  }
  if (kind === 'pointer') receivePointer(message);
  if (kind === 'runner' && phase === 'game' && ['up', 'down'].includes(message?.direction)) {
    runnerAction(message.direction);
  }
  if (kind === 'flight' && phase === 'flight' && message?.action === 'flap') {
    flap();
  }
  if (kind === 'tower') towerGesture(message?.direction, message?.amount);
}
tacto.on('datos', (_device, kind, message) => handleRemoteInput(kind, message));
if (localPreview) localPreview.onmessage = event => handleRemoteInput(event.data?.kind, event.data?.message);
resetJourney();
resize();
requestAnimationFrame(frame);
