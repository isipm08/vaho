const roomInput = document.querySelector('#roomInput');
const statusEl = document.querySelector('#status');
const pad = document.querySelector('#pad');
const connectButton = document.querySelector('#connect');
const towerPad = document.querySelector('#towerPad');
const pointerModeButton = document.querySelector('#pointerMode');
let swipe = null;
roomInput.value = Tacto.sala();
const preview = new URLSearchParams(location.search).has('preview') && typeof BroadcastChannel === 'function'
  ? new BroadcastChannel('vaho-preview-' + roomInput.value) : null;

function controlConnected() { return Boolean(preview || client?.connected); }

function sendControl(kind, message) {
  if (preview) preview.postMessage({ kind, message });
  else if (client?.connected) client.publish(topic + '/' + kind, JSON.stringify(message));
}

let client;
let topic;
let phase = 'reveal';
let last = 0;
let pointerMode = false;
const tapRadius = 13;
const tapWindow = 650;
let pointerFrame = null;
let pendingPointer = null;

function flushPointer() {
  if (pointerFrame !== null) cancelAnimationFrame(pointerFrame);
  pointerFrame = null;
  if (!pendingPointer) return;
  sendControl('pointer', pendingPointer);
  pendingPointer = null;
}

function padPosition(event) {
  const bounds = towerPad.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(1, (event.clientX-bounds.left)/Math.max(1, bounds.width))),
    y: Math.max(0, Math.min(1, (event.clientY-bounds.top)/Math.max(1, bounds.height))),
  };
}

function queuePointer(event) {
  pendingPointer = { phase, ...padPosition(event) };
  if (pointerFrame === null) pointerFrame = requestAnimationFrame(flushPointer);
}
let audioEnabled = false;
const buttonClick = new Audio('assets/click.mp3?v=new-click');
buttonClick.preload = 'auto';
buttonClick.volume = .4;
let retryClickFor = null;
let clickContext;
let clickBuffer;
let clickOffset = 0;
let clickGain;

function preparePhoneClick() {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return;
  if (clickContext) {
    clickContext.resume().catch(() => {});
    return;
  }
  clickContext = new Context({ latencyHint: 'interactive' });
  clickGain = clickContext.createGain();
  clickGain.gain.value = .4;
  clickGain.connect(clickContext.destination);
  clickContext.resume().catch(() => {});
  fetch('assets/click.mp3?v=new-click').then(response => response.arrayBuffer())
    .then(bytes => clickContext.decodeAudioData(bytes))
    .then(buffer => {
      clickOffset = clickOnset(buffer);
      clickBuffer = buffer;
    }).catch(() => {});
}

function playButtonClick(event) {
  const button = event.target.closest('button');
  if (!audioEnabled || !button || button.disabled) return;
  retryClickFor = null;
  if (clickBuffer && clickContext.state === 'running') {
    const source = clickContext.createBufferSource();
    source.buffer = clickBuffer;
    source.connect(clickGain);
    source.onended = () => source.disconnect();
    source.start(0, clickOffset);
    return;
  }
  buttonClick.currentTime = clickOffset;
  buttonClick.play().catch(error => {
    if (event.type === 'pointerdown' && error.name === 'NotAllowedError') retryClickFor = button;
  });
}

document.addEventListener('pointerdown', event => {
  if (event.isPrimary && event.button === 0) playButtonClick(event);
}, true);
document.addEventListener('click', event => {
  if (event.detail === 0 || (retryClickFor && retryClickFor === event.target.closest('button'))) {
    playButtonClick(event);
  }
}, true);

