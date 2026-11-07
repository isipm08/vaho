const $=s=>document.querySelector(s), canvas=$('#fog'),ctx=canvas.getContext('2d'),tacto=new Tacto();let w=0,h=0,lastTime=0,lastTouch=0,lastMotion=-Infinity,previous=new Map(),cursor={x:.5,y:.5};const points=new Map();
function fill(alpha=1){ctx.globalCompositeOperation='source-over';ctx.fillStyle=`rgba(210,237,229,${alpha})`;ctx.fillRect(0,0,w,h);}function resize() {
  const bounds = canvas.getBoundingClientRect();
  const scale = Math.min(1, 1000 / bounds.width);
  const width = Math.round(bounds.width * scale);
  const height = Math.round(bounds.height * scale);
  if (!width || !height || (width === w && height === h)) return;
  let savedFog;
  if (w && h) {
    savedFog = document.createElement('canvas');
    savedFog.width = w;
    savedFog.height = h;
    savedFog.getContext('2d').drawImage(canvas, 0, 0);
  }
  w = canvas.width = width;
  h = canvas.height = height;
  previous.clear();
  if (savedFog) ctx.drawImage(savedFog, 0, 0, w, h);
  else fill();
}
new ResizeObserver(resize).observe(canvas);
const brushes = new Map();
function reveal(x, y, n = 1, id = 'remote') {
  if (!w || !h) return;
  x = Math.max(0, Math.min(1, x));
  y = Math.max(0, Math.min(1, y));
  const old = previous.get(id);
  const radius = Math.max(1, Math.round(Math.min(w, h) * (n > 1 ? .105 : .065)));
  const px = x*w;
  const py = y*h;
  const distance = old ? Math.hypot(px-old.x, py-old.y) : 0;
  lastTouch = performance.now();
  if (old && distance < .7 && old.radius === radius) return;
  if (!brushes.has(radius)) {
    const brush = document.createElement('canvas');
    brush.width = brush.height = radius*2;
    const painter = brush.getContext('2d');
    const gradient = painter.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(.7, 'rgba(0,0,0,.95)');
    gradient.addColorStop(1, 'transparent');
    painter.fillStyle = gradient;
    painter.fillRect(0, 0, brush.width, brush.height);
    if (brushes.size >= 4) brushes.clear();
    brushes.set(radius, brush);
  }
  const steps = Math.max(1, Math.ceil(distance/Math.max(1, radius*.35)));
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 1; i <= steps; i++) {
    const a = old ? old.x+(px-old.x)*i/steps : px;
    const b = old ? old.y+(py-old.y)*i/steps : py;
    ctx.drawImage(brushes.get(radius), a-radius, b-radius);
    followTouch(a/w, b/h, radius);
    if (phase !== 'reveal') break;
  }
  previous.set(id, {x:px, y:py, radius});
  cursor = {x,y};
  if (old) lastMotion = lastTouch;
  $('#hint').style.opacity = '0';
}
canvas.onpointerdown=e=>{canvas.setPointerCapture(e.pointerId);points.set(e.pointerId,e);previous.delete(e.pointerId);};canvas.onpointermove=e=>{if(points.has(e.pointerId))points.set(e.pointerId,e);};for(const ev of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(ev,e=>{points.delete(e.pointerId);previous.delete(e.pointerId);});canvas.onkeydown=e=>{const d={ArrowLeft:[-.035,0],ArrowRight:[.035,0],ArrowUp:[0,-.035],ArrowDown:[0,.035]}[e.key];if(d&&phase==='reveal'){e.preventDefault();reveal(cursor.x+d[0],cursor.y+d[1],1,'keyboard');}};
let remote=null;tacto.on('estado',s=>$('#connection').textContent=s==='conectado'?'● Sala '+tacto.sala:'MQTT · '+s);tacto.on('error',()=>$('#connection').textContent='MQTT no disponible · puedes usar el ratón');tacto.connect().catch(()=>$('#connection').textContent='Sin MQTT · prueba con el ratón');
const phone=new URL('phone.html',location.href);phone.searchParams.set('sala',tacto.sala);$('#phoneLink').href=phone;$('#phoneLink').textContent=phone.href;$('#room').textContent='Código de sala: '+tacto.sala;$('#join').onclick=()=>$('#pair').showModal();$('#close').onclick=()=>$('#pair').close();$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(phone.href);$('#copy').textContent='Enlace copiado';}catch{$('#copy').textContent='Selecciona y copia el enlace de arriba';}};
fetch(new URL('info', document.baseURI), { cache: 'no-store' })
  .then(response => response.ok ? response.json() : null)
  .then(info => {
    if (!info?.phoneUrl) return;
    const address = new URL(info.phoneUrl);
    address.searchParams.set('sala', tacto.sala);
    phone.href = address.href;
    $('#phoneLink').href = address.href;
    $('#phoneLink').textContent = address.href;
  }).catch(() => {});

