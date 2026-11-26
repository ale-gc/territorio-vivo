/* El inventario se genera al preparar una versión; nunca se cachean rutas libres. */
importScripts('./pwa-recursos.js');
const {version, bytes, files} = self.TV_BUNDLE;
const scope = self.registration.scope;
const prefix = 'territorio-vivo:' + scope + ':';
const name = prefix + version;
const marker = new URL('.copia-completa', scope).href;
const resources = new Map(Object.entries(files).map(([path, hash]) => [new URL(path, scope).href, hash]));
const total = resources.size;
let running, complete, count = 0;

async function inspect() {
  const cache = await caches.open(name);
  const keys = new Set((await cache.keys()).map(key => key.url));
  count = [...resources.keys()].filter(url => keys.has(url)).length;
  complete = count === total && keys.has(marker);
  if (!complete && keys.has(marker)) await cache.delete(marker);
  return complete;
}

function state(type) { return {app:'territorio-vivo', type, version, count, total, bytes}; }

async function announce(type) {
  const clients = await self.clients.matchAll({includeUncontrolled:true});
  for (const client of clients) client.postMessage(state(type));
}

async function download() {
  if (await inspect()) return announce('ready');
  const cache = await caches.open(name);
  // Los archivos comprobados sobreviven a una interrupción. El marcador se escribe al final.
  for (const [url, expected] of resources) {
    if (await cache.match(url)) continue;
    const response = await fetch(url, {cache:'no-store', redirect:'error', credentials:'same-origin', signal:AbortSignal.timeout(90000)});
    if (!response.ok) throw Error('Recurso no disponible');
    let data = await response.clone().arrayBuffer();
    if (/\.(html|css|js|svg|webmanifest)$/.test(url)) {
      data = new TextEncoder().encode(new TextDecoder('utf-8', {ignoreBOM:true}).decode(data).replace(/\r\n/g,'\n'));
    }
    const digest = await crypto.subtle.digest('SHA-256', data);
    const actual = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,'0')).join('');
    if (actual !== expected) throw Error('El recurso pertenece a otra versión');
    await cache.put(url, response);
    count++;
    await announce('progress');
  }
  await cache.put(marker, new Response(version));
  complete = true;
  await announce('ready');
}

function prepare() {
  if (!running) running = download().catch(async err => {
    complete = false;
    await announce('error');
    throw err;
  }).finally(() => { running = null; });
  return running;
}

self.addEventListener('install', event => {
  // Una actualización de una copia guardada debe estar completa antes de sustituirla.
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key !== name && key.startsWith(prefix) && await (await caches.open(key)).match(marker)) {
        await prepare();
        break;
      }
    }
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key !== name && key.startsWith(prefix)) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'prepare') event.waitUntil(prepare().catch(() => {}));
  if (event.data === 'status') event.waitUntil((async () => {
    try {
      if (!running) await inspect();
    } catch {
      event.source?.postMessage(state('error'));
      return;
    }
    event.source?.postMessage(state(complete ? 'ready' : running ? 'progress' : count ? 'partial' : 'idle'));
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  url.search = '';
  url.hash = '';
  if (url.href === scope) url.pathname += 'index.html';
  if (!resources.has(url.href)) return;
  event.respondWith((async () => {
    if (complete === undefined && !running) {
      try { await inspect(); } catch { return fetch(event.request); }
    }
    if (complete) {
      const saved = await (await caches.open(name)).match(url.href);
      if (saved) return saved;
      complete = false;
      await announce('partial');
    }
    return fetch(event.request);
  })());
});
