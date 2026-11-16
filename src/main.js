import './style.css';

const VERSION = '0.2.0-alpha';
const REPO = 'Gabe255/ECLIPSE';
const systems = [
  { name: 'Nintendo', icon: '◈', family: 'Nintendo' },
  { name: 'NES', icon: '▦', family: 'Nintendo' },
  { name: 'SNES', icon: '▤', family: 'Nintendo' },
  { name: 'Nintendo 64', icon: '◉', family: 'Nintendo' },
  { name: 'Game Boy', icon: '▣', family: 'Nintendo' },
  { name: 'Game Boy Advance', icon: '▣', family: 'Nintendo' },
  { name: 'Nintendo DS', icon: '▤', family: 'Nintendo' },
  { name: 'Nintendo 3DS', icon: '▤', family: 'Nintendo' },
  { name: 'GameCube', icon: '◆', family: 'Nintendo' },
  { name: 'Wii', icon: '◎', family: 'Nintendo' },
  { name: 'Wii U', icon: '▣', family: 'Nintendo' },
  { name: 'Nintendo Switch', icon: '▥', family: 'Nintendo' },
  { name: 'Nintendo Switch 2', icon: '▥', family: 'Nintendo' },
  { name: 'PlayStation', icon: '△', family: 'PlayStation' },
  { name: 'PlayStation 4 / Pro', icon: '△', family: 'PlayStation' },
  { name: 'PlayStation 5 / Pro', icon: '△', family: 'PlayStation' },
  { name: 'PlayStation 2', icon: '△', family: 'PlayStation' },
  { name: 'PlayStation 3', icon: '△', family: 'PlayStation' },
  { name: 'PSP', icon: '▰', family: 'PlayStation' },
  { name: 'PS Vita', icon: '▰', family: 'PlayStation' },
  { name: 'Xbox', icon: '✕', family: 'Xbox' },
  { name: 'Xbox 360', icon: '✕', family: 'Xbox' },
  { name: 'Xbox One', icon: '✕', family: 'Xbox' },
  { name: 'Xbox Series X|S', icon: '✕', family: 'Xbox' },
  { name: 'PC Games (x86)', icon: '▣', family: 'PC Gaming' },
  { name: 'Windows PC', icon: '▣', family: 'PC' },
  { name: 'SteamOS / Steam Deck', icon: '▣', family: 'PC' },
  { name: 'Linux PC', icon: '▣', family: 'PC' },
  { name: 'macOS', icon: '▣', family: 'PC' },
  { name: 'iPhone / iPad', icon: '▣', family: 'Mobile' },
  { name: 'Master System', icon: '◫', family: 'Sega' },
  { name: 'Genesis / Mega Drive', icon: '◫', family: 'Sega' },
  { name: 'Saturn', icon: '◉', family: 'Sega' },
  { name: 'Dreamcast', icon: '◉', family: 'Sega' },
  { name: 'Atari 2600', icon: '▥', family: 'Atari' },
  { name: 'Arcade', icon: '✦', family: 'Arcade' },
  { name: 'Android', icon: '▣', family: 'Android' }
];
const emulatorOptions = {
  'Nintendo Switch': { items: ['Eden'], note: 'Switch 1 emulator. Availability and compatibility depend on the device.' },
  'Nintendo Switch 2': { items: ['Banana Native'], note: 'Experimental Android compatibility layer; not a traditional emulator.' },
  'PlayStation 4 / Pro': { items: ['shadPS4'], note: 'Experimental PC emulator; not an Android emulator.' },
  'PlayStation 5 / Pro': { items: ['CapyPS5'], note: 'Experimental project; compatibility and supported devices are limited.' },
  'Xbox': { items: ['xemu', 'hakuX'], note: 'Original Xbox emulator options; support varies by device.' },
  'Xbox 360': { items: ['XenDroid'], note: 'Experimental Xbox 360 emulator option.' },
  'Xbox One': { items: ['No established general-purpose emulator'], note: 'Use native console features or supported streaming; ECLIPSE will not claim emulation support.' },
  'Xbox Series X|S': { items: ['No established general-purpose emulator'], note: 'Use native console features or supported streaming; ECLIPSE will not claim emulation support.' },
  'PC Games (x86)': { items: ['GameHub', 'GameNative'], note: 'Android apps for running compatible Windows PC games; they are compatibility layers, not traditional emulators.' },
  'Windows PC': { items: ['Native Windows launch'], note: 'PC games run directly on Windows; no emulator is normally needed.' },
  'SteamOS / Steam Deck': { items: ['Steam + Proton'], note: 'Proton is a compatibility layer, not an emulator.' },
  'Linux PC': { items: ['Native Linux launch', 'Wine / Proton'], note: 'Wine and Proton are compatibility layers, not console emulators.' },
  'macOS': { items: ['Native macOS launch'], note: 'Native Mac games launch directly; compatibility tools vary by game.' },
  'iPhone / iPad': { items: ['Native iOS / iPadOS apps'], note: 'ECLIPSE can organize apps; launching depends on iOS permissions.' },
  'Android': { items: ['Native Android apps'], note: 'Installed-app detection requires the Android integration and user permission.' }
};
const games = [
  { title: 'METROID PRIME', system: 'GAMECUBE', year: '2002', art: 'metroid', tag: 'ADVENTURE' },
  { title: 'THE LEGEND OF ZELDA', system: 'NINTENDO', year: '2006', art: 'zelda', tag: 'ACTION' },
  { title: 'GRAND THEFT AUTO', system: 'PLAYSTATION', year: '2004', art: 'city', tag: 'OPEN WORLD' },
  { title: 'SONIC ADVENTURE', system: 'DREAMCAST', year: '1998', art: 'sonic', tag: 'PLATFORMER' }
];
const themes = [
  ['violet','Eclipse Violet'],['iisu','Prism Flow'],['cocoonix','Cocoonix'],['midnight','Midnight'],
  ['ember','Ember'],['ice','Arctic'],['sakura','Sakura'],['matrix','Matrix'],['gold','Solar Gold']
];
const widgetCatalog = [
  ['recent','Recently played','Your latest game picks'],['systems','My systems','Jump into a platform'],
  ['favorites','Favorites','Your pinned games'],['playtime','Play activity','Your playtime overview'],
  ['achievements','Achievements','Achievement progress'],['quicklaunch','Quick launch','Your favorite shortcuts']
];
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
let activeTheme = localStorage.getItem('eclipse-theme') || 'violet';
let activePage = 'home';
let activeSystem = 'All Games';
let selectedGame = 0;
let widgets = load('eclipse-widgets', ['recent','systems','favorites']);
let pageNames = load('eclipse-pages', ['Home','Discover','Collections']);
let currentPage = 0;
let playCount = load('eclipse-play-count', 0);
let folderPaths = load('eclipse-folders', []);
let preferences = load('eclipse-preferences', {showHero:true,compactRows:false,systemCounts:true,startPage:'home'});
document.documentElement.dataset.theme = activeTheme;

