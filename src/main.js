import './style.css';

const systems = [
  { name: 'All Games', count: '04', icon: '✦' },
  { name: 'Nintendo', count: '02', icon: '◈' },
  { name: 'PlayStation', count: '01', icon: '△' },
  { name: 'Handheld', count: '01', icon: '▣' }
];

const games = [
  { title: 'METROID PRIME', system: 'GAMECUBE', year: '2002', art: 'metroid', tag: 'ADVENTURE' },
  { title: 'THE LEGEND OF ZELDA', system: 'NINTENDO', year: '2006', art: 'zelda', tag: 'ACTION' },
  { title: 'GRAND THEFT AUTO', system: 'PLAYSTATION', year: '2004', art: 'city', tag: 'OPEN WORLD' },
  { title: 'SONIC ADVENTURE', system: 'DREAMCAST', year: '1998', art: 'sonic', tag: 'PLATFORMER' }
];

const themes = [
  { id: 'violet', name: 'Eclipse Violet' },
  { id: 'cocoonix', name: 'Cocoonix' },
  { id: 'midnight', name: 'Midnight' },
  { id: 'ember', name: 'Ember' },
  { id: 'ice', name: 'Arctic' },
  { id: 'sakura', name: 'Sakura' },
  { id: 'matrix', name: 'Matrix' },
  { id: 'gold', name: 'Solar Gold' }
];

let activeSystem = 'All Games';
let activeIndex = 0;
let activeTheme = localStorage.getItem('eclipse-theme') || 'violet';

document.documentElement.dataset.theme = activeTheme;

document.querySelector('#app').innerHTML = `
  <div class="shell">
    <aside class="rail">
      <div class="brand-mark">E<span>.</span></div>
      <button class="rail-btn active" aria-label="Home" data-view="home">⌂</button>
      <button class="rail-btn" aria-label="Library" data-view="library">▤</button>
      <button class="rail-btn" aria-label="Android games" data-view="android">▣</button>
      <button class="rail-btn" aria-label="Settings" data-view="settings">⚙</button>
      <div class="rail-bottom">BETA 0.1</div>
    </aside>
    <main class="main">
      <header class="topbar">
        <div class="wordmark">ECLIPSE<span>/</span></div>
        <div class="top-actions"><span class="online-dot"></span><span>READY</span>
          <label class="theme-picker">THEME
            <select id="themeSelect" aria-label="Choose theme">
              ${themes.map(t => `<option value="${t.id}" ${t.id === activeTheme ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
          </label>
        </div>
      </header>

      <section class="welcome-row">
        <div><p class="eyebrow">YOUR PERSONAL GAME SPACE</p><h1>WELCOME <em>BACK.</em></h1><p class="welcome-sub">Everything you play. All in one place.</p></div>
        <div class="welcome-orb" aria-hidden="true"><span></span></div>
      </section>

      <section class="feature-hero" aria-label="Featured game">
        <div class="feature-art art-metroid"><span class="feature-glow"></span><span class="feature-symbol">M</span><span class="feature-kicker">FEATURED IN YOUR LIBRARY</span></div>
        <div class="feature-copy"><p class="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>METROID<br><em>PRIME</em></h2><p>GameCube · 2002</p><button class="primary-btn" id="continueBtn">VIEW GAME <span>↗</span></button></div>
        <div class="feature-count">01 <span>/</span> 04</div>
      </section>

      <section class="quick-widgets" aria-label="Dashboard widgets">
        <article class="widget"><span class="widget-icon">▤</span><div><small>YOUR LIBRARY</small><strong>04 <i>GAMES</i></strong></div></article>
        <article class="widget"><span class="widget-icon">◈</span><div><small>COLLECTIONS</small><strong>04 <i>SYSTEMS</i></strong></div></article>
        <article class="widget"><span class="widget-icon">▣</span><div><small>ANDROID GAMES</small><strong>READY <i>TO SET UP</i></strong></div></article>
      </section>

      <section class="library" id="library">
        <div class="section-head"><div><p class="eyebrow">THE VAULT</p><h2>YOUR LIBRARY</h2></div><span class="collection-count">04 TITLES</span></div>
        <nav class="systems" aria-label="Filter games">
          ${systems.map(s => `<button class="system-chip ${s.name === activeSystem ? 'selected' : ''}" data-system="${s.name}"><span>${s.icon}</span>${s.name}<small>${s.count}</small></button>`).join('')}
        </nav>
        <div class="game-grid" id="gameGrid"></div>
      </section>
      <footer><span>ECLIPSE INTERFACE · BETA</span><span>MADE FOR YOUR NEXT ADVENTURE <b>✦</b></span></footer>
    </main>
  </div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

const grid = document.querySelector('#gameGrid');
const toast = document.querySelector('#toast');
let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}
function renderGames() {
  const visible = activeSystem === 'All Games' ? games : games.filter(g =>
    activeSystem === 'Nintendo' ? /NINTENDO|GAMECUBE/.test(g.system) :
    activeSystem === 'PlayStation' ? g.system === 'PLAYSTATION' :
    /DREAMCAST/.test(g.system)
  );
  grid.innerHTML = visible.map(g => {
    const i = games.indexOf(g);
    return `<button class="game-card ${i === activeIndex ? 'focused' : ''}" data-game="${i}" style="--card-index:${i}"><div class="game-art art-${g.art}"><span class="art-glow"></span><span class="art-mark">${['M','Z','Ⅲ','S'][i]}</span><span class="art-caption">${g.tag}</span></div><div class="game-meta"><div><h3>${g.title}</h3><p>${g.system} · ${g.year}</p></div><span class="game-arrow">↗</span></div></button>`;
  }).join('');
}
renderGames();

