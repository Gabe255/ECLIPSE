const CONTINUE_KEY = 'eclipse-continue-playing';

const ENTERTAINMENT_APPS = [
  { name:'YouTube', packages:['com.google.android.youtube'], family:'VIDEO', mark:'▶' },
  { name:'Netflix', packages:['com.netflix.mediaclient'], family:'STREAMING', mark:'N' },
  { name:'Disney+', packages:['com.disney.disneyplus'], family:'STREAMING', mark:'D+' },
  { name:'Hulu', packages:['com.hulu.plus','com.hulu.livingroomplus'], family:'STREAMING', mark:'h' },
  { name:'Plex', packages:['com.plexapp.android'], family:'MEDIA', mark:'P' },
  { name:'Spotify', packages:['com.spotify.music'], family:'MUSIC', mark:'♫' }
];

export function mountPlatformSuite({ $, notify, games, getInstalledApps, launchApp, openGame, showView, onWidgetsReorder }) {
  const main = document.querySelector('.main');
  const rail = document.querySelector('.rail');
  if (!main || !rail) return {};

  // The Entertainment Hub is a real app directory: unavailable apps are clearly marked,
  // and only packages returned by Android's installed-app scan can be launched.
  if (!document.getElementById('entertainmentView')) {
    const view = document.createElement('section');
    view.id = 'entertainmentView';
    view.className = 'view hidden';
    view.innerHTML = `
      <div class="section-head"><div><p class="eyebrow">BEYOND THE GAME LIBRARY</p><h2>ENTERTAINMENT HUB</h2><p class="settings-note">Your installed streaming and media apps, in one place.</p></div><button class="subtle-btn" id="refreshEntertainment">REFRESH APPS</button></div>
      <section class="entertainment-feature"><div><p class="eyebrow">ECLIPSE MEDIA SPACE</p><h3>ONE HOME FOR <em>EVERYTHING.</em></h3><p>Launch an app that's installed on this device. ECLIPSE never pretends an unavailable app is installed.</p></div><span class="entertainment-orbit" aria-hidden="true">E</span></section>
      <div class="entertainment-app-grid" id="entertainmentAppGrid"></div>
      <p class="settings-note" id="entertainmentStatus" role="status">Scan your Android apps library to discover installed media apps.</p>`;
    document.getElementById('settingsView')?.before(view);
  }

  let nav = rail.querySelector('[data-view="entertainment"]');
  if (!nav) {
    nav = document.createElement('button');
    nav.className = 'rail-btn';
    nav.dataset.view = 'entertainment';
    nav.type = 'button';
    nav.textContent = '▶';
    nav.setAttribute('aria-label', 'Entertainment Hub');
    nav.title = 'Entertainment Hub';
    rail.insertBefore(nav, rail.querySelector('[data-view="settings"]'));
    nav.addEventListener('click', () => { showView('entertainment'); renderEntertainment(); });
  }

  if (!document.getElementById('continuePlayingShelf')) {
    const shelf = document.createElement('section');
    shelf.id = 'continuePlayingShelf';
    shelf.className = 'continue-playing-shelf';
    shelf.setAttribute('aria-label', 'Continue playing');
    document.getElementById('homeGamesShelf')?.before(shelf);
  }

  function readContinue() {
    try { return JSON.parse(localStorage.getItem(CONTINUE_KEY) || '[]'); } catch { return []; }
  }
  function recordGameLaunch(game) {
    if (!game?.id) return;
    const history = readContinue().filter(item => item.id !== game.id);
    history.unshift({ id: game.id, playedAt: Date.now(), launches: (readContinue().find(item => item.id === game.id)?.launches || 0) + 1 });
    localStorage.setItem(CONTINUE_KEY, JSON.stringify(history.slice(0, 24)));
    renderContinuePlaying();
  }
  function renderContinuePlaying() {
    const shelf = document.getElementById('continuePlayingShelf');
    if (!shelf) return;
    const history = readContinue();
    const recent = history.map(item => ({ item, game: games.find(game => game.id === item.id) })).filter(entry => entry.game);
    shelf.classList.toggle('hidden', recent.length === 0);
    if (!recent.length) { shelf.replaceChildren(); return; }
    shelf.innerHTML = '<div class="home-shelf-heading"><div><p class="eyebrow">YOUR RECENT SESSIONS</p><h2>CONTINUE PLAYING</h2></div><span>' + recent.length + ' RECENT</span></div><div class="continue-playing-row">' +
      recent.slice(0, 10).map(({game}) => '<button class="continue-game-card" type="button" data-continue-game="' + escapeAttr(game.id) + '"><span class="continue-game-art"><i>' + escapeHTML(game.system || 'E') + '</i></span><b>' + escapeHTML(game.title) + '</b><small>' + escapeHTML(game.system || 'GAME') + '</small></button>').join('') + '</div>';
    shelf.querySelectorAll('[data-continue-game]').forEach(button => {
      const game = games.find(item => item.id === button.dataset.continueGame);
      const art = game?.artwork?.grid;
      if (art && /^https:\/\//i.test(art)) {
        const image = document.createElement('img'); image.src = art; image.alt = ''; image.loading = 'lazy';
        button.querySelector('.continue-game-art')?.prepend(image);
      }
      button.addEventListener('click', () => game && openGame(game));
    });
  }

  function renderEntertainment() {
    const grid = document.getElementById('entertainmentAppGrid');
    if (!grid) return;
    const installed = getInstalledApps() || [];
    const cards = ENTERTAINMENT_APPS.map(def => {
      const app = installed.find(item => def.packages.includes(item.packageName)) ||
        installed.find(item => def.name.toLowerCase() === String(item.name || '').toLowerCase());
      return { ...def, app };
    });
    const discovered = installed.filter(app => /youtube|netflix|disney|hulu|plex|spotify|prime video|paramount|peacock|max\b|tubi|crunchyroll/i.test(app.name || ''));
    const extras = discovered.filter(app => !cards.some(card => card.app?.packageName === app.packageName));
    grid.innerHTML = cards.map(card => '<article class="entertainment-app-card ' + (card.app ? 'is-installed' : 'is-missing') + '"><span class="entertainment-app-mark">' + card.mark + '</span><div><b>' + escapeHTML(card.name) + '</b><small>' + card.family + '</small></div><button type="button" ' + (card.app ? 'data-entertainment-launch="' + escapeAttr(card.app.packageName) + '"' : 'disabled') + '>' + (card.app ? 'OPEN ↗' : 'NOT INSTALLED') + '</button></article>').join('') +
      extras.map(app => '<article class="entertainment-app-card is-installed"><span class="entertainment-app-mark">' + escapeHTML((app.name || '?').slice(0, 1).toUpperCase()) + '</span><div><b>' + escapeHTML(app.name) + '</b><small>DISCOVERED APP</small></div><button type="button" data-entertainment-launch="' + escapeAttr(app.packageName) + '">OPEN ↗</button></article>').join('');
    grid.querySelectorAll('[data-entertainment-launch]').forEach(button => button.addEventListener('click', () => launchApp(button.dataset.entertainmentLaunch)));
    const status = document.getElementById('entertainmentStatus');
    if (status) status.textContent = installed.length ? 'Showing installed media apps found on this device. Missing apps stay visible but cannot be opened.' : 'No Android app scan yet. Open Apps Library and run SCAN DEVICE to populate this hub.';
  }

  // Drag-and-drop is an additional dashboard editing method; arrow controls remain available.
  const widgetGrid = document.getElementById('widgetGrid');
  if (widgetGrid) {
    let dragged = null;
    widgetGrid.addEventListener('dragstart', event => {
      const card = event.target.closest('[data-widget]');
      if (!card) return;
      dragged = card.dataset.widget;
      card.classList.add('is-dragging');
      event.dataTransfer?.setData('text/plain', dragged);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    });
    widgetGrid.addEventListener('dragover', event => {
      if (!dragged || !event.target.closest('[data-widget]')) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    });
    widgetGrid.addEventListener('drop', event => {
      const target = event.target.closest('[data-widget]');
      if (!dragged || !target || target.dataset.widget === dragged) return;
      event.preventDefault();
      const order = [...widgetGrid.querySelectorAll('[data-widget]')].map(card => card.dataset.widget);
      const from = order.indexOf(dragged), to = order.indexOf(target.dataset.widget);
      if (from < 0 || to < 0) return;
      order.splice(to, 0, order.splice(from, 1)[0]);
      onWidgetsReorder(order);
      dragged = null;
    });
    widgetGrid.addEventListener('dragend', () => {
      dragged = null;
      widgetGrid.querySelectorAll('.is-dragging').forEach(card => card.classList.remove('is-dragging'));
    });
    const observer = new MutationObserver(() => widgetGrid.querySelectorAll('[data-widget]').forEach(card => {
      card.draggable = true;
      card.title = 'Drag to rearrange this widget';
    }));
    observer.observe(widgetGrid, { childList: true });
  }

  // Performance dashboard reports only browser/device values the platform actually exposes.
  const perfButton = document.createElement('button');
  perfButton.className = 'performance-launcher';
  perfButton.type = 'button';
  perfButton.textContent = '◉ PERFORMANCE';
  perfButton.setAttribute('aria-label', 'Open ECLIPSE Performance Dashboard');
  document.querySelector('.top-actions')?.append(perfButton);
  const perfModal = document.createElement('div');
  perfModal.className = 'performance-backdrop hidden';
  perfModal.id = 'eclipsePerformanceDashboard';
  perfModal.innerHTML = `
    <section class="performance-panel" role="dialog" aria-modal="true" aria-labelledby="performanceTitle">
      <header class="experience-head"><div><p class="eyebrow">LIVE DEVICE SNAPSHOT</p><h2 id="performanceTitle">PERFORMANCE <em>DASHBOARD</em></h2></div><button class="performance-close" type="button" aria-label="Close">×</button></header>
      <div class="performance-metrics" id="performanceMetrics"></div>
      <p class="studio-hint">These are available browser/device diagnostics, not CPU/GPU benchmark scores. Android may hide some values.</p>
      <button class="studio-secondary" id="refreshPerformance" type="button">REFRESH SNAPSHOT</button>
    </section>`;
  document.body.append(perfModal);
  function renderPerformance() {
    const memory = performance.memory;
    const data = [
      ['DISPLAY', window.screen.width + ' × ' + window.screen.height],
      ['APP VIEWPORT', window.innerWidth + ' × ' + window.innerHeight],
      ['PIXEL RATIO', String(window.devicePixelRatio || 1) + '×'],
      ['CPU THREADS', navigator.hardwareConcurrency ? String(navigator.hardwareConcurrency) : 'Not exposed'],
      ['DEVICE MEMORY', navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Not exposed'],
      ['JS HEAP', memory ? Math.round(memory.usedJSHeapSize / 1048576) + ' / ' + Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB' : 'Not exposed'],
      ['GAMEPAD', [...(navigator.getGamepads?.() || [])].some(pad => pad?.connected) ? 'Connected' : 'Not detected'],
      ['NETWORK', navigator.connection?.effectiveType || 'Not exposed']
    ];
    const root = document.getElementById('performanceMetrics');
    if (root) root.innerHTML = data.map(([label,value]) => '<article><small>' + label + '</small><b>' + escapeHTML(value) + '</b></article>').join('');
  }
  const closePerf = () => perfModal.classList.add('hidden');
  perfButton.addEventListener('click', () => { renderPerformance(); perfModal.classList.remove('hidden'); });
  perfModal.querySelector('.performance-close').addEventListener('click', closePerf);
  perfModal.addEventListener('click', event => { if (event.target === perfModal) closePerf(); });
  perfModal.querySelector('#refreshPerformance').addEventListener('click', renderPerformance);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePerf(); });

  document.getElementById('refreshEntertainment')?.addEventListener('click', renderEntertainment);
  window.addEventListener('gamepadconnected', event => {
    const status = document.getElementById('controllerStatus');
    if (status) status.textContent = 'Controller detected automatically: ' + (event.gamepad?.id || 'Gamepad') + '. Standard navigation is active; no setup screen is needed.';
  });
  window.addEventListener('gamepaddisconnected', () => {
    const status = document.getElementById('controllerStatus');
    if (status) status.textContent = 'Controller disconnected. ECLIPSE will detect the next controller automatically.';
  });

  renderContinuePlaying();
  renderEntertainment();
  return { recordGameLaunch, renderContinuePlaying, renderEntertainment, renderPerformance };
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function escapeAttr(value) { return escapeHTML(value).replace(/[`]/g, '&#96;'); }
