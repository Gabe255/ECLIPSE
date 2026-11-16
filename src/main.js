import './style.css';

const systems = [
  { name: 'All Games', count: '12', icon: '✦' },
  { name: 'Nintendo', count: '04', icon: '◈' },
  { name: 'PlayStation', count: '03', icon: '△' },
  { name: 'Handheld', count: '05', icon: '▣' }
];

const games = [
  { title: 'METROID PRIME', system: 'GAMECUBE', year: '2002', art: 'metroid', tag: 'ADVENTURE' },
  { title: 'THE LEGEND OF ZELDA', system: 'NINTENDO', year: '2006', art: 'zelda', tag: 'ACTION' },
  { title: 'GRAND THEFT AUTO', system: 'PLAYSTATION', year: '2004', art: 'city', tag: 'OPEN WORLD' },
  { title: 'SONIC ADVENTURE', system: 'DREAMCAST', year: '1998', art: 'sonic', tag: 'PLATFORMER' }
];

let activeSystem = 'All Games';
let activeIndex = 0;

document.querySelector('#app').innerHTML = `
  <div class="shell">
    <aside class="rail">
      <div class="brand-mark">E<span>.</span></div>
      <button class="rail-btn active" aria-label="Home" data-view="home">⌂</button>
      <button class="rail-btn" aria-label="Library" data-view="library">▤</button>
      <button class="rail-btn" aria-label="Settings" data-view="settings">⚙</button>
      <div class="rail-bottom">v0.1</div>
    </aside>
    <main class="main">
      <header class="topbar">
        <div class="wordmark">ECLIPSE<span>/</span></div>
        <div class="top-actions"><span class="online-dot"></span><span>SYSTEM READY</span><button id="themeBtn" class="theme-btn">THEME <b>◐</b></button></div>
      </header>
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">YOUR COLLECTION. YOUR UNIVERSE.</p>
          <h1>ENTER THE<br><em>ORBIT.</em></h1>
          <p class="hero-sub">One home for every game you love.</p>
          <button class="primary-btn" id="exploreBtn">EXPLORE LIBRARY <span>↗</span></button>
        </div>
        <div class="orbital" aria-hidden="true"><div class="planet"></div><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit orbit-three"></div><span class="orbit-label">E / 001</span></div>
        <div class="hero-index">01 <span>—</span> 04</div>
      </section>
      <section class="library" id="library">
        <div class="section-head"><div><p class="eyebrow">THE VAULT</p><h2>YOUR LIBRARY</h2></div><span class="collection-count">04 TITLES FOUND</span></div>
        <nav class="systems" aria-label="Filter games">
          ${systems.map(s => `<button class="system-chip ${s.name === activeSystem ? 'selected' : ''}" data-system="${s.name}"><span>${s.icon}</span>${s.name}<small>${s.count}</small></button>`).join('')}
        </nav>
        <div class="game-grid" id="gameGrid">
          ${games.map((g, i) => `<button class="game-card ${i === activeIndex ? 'focused' : ''}" data-game="${i}" style="--card-index:${i}"><div class="game-art art-${g.art}"><span class="art-glow"></span><span class="art-mark">${['M','Z','Ⅲ','S'][i]}</span><span class="art-caption">${g.tag}</span></div><div class="game-meta"><div><h3>${g.title}</h3><p>${g.system} · ${g.year}</p></div><span class="game-arrow">↗</span></div></button>`).join('')}
        </div>
      </section>
      <footer><span>ECLIPSE INTERFACE</span><span>BUILT FOR YOUR NEXT ADVENTURE <b>✦</b></span></footer>
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
    /DREAMCAST|GAMECUBE/.test(g.system)
  );
  grid.innerHTML = visible.map(g => {
    const i = games.indexOf(g);
    return `<button class="game-card ${i === activeIndex ? 'focused' : ''}" data-game="${i}" style="--card-index:${i}"><div class="game-art art-${g.art}"><span class="art-glow"></span><span class="art-mark">${['M','Z','Ⅲ','S'][i]}</span><span class="art-caption">${g.tag}</span></div><div class="game-meta"><div><h3>${g.title}</h3><p>${g.system} · ${g.year}</p></div><span class="game-arrow">↗</span></div></button>`;
  }).join('');
}
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
  notify(`${games[activeIndex].title} selected · Add a game file to launch it.`);
});
document.querySelector('#exploreBtn').addEventListener('click', () => document.querySelector('#library').scrollIntoView({ behavior: 'smooth' }));
document.querySelector('#themeBtn').addEventListener('click', () => {
  const themes = ['violet', 'ember', 'ice'];
  const current = document.documentElement.dataset.theme || 'violet';
  document.documentElement.dataset.theme = themes[(themes.indexOf(current) + 1) % themes.length];
  notify(`Theme: ${document.documentElement.dataset.theme.toUpperCase()}`);
});
document.querySelectorAll('.rail-btn').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('active', b === btn));
  if (btn.dataset.view === 'settings') notify('Settings panel is coming in a future update.');
  else if (btn.dataset.view === 'library') document.querySelector('#library').scrollIntoView({ behavior: 'smooth' });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}));

// Keyboard and controller-friendly focus navigation.
document.addEventListener('keydown', e => {
  if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter', ' '].includes(e.key)) return;
  const cards = [...grid.querySelectorAll('[data-game]')];
  if (!cards.length) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') activeIndex = (activeIndex + 1) % games.length;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') activeIndex = (activeIndex - 1 + games.length) % games.length;
  if (e.key === 'Enter' || e.key === ' ') {
    const chosen = games[activeIndex];
    notify(`${chosen.title} selected · Game launching will be added with emulator integration.`);
    return;
  }
  renderGames();
  grid.querySelector(`[data-game="${activeIndex}"]`)?.focus();
});
