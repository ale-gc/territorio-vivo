/* Opciones locales independientes de la navegación educativa. */
(() => {
  const panel = document.createElement('section');
  panel.className = 'dispositivo';
  panel.id = 'en-tu-dispositivo';
  panel.setAttribute('aria-labelledby', 'dispositivo-titulo');
  panel.innerHTML = `
    <h2 id="dispositivo-titulo">Territorio vivo en tu dispositivo</h2>
    <div class="dispositivo-opciones">
      <div><h3>Usar sin conexión</h3>
        <p id="tv-estado" role="status">Comprobando la disponibilidad…</p>
        <progress id="tv-progreso" aria-label="Recursos guardados" hidden></progress>
        <button type="button" id="tv-guardar" hidden>Guardar en este dispositivo</button>
        <button type="button" id="tv-despues" hidden>Ahora no</button>
        <p id="tv-actualizacion" role="status"></p>
      </div>
      <div><h3>Instalar Territorio vivo</h3>
        <p>Abre la aplicación desde su propio icono.</p>
        <button type="button" id="tv-instalar" hidden>Instalar</button>
        <details id="tv-instrucciones"><summary>Cómo instalar</summary><p></p></details>
        <p id="tv-instalada" role="status"></p>
      </div>
    </div>`;
  document.querySelector('main').after(panel);
  const invitation = document.querySelector('.entry-invitation');
  if (invitation) {
    const shortcut = document.createElement('a');
    shortcut.className = 'text-link';
    shortcut.href = '#en-tu-dispositivo';
    shortcut.textContent = 'Instalar o guardar sin conexión';
    invitation.append(shortcut);
  }
  const get = id => panel.querySelector('#tv-' + id);
  const save = get('guardar'), later = get('despues'), progress = get('progreso');
  const status = get('estado'), update = get('actualizacion');
  const install = get('instalar'), instructions = get('instrucciones');
  const topInstall = document.createElement('button');
  topInstall.type = 'button';
  topInstall.className = 'tv-install-header';
  topInstall.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v11m-4-4 4 4 4-4M4 16v4h16v-4"/></svg> Instalar aplicación';
  document.querySelector('.app-header').append(topInstall);
  function showInstructions() {
    instructions.open = true;
    instructions.querySelector('summary').focus();
    instructions.scrollIntoView({block:'center'});
  }
  topInstall.onclick = () => prompt ? install.click() : showInstructions();
  const appleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  instructions.querySelector('p').textContent = appleMobile
    ? 'Abre la página en Safari, pulsa Compartir y Añadir a pantalla de inicio. Si aparece «Abrir como app web», actívalo. Abre el nuevo icono con conexión para comprobar tu copia.'
    : 'Busca la opción de instalar esta página en el menú del navegador o en la barra de direcciones. Si no aparece, puedes guardar la página en favoritos y usarla desde aquí.';
  let prompt, registration, mode;
  const supported = window.isSecureContext && location.protocol !== 'file:' && 'serviceWorker' in navigator;
  function installed() {
    topInstall.hidden = true;
    install.hidden = instructions.hidden = true;
    get('instalada').textContent = 'Abierta como aplicación o instalada en este dispositivo.';
  }
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) installed();
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    prompt = event;
    if (!instructions.hidden) install.hidden = false;
  });
  install.onclick = async () => {
    const pending = prompt;
    prompt = null;
    install.hidden = true;
    if (pending) {
      try { await pending.prompt(); await pending.userChoice; }
      catch { showInstructions(); }
    }
  };
  window.addEventListener('appinstalled', installed);
  if (!supported) {
    status.textContent = 'Para guardar una copia, abre el sitio con HTTPS en un navegador compatible.';
    return;
  }
  const worker = () => navigator.serviceWorker.controller || registration?.active;
  const ask = () => worker()?.postMessage('status');
  let deferred = false;
  try { deferred = localStorage.getItem('tv.posponer') === '1'; } catch {}
  function postpone(value) {
    deferred = value;
    try { localStorage.setItem('tv.posponer', value ? '1' : '0'); } catch {}
  }
  function render(info) {
    mode = info.type;
    const busy = mode === 'progress', ready = mode === 'ready';
    progress.hidden = !busy;
    progress.max = info.total;
    progress.value = info.count;
    const size = (info.bytes / 1e6).toLocaleString('es-CO', {maximumFractionDigits:1});
    const messages = {
      idle: deferred ? 'Puedes guardar las lecturas y actividades cuando te convenga.' : 'Guarda todas las páginas, imágenes y actividades, incluso las que aún no has abierto.',
      partial: 'Quedaron recursos por guardar. Con conexión puedes continuar la descarga.',
      progress: 'Guardando en este dispositivo…',
      ready: 'Listo para usar sin conexión. Los enlaces externos requieren Internet.',
      error: 'La descarga quedó pendiente. Revisa tu conexión y el espacio disponible, y vuelve a intentarlo.'
    };
    status.textContent = messages[mode];
    save.hidden = busy;
    save.disabled = ready && !navigator.onLine;
    save.textContent = ready ? 'Buscar actualizaciones' : mode === 'idle' ? 'Guardar ahora · ' + size + ' MB' : 'Reintentar descarga';
    later.hidden = mode !== 'idle' || deferred;
  }
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.app === 'territorio-vivo' && event.source === worker()) render(event.data);
  });
  later.onclick = () => { postpone(true); ask(); };
  function waiting() {
    update.textContent = 'Hay una versión nueva. Cierra todas las ventanas de Territorio vivo y vuelve a abrir la aplicación.';
  }
  save.onclick = async () => {
    if (!registration) { connect(); return; }
    if (mode !== 'ready') {
      postpone(false);
      save.disabled = true;
      status.textContent = 'Preparando la descarga…';
      worker()?.postMessage('prepare');
      return;
    }
    if (registration.waiting) { waiting(); return; }
    save.disabled = true;
    update.textContent = 'Buscando actualizaciones…';
    try {
      await registration.update();
      if (registration.waiting) waiting();
      else if (!registration.installing) update.textContent = 'Tienes la versión disponible.';
    } catch { update.textContent = 'No se pudo comprobar la actualización. Tu copia sigue disponible.'; }
    save.disabled = !navigator.onLine;
  };
  async function connect() {
    try {
      save.hidden = true;
      registration = await navigator.serviceWorker.register('./sw.js', {updateViaCache:'none'});
      const first = registration.installing;
      if (first && !registration.active) {
        first.addEventListener('statechange', () => {
          if (first.state === 'redundant' && !registration?.active) {
            registration = null;
            status.textContent = 'La preparación se interrumpió. Puedes volver a intentarlo con conexión.';
            save.textContent = 'Reintentar';
            save.hidden = save.disabled = false;
          }
        });
      }
      registration.addEventListener('updatefound', () => {
        const next = registration.installing;
        if (!next || !registration.active) return;
        update.textContent = 'Preparando una actualización…';
        next.addEventListener('statechange', () => {
          if (next.state === 'installed') waiting();
          if (next.state === 'redundant') update.textContent = 'La actualización quedó pendiente. Puedes volver a comprobarla.';
        });
      });
      await navigator.serviceWorker.ready;
      if (registration.waiting) waiting();
      ask();
    } catch {
      registration = null;
      status.textContent = 'No se pudo preparar el almacenamiento en este navegador.';
      save.textContent = 'Volver a comprobar';
      save.hidden = false;
      save.disabled = false;
    }
  }
  navigator.serviceWorker.addEventListener('controllerchange', ask);
  window.addEventListener('pageshow', ask);
  for (const name of ['online','offline']) window.addEventListener(name, ask);
  connect();
})();
