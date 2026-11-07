const remotePointer = $('#remotePointer');
let pointerX = .5;
let pointerY = .5;

function clampPointer(value) { return Math.max(0, Math.min(.999, value)); }

function resetRemotePointer() {
  pointerX = pointerY = .5;
  remotePointer.hidden = true;
}

function drawRemotePointer() {
  if (remotePointer.hidden) return;
  const dialog = $('#pair');
  const layer = dialog.open ? dialog : document.body;
  if (layer && remotePointer.parentElement !== layer) layer.append(remotePointer);
  remotePointer.style.transform = `translate3d(${pointerX*window.innerWidth}px, ${pointerY*window.innerHeight}px, 0) translate(-50%, -50%)`;
}

function receivePointer(message) {
  if (message?.phase !== phase) return;
  if (phase === 'reveal') $('#hand').hidden = true;
  if (Number.isFinite(message.x) && Number.isFinite(message.y)) {
    pointerX = clampPointer(message.x);
    pointerY = clampPointer(message.y);
  } else if (Number.isFinite(message.dx) && Number.isFinite(message.dy)) {
    pointerX = clampPointer(pointerX + Math.max(-.5, Math.min(.5, message.dx)));
    pointerY = clampPointer(pointerY + Math.max(-.5, Math.min(.5, message.dy)));
  }
  remotePointer.hidden = false;
  drawRemotePointer();
  if (!message.tap) return;
  const target = document.elementFromPoint(pointerX*window.innerWidth, pointerY*window.innerHeight);
  const control = target?.closest('button, a[href]');
  if (control && !control.disabled) {
    control.click();
  } else if (phase === 'flight' && target === runnerCanvas) {
    flap();
  }
}