document.querySelectorAll('.system-chip').forEach(btn => btn.addEventListener('click', () => {
  activeSystem = btn.dataset.system;
  document.querySelectorAll('.system-chip').forEach(b => b.classList.toggle('selected', b === btn));
  renderGames();
}));
grid.addEventListener('click', e => {
  const card = e.target.closest('[data-game]');
  if (!card) return;
  activeIndex = Number(card.dataset.game);
  renderGames();
  notify(`${games[activeIndex].title} selected · Emulator launching comes later.`);
});
document.querySelector('#continueBtn').addEventListener('click', () => {
  activeIndex = 0;
  notify('METROID PRIME selected · Add your game file to launch it.');
});
document.querySelector('#themeSelect').addEventListener('change', e => {
  activeTheme = e.target.value;
  document.documentElement.dataset.theme = activeTheme;
  localStorage.setItem('eclipse-theme', activeTheme);
  notify(`Theme changed: ${themes.find(t => t.id === activeTheme).name}`);
});
document.querySelectorAll('.rail-btn').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('active', b === btn));
  if (btn.dataset.view === 'settings') notify('Settings hub is next: layout, widgets, controls and display.');
  else if (btn.dataset.view === 'library') document.querySelector('#library').scrollIntoView({ behavior: 'smooth' });
  else if (btn.dataset.view === 'android') notify('Android Games folder is coming next.');
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}));

document.addEventListener('keydown', e => {
  if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter', ' '].includes(e.key)) return;
  if (e.target.matches('select, input, textarea')) return;
  const cards = [...grid.querySelectorAll('[data-game]')];
  if (!cards.length) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') activeIndex = (activeIndex + 1) % games.length;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') activeIndex = (activeIndex - 1 + games.length) % games.length;
  if (e.key === 'Enter' || e.key === ' ') {
    notify(`${games[activeIndex].title} selected · Game launching will be added with emulator integration.`);
    return;
  }
  renderGames();
  grid.querySelector(`[data-game="${activeIndex}"]`)?.focus();
});