const audioButton = $('#audio');
const effectFiles = {
  duck: 'assets/agacharse.mp3',
  jump: 'assets/salto.mp3',
  flap: 'assets/salto-etapa-2.mp3',
  step: 'assets/caminar.mp3',
  click: 'assets/click.mp3?v=new-click',
  countdown: 'assets/cuenta-regresiva.mp3',
  slide: 'assets/deslizar.mp3',
  kiss: 'assets/besos.mp3',
};
const effects = new Map();
const activeEffects = new Map();
const mediaEffects = new Map();
let desktopClickOffset = 0;
let effectContext;
let melody;
let audioEnabled = false;

for (const [name, file] of Object.entries(effectFiles)) {
  const media = new Audio(file);
  media.preload = 'auto';
  media.volume = name === 'click' ? .4 : .85;
  mediaEffects.set(name, media);
}

async function enableEffects() {
  const Context = typeof AudioContext === 'function' ? AudioContext : window.webkitAudioContext;
  if (!Context) return;
  effectContext ??= new Context();
  const ready = effectContext.resume();
  await Promise.allSettled([ready, ...Object.entries(effectFiles).map(async ([name, file]) => {
    if (effects.has(name)) return;
    const response = await fetch(file);
    if (!response.ok) throw new Error(`No se pudo cargar ${file}`);
    const buffer = await effectContext.decodeAudioData(await response.arrayBuffer());
    effects.set(name, buffer);
    if (name === 'click') desktopClickOffset = clickOnset(buffer);
  })]);
}

function stopEffect(name) {
  const source = activeEffects.get(name);
  if (source) {
    activeEffects.delete(name);
    source.stop();
  }
  mediaEffects.get(name)?.pause();
}

function playEffect(name, duration) {
  if (!audioEnabled) return;
  stopEffect(name);
  if (effectContext?.state === 'running' && effects.has(name)) {
    const source = effectContext.createBufferSource();
    const gain = effectContext.createGain();
    source.buffer = effects.get(name);
    if (duration) source.playbackRate.value = source.buffer.duration / duration;
    gain.gain.value = name === 'click' ? .4 : .85;
    source.connect(gain);
    gain.connect(effectContext.destination);
    activeEffects.set(name, source);
    source.onended = () => {
      if (activeEffects.get(name) === source) activeEffects.delete(name);
      source.disconnect();
      gain.disconnect();
    };
    source.start(0, name === 'click' ? desktopClickOffset : 0);
    return;
  }
  const media = mediaEffects.get(name);
  if (!media) return;
  media.muted = false;
  media.currentTime = name === 'click' ? desktopClickOffset : 0;
  media.playbackRate = duration && Number.isFinite(media.duration) ? media.duration / duration : 1;
  media.play().catch(error => console.warn(`No se pudo reproducir ${name}`, error));
}

function unlockMediaEffects() {
  for (const media of mediaEffects.values()) {
    media.muted = true;
    media.play().then(() => {
      if (media.muted) media.pause();
    }).catch(() => {}).finally(() => { media.muted = false; });
  }
}

function playButtonClick(event) {
  const button = event.target.closest('button');
  if (button && button !== audioButton && !button.disabled) playEffect('click');
}

document.addEventListener('pointerdown', event => {
  if (event.isPrimary && event.button === 0) playButtonClick(event);
}, true);
document.addEventListener('click', event => {
  if (event.detail === 0) playButtonClick(event);
}, true);

if (audioButton.dataset.melody) {
  audioButton.disabled = false;
  audioButton.textContent = 'Activar sonido';
  melody = new Audio(audioButton.dataset.melody);
  melody.loop = true;
  melody.volume = 0;
  audioButton.onclick = async () => {
    if (audioEnabled) {
      audioEnabled = false;
      melody.pause();
      for (const name of mediaEffects.keys()) stopEffect(name);
      audioButton.textContent = 'Activar sonido';
      publishMode();
      return;
    }
    audioEnabled = true;
    audioButton.textContent = 'Silenciar sonido';
    publishMode();
    unlockMediaEffects();
    const loading = enableEffects().catch(error => console.warn(error));
    melody.play().catch(error => console.warn(error));
    await loading;
  };
}

function frame(now) {
  const dt = Math.min(.1, (now-lastTime)/1000 || .016);
  lastTime = now;
  if (phase === 'reveal' && w && h) {
    for (const [id, event] of points) {
      const bounds = canvas.getBoundingClientRect();
      reveal((event.clientX-bounds.left)/bounds.width, (event.clientY-bounds.top)/bounds.height, points.size, id);
      if (phase !== 'reveal') break;
    }
    if (phase === 'reveal' && remote?.p.length && now-remote.at < 1200) {
      const point = remote.p[0];
      reveal(point.x, point.y, remote.p.length);
    }
  }
  if (melody && !melody.paused) {
    const moving = phase === 'reveal' && now-lastMotion < 220;
    const targetVolume = moving ? .28 + .52 * progress.value / unlockPercent : 0;
    melody.volume += (targetVolume-melody.volume) * (1-Math.exp(-dt*6));
  }
  updateRunner(dt);
  updateFlight(dt);
  updateTower(dt);
  drawRemotePointer(dt);
  if (now-lastTouch > 8000) $('#hint').style.opacity = '1';
  requestAnimationFrame(frame);
}