function setMode(value) {
  if (!['reveal', 'ready', 'game', 'done', 'runnerLost', 'flight', 'flightLost', 'flightWon',
        'towerRun', 'towerWalk', 'towerClimb', 'towerLost', 'ending'].includes(value)) return;
  swipe = null;
  contacts.clear();
  if (touchFrame !== null) cancelAnimationFrame(touchFrame);
  touchFrame = null;
  pendingPointer = null;
  if (pointerFrame !== null) cancelAnimationFrame(pointerFrame);
  pointerFrame = null;
  phase = value;
  if (value !== 'reveal') pointerMode = false;
  pad.hidden = value !== 'reveal' || pointerMode;
  document.querySelector('#revealHelp').hidden = pad.hidden;
  pointerModeButton.hidden = value !== 'reveal';
  pointerModeButton.textContent = pointerMode ? 'Volver a despejar' : 'Mover punto';
  const trackpadVisible = value !== 'ending' && (value !== 'reveal' || pointerMode);
  document.querySelector('#towerControls').hidden = !trackpadVisible;
  towerPad.textContent = '';
  document.querySelector('#towerHint').textContent = {
    reveal: 'Mueve el dedo para señalar y da un toque para pulsar un botón.',
    ready: 'Señala «Empezar aventura» con el punto y toca para pulsarlo.',
    game: 'Desliza arriba para saltar y abajo para agacharte.',
    done: 'Señala el botón de la siguiente etapa y toca.',
    flight: 'Señala el escenario y toca para impulsarte.',
    flightWon: 'Señala el botón de la siguiente etapa y toca.',
    towerRun: 'Desliza hacia los lados para esquivar las rocas.',
    towerWalk: 'Desliza a la derecha para caminar hasta la escalera.',
    towerClimb: 'Desliza hacia arriba varias veces para subir la torre.',
  }[value] || 'Apunta a «Reiniciar etapa» y toca para pulsarlo.';
}

pointerModeButton.onclick = () => {
  if (phase !== 'reveal') return;
  sendControl('touch', { n: 0, p: [] });
  pointerMode = !pointerMode;
  setMode(phase);
};

connectButton.onclick = async () => {
  preparePhoneClick();
  const room = Tacto.clean(roomInput.value);
  if (room.length < 4) {
    statusEl.textContent = 'Escribe una sala de al menos 4 caracteres';
    return;
  }
  connectButton.disabled = true;
  if (client) client.end();
  setMode('reveal');
  const id = 'mano-' + Tacto.rand(8);
  topic = 'tacto/' + room + '/' + id;
  const modeTopic = 'tacto/' + room + '/stage/mode';
  statusEl.textContent = 'Conectando…';
  try {
    const result = await Tacto.open({
      clientId: id,
      will: { topic: topic + '/status', payload: JSON.stringify({online:false}), retain:true, qos:0 },
    });
    client = result.client;
    const connection = client;
    connection.on('connect', () => {
      statusEl.textContent = 'Conectado · ' + room;
      document.body.classList.add('controller-connected');
      document.querySelector('#connectionSettings').open = false;
      connectButton.disabled = false;
      connection.publish(topic + '/status', JSON.stringify({online:true,name:'Mano Vaho'}), {retain:true});
      connection.subscribe(modeTopic, error => {
        if (!error) connection.publish(topic + '/hello', '{}');
      });
    });
    connection.on('message', (channel, payload) => {
      if (channel !== modeTopic || connection !== client) return;
      try {
        const mode = JSON.parse(payload.toString());
        audioEnabled = mode.audioEnabled === true;
        if (mode.phase !== phase) setMode(mode.phase);
      } catch {}
    });
    connection.on('offline', () => {
      if (connection !== client) return;
      statusEl.textContent = 'Sin conexión · reintentando';
      connectButton.disabled = false;
    });
    connection.on('error', () => {
      if (connection !== client) return;
      statusEl.textContent = 'Error MQTT · reintentando';
      connectButton.disabled = false;
    });
  } catch {
    statusEl.textContent = 'No se pudo cargar MQTT. Revisa internet.';
    connectButton.disabled = false;
  }
};

