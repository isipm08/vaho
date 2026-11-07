const flyerX = 66;
const pipeWidth = 21;
const gapHeight = 79;
const flightFloor = 166;
const gapCenters = [83, 70, 94, 77, 103, 82, 68, 89, 104, 79];
let flight = null;

function startFlight() {
  if (!['done', 'flightLost'].includes(phase)) return;
  phase = 'flight';
  flight = { y: 82, velocity: 0, distance: 0, started: false, passed: 0, hearts: 3, grace: 0 };
  $('#nextStage').hidden = true;
  retryStage.hidden = true;
  progress.value = 0;
  progress.setAttribute('aria-label', 'Progreso del vuelo');
  showFlightProgress();
  $('#runnerMessage').textContent = 'Pulsa el escenario para volar';
  $('#runnerMessage').hidden = false;
  drawFlight();
  publishMode();
}

function flap() {
  if (phase !== 'flight') return;
  flight.started = true;
  flight.velocity = -103;
  playEffect('flap');
  $('#runnerMessage').hidden = true;
}

function showFlightProgress() {
  const { hearts, passed } = flight;
  phaseLabel.textContent = `Etapa 2 · ${'♥'.repeat(hearts)}${'♡'.repeat(3-hearts)} · Tubos ${passed} / ${gapCenters.length}`;
}

function hitFlight() {
  flight.hearts--;
  showFlightProgress();
  if (!flight.hearts) {
    finishFlight(false);
    return;
  }
  flight.y = gapCenters[flight.passed] ?? 83;
  flight.velocity = 0;
  flight.started = false;
  flight.grace = .5;
  $('#runnerMessage').textContent = 'Toca para seguir';
  $('#runnerMessage').hidden = false;
  drawFlight();
}

function finishFlight(won) {
  phase = won ? 'flightWon' : 'flightLost';
  if (won) $('#runnerMessage').textContent = 'Etapa 2 completada';
  else showCrashMessage();
  $('#runnerMessage').hidden = false;
  retryStage.hidden = won;
  $('#nextTower').hidden = !won;
  if (won) phaseLabel.textContent = 'Etapa 2 · Vuelo completado';
  publishMode();
}

function pipeX(index) {
  return 174 + index * 102 - flight.distance;
}

function updateFlight(dt) {
  if (phase !== 'flight' || !flight.started) return;
  flight.velocity += 295 * dt;
  flight.y += flight.velocity * dt;
  flight.distance += 85 * dt;
  flight.grace = Math.max(0, flight.grace-dt);

  if (flight.y < 13 || flight.y > flightFloor - 12) {
    hitFlight();
    return;
  }
  for (let i = 0; i < gapCenters.length; i++) {
    const x = pipeX(i);
    const center = gapCenters[i];
    if (!flight.grace && x - 2 < flyerX + 6 && x + pipeWidth + 2 > flyerX - 6 &&
        Math.abs(flight.y - center) + 12 > gapHeight / 2) {
      hitFlight();
      return;
    }
  }
  const passed = gapCenters.filter((_, index) => pipeX(index) + pipeWidth + 2 < flyerX - 6).length;
  if (passed !== flight.passed) {
    flight.passed = passed;
    progress.value = 100 * passed / gapCenters.length;
    showFlightProgress();
  }
  drawFlight();
  if (passed === gapCenters.length) finishFlight(true);
}

function drawFlight() {
  block('#87d4ee', 0, 0, 320, 180);
  const image = $('#window img');
  if (image.complete && image.naturalWidth) {
    const offset = Math.floor(flight.distance / 5) % 320;
    pixel.drawImage(image, -offset, 0, 320, flightFloor);
    pixel.drawImage(image, 320 - offset, 0, 320, flightFloor);
  }
  for (let i = 0; i < gapCenters.length; i++) {
    const x = pipeX(i);
    const top = Math.floor(gapCenters[i] - gapHeight / 2);
    const bottom = Math.ceil(gapCenters[i] + gapHeight / 2);
    block('#315e39', x, 0, pipeWidth, top);
    block('#67a84b', x+3, 0, pipeWidth-6, top);
    block('#add66c', x+5, 0, 3, top);
    block('#437442', x-2, top-6, pipeWidth+4, 6);
    block('#315e39', x, bottom, pipeWidth, flightFloor-bottom);
    block('#67a84b', x+3, bottom, pipeWidth-6, flightFloor-bottom);
    block('#add66c', x+5, bottom, 3, flightFloor-bottom);
    block('#437442', x-2, bottom, pipeWidth+4, 6);
  }
  block('#bf8f58', 0, flightFloor, 320, 14);
  block('#8ac964', 0, flightFloor, 320, 4);
  drawHero(flyerX-7, flight.y+12, flight.velocity < 0 ? 1 : 0);
}

runnerCanvas.addEventListener('pointerdown', flap);
window.addEventListener('keydown', event => {
  if (phase === 'flight' && !event.repeat && ['Space', 'ArrowUp'].includes(event.code) &&
      !event.target.closest('button, input, dialog')) {
    event.preventDefault();
    flap();
  }
});

