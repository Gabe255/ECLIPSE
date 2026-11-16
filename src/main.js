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
const games = load('eclipse-games', []);
const supportedGameTypes = [
  {system:'NES',ext:['nes'],dirs:['nes','nintendo entertainment system']},
  {system:'SNES',ext:['sfc','smc'],dirs:['snes','super nintendo']},
  {system:'NINTENDO 64',ext:['n64','z64','v64'],dirs:['n64','nintendo64','nintendo 64']},
  {system:'GAME BOY',ext:['gb'],dirs:['gb','gameboy','game boy']},
  {system:'GAME BOY ADVANCE',ext:['gba'],dirs:['gba','gameboy advance','game boy advance']},
  {system:'NINTENDO DS',ext:['nds'],dirs:['nds','nintendo ds','ds']},
  {system:'NINTENDO 3DS',ext:['3ds','cci','cxi'],dirs:['3ds','nintendo 3ds']},
  {system:'GAMECUBE',ext:['gcm','rvz','gcz'],dirs:['gamecube','game cube','gc']},
  {system:'WII',ext:['wbfs','wia'],dirs:['wii']},
  {system:'PLAYSTATION',ext:['pbp','chd'],dirs:['psx','ps1','ps one','playstation','playstation 1']},
  {system:'PLAYSTATION 2',ext:['iso','cso'],dirs:['ps2','playstation 2']},
  {system:'PSP',ext:['cso','pbp'],dirs:['psp','playstation portable']},
  {system:'PS VITA',ext:['vpk'],dirs:['ps vita','psvita','vita']},
  {system:'MASTER SYSTEM',ext:['sms'],dirs:['mastersystem','master system']},
  {system:'GENESIS / MEGA DRIVE',ext:['md','gen','smd'],dirs:['genesis','megadrive','mega drive']},
  {system:'SATURN',ext:['cue','chd'],dirs:['saturn','sega saturn']},
  {system:'DREAMCAST',ext:['cdi','gdi'],dirs:['dreamcast','dc']},
  {system:'ATARI 2600',ext:['a26','bin'],dirs:['atari2600','atari 2600']},
  {system:'ARCADE',ext:['zip','7z'],dirs:['arcade','mame','fbneo']}
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
let systemFolders = load('eclipse-system-folders', {});
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
      <section class="feature-hero hidden" id="homeLibraryHero" aria-label="Your game library">
        <div class="feature-art"><span class="feature-glow"></span><span class="feature-symbol">E</span><span class="feature-kicker">YOUR COLLECTION</span></div>
        <div class="feature-copy"><p class="eyebrow">YOUR VAULT</p><h2 id="homeHeroTitle">YOUR GAMES</h2><p id="homeHeroMeta">Games you scan will appear here.</p><button class="primary-btn" id="homeScanBtn">ADD GAME FOLDER ↗</button></div>
      </section>
    </section>
    <section id="libraryView" class="view hidden">
      <div class="section-head"><div><p class="eyebrow">THE VAULT</p><h2>YOUR LIBRARY</h2></div><div class="library-actions"><span class="collection-count" id="libraryCount">0 GAMES</span><button class="primary-btn" id="scanGamesBtn">＋ ADD GAME FOLDER</button><input id="gameFolderPicker" type="file" webkitdirectory directory multiple hidden></div></div>
      <div class="scan-status" id="scanStatus" aria-live="polite">Choose the folder that contains your game folders. ECLIPSE only adds files it can identify.</div>
      <div class="console-strip" id="consoleStrip"></div>
      <nav class="systems" id="systemFilters" aria-label="Filter games"></nav>
      <div class="game-grid" id="gameGrid"></div>
    </section>
    <section id="consoleView" class="view hidden">
      <div class="console-detail-top"><button class="subtle-btn" id="backToLibrary">← ALL SYSTEMS</button><span class="collection-count" id="consoleGeneration">PLATFORM</span></div>
      <section class="console-banner" id="consoleBanner"></section>
      <section class="emulator-panel" id="emulatorPanel"></section>
      <section class="system-home" id="systemHome"></section>
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
          <article class="settings-card folder-card"><h3>GAME FOLDERS</h3><p class="settings-note">Choose the parent folder that contains your platform folders. ECLIPSE scans the files you select and only adds recognized game files. Folder-picker support depends on the Android WebView or browser.</p><div class="folder-add-row"><button class="primary-btn" id="addFolderPath">CHOOSE GAME FOLDER</button></div><div id="folderList" class="folder-list"></div><button class="primary-btn" id="rescanFolders">↻ RESCAN FOLDERS</button><div id="scanResult" class="update-result">No scan has been run. Saved folder locations will appear here.</div></article>
          <article class="settings-card"><p class="eyebrow">IMPORT STATUS</p><h3>SCAN RESULTS</h3><p class="settings-note">ECLIPSE currently identifies supported files by extension and platform folder name. It stores the library index, not copies of your game files. Native Android folder permissions, metadata scraping and emulator launching still need dedicated integrations.</p></article>
        </div>
        <div class="settings-panel hidden" id="settingsControls">
          <div class="settings-panel-head"><div><p class="eyebrow">NAVIGATION</p><h3>CONTROLS</h3></div></div>
          <article class="settings-card"><h3>CONTROLLER & KEYBOARD</h3><p class="settings-note">D-pad / arrow keys move focus. A / Enter selects. B / Escape backs out. Native controller remapping is planned for a later Android integration.</p><span class="feature-tag">BASIC KEYBOARD NAVIGATION ACTIVE</span></article>
        </div>
        <div class="settings-panel hidden" id="settingsSystem">
          <div class="settings-panel-head"><div><p class="eyebrow">ECLIPSE</p><h3>SYSTEM</h3></div></div>
          <div class="settings-grid">
            <article class="settings-card"><p class="eyebrow">SOFTWARE</p><h3>UPDATES</h3><p class="settings-note">Installed version: ${VERSION}</p><button class="primary-btn" id="checkUpdates">CHECK FOR UPDATES</button><div id="updateResult" class="update-result">Check GitHub for the latest ECLIPSE release.</div><div id="releaseHistory" class="release-history"></div></article>
            <article class="settings-card"><p class="eyebrow">DEVICE CHECK</p><h3>COMPATIBILITY</h3><p class="settings-note">Check whether this device can run the current ECLIPSE web frontend and review update requirements.</p><button class="subtle-btn" id="checkCompatibility">CHECK THIS DEVICE</button><div id="compatibilityResult" class="update-result">Compatibility has not been checked yet.</div></article>
            <article class="settings-card"><p class="eyebrow">ABOUT</p><h3>ECLIPSE ALPHA</h3><p class="settings-note">A personal gaming frontend prototype. Emulator launching, native app scanning and real game imports are still in development.</p></article>
          </div>
        </div>
      </div>
    </section>
    <footer><span>ECLIPSE · PERSONAL BUILD · ${VERSION}</span><span>BUILT FOR YOUR NEXT ADVENTURE <b>✦</b></span></footer>
  </main>
</div>
<div class="modal-backdrop hidden" id="widgetModal"><div class="widget-modal"><div class="modal-head"><div><p class="eyebrow">MAKE IT YOURS</p><h2>HOME WIDGETS</h2></div><button class="close-modal" id="closeWidgetModal">×</button></div><p class="settings-note">Add widgets, change their order, or remove the ones you don't use.</p><div id="widgetChoices" class="widget-choices"></div><button class="primary-btn" id="doneWidgets">DONE</button></div></div>
<div class="system-boot hidden" id="systemBoot" aria-live="polite"><div class="boot-orbit"><span></span></div><p class="eyebrow">ECLIPSE SYSTEM STARTUP</p><h2 id="bootSystemName">STARTING SYSTEM</h2><div class="boot-progress"><span></span></div><small>PREPARING YOUR GAME SPACE</small></div>
<div class="mascot-welcome hidden" id="mascotWelcome" role="dialog" aria-modal="true" aria-labelledby="mascotTitle"><div class="mascot-card"><div class="mascot-art" aria-hidden="true"><div class="mascot-hat"></div><div class="mascot-face"><span class="mascot-eye left"></span><span class="mascot-eye right"></span><span class="mascot-shadow"></span></div><div class="mascot-body"><span class="mascot-lapel left"></span><span class="mascot-lapel right"></span><span class="mascot-tie"></span></div></div><p class="eyebrow">YOUR NEW GAME SPACE</p><h2 id="mascotTitle">WELCOME TO <em>ECLIPSE.</em></h2><p class="mascot-message">I’ll show you around. Your systems, game shelves and collections all live here. Set things up your way and make this space yours.</p><div class="mascot-tips"><span><b>01</b> Pick a system</span><span><b>02</b> Build your library</span><span><b>03</b> Make it yours</span></div><div class="mascot-actions"><button class="primary-btn" id="mascotStart">SHOW ME AROUND ↗</button><button class="subtle-btn" id="mascotSkip">SKIP FOR NOW</button></div></div></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`;

const $ = s => document.querySelector(s);
const toast = $('#toast');
const mascotWelcome=$('#mascotWelcome');
function closeMascot(){mascotWelcome.classList.add('hidden');localStorage.setItem('eclipse-onboarding-complete','true');}
$('#mascotStart').addEventListener('click',()=>{closeMascot();showView('library');notify('Choose a system to open its ECLIPSE home.');});
$('#mascotSkip').addEventListener('click',closeMascot);
if(!localStorage.getItem('eclipse-onboarding-complete'))mascotWelcome.classList.remove('hidden');
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400);}
function saveLayout(){localStorage.setItem('eclipse-widgets',JSON.stringify(widgets));localStorage.setItem('eclipse-pages',JSON.stringify(pageNames));}
function setTheme(id){activeTheme=id;document.documentElement.dataset.theme=id;localStorage.setItem('eclipse-theme',id);$('#themeSelect').value=id;$('#settingsTheme').value=id;notify('Theme changed: '+themes.find(t=>t[0]===id)[1]);}
function showView(name){activePage=name;document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$('#'+name+'View').classList.remove('hidden');document.querySelectorAll('.rail-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));window.scrollTo({top:0,behavior:'smooth'});if(name==='library')renderLibrary();if(name==='settings')renderSettings();renderHomeHero();}
function renderPages(){$('#pageTabs').innerHTML=pageNames.map((p,i)=>`<button class="page-tab ${i===currentPage?'selected':''}" data-page="${i}">${p}</button>`).join('');$('#pageTabs').querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>{currentPage=Number(b.dataset.page);renderPages();renderWidgets();}));}
function widgetContent(id){
 const recent=games.length?games[games.length-1]:null;
 if(id==='recent')return `<div class="widget-heading"><small>LAST ADDED</small><span>↗</span></div><div class="widget-large">${recent?recent.title:'NO GAMES YET'}</div><p class="widget-caption">${recent?recent.system+' · '+(recent.year||'YOUR LIBRARY'):'Scan a folder to start your collection'}</p>`;
 if(id==='systems')return `<div class="widget-heading"><small>MY SYSTEMS</small><span>↗</span></div><div class="system-mini-list">${systems.slice(0,3).map(s=>`<span>${s.icon} ${s.name}</span>`).join('')}</div>`;
 if(id==='favorites')return `<div class="widget-heading"><small>FAVORITES</small><span>✦</span></div><div class="widget-large">YOUR FAVORITES</div><p class="widget-caption">${games.length?'Pin games from their options menu':'No games to pin yet'}</p>`;
 if(id==='playtime')return `<div class="widget-heading"><small>PLAYTIME</small><span>◷</span></div><div class="widget-large">NOT TRACKING YET</div><p class="widget-caption">Accurate sessions need native game-launch tracking</p>`;
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
function renderHomeHero(){
 const hero=$('#homeLibraryHero');if(!hero)return;
 hero.classList.toggle('hidden',games.length===0||!preferences.showHero);
 if(games.length){$('#homeHeroTitle').textContent=games[games.length-1].title;$('#homeHeroMeta').textContent=games[games.length-1].system+' · '+games.length+' GAMES IN YOUR LIBRARY';}
}
function renderLibrary(){
 $('#libraryCount').textContent=games.length+' GAMES';
 $('#consoleStrip').innerHTML=systems.map(s=>`<button class="console-card" data-console="${s.name}"><span>${s.icon}</span><b>${s.name}</b><small>${preferences.systemCounts?(gamesForSystem(s.name).length ? gamesForSystem(s.name)+' IN LIBRARY' : 'NO GAMES FOUND'):'OPEN SYSTEM'}</small></button>`).join('');
 $('#consoleStrip').querySelectorAll('[data-console]').forEach(b=>b.addEventListener('click',()=>openConsolePage(b.dataset.console)));
 renderFilters();renderGames();
}
function openConsolePage(name){
 const system=systems.find(s=>s.name===name)||{name,icon:'✦',family:'Platform'};
 const boot=$('#systemBoot');
 $('#bootSystemName').textContent='STARTING '+system.name.toUpperCase();
 boot.classList.remove('hidden');
 window.setTimeout(()=>{
  boot.classList.add('hidden');
  renderConsoleHome(system);
  showView('console');
 },1050);
}
function renderConsoleHome(system){
 const name=system.name;
 const titles=gamesForSystem(name);
 $('#consoleTitle')?.remove();
 $('#consoleGeneration').textContent=system.family.toUpperCase()+' PLATFORM';
 $('#consoleBanner').innerHTML='<div class="console-banner-mark">'+system.icon+'</div><div class="console-banner-copy"><p class="eyebrow">SYSTEM HOME</p><h1>'+system.name.toUpperCase()+'</h1><p>Your '+system.name+' dashboard. Pick a folder or jump into a game.</p></div><div class="console-banner-index">SYSTEM / '+String(systems.indexOf(system)+1).padStart(2,'0')+'</div>';
 const profile=emulatorOptions[name];
 $('#emulatorPanel').innerHTML='<div class="emulator-panel-head"><div><p class="eyebrow">COMPATIBILITY PROFILE</p><h3>EMULATORS & LAUNCHERS</h3></div><span class="feature-tag">'+(profile?'OPTIONS LISTED':'PROFILE PENDING')+'</span></div>'+(profile?'<div class="emulator-option-list">'+profile.items.map(item=>'<span class="emulator-option">'+item+'</span>').join('')+'</div><p class="settings-note">'+profile.note+'</p>':'<p class="settings-note">No emulator or launcher profile has been added for this platform yet.</p>');
 const artFor=g=>'<div class="game-art art-'+g.art+'"><span class="art-glow"></span><span class="art-mark">'+(['M','Z','Ⅲ','S'][games.indexOf(g)]||'✦')+'</span><span class="art-caption">'+g.tag+'</span></div>';
 const cardFor=g=>'<button class="system-game-card" data-system-game="'+games.indexOf(g)+'">'+artFor(g)+'<div class="system-game-meta"><b>'+g.title+'</b><small>'+g.year+' · '+g.tag+'</small></div></button>';
 const featured=titles[0];
 const folderNames=['ALL GAMES'];
 $('#systemHome').innerHTML=
  '<div class="system-home-head"><div><p class="eyebrow">WELCOME TO YOUR SYSTEM</p><h2>'+name.toUpperCase()+' HOME</h2></div><span class="collection-count">'+titles.length+' TITLES</span></div>'+
  '<div class="system-folder-row"><div class="system-row-label"><p class="eyebrow">YOUR COLLECTION</p><span>'+titles.length+' VERIFIED FILES</span></div><div class="system-folders">'+folderNames.map(folder=>'<button class="system-folder" data-system-folder="'+folder+'"><span>▣</span><b>'+folder+'</b><small>'+titles.length+' GAMES FOUND</small></button>').join('')+'</div></div>'+
  (featured?'<section class="system-featured"><div class="system-featured-art">'+artFor(featured)+'</div><div class="system-featured-copy"><p class="eyebrow">FEATURED GAME</p><h2>'+featured.title+'</h2><p>'+name+' · '+featured.year+' · '+featured.tag+'</p><button class="primary-btn" data-system-game="'+games.indexOf(featured)+'">OPEN GAME ↗</button></div></section>':'<div class="system-empty-hero"><p class="eyebrow">NOTHING IMPORTED</p><h2>NO GAMES FOUND.</h2><p>Only games found in a folder scan appear here. Nothing is added automatically.</p><button class="primary-btn" data-go-scan>CHOOSE GAME FOLDER ↗</button></div>')+
  '<section class="system-shelf"><div class="system-row-label"><div><p class="eyebrow">YOUR COLLECTION</p><h3>ALL GAMES</h3></div><span>'+titles.length+' ITEMS</span></div><div class="system-game-row">'+(titles.length?titles.map(cardFor).join(''):'<p class="settings-note">No supported game files were found for this system.</p>')+'</div></section>';
 $('#systemHome').querySelectorAll('[data-system-game]').forEach(button=>button.addEventListener('click',()=>{const game=games[Number(button.dataset.systemGame)];if(game)showGameDetails(game);}));
 $('#systemHome').querySelectorAll('[data-system-folder]').forEach(button=>button.addEventListener('click',()=>$('#systemHome').querySelector('.system-shelf')?.scrollIntoView({behavior:'smooth'})));
 $('#systemHome').querySelector('[data-go-scan]')?.addEventListener('click',()=>{showView('library');$('#gameFolderPicker').click();});
}
function gamesForSystem(name){
 if(name==='Nintendo')return games.filter(g=>['NES','SNES','NINTENDO 64','GAME BOY','GAME BOY ADVANCE','NINTENDO DS','NINTENDO 3DS','GAMECUBE','WII','WII U','NINTENDO SWITCH','NINTENDO SWITCH 2'].includes(g.system));
 if(name==='PlayStation')return games.filter(g=>g.system.startsWith('PLAYSTATION')||g.system==='PSP'||g.system==='PS VITA');
 return games.filter(g=>g.system===name.toUpperCase());
}
function renderFilters(){
 const labels=['All Games',...systems.map(s=>s.name)];
 $('#systemFilters').innerHTML=labels.map(n=>{const count=n==='All Games'?games.length:gamesForSystem(n).length;return `<button class="system-chip ${activeSystem===n?'selected':''}" data-system="${n}">${n}<small>${String(count).padStart(2,'0')}</small></button>`;}).join('');
 $('#systemFilters').querySelectorAll('[data-system]').forEach(b=>b.addEventListener('click',()=>{activeSystem=b.dataset.system;renderFilters();renderGames();}));
}
function renderGames(){
 const visible=activeSystem==='All Games'?games:gamesForSystem(activeSystem);
 $('#gameGrid').innerHTML=visible.length?visible.map(g=>{const i=games.indexOf(g);return `<button class="game-card ${i===selectedGame?'focused':''}" data-game="${i}"><div class="game-art art-generic"><span class="art-glow"></span><span class="art-mark">✦</span><span class="art-caption">${g.tag||'GAME FILE'}</span></div><div class="game-meta"><div><h3>${g.title}</h3><p>${g.system} · ${g.fileName||'Imported file'}</p></div><span class="game-arrow">↗</span></div></button>`;}).join(''):'<div class="empty-state system-empty"><div class="empty-icon">✦</div><h3>NO GAMES FOUND</h3><p>Choose a game folder and scan it. ECLIPSE will only show files it can identify for this platform.</p><button class="primary-btn" id="emptyScanBtn">CHOOSE GAME FOLDER</button></div>';
 $('#gameGrid').querySelectorAll('[data-game]').forEach(card=>card.addEventListener('click',()=>{selectedGame=Number(card.dataset.game);showGameDetails(games[selectedGame]);}));
 $('#emptyScanBtn')?.addEventListener('click',()=>$('#gameFolderPicker').click());
}
function showGameDetails(game){
 if(!game)return;
 notify(game.title+' · '+game.system+' · File: '+game.fileName+'. Player assignment and launch integration are next.');
}
function inferGameSystem(file){
 const path=(file.webkitRelativePath||file.name).toLowerCase().replace(/\\/g,'/');
 const ext=(file.name.split('.').pop()||'').toLowerCase();
 const dirMatch=supportedGameTypes.find(item=>item.dirs.some(dir=>path.includes('/'+dir+'/')||path.startsWith(dir+'/')));
 if(dirMatch&&dirMatch.ext.includes(ext))return dirMatch.system;
 const extensionMatches=supportedGameTypes.filter(item=>item.ext.includes(ext));
 return extensionMatches.length===1?extensionMatches[0].system:null;
}
function titleFromFile(name){return name.replace(/\\.[^.]+$/,'').replace(/[._-]+/g,' ').replace(/\\s+/g,' ').trim().replace(/\\b\\w/g,ch=>ch.toUpperCase());}
function scanSelectedFolder(fileList){
 const files=[...fileList].filter(file=>file&&file.size>0);
 const found=[];
 for(const file of files){
  const system=inferGameSystem(file);if(!system)continue;
  const relative=file.webkitRelativePath||file.name;
  if(games.some(game=>game.relativePath===relative))continue;
  found.push({id:relative+'|'+file.size,title:titleFromFile(file.name),system,year:'',art:'generic',tag:file.name.split('.').pop().toUpperCase(),fileName:file.name,relativePath:relative,size:file.size,lastModified:file.lastModified});
 }
 if(found.length){games.push(...found);localStorage.setItem('eclipse-games',JSON.stringify(games));activeSystem='All Games';renderLibrary();renderWidgets();renderHomeHero();}
 const status=$('#scanStatus');
 status.textContent=found.length?'Found '+found.length+' supported game file(s). '+files.length+' total file(s) were checked.': 'No supported game files were found in that folder. Nothing was added to Home or your library.';
 notify(found.length?'Added '+found.length+' games to your library.':'No games found — nothing added.');
}
function compareVersions(a,b){
 const parse=value=>{const clean=String(value||'').replace(/^v/i,'');const [core,pre='']=clean.split('-',2);return {parts:core.split('.').map(n=>Number(n)||0),pre};};
 const x=parse(a),y=parse(b);
 for(let i=0;i<3;i++){if((x.parts[i]||0)!==(y.parts[i]||0))return (x.parts[i]||0)>(y.parts[i]||0)?1:-1;}
 if(!x.pre&&!y.pre)return 0;
 if(!x.pre)return 1;
 if(!y.pre)return -1;
 return x.pre.localeCompare(y.pre,undefined,{numeric:true});
}
function addSafeLink(parent,url,label){
 const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=label;parent.append(link);
}
async function checkUpdates(){
 const result=$('#updateResult'),history=$('#releaseHistory'),button=$('#checkUpdates');
 result.textContent='Checking published ECLIPSE versions…';history.textContent='';button.disabled=true;
 try{
  const response=await fetch('https://api.github.com/repos/'+REPO+'/releases?per_page=20',{headers:{Accept:'application/vnd.github+json'}});
  if(!response.ok)throw new Error('GitHub returned '+response.status);
  const releases=(await response.json()).filter(r=>!r.draft&&r.assets?.some(a=>a.name.toLowerCase().endsWith('.apk')));
  releases.sort((a,b)=>compareVersions(b.tag_name,a.tag_name));
  if(!releases.length){result.textContent='No APK releases are published yet.';return;}
  const latest=releases[0],asset=latest.assets.find(a=>a.name.toLowerCase().endsWith('.apk'));
  result.textContent='';
  const status=document.createElement('b');
  const comparison=compareVersions(latest.tag_name,VERSION);
  status.textContent=comparison>0?'Update available: '+latest.tag_name:comparison===0?'You are on the latest published version.':'Installed version is newer than the latest published APK.';
  result.append(status);
  if(comparison>0){
   const note=document.createElement('p');note.textContent=latest.body?.replace(/\s+/g,' ').slice(0,260)||'A newer ECLIPSE build is ready.';
   result.append(note);addSafeLink(result,asset.browser_download_url,'DOWNLOAD '+latest.tag_name+' APK ↗');
   const caution=document.createElement('p');caution.textContent='Install compatibility depends on the same app ID, a newer Android version code, and the same signing certificate. Back up important app data before updating.';result.append(caution);
  }else{
   const note=document.createElement('p');note.textContent='Latest release: '+latest.tag_name+'. Check the release history below for older builds.';result.append(note);
  }
  const heading=document.createElement('p');heading.className='release-history-title';heading.textContent='AVAILABLE RELEASES';history.append(heading);
  releases.forEach(release=>{
   const row=document.createElement('div');row.className='release-history-row';
   const label=document.createElement('span');label.textContent=release.tag_name+(release.tag_name===VERSION?' · INSTALLED':'');
   row.append(label);
   const item=release.assets.find(a=>a.name.toLowerCase().endsWith('.apk'));
   if(item)addSafeLink(row,item.browser_download_url,'APK ↗');
   history.append(row);
  });
 }catch(error){result.textContent='Could not check releases right now. Connect to the internet and try again, or open the ECLIPSE Releases page.';console.error(error);}
 finally{button.disabled=false;}
}
function checkCompatibility(){
 const result=$('#compatibilityResult');result.textContent='';
 const ua=navigator.userAgent||'';
 const android=ua.match(/Android\s([0-9.]+)/i);
 const isAndroid=!!android;
 const checks=[
  ['Browser engine',typeof window.fetch==='function'&&typeof Promise!=='undefined'?'Supported':'Required web features missing'],
  ['Local data storage',(()=>{try{const key='eclipse-compat-test';localStorage.setItem(key,'1');localStorage.removeItem(key);return 'Available on this device';}catch{return 'Storage unavailable or restricted';}})()],
  ['Device platform',isAndroid?'Android '+android[1]:'Non-Android browser / platform'],
  ['Native app bridge',window.Capacitor?.isNativePlatform?.()?'Capacitor native bridge detected':'Not detected in this build']
 ];
 checks.forEach(([name,value])=>{const line=document.createElement('p');line.textContent=name+': '+value;result.append(line);});
 const note=document.createElement('p');note.textContent='This is a frontend-level check only. It cannot verify every device requirement, emulator capability, or installed app.';result.append(note);
 const update=document.createElement('p');update.textContent='For an in-place APK update, Android requires the same application ID, a higher versionCode, and the same signing certificate. The current CI debug APK may not have a persistent signing key, so an update may require uninstalling the old build first; uninstalling can erase local app data.';result.append(update);
}

$('#themeSelect').addEventListener('change',e=>setTheme(e.target.value));
$('#settingsTheme').addEventListener('change',e=>setTheme(e.target.value));
document.querySelectorAll('.rail-btn').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$('#backToLibrary').addEventListener('click',()=>showView('library'));
$('#scanGamesBtn').addEventListener('click',()=>$('#gameFolderPicker').click());
$('#homeScanBtn').addEventListener('click',()=>{showView('library');$('#gameFolderPicker').click();});
$('#gameFolderPicker').addEventListener('change',e=>{if(e.target.files?.length)scanSelectedFolder(e.target.files);e.target.value='';});

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
$('#addFolderPath').addEventListener('click',()=>{$('#gameFolderPicker').click();});

$('#rescanFolders').addEventListener('click',()=>{$('#scanResult').textContent='Choose a folder again to rescan it. ECLIPSE does not invent entries when no supported files are found.';$('#gameFolderPicker').click();});
$('#resetAllDefaults').addEventListener('click',()=>{if(!confirm('Restore ECLIPSE default settings?'))return;activeTheme='violet';localStorage.setItem('eclipse-theme',activeTheme);document.documentElement.dataset.theme=activeTheme;$('#themeSelect').value=activeTheme;widgets=['recent','systems','favorites'];pageNames=['Home','Discover','Collections'];currentPage=0;preferences={showHero:true,compactRows:false,systemCounts:true,startPage:'home'};localStorage.setItem('eclipse-preferences',JSON.stringify(preferences));saveLayout();renderWidgets();renderSettings();document.querySelector('.feature-hero').classList.remove('hidden');notify('Default settings restored.');});
document.querySelectorAll('[data-settings-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-settings-tab]').forEach(x=>x.classList.toggle('active',x===b));['personal','library','controls','system'].forEach(k=>$('#settings'+k[0].toUpperCase()+k.slice(1)).classList.toggle('hidden',k!==b.dataset.settingsTab));}));
$('#checkUpdates').addEventListener('click',checkUpdates);
$('#checkCompatibility').addEventListener('click',checkCompatibility);
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
renderWidgets();renderLibrary();renderHomeHero();if(preferences.startPage&&preferences.startPage!=='home')showView(preferences.startPage);