const contacts = new Map();
let touchFrame = null;
function flushTouch() {
  if (touchFrame !== null) cancelAnimationFrame(touchFrame);
  touchFrame = null;
  if (!controlConnected() || phase !== 'reveal') return;
  const bounds = pad.getBoundingClientRect();
  const points = [...contacts.values()].map((point, index) => ({
    i: index+1,
    x: Math.max(0, Math.min(1, (point.x-bounds.left)/Math.max(1, bounds.width))),
    y: Math.max(0, Math.min(1, (point.y-bounds.top)/Math.max(1, bounds.height))),
  }));
  sendControl('touch', { n:points.length, p:points });
}
pad.onpointerdown = event => {
  if (!controlConnected() || phase !== 'reveal' || event.button !== 0) return;
  event.preventDefault();
  pad.setPointerCapture(event.pointerId);
  contacts.set(event.pointerId, {x:event.clientX, y:event.clientY});
  flushTouch();
};
pad.onpointermove = event => {
  if (!contacts.has(event.pointerId)) return;
  event.preventDefault();
  contacts.set(event.pointerId, {x:event.clientX, y:event.clientY});
  if (touchFrame === null) touchFrame = requestAnimationFrame(flushTouch);
};
function endContact(event) {
  if (!contacts.has(event.pointerId)) return;
  contacts.delete(event.pointerId);
  flushTouch();
}
pad.onpointerup = endContact;
pad.onpointercancel = endContact;
pad.onlostpointercapture = endContact;

document.addEventListener('visibilitychange', () => {
  if (document.hidden && controlConnected() && phase === 'reveal') {
    sendControl('touch', {n:0,p:[]});
  }
});
towerPad.onpointerdown = event => {
  if (!event.isPrimary || event.button !== 0 || !controlConnected()) return;
  towerPad.setPointerCapture(event.pointerId);
  swipe = { id: event.pointerId, x: event.clientX, y: event.clientY,
    started: performance.now(), moved: false, used: false };
  sendControl('pointer', { phase, ...padPosition(event) });
};

towerPad.onpointermove = event => {
  if (swipe?.id !== event.pointerId || !controlConnected()) return;
  const dx = event.clientX - swipe.x;
  const dy = event.clientY - swipe.y;
  if (Math.hypot(dx, dy) > tapRadius) swipe.moved = true;
  const width = Math.max(1, towerPad.clientWidth);
  const height = Math.max(1, towerPad.clientHeight);
  queuePointer(event);
  if (phase === 'game' && !swipe.used && Math.abs(dy) >= 14 && Math.abs(dy) > Math.abs(dx)) {
    sendControl('runner', { direction: dy < 0 ? 'up' : 'down' });
    swipe.used = true;
  } else if (phase === 'towerRun' && !swipe.used && Math.abs(dx) >= 16 && Math.abs(dx) > Math.abs(dy)) {
    sendControl('tower', { direction: dx < 0 ? 'left' : 'right' });
    swipe.used = true;
  } else if (phase === 'towerWalk' && dx >= 10) {
    sendControl('tower', { direction: 'right', amount: dx/width*.8 });
    swipe.used = true;
    swipe.x = event.clientX;
  } else if (phase === 'towerClimb' && dy <= -10) {
    sendControl('tower', { direction: 'up', amount: -dy/height*.8 });
    swipe.used = true;
    swipe.y = event.clientY;
  }
};
towerPad.onpointerup = event => {
  if (swipe?.id !== event.pointerId) return;
  flushPointer();
  if (!swipe.moved && !swipe.used && Math.hypot(event.clientX-swipe.x, event.clientY-swipe.y) <= tapRadius && performance.now()-swipe.started <= tapWindow) {
    sendControl('pointer', { phase, ...padPosition(event), tap: true });
  }
  swipe = null;
};
towerPad.onlostpointercapture = () => { flushPointer(); swipe = null; };

if (preview) {
  connectButton.hidden = true;
  roomInput.readOnly = true;
  statusEl.textContent = 'Vista previa local';
  document.body.classList.add('controller-connected');
  document.querySelector('#connectionSettings').open = false;
  preview.onmessage = event => {
    if (event.data?.kind === 'mode' && event.data.message.phase !== phase) setMode(event.data.message.phase);
  };
  sendControl('hello', {});
}