document.querySelector('#app').innerHTML = `
<div class="shell">
  <aside class="rail">
    <div class="brand-mark">E<span>.</span></div>
    <button class="rail-btn active" data-view="home" aria-label="Home">⌂</button>
    <button class="rail-btn" data-view="library" aria-label="Library">▤</button>
    <button class="rail-btn" data-view="android" aria-label="Android games">▣</button>
    <button class="rail-btn" data-view="settings" aria-label="Settings">⚙</button>
    <div class="rail-bottom">ALPHA ${VERSION}</div>
  </aside>
  <main class="main">
    <header class="topbar">
      <div class="wordmark">ECLIPSE<span>/</span></div>
      <div class="top-actions"><span class="online-dot"></span><span>PERSONAL MODE</span>
        <label class="theme-picker">THEME<select id="themeSelect">${themes.map(([id,name])=>`<option value="${id}" ${id===activeTheme?'selected':''}>${name}</option>`).join('')}</select></label>
      </div>
    </header>
    <section id="homeView" class="view">
      <section class="welcome-row">
        <div><p class="eyebrow">YOUR PERSONAL GAME SPACE</p><h1>WELCOME <em>BACK.</em></h1><p class="welcome-sub">Your games. Your setup. Your rules.</p></div>
        <div class="welcome-orb" aria-hidden="true"></div>
      </section>
      <div class="page-toolbar"><div class="page-tabs" id="pageTabs"></div><div class="page-actions"><button class="subtle-btn" id="addPage">+ PAGE</button><button class="subtle-btn" id="editWidgets">EDIT HOME</button></div></div>
      <section class="dashboard-grid" id="widgetGrid"></section>
      <section class="feature-hero" aria-label="Featured game">
        <div class="feature-art art-metroid"><span class="feature-glow"></span><span class="feature-symbol">M</span><span class="feature-kicker">FEATURED IN YOUR LIBRARY</span></div>
        <div class="feature-copy"><p class="eyebrow">JUMP BACK IN</p><h2>METROID<br><em>PRIME</em></h2><p>GameCube · 2002</p><button class="primary-btn" id="continueBtn">VIEW GAME <span>↗</span></button></div>
        <div class="feature-count">01 <span>/</span> 04</div>
      </section>
    </section>
    <section id="libraryView" class="view hidden">
      <div class="section-head"><div><p class="eyebrow">THE VAULT</p><h2>YOUR LIBRARY</h2></div><span class="collection-count">04 SAMPLE TITLES</span></div>
      <div class="console-strip" id="consoleStrip"></div>
      <nav class="systems" id="systemFilters" aria-label="Filter games"></nav>
      <div class="game-grid" id="gameGrid"></div>
    </section>
    <section id="consoleView" class="view hidden">
      <div class="console-detail-top"><button class="subtle-btn" id="backToLibrary">← ALL SYSTEMS</button><span class="collection-count" id="consoleGeneration">PLATFORM</span></div>
      <section class="console-banner" id="consoleBanner"></section>
      <section class="emulator-panel" id="emulatorPanel"></section>
      <div class="console-detail-toolbar"><div><p class="eyebrow">YOUR COLLECTION</p><h2 id="consoleTitle">SYSTEM</h2></div><span class="collection-count" id="consoleGameCount">0 GAMES</span></div>
      <div class="game-grid" id="consoleGameGrid"></div>
      <div class="console-empty-note" id="consoleEmptyNote">Your games for this system will appear here when imported.</div>
    </section>
    <section id="androidView" class="view hidden">
      <div class="section-head"><div><p class="eyebrow">NATIVE ANDROID</p><h2>ANDROID GAMES</h2></div><span class="collection-count">DEVICE LIBRARY</span></div>
      <div class="empty-state"><div class="empty-icon">▣</div><h3>YOUR ANDROID SPACE</h3><p>Installed Android games will appear here once ECLIPSE has its native app-scanning bridge.</p><button class="subtle-btn" id="androidInfo">HOW THIS WORKS</button></div>
    </section>
    <section id="settingsView" class="view hidden">
      <div class="section-head"><div><p class="eyebrow">MAKE IT YOURS</p><h2>SETTINGS</h2></div></div>
      <div class="settings-layout">
        <nav class="settings-nav"><button class="settings-tab active" data-settings-tab="personal">PERSONALIZE</button><button class="settings-tab" data-settings-tab="library">LIBRARY FOLDERS</button><button class="settings-tab" data-settings-tab="controls">CONTROLS</button><button class="settings-tab" data-settings-tab="system">SYSTEM</button></nav>
        <div class="settings-panel" id="settingsPersonal">
          <div class="settings-panel-head"><div><p class="eyebrow">MAKE ECLIPSE YOURS</p><h3>PERSONALIZE</h3></div><button class="subtle-btn" id="resetAllDefaults">RESTORE DEFAULTS</button></div>
          <div class="settings-grid">
            <article class="settings-card"><p class="eyebrow">APPEARANCE</p><h3>THEME</h3><label>Built-in theme<select id="settingsTheme">${themes.map(([id,name])=>`<option value="${id}" ${id===activeTheme?'selected':''}>${name}</option>`).join('')}</select></label><p class="settings-note">Choose a visual preset. Your selection is saved on this device.</p></article>
            <article class="settings-card"><p class="eyebrow">HOME SCREEN</p><h3>LAYOUT OPTIONS</h3><label class="setting-toggle"><input type="checkbox" id="showHeroSetting" checked><span>Show featured hero</span></label><label class="setting-toggle"><input type="checkbox" id="compactRowsSetting"><span>Compact home rows</span></label><label class="setting-toggle"><input type="checkbox" id="systemCountsSetting" checked><span>Show game counts on systems</span></label><label>Start page<select id="startPageSetting"><option value="home">Home</option><option value="library">Library</option><option value="android">Android games</option></select></label></article>
            <article class="settings-card"><p class="eyebrow">HOME PAGES</p><h3>YOUR PAGES</h3><p class="settings-note">Add up to five pages and arrange the widgets on each page.</p><button class="subtle-btn" id="settingsAddPage">+ ADD PAGE</button><div id="settingsPageList" class="settings-page-list"></div></article>
            <article class="settings-card"><p class="eyebrow">WIDGETS</p><h3>HOME CONTENT</h3><p class="settings-note">Choose which shelves appear and change their order.</p><button class="primary-btn" id="settingsEditWidgets">EDIT HOME WIDGETS</button><button class="subtle-btn" id="resetWidgets">RESET WIDGETS</button></article>
          </div>
        </div>
        <div class="settings-panel hidden" id="settingsLibrary">
          <div class="settings-panel-head"><div><p class="eyebrow">YOUR GAME LOCATIONS</p><h3>LIBRARY FOLDERS</h3></div><span class="feature-tag">LOCAL SETUP</span></div>
          <article class="settings-card folder-card"><h3>GAME FOLDERS</h3><p class="settings-note">Add the folder locations where you keep your game files. ECLIPSE can save these locations now; automatic folder scanning needs the native Android storage bridge, which is not connected yet.</p><div class="folder-add-row"><input id="folderPathInput" type="text" placeholder="Example: /storage/emulated/0/Games"><button class="primary-btn" id="addFolderPath">ADD FOLDER</button></div><div id="folderList" class="folder-list"></div><button class="primary-btn" id="rescanFolders">↻ RESCAN FOLDERS</button><div id="scanResult" class="update-result">No scan has been run. Saved folder locations will appear here.</div></article>
          <article class="settings-card"><p class="eyebrow">IMPORT STATUS</p><h3>WHAT WORKS RIGHT NOW</h3><p class="settings-note">Folder locations are stored on this device. Detecting game files, reading metadata and importing box art will be enabled when the Android storage integration is added.</p></article>
        </div>
        <div class="settings-panel hidden" id="settingsControls">
          <div class="settings-panel-head"><div><p class="eyebrow">NAVIGATION</p><h3>CONTROLS</h3></div></div>
          <article class="settings-card"><h3>CONTROLLER & KEYBOARD</h3><p class="settings-note">D-pad / arrow keys move focus. A / Enter selects. B / Escape backs out. Native controller remapping is planned for a later Android integration.</p><span class="feature-tag">BASIC KEYBOARD NAVIGATION ACTIVE</span></article>
        </div>
        <div class="settings-panel hidden" id="settingsSystem">
          <div class="settings-panel-head"><div><p class="eyebrow">ECLIPSE</p><h3>SYSTEM</h3></div></div>
          <div class="settings-grid">
            <article class="settings-card"><p class="eyebrow">SOFTWARE</p><h3>UPDATES</h3><p class="settings-note">Installed version: ${VERSION}</p><button class="primary-btn" id="checkUpdates">CHECK FOR UPDATES</button><div id="updateResult" class="update-result">Check GitHub for the latest ECLIPSE release.</div></article>
            <article class="settings-card"><p class="eyebrow">ABOUT</p><h3>ECLIPSE ALPHA</h3><p class="settings-note">A personal gaming frontend prototype. Emulator launching, native app scanning and real game imports are still in development.</p></article>
          </div>
        </div>
      </div>
    </section>
    <footer><span>ECLIPSE · PERSONAL BUILD · ${VERSION}</span><span>BUILT FOR YOUR NEXT ADVENTURE <b>✦</b></span></footer>
  </main>
</div>
<div class="modal-backdrop hidden" id="widgetModal"><div class="widget-modal"><div class="modal-head"><div><p class="eyebrow">MAKE IT YOURS</p><h2>HOME WIDGETS</h2></div><button class="close-modal" id="closeWidgetModal">×</button></div><p class="settings-note">Add widgets, change their order, or remove the ones you don't use.</p><div id="widgetChoices" class="widget-choices"></div><button class="primary-btn" id="doneWidgets">DONE</button></div></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`;

