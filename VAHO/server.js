const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const aedes = require('aedes')();
const { WebSocketServer, createWebSocketStream } = require('ws');

const port = Number(process.env.PORT || 8002);
const root = __dirname;
const addresses = Object.values(os.networkInterfaces()).flat()
  .filter(address => address.family === 'IPv4' && !address.internal);
const lan = addresses.find(address => address.address.startsWith('192.168.')) || addresses[0];
const phoneUrl = `http://${lan?.address || 'localhost'}:${port}/phone.html`;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ttf': 'font/ttf' };

const server = http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end(); return; }
  if (pathname === '/info') {
    response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify({ mqtt: true, phoneUrl }));
    return;
  }
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  const file = relative === 'vendor/mqtt.min.js'
    ? path.join(root, 'node_modules/mqtt/dist/mqtt.min.js') : path.resolve(root, relative);
  const extension = path.extname(file).toLowerCase();
  const allowed = relative === 'vendor/mqtt.min.js' ||
    (file.startsWith(root + path.sep) && path.relative(root, file).split(path.sep)[0] !== 'node_modules' &&
      file !== path.join(root, 'server.js') && Boolean(types[extension]));
  if (!allowed) { response.writeHead(404).end(); return; }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { response.writeHead(404).end(); return; }
    response.writeHead(200, {
      'Content-Type': types[extension], 'Content-Length': stat.size,
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(file).pipe(response);
  });
});

const sockets = new WebSocketServer({ server, path: '/mqtt' });
sockets.on('connection', socket => {
  socket._socket?.setNoDelay(true);
  const stream = createWebSocketStream(socket);
  stream.on('error', () => socket.terminate());
  aedes.handle(stream);
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `El puerto ${port} ya está ocupado.` : error.message);
  process.exitCode = 1;
});
server.listen(port, '0.0.0.0', () => {
  console.log(`Vaho en el computador: http://127.0.0.1:${port}/`);
  console.log(`Mando del teléfono: ${phoneUrl}`);
  console.log('MQTT local activo. Deja esta ventana abierta.');
});