const $ = s => document.querySelector(s);
const toast = $('#toast');
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400);}
function saveLayout(){localStorage.setItem('eclipse-widgets',JSON.stringify(widgets));localStorage.setItem('eclipse-pages',JSON.stringify(pageNames));}
function setTheme(id){activeTheme=id;document.documentElement.dataset.theme=id;localStorage.setItem('eclipse-theme',id);$('#themeSelect').value=id;$('#settingsTheme').value=id;notify('Theme changed: '+themes.find(t=>t[0]===id)[1]);}
function showView(name){activePage=name;document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$('#'+name+'View').classList.remove('hidden');document.querySelectorAll('.rail-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));window.scrollTo({top:0,behavior:'smooth'});if(name==='library')renderLibrary();if(name==='settings')renderSettings();}
function renderPages(){$('#pageTabs').innerHTML=pageNames.map((p,i)=>`<button class="page-tab ${i===currentPage?'selected':''}" data-page="${i}">${p}</button>`).join('');$('#pageTabs').querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>{currentPage=Number(b.dataset.page);renderPages();renderWidgets();}));}
function widgetContent(id){
 const recent=games[playCount%games.length];
 if(id==='recent')return `<div class="widget-heading"><small>RECENTLY PLAYED</small><span>↗</span></div><div class="widget-large">${recent.title}</div><p class="widget-caption">${recent.system} · ${recent.year}</p>`;
 if(id==='systems')return `<div class="widget-heading"><small>MY SYSTEMS</small><span>↗</span></div><div class="system-mini-list">${systems.slice(0,3).map(s=>`<span>${s.icon} ${s.name}</span>`).join('')}</div>`;
 if(id==='favorites')return `<div class="widget-heading"><small>FAVORITES</small><span>✦</span></div><div class="widget-large">METROID PRIME</div><p class="widget-caption">Your pinned games live here</p>`;
 if(id==='playtime')return `<div class="widget-heading"><small>PLAY ACTIVITY</small><span>◷</span></div><div class="widget-large">${playCount} <i>SESSIONS</i></div><p class="widget-caption">Sessions started in this demo</p>`;
 if(id==='achievements')return `<div class="widget-heading"><small>ACHIEVEMENTS</small><span>✧</span></div><div class="widget-large">READY</div><p class="widget-caption">Connect a supported achievement service later</p>`;
 return `<div class="widget-heading"><small>QUICK LAUNCH</small><span>↗</span></div><div class="quick-links"><button data-jump="library">LIBRARY</button><button data-jump="android">ANDROID</button></div>`;
}
function renderWidgets(){
 renderPages();
 const pageWidgets=currentPage===0?widgets:widgets.slice().reverse().slice(0,2);
 $('#widgetGrid').innerHTML=pageWidgets.map((id,i)=>{const meta=widgetCatalog.find(w=>w[0]===id);return `<article class="dashboard-widget widget-${id}" data-widget="${id}">${widgetContent(id)}<div class="widget-controls"><button data-move="-1" aria-label="Move widget left">←</button><button data-move="1" aria-label="Move widget right">→</button><button data-remove="${id}" aria-label="Remove widget">×</button></div></article>`;}).join('')||'<p class="settings-note">This page is empty. Add widgets to make it yours.</p>';
 $('#widgetGrid').querySelectorAll('[data-move]').forEach(b=>b.addEventListener('click',()=>{const card=b.closest('[data-widget]'),idx=widgets.indexOf(card.dataset.widget),next=idx+Number(b.dataset.move);if(next<0||next>=widgets.length)return;[widgets[idx],widgets[next]]=[widgets[next],widgets[idx]];saveLayout();renderWidgets();}));
 $('#widgetGrid').querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{widgets=widgets.filter(x=>x!==b.dataset.remove);saveLayout();renderWidgets();}));
 $('#widgetGrid').querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.jump)));
}
function renderWidgetChoices(){
 $('#widgetChoices').innerHTML=widgetCatalog.map(([id,name,desc])=>`<label class="widget-choice"><input type="checkbox" value="${id}" ${widgets.includes(id)?'checked':''}><span><b>${name}</b><small>${desc}</small></span></label>`).join('');
 $('#widgetChoices').querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{widgets=input.checked?[...widgets,input.value]:widgets.filter(x=>x!==input.value);saveLayout();}));
}
function renderSettings(){
 ['showHeroSetting','compactRowsSetting','systemCountsSetting','startPageSetting'].forEach((id)=>{const el=$('#'+id);if(el){const key={showHeroSetting:'showHero',compactRowsSetting:'compactRows',systemCountsSetting:'systemCounts',startPageSetting:'startPage'}[id];el.value=preferences[key];if(el.type==='checkbox')el.checked=!!preferences[key];}});
 renderFolderPaths();renderSettingsPages();
}
function savePreferences(){localStorage.setItem('eclipse-preferences',JSON.stringify(preferences));document.querySelector('.feature-hero')?.classList.toggle('hidden',!preferences.showHero);document.documentElement.classList.toggle('eclipse-compact-rows',!!preferences.compactRows);renderLibrary();renderWidgets();}
function renderFolderPaths(){const list=$('#folderList');if(!list)return;list.innerHTML=folderPaths.length?folderPaths.map((p,i)=>'<div class="folder-item"><span>▰ '+p.replace(/</g,'&lt;')+'</span><button data-folder-remove="'+i+'" aria-label="Remove folder">×</button></div>').join(''):'<p class="settings-note">No folders added yet.</p>';list.querySelectorAll('[data-folder-remove]').forEach(b=>b.addEventListener('click',()=>{folderPaths.splice(Number(b.dataset.folderRemove),1);localStorage.setItem('eclipse-folders',JSON.stringify(folderPaths));renderFolderPaths();}));}
function renderSettingsPages(){const list=$('#settingsPageList');if(!list)return;list.innerHTML=pageNames.map((p,i)=>'<div class="settings-page-item"><span>'+p+'</span><button data-page-rename="'+i+'">RENAME</button><button data-page-delete="'+i+'">×</button></div>').join('');list.querySelectorAll('[data-page-rename]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.pageRename),name=prompt('Name this home page',pageNames[i]);if(name?.trim()){pageNames[i]=name.trim().slice(0,24);saveLayout();renderPages();renderSettingsPages();}}));list.querySelectorAll('[data-page-delete]').forEach(b=>b.addEventListener('click',()=>{if(pageNames.length===1){notify('Keep at least one home page.');return;}pageNames.splice(Number(b.dataset.pageDelete),1);currentPage=Math.min(currentPage,pageNames.length-1);saveLayout();renderWidgets();renderSettingsPages();}));}
function renderLibrary(){
 $('#consoleStrip').innerHTML=systems.map(s=>`<button class="console-card" data-console="${s.name}"><span>${s.icon}</span><b>${s.name}</b><small>${preferences.systemCounts?(gamesForSystem(s.name).length ? gamesForSystem(s.name)+' IN LIBRARY' : 'READY FOR IMPORT'):'OPEN SYSTEM'}</small></button>`).join('');
 $('#consoleStrip').querySelectorAll('[data-console]').forEach(b=>b.addEventListener('click',()=>openConsolePage(b.dataset.console)));
 renderFilters();renderGames();
}
function openConsolePage(name){
 const system=systems.find(s=>s.name===name)||{name,icon:'✦',family:'Platform'};
 const titles=gamesForSystem(name);
 $('#consoleTitle').textContent=system.name.toUpperCase();
 $('#consoleGeneration').textContent=system.family.toUpperCase()+' PLATFORM';
 $('#consoleGameCount').textContent=String(titles.length).padStart(2,'0')+' GAMES';
 $('#consoleBanner').innerHTML='<div class="console-banner-mark">'+system.icon+'</div><div class="console-banner-copy"><p class="eyebrow">ECLIPSE SYSTEM PROFILE</p><h1>'+system.name.toUpperCase()+'</h1><p>Your '+system.name+' collection, all in one place.</p></div><div class="console-banner-index">SYSTEM / '+String(systems.indexOf(system)+1).padStart(2,'0')+'</div>';
 const profile=emulatorOptions[name];
 $('#emulatorPanel').innerHTML='<div class="emulator-panel-head"><div><p class="eyebrow">COMPATIBILITY PROFILE</p><h3>EMULATORS & LAUNCHERS</h3></div><span class="feature-tag">'+(profile?'OPTIONS LISTED':'PROFILE PENDING')+'</span></div>'+(profile?'<div class="emulator-option-list">'+profile.items.map(item=>'<span class="emulator-option">'+item+'</span>').join('')+'</div><p class="settings-note">'+profile.note+'</p>':'<p class="settings-note">No emulator or launcher profile has been added for this platform yet.</p>');
 $('#consoleGameGrid').innerHTML=titles.map(g=>{const i=games.indexOf(g);return '<button class="game-card" data-console-game="'+i+'"><div class="game-art art-'+g.art+'"><span class="art-glow"></span><span class="art-mark">'+['M','Z','Ⅲ','S'][i]+'</span><span class="art-caption">'+g.tag+'</span></div><div class="game-meta"><div><h3>'+g.title+'</h3><p>'+g.system+' · '+g.year+'</p></div><span class="game-arrow">↗</span></div></button>';}).join('');
 $('#consoleEmptyNote').classList.toggle('hidden',titles.length>0);
 $('#consoleGameGrid').querySelectorAll('[data-console-game]').forEach(card=>card.addEventListener('click',()=>{selectedGame=Number(card.dataset.consoleGame);notify(games[selectedGame].title+' selected · Game launching is coming later.');}));
 showView('console');
}
function gamesForSystem(name){
 if(name==='Nintendo')return games.filter(g=>g.system==='NINTENDO'||g.system==='GAMECUBE');
 if(name==='PlayStation')return games.filter(g=>g.system.startsWith('PLAYSTATION'));
 return games.filter(g=>g.system===name.toUpperCase());
}
function renderFilters(){
 const labels=['All Games',...systems.map(s=>s.name)];
 $('#systemFilters').innerHTML=labels.map(n=>{const count=n==='All Games'?games.length:gamesForSystem(n).length;return `<button class="system-chip ${activeSystem===n?'selected':''}" data-system="${n}">${n}<small>${String(count).padStart(2,'0')}</small></button>`;}).join('');
 $('#systemFilters').querySelectorAll('[data-system]').forEach(b=>b.addEventListener('click',()=>{activeSystem=b.dataset.system;renderFilters();renderGames();}));
}
function renderGames(){
 const visible=activeSystem==='All Games'?games:gamesForSystem(activeSystem);
 $('#gameGrid').innerHTML=visible.length?visible.map(g=>{const i=games.indexOf(g);return `<button class="game-card ${i===selectedGame?'focused':''}" data-game="${i}"><div class="game-art art-${g.art}"><span class="art-glow"></span><span class="art-mark">${['M','Z','Ⅲ','S'][i]}</span><span class="art-caption">${g.tag}</span></div><div class="game-meta"><div><h3>${g.title}</h3><p>${g.system} · ${g.year}</p></div><span class="game-arrow">↗</span></div></button>`;}).join(''):'<div class="empty-state system-empty"><div class="empty-icon">✦</div><h3>YOUR COLLECTION STARTS HERE</h3><p>No games imported for this system yet. This platform is ready for your library.</p></div>';
 $('#gameGrid').querySelectorAll('[data-game]').forEach(card=>card.addEventListener('click',()=>{selectedGame=Number(card.dataset.game);playCount++;localStorage.setItem('eclipse-play-count',JSON.stringify(playCount));notify(games[selectedGame].title+' selected · Emulator launch integration is still in development.');}));
}
async function checkUpdates(){
 const result=$('#updateResult');result.textContent='Checking the ECLIPSE releases…';$('#checkUpdates').disabled=true;
 try{
  const response=await fetch('https://api.github.com/repos/'+REPO+'/releases?per_page=10',{headers:{Accept:'application/vnd.github+json'}});
  if(!response.ok)throw new Error('GitHub returned '+response.status);
  const releases=await response.json();const release=releases.find(r=>!r.draft&&r.assets?.some(a=>a.name.toLowerCase().endsWith('.apk')));
  if(!release){result.textContent='No APK release is published yet. Check again after the next beta release.';return;}
  const asset=release.assets.find(a=>a.name.toLowerCase().endsWith('.apk'));
  result.innerHTML='';
  const title=document.createElement('b');title.textContent=release.tag_name+' is available';
  const note=document.createElement('p');note.textContent=release.body?.slice(0,220)||'A newer ECLIPSE build is ready.';
  const link=document.createElement('a');link.href=asset.browser_download_url;link.target='_blank';link.rel='noopener';link.textContent='DOWNLOAD APK ↗';
  result.append(title,note,link);
  if(release.tag_name===VERSION)result.prepend(document.createTextNode('You are on the latest published version. '));
 }catch(error){result.textContent='Could not check right now. Open the ECLIPSE GitHub Releases page when online.';console.error(error);}
 finally{$('#checkUpdates').disabled=false;}
}
$('#themeSelect').addEventListener('change',e=>setTheme(e.target.value));
$('#settingsTheme').addEventListener('change',e=>setTheme(e.target.value));
document.querySelectorAll('.rail-btn').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$('#backToLibrary').addEventListener('click',()=>showView('library'));
$('#continueBtn').addEventListener('click',()=>{playCount++;localStorage.setItem('eclipse-play-count',JSON.stringify(playCount));notify('METROID PRIME selected · Add your game file after library import is implemented.');});
$('#editWidgets').addEventListener('click',()=>{$('#widgetModal').classList.remove('hidden');renderWidgetChoices();});
$('#closeWidgetModal').addEventListener('click',()=>{$('#widgetModal').classList.add('hidden');renderWidgets();});
$('#doneWidgets').addEventListener('click',()=>{$('#widgetModal').classList.add('hidden');renderWidgets();notify('Home layout saved.');});
$('#addPage').addEventListener('click',()=>{if(pageNames.length>=5){notify('You can have up to five home pages.');return;}pageNames.push('Page '+(pageNames.length+1));currentPage=pageNames.length-1;saveLayout();renderWidgets();});
$('#resetWidgets').addEventListener('click',()=>{widgets=['recent','systems','favorites'];currentPage=0;saveLayout();renderWidgets();notify('Widgets reset.');});
$('#settingsAddPage').addEventListener('click',()=>$('#addPage').click());
$('#settingsEditWidgets').addEventListener('click',()=>$('#editWidgets').click());
$('#showHeroSetting').addEventListener('change',e=>{preferences.showHero=e.target.checked;localStorage.setItem('eclipse-preferences',JSON.stringify(preferences));document.querySelector('.feature-hero').classList.toggle('hidden',!preferences.showHero);});
$('#compactRowsSetting').addEventListener('change',e=>{preferences.compactRows=e.target.checked;localStorage.setItem('eclipse-preferences',JSON.stringify(preferences));document.documentElement.classList.toggle('eclipse-compact-rows',preferences.compactRows);});
$('#systemCountsSetting').addEventListener('change',e=>{preferences.systemCounts=e.target.checked;localStorage.setItem('eclipse-preferences',JSON.stringify(preferences));renderLibrary();});
$('#startPageSetting').addEventListener('change',e=>{preferences.startPage=e.target.value;localStorage.setItem('eclipse-preferences',JSON.stringify(preferences));notify('Startup page saved.');});
$('#addFolderPath').addEventListener('click',()=>{const value=$('#folderPathInput').value.trim();if(!value){notify('Enter a folder location first.');return;}if(!folderPaths.includes(value)){folderPaths.push(value);localStorage.setItem('eclipse-folders',JSON.stringify(folderPaths));}$('#folderPathInput').value='';renderFolderPaths();notify('Folder location saved.');});
$('#rescanFolders').addEventListener('click',()=>{$('#scanResult').textContent=folderPaths.length?'Rescan requested for '+folderPaths.length+' saved location(s). Automatic file detection is not available until the native Android storage bridge is connected.':'Add a game folder first. No locations to rescan.';});
$('#resetAllDefaults').addEventListener('click',()=>{if(!confirm('Restore ECLIPSE default settings?'))return;activeTheme='violet';localStorage.setItem('eclipse-theme',activeTheme);document.documentElement.dataset.theme=activeTheme;$('#themeSelect').value=activeTheme;widgets=['recent','systems','favorites'];pageNames=['Home','Discover','Collections'];currentPage=0;preferences={showHero:true,compactRows:false,systemCounts:true,startPage:'home'};localStorage.setItem('eclipse-preferences',JSON.stringify(preferences));saveLayout();renderWidgets();renderSettings();document.querySelector('.feature-hero').classList.remove('hidden');notify('Default settings restored.');});
document.querySelectorAll('[data-settings-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-settings-tab]').forEach(x=>x.classList.toggle('active',x===b));['personal','library','controls','system'].forEach(k=>$('#settings'+k[0].toUpperCase()+k.slice(1)).classList.toggle('hidden',k!==b.dataset.settingsTab));}));
$('#checkUpdates').addEventListener('click',checkUpdates);
$('#androidInfo').addEventListener('click',()=>notify('Android app detection needs a native Android bridge and package visibility permission.'));
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){$('#widgetModal').classList.add('hidden');if(activePage!=='home')showView('home');return;}
 if(['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Enter',' '].includes(e.key)&&!e.target.matches('select,input,textarea,button')){
  const cards=[...$('#gameGrid').querySelectorAll('[data-game]')];if(!cards.length)return;
  if(e.key==='ArrowRight'||e.key==='ArrowDown')selectedGame=(selectedGame+1)%games.length;
  if(e.key==='ArrowLeft'||e.key==='ArrowUp')selectedGame=(selectedGame-1+games.length)%games.length;
  renderGames();$('#gameGrid').querySelector('[data-game="'+selectedGame+'"]')?.focus();
 }
});
renderWidgets();renderLibrary();document.querySelector('.feature-hero').classList.toggle('hidden',!preferences.showHero);if(preferences.startPage&&preferences.startPage!=='home')showView(preferences.startPage);
