import './style.css';
import { mountExperience } from './experience.js';
import { mountControlCenter } from './controls.js';
import { Capacitor, registerPlugin } from '@capacitor/core';
const FolderAccess = registerPlugin('FolderAccess');
const UpdateDownload = registerPlugin('UpdateDownload');
const LauncherSetup = registerPlugin('LauncherSetup');
const DisplayInfo = registerPlugin('DisplayInfo');

const VERSION = import.meta.env.VITE_ECLIPSE_VERSION || '4.0.2';
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
const games = (()=>{try{return JSON.parse(localStorage.getItem('eclipse-games'))||[];}catch{return [];}})();
const supportedGameTypes = [
  {system:'NES',ext:['nes'],dirs:['nes','nintendo entertainment system']},
  {system:'SNES',ext:['sfc','smc'],dirs:['snes','super nintendo']},
  {system:'NINTENDO 64',ext:['n64','z64','v64'],dirs:['n64','nintendo64','nintendo 64']},
  {system:'GAME BOY',ext:['gb'],dirs:['gb','gameboy','game boy']},
  {system:'GAME BOY ADVANCE',ext:['gba'],dirs:['gba','gameboy advance','game boy advance']},
  {system:'NINTENDO DS',ext:['nds'],dirs:['nds','nintendo ds','ds']},
  {system:'NINTENDO 3DS',ext:['3ds','cci','cxi'],dirs:['3ds','nintendo 3ds']},
  {system:'GAMECUBE',ext:['gcm','rvz','gcz','iso'],dirs:['gamecube','game cube','gc']},
  {system:'WII',ext:['wbfs','wia','iso'],dirs:['wii']},
  {system:'PLAYSTATION',ext:['pbp','chd','bin','cue','iso'],dirs:['psx','ps1','ps one','playstation','playstation 1']},
  {system:'PLAYSTATION 2',ext:['iso','cso','chd','bin','cue'],dirs:['ps2','playstation 2']},
  {system:'PSP',ext:['cso','pbp','iso'],dirs:['psp','playstation portable']},
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
  ['recent','Last added','Your most recently scanned game'],['systems','My systems','Jump into a platform'],
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
let systemShelfRows = Math.max(1, Math.min(4, Number(load('eclipse-system-shelf-rows', 2)) || 2));
let interfaceMode = load('eclipse-interface-mode', 'cocoon');
if(!['console','konsoru','cocoon','hybrid'].includes(interfaceMode)) interfaceMode='hybrid';
let systemFolders = load('eclipse-system-folders', {});
let preferences = load('eclipse-preferences', {showHero:true,compactRows:false,systemCounts:true,startPage:'home'});
let installedApps = load('eclipse-installed-apps', []);
let emulatorAssignments = load('eclipse-emulator-assignments', {});
let favorites = load('eclipse-favorites', []);
let appGameFlags = load('eclipse-app-games', {});
let appHomePins = load('eclipse-home-app-pins', []);
let appPlaytime = load('eclipse-app-playtime', {});
let activeAppSession = load('eclipse-active-app-session', null);
document.documentElement.dataset.theme = activeTheme;

document.querySelector('#app').innerHTML = `
<div class="shell">
  <aside class="rail">
    <div class="brand-mark">E<span>.</span></div>
    <button class="rail-btn active" data-view="home" aria-label="Home">⌂</button>
    <button class="rail-btn" data-view="library" aria-label="Library">▤</button>
    <button class="rail-btn" data-view="android" aria-label="Android games">▣</button>
    <button class="rail-btn" data-view="settings" aria-label="Settings">⚙</button>
    <div class="rail-bottom">v${VERSION}</div>
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
      <section class="konsoru-home" id="konsoruHome" aria-label="Konsoru console home">
        <div class="konsoru-welcome">
          <div class="konsoru-welcome-copy"><p class="eyebrow">ECLIPSE OS · KONSORU</p><h1>YOUR WORLD.<br><em>YOUR NEXT GAME.</em></h1><p id="konsoruGreeting">Everything you play, one place.</p><div class="konsoru-hero-actions"><button class="konsoru-primary" id="konsoruResume">▶ &nbsp; CONTINUE PLAYING</button><button class="konsoru-secondary" id="konsoruOpenLibrary">OPEN LIBRARY</button></div></div>
          <div class="konsoru-core-art" aria-hidden="true"><span class="konsoru-core-orbit orbit-one"></span><span class="konsoru-core-orbit orbit-two"></span><span class="konsoru-core">E</span><small>INFINITE PLAY</small></div>
          <div class="konsoru-hero-stats"><div><b id="konsoruGameCount">0</b><small>GAMES</small></div><div><b id="konsoruSystemCount">0</b><small>SYSTEMS</small></div></div>
        </div>
        <nav class="konsoru-nav" aria-label="Konsoru shortcuts"><button class="selected" data-konsoru-jump="home">⌂ <span>HOME</span></button><button data-konsoru-jump="library">▤ <span>LIBRARY</span></button><button data-konsoru-jump="android">▣ <span>APPS</span></button><button data-konsoru-jump="settings">⚙ <span>SETTINGS</span></button></nav>
        <section class="konsoru-section"><div class="konsoru-section-head"><div><p class="eyebrow">CHOOSE YOUR UNIVERSE</p><h2>GAMING WORLDS</h2></div><span>01 / SYSTEMS</span></div><div class="konsoru-world-grid" id="konsoruWorldGrid"></div></section>
        <section class="konsoru-section"><div class="konsoru-section-head"><div><p class="eyebrow">BACK IN THE GAME</p><h2>RECENTLY ADDED</h2></div><button class="konsoru-text-button" id="konsoruAllGames">VIEW ALL ↗</button></div><div class="konsoru-recent-row" id="konsoruRecentRow"></div></section>
        <section class="konsoru-bottom-grid"><article><p class="eyebrow">YOUR SPACE</p><h3>MAKE IT YOURS.</h3><p>Organize your collection, choose your players, and shape your ECLIPSE setup.</p><button class="konsoru-secondary" id="konsoruCustomize">CUSTOMIZE ECLIPSE ↗</button></article><article><p class="eyebrow">QUICK STATUS</p><div class="konsoru-status-line"><span>LIBRARY STATUS</span><b id="konsoruLibraryStatus">READY</b></div><div class="konsoru-status-line"><span>ACTIVE INTERFACE</span><b>KONSORU</b></div><div class="konsoru-status-line"><span>DEVICE MODE</span><b>HANDHELD</b></div></article></section>
      </section>
      <section class="system-stage" aria-label="Choose a gaming system">
        <div class="stage-heading"><div><p class="eyebrow">THE MULTIVERSE</p><h2>CHOOSE YOUR <em>WORLD.</em></h2><p>One tap takes you into that system's own space.</p></div><span class="stage-index">01 <i>/</i> SYSTEMS</span></div>
        <section class="system-feature" id="systemFeature" aria-live="polite">
          <div class="system-feature-art"><span class="system-feature-orbit"></span><strong id="systemFeatureMark">✦</strong><small id="systemFeatureFamily">PLATFORM</small></div>
          <div class="system-feature-copy"><p class="eyebrow">SELECTED SYSTEM</p><h2 id="systemFeatureName">NINTENDO</h2><p id="systemFeatureMeta">Your platform library</p><button class="primary-btn" id="enterFeaturedSystem">ENTER SYSTEM ↗</button></div>
          <div class="system-feature-count"><b id="systemFeatureCount">0</b><small>GAMES IN LIBRARY</small></div>
        </section>
        <div class="system-carousel-shell">
          <button class="carousel-arrow" id="systemPrev" aria-label="Previous systems">‹</button>
          <div class="system-picker" id="systemPicker" tabindex="0" aria-label="Available systems"></div>
          <button class="carousel-arrow" id="systemNext" aria-label="Next systems">›</button>
        </div>
        <div class="stage-footer"><span id="systemPickerCount">37 WORLDS AVAILABLE</span><button class="text-link" data-view="library">EXPLORE FULL LIBRARY <b>↗</b></button></div>
      </section>
      <div class="page-toolbar"><div class="page-tabs" id="pageTabs"></div><div class="page-actions"><button class="subtle-btn" id="addPage">+ PAGE</button><button class="subtle-btn" id="editWidgets">EDIT HOME</button></div></div>
      <section class="dashboard-grid" id="widgetGrid"></section>
      <section class="home-games-shelf hidden" id="homeGamesShelf"></section>
      <section class="home-apps-shelf hidden" id="homeAppsShelf" aria-label="Pinned Android apps"></section>
      <section class="feature-hero hidden" id="homeLibraryHero" aria-label="Your game library">
        <div class="feature-art"><span class="feature-glow"></span><span class="feature-symbol">E</span><span class="feature-kicker">YOUR COLLECTION</span></div>
        <div class="feature-copy"><p class="eyebrow">YOUR VAULT</p><h2 id="homeHeroTitle">YOUR GAMES</h2><p id="homeHeroMeta">Games you scan will appear here.</p><button class="primary-btn" id="homeScanBtn">ADD MORE GAMES ↗</button></div>
      </section>
    </section>
    <section id="libraryView" class="view hidden">
      <div class="section-head"><div><p class="eyebrow">THE VAULT</p><h2>YOUR LIBRARY</h2></div><div class="library-actions"><span class="collection-count" id="libraryCount">0 GAMES</span><input id="librarySearch" type="search" placeholder="Search your games…" aria-label="Search your games"><button class="primary-btn" id="scanGamesBtn">＋ ADD GAME FOLDER</button><input id="gameFolderPicker" type="file" webkitdirectory directory multiple hidden></div></div>
      <div class="scan-status" id="scanStatus" aria-live="polite">Choose the folder that contains your game folders. ECLIPSE only adds files it can identify.</div>
      <div class="console-strip" id="consoleStrip"></div>
      <nav class="systems" id="systemFilters" aria-label="Filter games"></nav>
      <div class="game-grid" id="gameGrid"></div>
    </section>
    <section id="consoleView" class="view hidden">
      <div class="console-detail-top"><button class="subtle-btn" id="backToLibrary">← ALL SYSTEMS</button><span class="collection-count" id="consoleGeneration">PLATFORM</span></div>
      <section class="console-banner" id="consoleBanner"></section>
      <nav class="system-menu" id="systemMenu" aria-label="System menu"></nav>
      <section class="emulator-panel" id="emulatorPanel"></section>
      <section class="system-home" id="systemHome"></section>
    </section>
    <section id="androidView" class="view hidden">
      <div class="section-head"><div><p class="eyebrow">YOUR DEVICE</p><h2>APPS LIBRARY</h2><p class="settings-note">Apps Android exposes to ECLIPSE. Mark games and track your sessions.</p></div><button class="primary-btn" id="scanAppsPage">SCAN DEVICE</button></div>
      <div class="app-library-summary"><div><b id="appCount">0</b><small>DISCOVERED APPS</small></div><div><b id="gameAppCount">0</b><small>TREATED AS GAMES</small></div><div><b id="trackedTime">0m</b><small>TRACKED PLAYTIME</small></div></div>
      <div class="app-library-toolbar"><input id="appLibrarySearch" type="search" placeholder="Search apps…" aria-label="Search installed apps"><span id="appLibraryStatus">Scan your Android device to populate this library.</span></div>
      <div class="app-library-list" id="appLibraryList"><div class="app-library-empty"><span>▣</span><b>YOUR APPS WILL APPEAR HERE</b><p>Run a device scan to find apps Android makes available to ECLIPSE.</p></div></div>
      <p class="app-library-disclaimer">App discovery requires the Android APK. Treat as Game and session totals are saved locally. Session tracking is manual; ECLIPSE does not yet detect when another app is opened or closed, and app launching is not connected yet.</p>
    </section>
    <section id="settingsView" class="view hidden">
      <div class="section-head"><div><p class="eyebrow">MAKE IT YOURS</p><h2>SETTINGS</h2></div></div>
      <div class="settings-layout">
        <nav class="settings-nav"><button class="settings-tab active" data-settings-tab="personal">PERSONALIZE</button><button class="settings-tab" data-settings-tab="library">LIBRARY FOLDERS</button><button class="settings-tab" data-settings-tab="controls">CONTROLS</button><button class="settings-tab" data-settings-tab="players">PLAYERS</button><button class="settings-tab" data-settings-tab="system">SYSTEM</button></nav>
        <div class="settings-panel" id="settingsPersonal">
          <div class="settings-panel-head"><div><p class="eyebrow">MAKE ECLIPSE YOURS</p><h3>PERSONALIZE</h3></div><button class="subtle-btn" id="resetAllDefaults">RESTORE DEFAULTS</button></div>
          <div class="settings-grid">
            <article class="settings-card"><p class="eyebrow">APPEARANCE</p><h3>THEME</h3><label>Built-in theme<select id="settingsTheme">${themes.map(([id,name])=>`<option value="${id}" ${id===activeTheme?'selected':''}>${name}</option>`).join('')}</select></label><p class="settings-note">Choose a visual preset. Your selection is saved on this device.</p></article>
            <article class="settings-card"><p class="eyebrow">HOME SCREEN</p><h3>LAYOUT OPTIONS</h3><label class="setting-toggle"><input type="checkbox" id="showHeroSetting" checked><span>Show featured hero</span></label><label class="setting-toggle"><input type="checkbox" id="compactRowsSetting"><span>Compact home rows</span></label><label class="setting-toggle"><input type="checkbox" id="systemCountsSetting" checked><span>Show game counts on systems</span></label><label>Start page<select id="startPageSetting"><option value="home">Home</option><option value="library">Library</option><option value="android">Android games</option></select></label><label>Interface style<select id="interfaceModeSetting"><option value="console">Console Interface</option><option value="konsoru">Konsoru Console</option><option value="cocoon">Cocoon-style Interface</option><option value="hybrid">Hybrid · Both</option></select></label><p class="settings-note">Hybrid keeps your unified home, folders and collections alongside a dedicated page for every system.</p><label>Games per shelf row<select id="systemShelfRowsSetting"><option value="1">1 row</option><option value="2">2 rows</option><option value="3">3 rows</option><option value="4">4 rows</option></select></label><label>Display layout<select id="settingsDisplayLayout"><option value="auto">Auto detect</option><option value="single">Single screen</option><option value="dual">Dual screen / foldable</option></select></label></article>
            <article class="settings-card"><p class="eyebrow">ARTWORK PROVIDER</p><h3>STEAMGRIDDB</h3><label>API key<input id="sgdbApiKey" type="password" autocomplete="off" placeholder="Paste your SteamGridDB API key"></label><div class="sgdb-settings-actions"><button class="primary-btn" id="saveSgdbKey">SAVE API KEY</button><button class="subtle-btn" id="clearSgdbKey">CLEAR</button></div><p class="settings-note" id="sgdbKeyStatus">Your key is saved only in this browser's local app storage. Don't put it in the GitHub source code.</p><p class="settings-note">Get your own key from your SteamGridDB profile preferences. Artwork is optional; the rest of ECLIPSE works without it.</p></article><article class="settings-card"><p class="eyebrow">HOME PAGES</p><h3>YOUR PAGES</h3><p class="settings-note">Add up to five pages and arrange the widgets on each page.</p><button class="subtle-btn" id="settingsAddPage">+ ADD PAGE</button><div id="settingsPageList" class="settings-page-list"></div></article>
            <article class="settings-card"><p class="eyebrow">WIDGETS</p><h3>HOME CONTENT</h3><p class="settings-note">Choose which shelves appear and change their order.</p><button class="primary-btn" id="settingsEditWidgets">EDIT HOME WIDGETS</button><button class="subtle-btn" id="resetWidgets">RESET WIDGETS</button></article>
          </div>
        </div>
        <div class="settings-panel hidden" id="settingsLibrary">
          <div class="settings-panel-head"><div><p class="eyebrow">YOUR GAME LOCATIONS</p><h3>LIBRARY FOLDERS</h3></div><span class="feature-tag">LOCAL SETUP</span></div>
          <article class="settings-card folder-card data-folder-card"><p class="eyebrow">PERSISTENT STORAGE</p><h3>ECLIPSE DATA FOLDER</h3><p class="settings-note">Choose a folder for a portable backup of your ECLIPSE library, settings, favorites, and player assignments. Android keeps access to this folder between app updates. Your original game files stay where they are.</p><div class="folder-add-row"><button class="primary-btn" id="chooseDataFolder">CHOOSE DATA FOLDER</button><button class="subtle-btn" id="saveDataBackup">SAVE BACKUP</button><button class="subtle-btn" id="restoreDataBackup">RESTORE BACKUP</button></div><div id="dataFolderStatus" class="update-result">No external data folder selected. ECLIPSE still keeps its normal local app data.</div></article>
          <article class="settings-card folder-card"><h3>GAME FOLDERS</h3><p class="settings-note">Choose the parent folder that contains your platform folders. On Android, ECLIPSE uses the system folder picker, keeps your folder permission, and scans nested files. Only recognized game files enter your library.</p><div class="folder-add-row"><button class="primary-btn" id="addFolderPath">CHOOSE GAME FOLDER</button></div><div id="folderList" class="folder-list"></div><button class="primary-btn" id="rescanFolders">↻ RESCAN FOLDERS</button><div id="scanResult" class="update-result">Choose a folder to scan your game files. Unsupported files are ignored.</div></article>
          <article class="settings-card"><p class="eyebrow">IMPORT STATUS</p><h3>SCAN RESULTS</h3><p class="settings-note">Android folder selection and recursive scanning are connected. ECLIPSE stores game details and file references, not copies of your game files. Artwork scraping, per-game player assignment and emulator launching are still being built.</p></article>
        </div>
        <div class="settings-panel hidden" id="settingsControls">
          <div class="settings-panel-head"><div><p class="eyebrow">NAVIGATION</p><h3>CONTROLS</h3></div></div>
          <article class="settings-card"><h3>CONTROLLER & KEYBOARD</h3><p class="settings-note">Physical gamepads use the D-pad or left stick to move, A / Cross to select, and B / Circle to go back. Arrow keys, Enter and Escape work with keyboards. Android button layouts can vary by controller.</p><span class="feature-tag">GAMEPAD + KEYBOARD NAVIGATION</span><p class="settings-note" id="controllerStatus" aria-live="polite">Connect a controller to test navigation. ECLIPSE reads standard browser Gamepad input while this screen is open.</p></article>
        </div>
        <div class="settings-panel hidden" id="settingsPlayers">
          <div class="settings-panel-head"><div><p class="eyebrow">EMULATOR & APP ROUTING</p><h3>YOUR PLAYERS</h3></div><button class="primary-btn" id="scanInstalledPlayers">SCAN INSTALLED APPS</button></div>
          <p class="settings-note">ECLIPSE can list apps Android exposes as launchable. Pick the player you use for each system, or let ECLIPSE choose a clear name match. This does not guarantee the app supports every game format.</p>
          <div id="playerScanStatus" class="scan-status">No app scan has been run yet.</div>
          <div id="playerAssignmentsList" class="player-assignments"></div>
        </div>
        <div class="settings-panel hidden" id="settingsSystem">
          <div class="settings-panel-head"><div><p class="eyebrow">ECLIPSE</p><h3>SYSTEM</h3></div></div>
          <div class="settings-grid">
            <article class="settings-card"><p class="eyebrow">SOFTWARE</p><h3>UPDATES</h3><p class="settings-note">Installed version: ${VERSION}</p><button class="primary-btn" id="checkUpdates">CHECK FOR UPDATES</button><div id="updateResult" class="update-result">Check GitHub for the latest ECLIPSE release.</div><div id="releaseHistory" class="release-history"></div></article>
            <article class="settings-card"><p class="eyebrow">DEVICE CHECK</p><h3>COMPATIBILITY</h3><p class="settings-note">Check whether this device can run the current ECLIPSE web frontend and review update requirements.</p><button class="subtle-btn" id="checkCompatibility">CHECK THIS DEVICE</button><div id="compatibilityResult" class="update-result">Compatibility has not been checked yet.</div></article>
            <article class="settings-card"><p class="eyebrow">ANDROID HOME</p><h3>DEFAULT LAUNCHER</h3><p class="settings-note">Ask Android to set ECLIPSE as your Home app. Android controls the final confirmation.</p><button class="primary-btn" id="defaultHomeSettings">SET DEFAULT HOME APP</button></article>
            <article class="settings-card"><p class="eyebrow">ABOUT</p><h3>ECLIPSE 3.0.0</h3><p class="settings-note">Android app discovery and launching, Home pins, Treat as Game labels, manual playtime tracking, folder scanning, and settings backup are available. Third-party emulator game handoff and automatic metadata/artwork scraping are still in development.</p></article>
          </div>
        </div>
      </div>
    </section>
    <footer><span>ECLIPSE · PERSONAL BUILD · ${VERSION}</span><span>BUILT FOR YOUR NEXT ADVENTURE <b>✦</b></span></footer>
  </main>
</div>
<div class="onboarding-backdrop hidden" id="onboardingModal" role="dialog" aria-modal="true" aria-labelledby="onboardingTitle">
  <div class="onboarding-card">
    <div class="mascot-stage"><div class="mascot-aura"></div><div class="eclipse-mascot"><div class="eclipse-mascot-hat"></div><div class="eclipse-mascot-orb"><i></i><i></i><span></span></div><div class="eclipse-mascot-ring"></div></div><div class="mascot-label">E / GUIDE</div></div>
    <div class="onboarding-copy"><p class="eyebrow">A NEW WORLD AWAITS</p><h2 id="onboardingTitle">WELCOME TO <em>ECLIPSE.</em></h2><p>I'm your guide. Let's set up your screen layout, Home launcher and storage before you jump in.</p>
      <section class="device-setup-block" aria-label="Device setup">
        <div class="device-setup-heading"><span class="setup-spark">✦</span><div><b>DISPLAY SETUP</b><small id="displayDetectionStatus">Checking your device screens…</small></div></div>
        <label class="setup-select-label">ECLIPSE LAYOUT<select id="displayLayoutSelect"><option value="auto">AUTO DETECT</option><option value="single">SINGLE SCREEN</option><option value="dual">DUAL SCREEN / FOLDABLE</option></select></label>
        <button class="setup-home-button" id="makeDefaultHome" type="button"><span>⌂</span><b>MAKE ECLIPSE MY DEFAULT HOME</b><small id="defaultHomeStatus">Android will ask you to confirm this.</small></button>
      </section>
      <div class="storage-options"><button class="storage-option" id="onboardingLocal"><b>ON THIS DEVICE</b><small>Keep settings and library data in app storage.</small><span>RECOMMENDED</span></button><button class="storage-option" id="onboardingFolder"><b>CHOOSE A BACKUP FOLDER</b><small>Pick a folder for portable backups on supported Android builds.</small><span>ANDROID FEATURE</span></button></div>
      <button class="onboarding-skip" id="onboardingSkip">I'LL DO THIS LATER</button>
    </div>
  </div>
</div>
<div class="modal-backdrop hidden" id="widgetModal"><div class="widget-modal"><div class="modal-head"><div><p class="eyebrow">MAKE IT YOURS</p><h2>HOME WIDGETS</h2></div><button class="close-modal" id="closeWidgetModal">×</button></div><p class="settings-note">Add widgets, change their order, or remove the ones you don't use.</p><div id="widgetChoices" class="widget-choices"></div><button class="primary-btn" id="doneWidgets">DONE</button></div></div>
<div class="system-boot hidden" id="systemBoot" aria-live="polite"><div class="boot-orbit"><span></span></div><p class="eyebrow">ECLIPSE SYSTEM STARTUP</p><h2 id="bootSystemName">STARTING SYSTEM</h2><div class="boot-progress"><span></span></div><small>PREPARING YOUR GAME SPACE</small></div>
<div class="mascot-welcome hidden" id="mascotWelcome" role="dialog" aria-modal="true" aria-labelledby="mascotTitle"><div class="mascot-card"><div class="mascot-art" aria-hidden="true"><div class="eclipse-mascot"><div class="eclipse-mascot-hat"></div><div class="eclipse-mascot-orb"><i></i><i></i><span></span></div><div class="eclipse-mascot-ring"></div></div></div><p class="eyebrow">YOUR NEW GAME SPACE</p><h2 id="mascotTitle">WELCOME TO <em>ECLIPSE.</em></h2><p class="mascot-message">I’ll show you around. Your systems, game shelves and collections all live here. Set things up your way and make this space yours.</p><div class="mascot-tips"><span><b>01</b> Pick a system</span><span><b>02</b> Build your library</span><span><b>03</b> Make it yours</span></div><div class="mascot-actions"><button class="primary-btn" id="mascotStart">SHOW ME AROUND ↗</button><button class="subtle-btn" id="mascotSkip">SKIP FOR NOW</button></div></div></div>
<div class="modal-backdrop hidden" id="gameDetailModal"><div class="widget-modal game-detail-modal"><div class="modal-head"><div><p class="eyebrow">GAME DETAILS</p><h2 id="gameDetailTitle">GAME</h2></div><button class="close-modal" id="closeGameDetail" aria-label="Close game details">×</button></div><p class="game-detail-meta" id="gameDetailMeta"></p><div class="game-detail-file"><small>FILE LOCATION</small><p id="gameDetailPath"></p><small>PLAYER</small><p id="gameDetailPlayer"></p></div><div class="game-detail-actions"><button class="primary-btn" id="gameDetailLaunch">▶ PLAY GAME</button><button class="subtle-btn" id="gameDetailFavorite">☆ ADD TO FAVORITES</button><button class="subtle-btn" id="gameDetailRemove">REMOVE FROM LIBRARY</button></div><div class="sgdb-launch-row"><div><p class="eyebrow">STEAMGRIDDB ARTWORK</p><h3>MAKE THIS GAME LOOK RIGHT.</h3></div><button class="primary-btn" id="autoFetchArtwork">AUTO FETCH ART</button><button class="subtle-btn" id="openArtworkBrowser">BROWSE ARTWORK ↗</button></div><div class="sgdb-browser hidden" id="sgdbBrowser"><div class="sgdb-search-row"><input id="sgdbSearchInput" type="search" placeholder="Search SteamGridDB for this game…"><button class="primary-btn" id="sgdbSearchButton">SEARCH</button></div><p class="settings-note" id="sgdbStatus">Search for the matching game, then choose its artwork.</p><div class="sgdb-matches" id="sgdbMatches"></div><div class="sgdb-category-tabs" id="sgdbCategoryTabs"><button class="active" data-sgdb-type="grids">COVERS</button><button data-sgdb-type="heroes">BANNERS</button><button data-sgdb-type="logos">LOGOS</button><button data-sgdb-type="icons">ICONS</button></div><div class="sgdb-results" id="sgdbResults"></div></div><p class="settings-note">Choose a player for this system, then launch the original game file directly through that app.</p></div></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`;

const $ = s => document.querySelector(s);
const toast = $('#toast');
const mascotWelcome=$('#mascotWelcome');
const mascotCompanion=document.createElement('button');mascotCompanion.className='mascot-companion';mascotCompanion.type='button';mascotCompanion.setAttribute('aria-label','Talk to the ECLIPSE guide');mascotCompanion.innerHTML='<span class="mascot-companion-orb"><i></i><i></i></span><span class="mascot-companion-label">GUIDE</span>';document.body.append(mascotCompanion);
let mascotAudio=null,mascotMuted=localStorage.getItem('eclipse-mascot-muted')==='true';
function mascotBlip(){if(mascotMuted)return;try{mascotAudio=mascotAudio||new (window.AudioContext||window.webkitAudioContext)();if(mascotAudio.state==='suspended')mascotAudio.resume();const osc=mascotAudio.createOscillator(),gain=mascotAudio.createGain();osc.type='square';osc.frequency.setValueAtTime(620+Math.random()*240,mascotAudio.currentTime);osc.frequency.exponentialRampToValueAtTime(280,mascotAudio.currentTime+.045);gain.gain.setValueAtTime(.035,mascotAudio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,mascotAudio.currentTime+.05);osc.connect(gain);gain.connect(mascotAudio.destination);osc.start();osc.stop(mascotAudio.currentTime+.052);}catch{}}
function typeMascotLine(line){const target=$('.mascot-message');if(!target)return;target.textContent='';let index=0;const step=()=>{if(index>=line.length)return;target.textContent+=line[index++];if(index%2===0)mascotBlip();window.setTimeout(step,22);};step();}
function closeMascot(){mascotWelcome.classList.add('hidden');localStorage.setItem('eclipse-onboarding-complete','true');}
$('#mascotStart').addEventListener('click',()=>{closeMascot();showView('library');notify('Choose a system to open its ECLIPSE home.');});
$('#mascotSkip').addEventListener('click',closeMascot);
mascotCompanion.addEventListener('click',()=>{mascotWelcome.classList.remove('hidden');typeMascotLine('Need a hand? Pick a system, add your game folders, then arrange your shelves.');});
const mascotSoundButton=document.createElement('button');mascotSoundButton.className='mascot-sound-toggle';mascotSoundButton.type='button';mascotSoundButton.textContent=mascotMuted?'SOUND OFF':'SOUND ON';mascotSoundButton.setAttribute('aria-label','Toggle mascot sound effects');$('.mascot-actions')?.append(mascotSoundButton);mascotSoundButton.addEventListener('click',()=>{mascotMuted=!mascotMuted;localStorage.setItem('eclipse-mascot-muted',String(mascotMuted));mascotSoundButton.textContent=mascotMuted?'SOUND OFF':'SOUND ON';if(!mascotMuted)mascotBlip();});
if(!localStorage.getItem('eclipse-onboarding-complete')){mascotWelcome.classList.remove('hidden');window.setTimeout(()=>typeMascotLine('Hey. I can help you set up your game space. Start by choosing a system. I will keep the menus simple.'),280);}
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400);}
function saveLayout(){localStorage.setItem('eclipse-widgets',JSON.stringify(widgets));localStorage.setItem('eclipse-pages',JSON.stringify(pageNames));}
function setTheme(id){activeTheme=id;document.documentElement.dataset.theme=id;localStorage.setItem('eclipse-theme',id);$('#themeSelect').value=id;$('#settingsTheme').value=id;notify('Theme changed: '+themes.find(t=>t[0]===id)[1]);}
function applyInterfaceMode(){document.documentElement.dataset.interfaceMode=interfaceMode;}
function showView(name){activePage=name;document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$('#'+name+'View').classList.remove('hidden');document.querySelectorAll('.rail-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));window.scrollTo({top:0,behavior:'smooth'});if(name==='library')renderLibrary();if(name==='settings')renderSettings();if(name==='android')renderAndroidApps();renderHomeHero();}
function renderPages(){$('#pageTabs').innerHTML=pageNames.map((p,i)=>`<button class="page-tab ${i===currentPage?'selected':''}" data-page="${i}">${p}</button>`).join('');$('#pageTabs').querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>{currentPage=Number(b.dataset.page);renderPages();renderWidgets();}));}
function escapeHTML(value){
 const entities={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
 return String(value??'').replace(/[&<>"']/g,char=>entities[char]);
}
function playerSystemForGame(game){
 return systems.find(system=>system.name.toUpperCase()===game.system)?.name||game.system;
}
function widgetContent(id){
 const recent=games.length?games[games.length-1]:null;
 if(id==='recent')return `<div class="widget-heading"><small>LAST ADDED</small><span>↗</span></div><div class="widget-large">${recent?escapeHTML(recent.title):'NO GAMES YET'}</div><p class="widget-caption">${recent?escapeHTML(recent.system)+' · '+(recent.year||'YOUR LIBRARY'):'Scan a folder to start your collection'}</p>`;
 if(id==='systems')return `<div class="widget-heading"><small>MY SYSTEMS</small><span>↗</span></div><div class="system-mini-list">${systems.slice(0,3).map(s=>`<span>${s.icon} ${s.name}</span>`).join('')}</div>`;
 if(id==='favorites'){const favoriteGames=games.filter(game=>favorites.includes(game.id));return `<div class="widget-heading"><small>FAVORITES</small><span>✦</span></div><div class="widget-large">${favoriteGames.length?favoriteGames.length+' SAVED':'NO FAVORITES YET'}</div><p class="widget-caption">${escapeHTML(favoriteGames[0]?.title||'Save games from their details panel')}</p>`;}
 if(id==='playtime'){const total=Object.values(appPlaytime).reduce((sum,value)=>sum+Number(value||0),0)+(activeAppSession?Math.floor((Date.now()-activeAppSession.startedAt)/1000):0);const mins=Math.floor(total/60);const label=mins>=60?Math.floor(mins/60)+'h '+mins%60+'m':mins+'m';return `<div class="widget-heading"><small>PLAYTIME</small><span>◷</span></div><div class="widget-large">\${label}</div><p class="widget-caption">\${Object.keys(appPlaytime).length+(activeAppSession?1:0)} tracked app session(s) · manual tracking</p>`}
 if(id==='achievements')return `<div class="widget-heading"><small>ACHIEVEMENTS</small><span>✧</span></div><div class="widget-large">NOT CONNECTED</div><p class="widget-caption">Achievement services are not integrated yet</p>`;
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
const ECLIPSE_BACKUP_KEYS=['eclipse-games','eclipse-widgets','eclipse-pages','eclipse-theme','eclipse-preferences','eclipse-installed-apps','eclipse-emulator-assignments','eclipse-favorites','eclipse-folders','eclipse-system-folders','eclipse-system-shelf-rows','eclipse-play-count','eclipse-onboarding-complete','eclipse-folder-uri','eclipse-mascot-muted'];
function eclipseBackupSnapshot(){const values={};ECLIPSE_BACKUP_KEYS.forEach(key=>{const value=localStorage.getItem(key);if(value!==null)values[key]=value;});return JSON.stringify({format:'eclipse-backup',version:1,savedAt:new Date().toISOString(),values});}
async function chooseEclipseDataFolder(){const status=$('#dataFolderStatus');if(!Capacitor.isNativePlatform()){status.textContent='External folder selection is available in the Android APK. Browser data remains stored locally.';return;}status.textContent='Choose where ECLIPSE should keep its backup…';try{const result=await FolderAccess.pickDataFolder();status.textContent='Backup folder: '+(result.name||'Selected folder')+'. Saving your current ECLIPSE data…';const saved=await FolderAccess.saveData({data:eclipseBackupSnapshot()});status.textContent='Backup folder: '+(result.name||saved.name||'Selected folder')+'. Your current library and settings are backed up.';notify('ECLIPSE data folder connected.');}catch(error){const message=String(error?.message||error||'');if(!message.toLowerCase().includes('cancel'))status.textContent='Could not select the data folder: '+message;}}
async function saveEclipseDataBackup(){const status=$('#dataFolderStatus');if(!Capacitor.isNativePlatform()){status.textContent='Open the Android APK to save a backup to a chosen folder.';return;}status.textContent='Saving ECLIPSE backup…';try{const result=await FolderAccess.saveData({data:eclipseBackupSnapshot()});status.textContent='Backup saved as '+result.name+'.';notify('ECLIPSE backup saved.');}catch(error){status.textContent='Backup not saved: '+(error?.message||'Choose a data folder first.');}}
async function restoreEclipseDataBackup(){const status=$('#dataFolderStatus');if(!Capacitor.isNativePlatform()){status.textContent='Backup restore from a chosen folder is available in the Android APK.';return;}if(!confirm('Restore ECLIPSE data from the selected backup folder? This replaces the current local library and settings.'))return;status.textContent='Reading ECLIPSE backup…';try{const result=await FolderAccess.loadData();const backup=JSON.parse(result.data||'{}');if(backup.format!=='eclipse-backup'||!backup.values||typeof backup.values!=='object')throw new Error('This folder does not contain a valid ECLIPSE backup.');Object.entries(backup.values).forEach(([key,value])=>{if(ECLIPSE_BACKUP_KEYS.includes(key)&&typeof value==='string')localStorage.setItem(key,value);});status.textContent='Backup restored. Reloading ECLIPSE…';window.location.reload();}catch(error){status.textContent='Could not restore backup: '+(error?.message||'unknown error');}}
function saveAppTracking(){localStorage.setItem('eclipse-app-games',JSON.stringify(appGameFlags));localStorage.setItem('eclipse-app-playtime',JSON.stringify(appPlaytime));}
function formatPlaytime(seconds){const total=Math.max(0,Math.floor(seconds||0));const hours=Math.floor(total/3600),minutes=Math.floor((total%3600)/60);return hours?hours+'h '+minutes+'m':minutes+'m';}
function trackedSeconds(packageName){const saved=Number(appPlaytime[packageName]||0);if(activeAppSession?.packageName===packageName)return saved+Math.floor((Date.now()-activeAppSession.startedAt)/1000);return saved;}
function renderAndroidApps(){
 const list=$('#appLibraryList');if(!list)return;
 const query=($('#appLibrarySearch')?.value||'').trim().toLowerCase();
 const filtered=installedApps.filter(app=>(app.name+' '+app.packageName).toLowerCase().includes(query));
 const total=installedApps.length,marked=installedApps.filter(app=>appGameFlags[app.packageName]).length;
 $('#appCount').textContent=total;$('#gameAppCount').textContent=marked;
 const seconds=Object.values(appPlaytime).reduce((sum,value)=>sum+Number(value||0),0)+(activeAppSession?Math.floor((Date.now()-activeAppSession.startedAt)/1000):0);
 $('#trackedTime').textContent=formatPlaytime(seconds);
 $('#appLibraryStatus').textContent=Capacitor.isNativePlatform()?total+' apps discovered on this device.':'Device scanning is available in the Android APK.';
 if(!filtered.length){list.innerHTML='<div class="app-library-empty"><span>▣</span><b>'+(total?'NO MATCHING APPS':'NO APPS DISCOVERED YET')+'</b><p>'+(total?'Try another search.':'Tap SCAN DEVICE in the Android APK to discover installed apps.')+'</p></div>';renderHomeAppsShelf();return;}
 list.innerHTML=filtered.map(app=>{
  const isGame=!!appGameFlags[app.packageName],secondsForApp=trackedSeconds(app.packageName),isActive=activeAppSession?.packageName===app.packageName;
  const isPinned=appHomePins.includes(app.packageName);
  return '<article class="app-library-card"><div class="app-icon">'+escapeHTML((app.name||'?').slice(0,1).toUpperCase())+'</div><div class="app-card-info"><b>'+escapeHTML(app.name)+'</b><small>'+escapeHTML(app.packageName)+'</small><span>'+formatPlaytime(secondsForApp)+' TRACKED '+(isGame?' · GAME':' · APP')+'</span></div><div class="app-card-actions"><button class="launch-app-button" data-launch-app="'+escapeHTML(app.packageName)+'" type="button">LAUNCH</button><button class="pin-home-button '+(isPinned?'selected':'')+'" data-pin-home="'+escapeHTML(app.packageName)+'" type="button">'+(isPinned?'✓ ON HOME':'＋ ADD TO HOME')+'</button><button class="treat-game '+(isGame?'selected':'')+'" data-treat-game="'+escapeHTML(app.packageName)+'">'+(isGame?'★ GAME':'＋ TREAT AS GAME')+'</button><button class="session-button '+(isActive?'running':'')+'" data-session-app="'+escapeHTML(app.packageName)+'">'+(isActive?'STOP SESSION':'START SESSION')+'</button></div></article>';
 }).join('');
 list.querySelectorAll('[data-launch-app]').forEach(button=>button.addEventListener('click',()=>launchInstalledApp(button.dataset.launchApp)));
 list.querySelectorAll('[data-pin-home]').forEach(button=>button.addEventListener('click',()=>{
  const packageName=button.dataset.pinHome;
  appHomePins=appHomePins.includes(packageName)?appHomePins.filter(item=>item!==packageName):[...appHomePins,packageName];
  localStorage.setItem('eclipse-home-app-pins',JSON.stringify(appHomePins));
  renderAndroidApps();renderHomeAppsShelf();
  notify(appHomePins.includes(packageName)?'App added to ECLIPSE Home.':'App removed from ECLIPSE Home.');
 }));
 list.querySelectorAll('[data-treat-game]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.treatGame;if(appGameFlags[id])delete appGameFlags[id];else appGameFlags[id]=true;saveAppTracking();renderAndroidApps();notify(appGameFlags[id]?'Added to games.':'Removed game label.');}));
 list.querySelectorAll('[data-session-app]').forEach(button=>button.addEventListener('click',()=>toggleAppSession(button.dataset.sessionApp)));
 renderHomeAppsShelf();
}
function toggleAppSession(packageName){
 if(activeAppSession?.packageName===packageName){
  appPlaytime[packageName]=Number(appPlaytime[packageName]||0)+Math.max(0,Math.floor((Date.now()-activeAppSession.startedAt)/1000));
  activeAppSession=null;localStorage.removeItem('eclipse-active-app-session');saveAppTracking();notify('Play session saved.');
 }else{
  if(activeAppSession){notify('Stop the current session before starting another.');return;}
  activeAppSession={packageName,startedAt:Date.now()};localStorage.setItem('eclipse-active-app-session',JSON.stringify(activeAppSession));notify('Manual play session started.');
 }
 renderAndroidApps();
}
window.setInterval(()=>{if(activeAppSession&&activePage==='android')renderAndroidApps();},15000);

function renderSettings(){
 renderPlayerSettings();
 ['showHeroSetting','compactRowsSetting','systemCountsSetting','startPageSetting'].forEach((id)=>{const el=$('#'+id);if(el){const key={showHeroSetting:'showHero',compactRowsSetting:'compactRows',systemCountsSetting:'systemCounts',startPageSetting:'startPage'}[id];el.value=preferences[key];if(el.type==='checkbox')el.checked=!!preferences[key];}});const rowsSelect=$('#systemShelfRowsSetting');if(rowsSelect)rowsSelect.value=String(systemShelfRows);const modeSelect=$('#interfaceModeSetting');if(modeSelect)modeSelect.value=interfaceMode;applyInterfaceMode();
 renderFolderPaths();renderSettingsPages();
 const sgdbInput=$('#sgdbApiKey');if(sgdbInput)sgdbInput.value=sgdbKey();const sgdbStatus=$('#sgdbKeyStatus');if(sgdbStatus)sgdbStatus.textContent=sgdbKey()?'API key saved on this device.':'No API key saved yet.';
 const dataStatus=$('#dataFolderStatus');if(dataStatus&&!Capacitor.isNativePlatform())dataStatus.textContent='External backup folders require the Android APK. Local app data is still saved automatically on this device.';
}
function savePreferences(){localStorage.setItem('eclipse-preferences',JSON.stringify(preferences));document.querySelector('.feature-hero')?.classList.toggle('hidden',!preferences.showHero);document.documentElement.classList.toggle('eclipse-compact-rows',!!preferences.compactRows);renderLibrary();renderWidgets();}
function renderFolderPaths(){const list=$('#folderList');if(!list)return;list.innerHTML=folderPaths.length?folderPaths.map((p,i)=>{const name=typeof p==='string'?p:(p.name||'Game folder');return '<div class="folder-item"><span>▰ '+escapeHTML(name)+'</span><button data-folder-remove="'+i+'" aria-label="Remove '+escapeHTML(name)+'">×</button></div>';}).join(''):'<p class="settings-note">No folders added yet. Add a parent folder or a platform folder below.</p>';list.querySelectorAll('[data-folder-remove]').forEach(b=>b.addEventListener('click',()=>{const removed=folderPaths.splice(Number(b.dataset.folderRemove),1)[0];const uri=typeof removed==='string'?removed:removed?.uri;if(uri&&localStorage.getItem('eclipse-folder-uri')===uri)localStorage.removeItem('eclipse-folder-uri');localStorage.setItem('eclipse-folders',JSON.stringify(folderPaths));renderFolderPaths();}));}
function renderSettingsPages(){const list=$('#settingsPageList');if(!list)return;list.innerHTML=pageNames.map((p,i)=>'<div class="settings-page-item"><span>'+p+'</span><button data-page-rename="'+i+'">RENAME</button><button data-page-delete="'+i+'">×</button></div>').join('');list.querySelectorAll('[data-page-rename]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.pageRename),name=prompt('Name this home page',pageNames[i]);if(name?.trim()){pageNames[i]=name.trim().slice(0,24);saveLayout();renderPages();renderSettingsPages();}}));list.querySelectorAll('[data-page-delete]').forEach(b=>b.addEventListener('click',()=>{if(pageNames.length===1){notify('Keep at least one home page.');return;}pageNames.splice(Number(b.dataset.pageDelete),1);currentPage=Math.min(currentPage,pageNames.length-1);saveLayout();renderWidgets();renderSettingsPages();}));}
let featuredSystemIndex=Math.max(0,systems.findIndex(item=>item.name===localStorage.getItem('eclipse-featured-system')));
function selectFeaturedSystem(index,scroll=true){
 featuredSystemIndex=(index+systems.length)%systems.length;
 const system=systems[featuredSystemIndex];
 localStorage.setItem('eclipse-featured-system',system.name);
 const marks={Nintendo:'✦',PlayStation:'△',Xbox:'◉',Sega:'◈',Atari:'▥',Arcade:'✧',PC:'⌘','PC Gaming':'⌘',Mobile:'▣',Android:'▣'};
 const mark=marks[system.family]||system.icon;
 const name=$('#systemFeatureName'),family=$('#systemFeatureFamily'),meta=$('#systemFeatureMeta'),count=$('#systemFeatureCount'),symbol=$('#systemFeatureMark');
 const feature=$('#systemFeature');if(feature){feature.dataset.family=system.family.toLowerCase().replace(/[^a-z0-9]+/g,'-');feature.dataset.system=system.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');}
 if(name)name.textContent=system.name.toUpperCase();
 if(family)family.textContent=system.family.toUpperCase();
 if(meta)meta.textContent='Explore your '+system.name+' collection and player setup.';
 if(count)count.textContent=String(gamesForSystem(system.name).length);
 if(symbol)symbol.textContent=mark;
 const picker=$('#systemPicker');
 picker?.querySelectorAll('[data-system-index]').forEach(card=>{const active=Number(card.dataset.systemIndex)===featuredSystemIndex;card.classList.toggle('selected',active);card.setAttribute('aria-pressed',String(active));});
 if(scroll){const card=picker?.querySelector('[data-system-index="'+featuredSystemIndex+'"]');card?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}
}
function renderSystemPicker(){
 const picker=$('#systemPicker');if(!picker)return;
 const marks={Nintendo:'✦',PlayStation:'△',Xbox:'◉',Sega:'◈',Atari:'▥',Arcade:'✧',PC:'⌘', 'PC Gaming':'⌘',Mobile:'▣',Android:'▣'};
 picker.innerHTML=systems.map((system,index)=>'<button class="system-pick-card" data-system-index="'+index+'" data-pick-system="'+escapeHTML(system.name)+'" style="--card-index:'+index+'" aria-label="Select '+escapeHTML(system.name)+'" aria-pressed="false"><span class="system-card-top"><small>'+String(index+1).padStart(2,'0')+'</small><i>'+escapeHTML(system.family.toUpperCase())+'</i></span><span class="system-cube"><span class="cube-face cube-front">'+(marks[system.family]||system.icon)+'</span><span class="cube-face cube-side"></span><span class="cube-face cube-top"></span></span><span class="system-card-bottom"><b>'+escapeHTML(system.name)+'</b><small>'+gamesForSystem(system.name)+' TITLES <i>•</i></small></span></button>').join('');
 $('#systemPickerCount').textContent=systems.length+' WORLDS AVAILABLE';
 picker.querySelectorAll('[data-pick-system]').forEach(card=>{card.addEventListener('focus',()=>selectFeaturedSystem(Number(card.dataset.systemIndex),false));card.addEventListener('click',()=>selectFeaturedSystem(Number(card.dataset.systemIndex)));});
 $('#enterFeaturedSystem')?.addEventListener('click',()=>openConsolePage(systems[featuredSystemIndex].name),{once:true});
 selectFeaturedSystem(featuredSystemIndex,false);
}
let nativeDisplayInfo = null;
function detectDisplaySegments(){
 const segments=typeof window.getWindowSegments==='function'?window.getWindowSegments():[];
 const posture=window.navigator.devicePosture?.type||'unknown';
 const cssSegments=window.matchMedia?.('(horizontal-viewport-segments: 2)').matches||window.matchMedia?.('(vertical-viewport-segments: 2)').matches||false;
 return {dual:segments.length>1||cssSegments||nativeDisplayInfo?.dual===true,segments,posture};
}
async function refreshDisplayLayout(){
 if(Capacitor.isNativePlatform()){
  try{nativeDisplayInfo=await DisplayInfo.getLayout();}catch(error){console.info('Native display detection unavailable; using browser detection.',error);}
 }
 return applyDisplayLayout(localStorage.getItem('eclipse-display-layout')||'auto');
}
function applyDisplayLayout(mode=localStorage.getItem('eclipse-display-layout')||'auto'){
 const detected=detectDisplaySegments();
 const effective=mode==='auto'?(detected.dual?'dual':'single'):mode;
 document.documentElement.dataset.displayLayout=effective;
 document.documentElement.dataset.displayPreference=mode;
 const orientation=nativeDisplayInfo?.orientation||(detected.segments.length>1?(detected.segments[0].width>=detected.segments[0].height?'vertical':'horizontal'):'vertical');
 document.documentElement.dataset.displayOrientation=orientation;
 if(detected.segments.length>1){
  const ordered=[...detected.segments].sort((a,b)=>a.left-b.left);
  const gap=Math.max(0,ordered[1].left-(ordered[0].left+ordered[0].width));
  document.documentElement.style.setProperty('--eclipse-hinge-gap',Math.min(gap,80)+'px');
 }else document.documentElement.style.removeProperty('--eclipse-hinge-gap');
 const status=$('#displayDetectionStatus');
 if(status)status.textContent=detected.dual?'Dual display detected · split layout ready':(detected.posture!=='unknown'?'Foldable posture detected · adaptive layout ready':'Single display detected · responsive layout ready');
 const select=$('#displayLayoutSelect');if(select&&select.value!==mode)select.value=mode;
 const settingsSelect=$('#settingsDisplayLayout');if(settingsSelect)settingsSelect.value=mode;
 return {mode,effective,detected};
}
async function requestDefaultHome(){
 const status=$('#defaultHomeStatus');
 if(!Capacitor.isNativePlatform()){if(status)status.textContent='Available in the Android APK. Android controls the final Home app selection.';notify('Default Home setup is available in the Android APK.');return;}
 if(status)status.textContent='Opening Android launcher confirmation…';
 try{
  const result=await LauncherSetup.requestDefaultHome();
  if(result?.isDefaultHome){if(status)status.textContent='ECLIPSE is your default Home app.';notify('ECLIPSE is now your default Home.');}
  else if(status)status.textContent='If Android showed its Home app chooser, select ECLIPSE there to finish.';
 }catch(error){if(status)status.textContent='Could not open the Home app chooser: '+(error?.message||'Try Android Settings → Apps → Default apps → Home app.');}
}
function openOnboarding(){
 const modal=$('#onboardingModal');if(!modal||localStorage.getItem('eclipse-onboarding-complete')==='true')return;
 applyDisplayLayout(localStorage.getItem('eclipse-display-layout')||'auto');
 modal.classList.remove('hidden');
 refreshDisplayLayout();
}
function finishOnboarding(){localStorage.setItem('eclipse-onboarding-complete','true');$('#onboardingModal')?.classList.add('hidden');}
function renderKonsoruHome(){
 const root=$('#konsoruHome');if(!root)return;
 const count=$('#konsoruGameCount'),systemsCount=$('#konsoruSystemCount');if(count)count.textContent=games.length;
 const activeSystems=[...new Set(games.map(game=>game.system))];if(systemsCount)systemsCount.textContent=activeSystems.length;
 const latest=games.length?games[games.length-1]:null;const resume=$('#konsoruResume');
 if(resume){resume.textContent=latest?'▶  OPEN · '+latest.title:'＋  ADD YOUR FIRST GAME';resume.onclick=()=>latest?showGameDetails(latest):(showView('library'),chooseGameFolder());}
 const status=$('#konsoruLibraryStatus');if(status)status.textContent=games.length?'COLLECTION READY':'AWAITING GAMES';
 const families=[...new Set(systems.map(item=>item.family))];const marks={Nintendo:'◈',PlayStation:'△',Xbox:'✕',Sega:'◉',Atari:'▥',Arcade:'✦',PC:'⌘','PC Gaming':'⌘',Mobile:'▣',Android:'▣'};
 const worldGrid=$('#konsoruWorldGrid');
 if(worldGrid)worldGrid.innerHTML=families.map((family,index)=>{const members=systems.filter(item=>item.family===family);const total=members.reduce((sum,item)=>sum+gamesForSystem(item.name).length,0);return '<button class="konsoru-world-card world-'+family.toLowerCase().replace(/[^a-z]+/g,'-')+'" data-konsoru-family="'+escapeHTML(family)+'" style="--world-index:'+index+'"><span class="konsoru-world-symbol">'+(marks[family]||'✦')+'</span><span class="konsoru-world-copy"><b>'+escapeHTML(family.toUpperCase())+'</b><small>'+members.length+' SYSTEMS · '+total+' GAMES</small></span><span class="konsoru-world-arrow">↗</span></button>';}).join('');
 worldGrid?.querySelectorAll('[data-konsoru-family]').forEach(button=>button.addEventListener('click',()=>{const first=systems.find(item=>item.family===button.dataset.konsoruFamily);if(first)openConsolePage(first.name);}));
 const recent=$('#konsoruRecentRow');
 if(recent)recent.innerHTML=games.length?games.slice().reverse().slice(0,10).map(game=>'<button class="konsoru-recent-card" data-konsoru-game="'+games.indexOf(game)+'"><span class="konsoru-cover"><i>✦</i><small>'+escapeHTML(game.system)+'</small></span><b>'+escapeHTML(game.title)+'</b><small>'+escapeHTML(game.system)+'</small></button>').join(''):'<div class="konsoru-empty"><span>✦</span><b>YOUR COLLECTION STARTS HERE</b><p>Add a game folder to build your library.</p><button class="konsoru-secondary" id="konsoruEmptyScan">ADD GAMES ↗</button></div>';
 recent?.querySelectorAll('[data-konsoru-game]').forEach(card=>{const game=games[Number(card.dataset.konsoruGame)],url=game?.artwork?.grid;if(url){const img=document.createElement('img');img.src=url;img.alt='';img.loading='lazy';img.className='sgdb-cover-image';card.querySelector('.konsoru-cover')?.prepend(img);}});
 recent?.querySelectorAll('[data-konsoru-game]').forEach(button=>button.addEventListener('click',()=>showGameDetails(games[Number(button.dataset.konsoruGame)])));
 $('#konsoruEmptyScan')?.addEventListener('click',()=>{showView('library');chooseGameFolder();});
 $('#konsoruOpenLibrary')?.addEventListener('click',()=>showView('library'));$('#konsoruAllGames')?.addEventListener('click',()=>showView('library'));
 $('#konsoruCustomize')?.addEventListener('click',()=>{showView('settings');document.querySelector('[data-settings-tab="personal"]')?.click();});
 root.querySelectorAll('[data-konsoru-jump]').forEach(button=>button.onclick=()=>showView(button.dataset.konsoruJump));
}
function renderHomeHero(){
 renderKonsoruHome();
 const hero=$('#homeLibraryHero');if(!hero)return;
 hero.classList.toggle('hidden',games.length===0||!preferences.showHero||interfaceMode==='cocoon');
 if(games.length){$('#homeHeroTitle').textContent=games[games.length-1].title;$('#homeHeroMeta').textContent=games[games.length-1].system+' · '+games.length+' GAMES IN YOUR LIBRARY';}
 const shelf=$('#homeGamesShelf');if(!shelf)return;
 shelf.classList.toggle('hidden',games.length===0);
 if(!games.length){shelf.innerHTML='';return;}
 const groups=[...new Set(games.map(game=>game.system))];
 const makeTile=game=>'<button class="cocoon-game-tile" data-home-game="'+games.indexOf(game)+'" type="button"><span class="cocoon-game-cover" data-art-game="'+games.indexOf(game)+'"><i>✦</i><small>'+escapeHTML(game.system)+'</small></span><b>'+escapeHTML(game.title)+'</b><small class="cocoon-game-platform">'+escapeHTML(game.system)+'</small></button>';
 const recent=games.slice().reverse().slice(0,14);
 shelf.innerHTML='<section class="cocoon-shelf"><div class="home-shelf-heading"><div><p class="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>YOUR COLLECTION</h2></div><span>'+games.length+' GAMES</span></div><div class="cocoon-game-row">'+recent.map(makeTile).join('')+'</div></section>'+
 groups.map(system=>{const items=games.filter(game=>game.system===system);return '<section class="cocoon-shelf"><div class="home-shelf-heading"><div><p class="eyebrow">YOUR LIBRARY</p><h2>'+escapeHTML(system)+'</h2></div><span>'+items.length+' '+(items.length===1?'GAME':'GAMES')+'</span></div><div class="cocoon-game-row">'+items.map(makeTile).join('')+'</div></section>';}).join('');
 shelf.querySelectorAll('[data-art-game]').forEach(cover=>{const url=games[Number(cover.dataset.artGame)]?.artwork?.grid;if(url){const img=document.createElement('img');img.src=url;img.alt='';img.loading='lazy';img.className='sgdb-cover-image';cover.prepend(img);}});
 shelf.querySelectorAll('[data-home-game]').forEach(button=>button.addEventListener('click',()=>showGameDetails(games[Number(button.dataset.homeGame)])));
}
function renderHomeAppsShelf(){
 const shelf=$('#homeAppsShelf');if(!shelf)return;
 const pinned=appHomePins.map(packageName=>installedApps.find(app=>app.packageName===packageName)).filter(Boolean);
 shelf.classList.toggle('hidden',pinned.length===0);
 if(!pinned.length)return;
 shelf.innerHTML='<div class="home-shelf-heading"><div><p class="eyebrow">QUICK LAUNCH</p><h2>YOUR APPS</h2></div><span>'+pinned.length+' PINNED</span></div><div class="home-app-row">'+pinned.map(app=>'<div class="home-app-tile"><button class="home-app-launch" data-home-app-launch="'+escapeHTML(app.packageName)+'" type="button"><span class="home-app-icon">'+escapeHTML((app.name||'?').slice(0,1).toUpperCase())+'</span><b>'+escapeHTML(app.name)+'</b></button><button class="home-app-remove" data-home-app-remove="'+escapeHTML(app.packageName)+'" type="button" aria-label="Remove '+escapeHTML(app.name)+' from Home">×</button></div>').join('')+'</div>';
 shelf.querySelectorAll('[data-home-app-launch]').forEach(button=>button.addEventListener('click',()=>launchInstalledApp(button.dataset.homeAppLaunch)));
 shelf.querySelectorAll('[data-home-app-remove]').forEach(button=>button.addEventListener('click',()=>{appHomePins=appHomePins.filter(item=>item!==button.dataset.homeAppRemove);localStorage.setItem('eclipse-home-app-pins',JSON.stringify(appHomePins));renderHomeAppsShelf();renderAndroidApps();notify('App removed from Home.');}));
}
async function launchInstalledApp(packageName){
 if(!Capacitor.isNativePlatform()){notify('App launching is available in the Android APK.');return;}
 try{await FolderAccess.launchApp({packageName});notify('Launching app…');}
 catch(error){notify(error?.message||'Could not launch this app.');}
}
function renderLibrary(){
 $('#libraryCount').textContent=games.length+' GAMES';
 $('#consoleStrip').innerHTML=systems.map(s=>`<button class="console-card" data-console="${s.name}"><span>${s.icon}</span><b>${s.name}</b><small>${preferences.systemCounts?(gamesForSystem(s.name).length ? gamesForSystem(s.name)+' IN LIBRARY' : 'NO GAMES FOUND'):'OPEN SYSTEM'}</small></button>`).join('');
 $('#consoleStrip').querySelectorAll('[data-console]').forEach(b=>b.addEventListener('click',()=>openConsolePage(b.dataset.console)));
 renderFilters();renderGames();
}
let systemBootTimer=null;
function openConsolePage(name){
 const system=systems.find(s=>s.name===name)||{name,icon:'✦',family:'Platform'};
 const boot=$('#systemBoot');if(systemBootTimer)window.clearTimeout(systemBootTimer);
 $('#bootSystemName').textContent='OPENING '+system.name.toUpperCase();
 renderConsoleHome(system);showView('console');boot.classList.remove('hidden');
 systemBootTimer=window.setTimeout(()=>{boot.classList.add('hidden');systemBootTimer=null;},420);
}
function renderConsoleHome(system){
 const name=system.name;activeConsoleName=name;window.EclipseExperienceApplySystemTheme?.(name);
 const titles=gamesForSystem(name);
 $('#consoleTitle')?.remove();
 $('#consoleGeneration').textContent=system.family.toUpperCase()+' PLATFORM';
 $('#consoleBanner').innerHTML='<div class="console-banner-mark">'+system.icon+'</div><div class="console-banner-copy"><p class="eyebrow">SYSTEM HOME</p><h1>'+system.name.toUpperCase()+'</h1><p>Your '+system.name+' dashboard. Review imported games and choose the player for this system.</p></div><div class="console-banner-index">SYSTEM / '+String(systems.indexOf(system)+1).padStart(2,'0')+'</div>';
 const profile=emulatorOptions[name];
 $('#emulatorPanel').innerHTML='<div class="emulator-panel-head"><div><p class="eyebrow">PLAYER SETUP</p><h3>CHOOSE YOUR EMULATOR / APP</h3></div><span class="feature-tag">'+(profile?'SYSTEM PROFILE':'PLAYER ROUTING')+'</span></div>'+(profile?'<p class="settings-note">Suggested player references only. These are not proof that an app is installed or compatible with every game.</p><div class="emulator-option-list">'+profile.items.map(item=>'<span class="emulator-option">'+item+'</span>').join('')+'</div><p class="settings-note">'+profile.note+'</p>':'<p class="settings-note">Choose an installed app for this system.</p>')+'<div class="player-picker-row"><label>PLAYER FOR '+name.toUpperCase()+'<select id="systemPlayerSelect"><option value="">Choose an installed app…</option></select></label><button class="subtle-btn" id="scanSystemPlayers">SCAN APPS</button><button class="subtle-btn" id="autoSystemPlayer">AUTO-SELECT</button></div><p class="settings-note" id="systemPlayerStatus">Scan installed apps, then choose the player you want to use.</p>';
populatePlayerSelect($('#systemPlayerSelect'),name);
$('#scanSystemPlayers').addEventListener('click',()=>scanInstalledApps(name));
$('#systemPlayerSelect').addEventListener('change',event=>savePlayerAssignment(name,event.target.value));
$('#autoSystemPlayer').addEventListener('click',()=>autoSelectPlayer(name));
 const artFor=g=>'<div class="game-art art-'+g.art+'" data-system-art="'+games.indexOf(g)+'"><span class="art-glow"></span><span class="art-mark">✦</span><span class="art-caption">'+escapeHTML(g.tag)+'</span></div>';
 const cardFor=g=>'<button class="system-game-card" data-system-game="'+games.indexOf(g)+'">'+artFor(g)+'<div class="system-game-meta"><b>'+escapeHTML(g.title)+'</b><small>'+escapeHTML(g.tag)+' · '+escapeHTML(g.fileName)+'</small></div></button>';
 const featured=titles[0];
 const folderNames=['ALL GAMES'];
 $('#systemHome').innerHTML=
  '<div class="system-home-head"><div><p class="eyebrow">WELCOME TO YOUR SYSTEM</p><h2>'+name.toUpperCase()+' HOME</h2></div><span class="collection-count">'+titles.length+' TITLES</span></div>'+
  '<div class="system-folder-row"><div class="system-row-label"><p class="eyebrow">YOUR COLLECTION</p><span>'+titles.length+' VERIFIED FILES</span></div><div class="system-folders">'+folderNames.map(folder=>'<button class="system-folder" data-system-folder="'+folder+'"><span>▣</span><b>'+folder+'</b><small>'+titles.length+' GAMES FOUND</small></button>').join('')+'</div></div>'+
  (featured?'<section class="system-featured"><div class="system-featured-art">'+artFor(featured)+'</div><div class="system-featured-copy"><p class="eyebrow">FEATURED GAME</p><h2>'+featured.title+'</h2><p>'+name+' · '+featured.year+' · '+featured.tag+'</p><button class="primary-btn" data-system-game="'+games.indexOf(featured)+'">OPEN GAME ↗</button></div></section>':'<div class="system-empty-hero"><p class="eyebrow">NOTHING IMPORTED</p><h2>NO GAMES FOUND.</h2><p>Only games found in a folder scan appear here. Nothing is added automatically.</p><button class="primary-btn" data-go-scan>CHOOSE GAME FOLDER ↗</button></div>')+
  '<section class="system-shelf"><div class="system-row-label"><div><p class="eyebrow">YOUR COLLECTION</p><h3>ALL GAMES</h3></div><span>'+titles.length+' ITEMS · '+systemShelfRows+' ROW'+(systemShelfRows===1?'':'S')+'</span></div><div class="system-game-row" style="--system-shelf-rows:'+systemShelfRows+'">'+(titles.length?titles.map(cardFor).join(''):'<p class="settings-note">No supported game files were found for this system.</p>')+'</div></section>';
 $('#systemHome').querySelectorAll('[data-system-art]').forEach(cover=>{const url=games[Number(cover.dataset.systemArt)]?.artwork?.grid;if(url){const img=document.createElement('img');img.src=url;img.alt='';img.loading='lazy';img.className='sgdb-cover-image';cover.prepend(img);}});
 $('#systemHome').querySelectorAll('[data-system-game]').forEach(button=>button.addEventListener('click',()=>{const game=games[Number(button.dataset.systemGame)];if(game)showGameDetails(game);}));
 $('#systemHome').querySelectorAll('[data-system-folder]').forEach(button=>button.addEventListener('click',()=>$('#systemHome').querySelector('.system-shelf')?.scrollIntoView({behavior:'smooth'})));
 $('#systemHome').querySelector('[data-go-scan]')?.addEventListener('click',()=>{showView('library');chooseGameFolder();});
 const menu=$('#systemMenu');
 menu.innerHTML=[['overview','OVERVIEW'],['games','GAMES'],['players','PLAYERS'],['scan','SCAN GAMES'],['settings','SYSTEM SETTINGS']].map(([key,label],index)=>'<button class="system-menu-item '+(index===0?'active':'')+'" data-system-menu="'+key+'">'+label+'</button>').join('');
 menu.querySelectorAll('[data-system-menu]').forEach(button=>button.addEventListener('click',()=>{
  menu.querySelectorAll('[data-system-menu]').forEach(item=>item.classList.toggle('active',item===button));
  const action=button.dataset.systemMenu;
  if(action==='overview'){window.scrollTo({top:0,behavior:'smooth'});}
  if(action==='games')$('#systemHome').querySelector('.system-shelf')?.scrollIntoView({behavior:'smooth',block:'start'});
  if(action==='players')$('#emulatorPanel').scrollIntoView({behavior:'smooth',block:'start'});
  if(action==='scan'){showView('library');chooseGameFolder();}
  if(action==='settings'){showView('settings');document.querySelector('[data-settings-tab="players"]')?.click();}
 }));
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
 const platformGames=activeSystem==='All Games'?games:gamesForSystem(activeSystem);
 const query=($('#librarySearch')?.value||'').trim().toLowerCase();
 const visible=platformGames.filter(game=>!query||[game.title,game.system,game.fileName,game.relativePath].join(' ').toLowerCase().includes(query));
 $('#gameGrid').innerHTML=visible.length?visible.map(g=>{const i=games.indexOf(g);return `<button class="game-card ${i===selectedGame?'focused':''}" data-game="${i}"><div class="game-art art-generic" data-library-art="${i}"><span class="art-glow"></span><span class="art-mark">✦</span><span class="art-caption">${escapeHTML(g.tag||'GAME FILE')}</span></div><div class="game-meta"><div><h3>${escapeHTML(g.title)}</h3><p>${escapeHTML(g.system)} · ${escapeHTML(g.fileName||'Imported file')}</p></div><span class="game-arrow">↗</span></div></button>`;}).join(''):query?'<div class="empty-state system-empty"><div class="empty-icon">⌕</div><h3>NO MATCHES</h3><p>Try another title or file name.</p><button class="subtle-btn" id="clearLibrarySearch">CLEAR SEARCH</button></div>':'<div class="empty-state system-empty"><div class="empty-icon">✦</div><h3>NO GAMES FOUND</h3><p>Choose a game folder and scan it. ECLIPSE will only show files it can identify for this platform.</p><button class="primary-btn" id="emptyScanBtn">CHOOSE GAME FOLDER</button></div>';
 $('#gameGrid').querySelectorAll('[data-library-art]').forEach(cover=>{const url=games[Number(cover.dataset.libraryArt)]?.artwork?.grid;if(url){const img=document.createElement('img');img.src=url;img.alt='';img.loading='lazy';img.className='sgdb-cover-image';cover.prepend(img);}});
 $('#gameGrid').querySelectorAll('[data-game]').forEach(card=>card.addEventListener('click',()=>{selectedGame=Number(card.dataset.game);showGameDetails(games[selectedGame]);}));
 $('#emptyScanBtn')?.addEventListener('click',chooseGameFolder);
 $('#clearLibrarySearch')?.addEventListener('click',()=>{$('#librarySearch').value='';renderGames();});
}
let activeConsoleName='';
let selectedGameDetailId=null;
let sgdbCurrentGameId=null;
let sgdbCurrentType='grids';
function sgdbKey(){return localStorage.getItem('eclipse-steamgriddb-key')||'';}
function sgdbSafeUrl(value){try{const url=new URL(value);return url.protocol==='https:'?url.href:'';}catch{return '';}}
async function sgdbFetch(path){
 const key=sgdbKey();if(!key)throw new Error('Add your SteamGridDB API key in Settings → Personalize → SteamGridDB first.');
 const response=await fetch('https://www.steamgriddb.com/api/v2/'+path,{headers:{Authorization:'Bearer '+key,Accept:'application/json'}});
 if(response.status===401||response.status===403)throw new Error('SteamGridDB rejected that API key. Check it in Settings.');
 if(response.status===429)throw new Error('SteamGridDB rate limit reached. Wait a little and try again.');
 if(!response.ok)throw new Error('SteamGridDB request failed ('+response.status+').');
 const payload=await response.json();if(!payload.success)throw new Error('SteamGridDB could not complete that request.');
 return Array.isArray(payload.data)?payload.data:[];
}
function setSgdbStatus(message,isError=false){const el=$('#sgdbStatus');if(el){el.textContent=message;el.classList.toggle('error',isError);}}
function renderSgdbMatches(items){
 const root=$('#sgdbMatches');if(!root)return;root.replaceChildren();
 items.forEach(item=>{const button=document.createElement('button');button.className='sgdb-match';button.type='button';const name=document.createElement('b');name.textContent=item.name||'Unknown game';const type=document.createElement('small');type.textContent=(item.types||[]).join(' · ')||'GAME';button.append(name,type);button.addEventListener('click',()=>selectSgdbGame(item));root.append(button);});
}
async function searchSgdbGames(){
 const query=$('#sgdbSearchInput')?.value.trim();if(!query){setSgdbStatus('Type a game title to search.',true);return;}
 if(!sgdbKey()){setSgdbStatus('Add your API key in Settings → Personalize → SteamGridDB.',true);return;}
 setSgdbStatus('SEARCHING STEAMGRIDDB…');$('#sgdbMatches')?.replaceChildren();$('#sgdbResults')?.replaceChildren();
 try{const items=await sgdbFetch('search/autocomplete/'+encodeURIComponent(query));renderSgdbMatches(items.slice(0,12));setSgdbStatus(items.length?'Choose the exact game below.':'No matching games found. Try another title.',!items.length);}
 catch(error){setSgdbStatus(error.message,true);}
}
async function selectSgdbGame(item){
 sgdbCurrentGameId=item.id;setSgdbStatus('MATCHED: '+item.name+' · LOADING ARTWORK…');renderSgdbMatches([item]);await loadSgdbAssets(sgdbCurrentType);
}
async function loadSgdbAssets(type){
 if(!sgdbCurrentGameId)return;sgdbCurrentType=type;
 $('#sgdbCategoryTabs')?.querySelectorAll('[data-sgdb-type]').forEach(button=>button.classList.toggle('active',button.dataset.sgdbType===type));
 const root=$('#sgdbResults');root?.replaceChildren();setSgdbStatus('LOADING '+type.toUpperCase()+'…');
 try{const assets=await sgdbFetch(type+'/game/'+sgdbCurrentGameId+'?types=static');renderSgdbAssets(assets,type);setSgdbStatus(assets.length?assets.length+' '+type.toUpperCase()+' FOUND. Select one to apply it.':'No '+type+' artwork found for this game. Try another category.');}
 catch(error){setSgdbStatus(error.message,true);}
}
function renderSgdbAssets(assets,type){
 const root=$('#sgdbResults');if(!root)return;root.replaceChildren();
 assets.slice(0,36).forEach(asset=>{const url=sgdbSafeUrl(asset.url),thumb=sgdbSafeUrl(asset.thumb)||url;if(!url||!thumb)return;
  const button=document.createElement('button');button.className='sgdb-art-card';button.type='button';button.title='Apply this '+type+' artwork';
  const img=document.createElement('img');img.loading='lazy';img.src=thumb;img.alt='SteamGridDB community artwork';button.append(img);
  const meta=document.createElement('small');meta.textContent=(asset.width&&asset.height?asset.width+' × '+asset.height:'ARTWORK')+' · '+(asset.style||'COMMUNITY');button.append(meta);
  button.addEventListener('click',()=>applySgdbArtwork(type,url));root.append(button);
 });
}
function applySgdbArtwork(type,url){
 const game=games.find(item=>item.id===selectedGameDetailId);if(!game)return;
 const safe=sgdbSafeUrl(url);if(!safe){setSgdbStatus('That artwork URL is not a secure HTTPS image.',true);return;}
 const field={grids:'grid',heroes:'hero',logos:'logo',icons:'icon'}[type];
 game.artwork={...(game.artwork||{}),[field]:safe,source:'SteamGridDB',gameId:sgdbCurrentGameId};
 try{localStorage.setItem('eclipse-games',JSON.stringify(games));}
 catch(error){setSgdbStatus('Could not save artwork. Device storage may be full.',true);return;}
 setSgdbStatus('APPLIED! '+type.toUpperCase()+' saved to '+game.title+'.');renderKonsoruHome();renderHomeHero();renderLibrary();
 if(activePage==='console'&&activeConsoleName)renderConsoleHome(systems.find(item=>item.name===activeConsoleName)||{name:activeConsoleName,icon:'✦',family:'Platform'});
 notify('SteamGridDB '+type+' applied to '+game.title+'.');
}
async function autoFetchSgdbArtwork(){
 const game=games.find(item=>item.id===selectedGameDetailId);if(!game)return;
 if(!sgdbKey()){notify('Add your SteamGridDB API key in Settings first.');return;}
 const button=$('#autoFetchArtwork');if(button){button.disabled=true;button.textContent='FETCHING…';}
 try{
  const matches=await sgdbFetch('search/autocomplete/'+encodeURIComponent(game.title));
  if(!matches.length)throw new Error('No SteamGridDB match found for '+game.title+'.');
  const match=matches.find(item=>(item.name||'').toLowerCase()===game.title.toLowerCase())||matches[0];
  const art={...(game.artwork||{}),source:'SteamGridDB',gameId:match.id};
  let found=0;
  for(const [type,field] of [['grids','grid'],['heroes','hero'],['logos','logo'],['icons','icon']]){
   if(art[field])continue;
   try{const assets=await sgdbFetch(type+'/game/'+match.id+'?types=static');const first=assets.find(asset=>sgdbSafeUrl(asset.url));if(first){art[field]=sgdbSafeUrl(first.url);found++;}}
   catch(error){console.warn('SteamGridDB '+type+' lookup failed',error);}
  }
  if(!found&&!art.grid&&!art.hero&&!art.logo&&!art.icon)throw new Error('No artwork was available for '+match.name+'.');
  game.artwork=art;localStorage.setItem('eclipse-games',JSON.stringify(games));
  setSgdbStatus('AUTO FETCH COMPLETE · '+found+' ARTWORK ITEMS ADDED.');renderKonsoruHome();renderHomeHero();renderLibrary();
  if(activePage==='console'&&activeConsoleName)renderConsoleHome(systems.find(item=>item.name===activeConsoleName)||{name:activeConsoleName,icon:'✦',family:'Platform'});
  notify('Fetched '+found+' artwork items for '+game.title+'.');
 }catch(error){notify(error.message||'Could not fetch SteamGridDB artwork.');}
 finally{if(button){button.disabled=false;button.textContent='AUTO FETCH ART';}}
}
function openSgdbBrowser(){
 const game=games.find(item=>item.id===selectedGameDetailId);if(!game)return;
 $('#sgdbBrowser')?.classList.remove('hidden');$('#sgdbSearchInput').value=game.title;$('#sgdbMatches')?.replaceChildren();$('#sgdbResults')?.replaceChildren();
 sgdbCurrentGameId=null;sgdbCurrentType='grids';
 $('#sgdbCategoryTabs')?.querySelectorAll('[data-sgdb-type]').forEach(button=>button.classList.toggle('active',button.dataset.sgdbType==='grids'));
 if(sgdbKey())searchSgdbGames();else setSgdbStatus('Add your SteamGridDB API key in Settings → Personalize → SteamGridDB, then search again.',true);
}

function showGameDetails(game){
 if(!game)return;
 selectedGameDetailId=game.id;
 $('#gameDetailTitle').textContent=game.title;
 $('#gameDetailMeta').textContent=game.system+' · '+(game.tag||'GAME FILE')+' · '+(game.size?Math.round(game.size/1024/1024*10)/10+' MB':'SIZE UNKNOWN');
 $('#gameDetailPath').textContent=game.relativePath||game.fileName||'File path unavailable';
 const playerSystem=playerSystemForGame(game);
 const player=installedApps.find(app=>app.packageName===emulatorAssignments[playerSystem]);
 $('#gameDetailPlayer').textContent=player?player.name:'No player selected for '+playerSystem;
 $('#gameDetailFavorite').textContent=favorites.includes(game.id)?'★ REMOVE FROM FAVORITES':'☆ ADD TO FAVORITES';
 $('#gameDetailLaunch').disabled=!game.uri;
 $('#gameDetailLaunch').textContent=game.uri?'▶ PLAY GAME':'PLAY IN ANDROID APK';
 $('#gameDetailModal').classList.remove('hidden');
}
async function launchSelectedGame(){
 const game=games.find(item=>item.id===selectedGameDetailId);if(!game)return;
 if(!Capacitor.isNativePlatform()){notify('Direct game launching is available in the Android APK.');return;}
 if(!game.uri){notify('This entry has no Android file permission. Re-scan its game folder.');return;}
 const system=playerSystemForGame(game),packageName=emulatorAssignments[system];if(!packageName){notify('Choose an installed player for '+system+' first.');return;}
 const button=$('#gameDetailLaunch');button.disabled=true;button.textContent='OPENING…';
 try{await FolderAccess.launchGame({uri:game.uri,packageName});notify('Opening '+game.title+'…');}
 catch(error){notify(error?.message||'That player could not open this game file.');}
 finally{button.disabled=false;button.textContent='▶ PLAY GAME';}
}
function inferGameSystem(file){
 const path=(file.webkitRelativePath||file.relativePath||file.name).toLowerCase().replace(/\\/g,'/');
 const ext=(file.name.split('.').pop()||'').toLowerCase();
 const dirMatch=supportedGameTypes.find(item=>item.dirs.some(dir=>path.includes('/'+dir+'/')||path.startsWith(dir+'/')));
 if(dirMatch&&dirMatch.ext.includes(ext))return dirMatch.system;
 const extensionMatches=supportedGameTypes.filter(item=>item.ext.includes(ext));
 return extensionMatches.length===1?extensionMatches[0].system:null;
}
function titleFromFile(name){return name.replace(/\.[^.]+$/,'').replace(/[._-]+/g,' ').replace(/\s+/g,' ').trim().replace(/\b\w/g,ch=>ch.toUpperCase());}
function scanSelectedFolder(fileList,folderUri='browser'){
 const files=Array.from(fileList||[]).filter(file=>file&&file.name);
 const found=[];let matched=0;
 // A Set avoids repeatedly walking the full library for every file in a large folder.
 const knownIds=new Set(games.map(game=>game.id));
 for(const file of files){
  const system=inferGameSystem(file);if(!system)continue;
  matched++;
  const relative=file.webkitRelativePath||file.relativePath||file.name;
  const id=(folderUri||'browser')+'|'+relative+'|'+(Number(file.size)||0);
  if(knownIds.has(id))continue;
  knownIds.add(id);
  found.push({id,title:titleFromFile(file.name),system,year:'',art:'generic',tag:file.name.split('.').pop().toUpperCase(),fileName:file.name,relativePath:relative,size:Number(file.size)||0,lastModified:Number(file.lastModified)||0,uri:file.uri||null});
 }
 const status=$('#scanStatus');
 if(found.length){
  try{
   // Persist before mutating in-memory state so storage quota errors do not leave a half-added library.
   localStorage.setItem('eclipse-games',JSON.stringify([...games,...found]));
   games.push(...found);activeSystem='All Games';renderLibrary();renderWidgets();renderHomeHero();
  }catch(error){
   console.error('ECLIPSE could not save scanned games',error);
   status.textContent='Found '+matched+' supported game file(s), but the library could not save them. Free device storage or remove unused entries, then scan again.';
   notify('Games were found, but ECLIPSE could not save the library.');
   return;
  }
 }
 status.textContent=matched?'Found '+matched+' supported game file(s); added '+found.length+' new game(s). '+files.length+' total file(s) checked.':'No supported game files were found in that folder. Nothing was added to Home or your library.';
 notify(found.length?'Added '+found.length+' games to your library.':'No new games found — your library was left unchanged.');
}
async function chooseGameFolder(){
 const status=$('#scanStatus');
 if(Capacitor.isNativePlatform()){
  status.textContent='Choose your game folder. ECLIPSE is scanning its files…';
  try{
   const result=await FolderAccess.pickAndScan();
   if(result.uri){
    localStorage.setItem('eclipse-folder-uri',result.uri);
    const entry={uri:result.uri,name:result.rootName||'Game folder'};
    const exists=folderPaths.some(item=>(typeof item==='string'?item:item?.uri)===entry.uri);
    if(!exists)folderPaths.push(entry);
    localStorage.setItem('eclipse-folders',JSON.stringify(folderPaths));
    renderFolderPaths();
   }
   scanSelectedFolder(result.files||[],result.uri||'android');
   if(result.truncated)status.textContent+=' Scan limit reached at 900 files; choose a smaller platform folder for the rest.';
  }catch(error){
   const message=String(error?.message||error||'');
   if(!message.toLowerCase().includes('cancel'))status.textContent='Folder scan failed: '+message;
  }
 }else{
  $('#gameFolderPicker').click();
 }
}
async function rescanGameFolder(){
 const savedUris=folderPaths.map(item=>typeof item==='string'?(item.startsWith('content://')?item:null):item?.uri).filter(Boolean);
 const legacyUri=localStorage.getItem('eclipse-folder-uri');if(legacyUri&&!savedUris.includes(legacyUri))savedUris.push(legacyUri);
 if(Capacitor.isNativePlatform()&&savedUris.length){
  const status=$('#scanStatus');status.textContent='Rescanning '+savedUris.length+' saved game folder(s)…';let scanned=0,failed=0;
  for(const uri of savedUris){try{const result=await FolderAccess.scanFolder({uri});scanSelectedFolder(result.files||[],uri);scanned++;if(result.truncated)status.textContent+=' A folder reached the 900-file safety limit.';}catch(error){failed++;console.warn('ECLIPSE folder rescan failed',error);}}
  status.textContent='Finished scanning '+scanned+' folder(s).'+(failed?' '+failed+' folder permission(s) need to be renewed.':'');if(failed)notify(failed+' folder(s) could not be opened. Re-select them in Settings.');
 }else chooseGameFolder();
}
function savePlayerAssignment(system,packageName){
 emulatorAssignments[system]=packageName||'';
 localStorage.setItem('eclipse-emulator-assignments',JSON.stringify(emulatorAssignments));
 const app=installedApps.find(item=>item.packageName===packageName);
 const status=$('#systemPlayerStatus');if(status)status.textContent=app?'Selected player: '+app.name+' ('+app.packageName+')':'No player selected for '+system+'.';
 notify(app?'Player saved for '+system+'.':'Player selection cleared.');
}
function populatePlayerSelect(select,system){
 if(!select)return;
 const selected=emulatorAssignments[system]||'';
 select.innerHTML='<option value="">Choose an installed app…</option>';
 installedApps.forEach(app=>{const option=document.createElement('option');option.value=app.packageName;option.textContent=app.name+' · '+app.packageName;select.append(option);});
 select.value=selected;
}
function renderPlayerSettings(){
 const list=$('#playerAssignmentsList');if(!list)return;
 list.innerHTML='';
 systems.forEach(system=>{
  const row=document.createElement('div');row.className='player-setting-row';
  const info=document.createElement('div');const title=document.createElement('b');title.textContent=system.name;const note=document.createElement('small');note.textContent=emulatorAssignments[system.name]||'No player selected';info.append(title,note);
  const select=document.createElement('select');select.dataset.playerSystem=system.name;populatePlayerSelect(select,system.name);
  select.addEventListener('change',event=>{savePlayerAssignment(system.name,event.target.value);note.textContent=event.target.value||'No player selected';});
  row.append(info,select);list.append(row);
 });
}
async function scanInstalledApps(systemName){
 const status=$('#playerScanStatus');if(status)status.textContent='Scanning apps Android makes available to ECLIPSE…';
 const localStatus=$('#systemPlayerStatus');if(localStatus)localStatus.textContent='Scanning installed apps…';
 if(!Capacitor.isNativePlatform()){
  const message='Installed-app discovery is available in the Android APK, not this browser preview.';
  if(status)status.textContent=message;if(localStatus)localStatus.textContent=message;return;
 }
 try{
  const result=await FolderAccess.getInstalledApps();
  installedApps=result.apps||[];
  const playerAliases={
   'NES':['retroarch','fceux','nes.emu'],'SNES':['retroarch','snes9x','snes.emu'],
   'Nintendo 64':['retroarch','m64plus','mupen'],'Game Boy':['retroarch','my oldboy','gbc.emu'],
   'Game Boy Advance':['retroarch','my boy','pizza boy','gba.emu'],
   'Nintendo DS':['drastic','melonds','retroarch'],'Nintendo 3DS':['azahar','lime3ds','citra'],
   'GameCube':['dolphin'],'Wii':['dolphin'],'PlayStation':['duckstation','retroarch','epsxe'],
   'PlayStation 2':['nethersx2','aethersx2','retroarch'],'PSP':['ppsspp'],'PS Vita':['vita3k'],
   'Master System':['retroarch','md.emu'],'Genesis / Mega Drive':['retroarch','md.emu'],
   'Saturn':['retroarch','yaba sanshiro'],'Dreamcast':['redream','flycast','retroarch'],
   'Atari 2600':['retroarch','atari 2600'],'Arcade':['retroarch','mame'],
   'Nintendo Switch':['eden','sudachi','suyu','yuzu'],
   'PC Games (x86)':['gamehub','gamenative']
  };
  systems.forEach(system=>{
   if(emulatorAssignments[system.name])return;
   const terms=playerAliases[system.name]||[];
   const match=installedApps.find(app=>terms.some(term=>(app.name+' '+app.packageName).toLowerCase().includes(term)));
   if(match)emulatorAssignments[system.name]=match.packageName;
  });
  localStorage.setItem('eclipse-installed-apps',JSON.stringify(installedApps));
  localStorage.setItem('eclipse-emulator-assignments',JSON.stringify(emulatorAssignments));
  renderPlayerSettings();
  if(systemName)populatePlayerSelect($('#systemPlayerSelect'),systemName);
  const message='Found '+installedApps.length+' launchable apps. Choose a player for each system below.';
  renderAndroidApps();
  if(status)status.textContent=message;if(localStatus)localStatus.textContent=message;
  notify('Installed app scan complete.');
 }catch(error){
  const message='Could not scan installed apps: '+(error?.message||'unknown error');
  if(status)status.textContent=message;if(localStatus)localStatus.textContent=message;
 }
}
function autoSelectPlayer(system){
 const profile=emulatorOptions[system];
 const suggestions=(profile?.items||[]).filter(item=>!/(native|no established|proton|wine)/i.test(item)).map(item=>item.toLowerCase());
 const match=installedApps.find(app=>suggestions.some(term=>app.name.toLowerCase().includes(term)||app.packageName.toLowerCase().includes(term)));
 if(!match){const message='No clear installed app match found for '+system+'. Choose one manually.';const status=$('#systemPlayerStatus');if(status)status.textContent=message;notify('No automatic match found.');return;}
 savePlayerAssignment(system,match.packageName);
 const select=$('#systemPlayerSelect');if(select)select.value=match.packageName;
 renderPlayerSettings();
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
 const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=label;
 if(String(url).startsWith('https://github.com/')&&String(url).includes('/releases/download/')){
  link.addEventListener('click',event=>{
   if(!Capacitor.isNativePlatform())return;
   event.preventDefault();
   link.setAttribute('aria-busy','true');
   UpdateDownload.openExternal({url}).then(()=>notify('Opening the APK download in Android…')).catch(error=>notify(error?.message||'Could not open the APK download.'));
   link.removeAttribute('aria-busy');
  });
 }
 parent.append(link);
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

$('#systemPrev')?.addEventListener('click',()=>selectFeaturedSystem(featuredSystemIndex-1));
$('#systemNext')?.addEventListener('click',()=>selectFeaturedSystem(featuredSystemIndex+1));
$('#systemPicker')?.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();selectFeaturedSystem(featuredSystemIndex+(event.key==='ArrowRight'?1:-1));}if(event.key==='Enter'){event.preventDefault();openConsolePage(systems[featuredSystemIndex].name);}});
$('#displayLayoutSelect')?.addEventListener('change',event=>{localStorage.setItem('eclipse-display-layout',event.target.value);const result=applyDisplayLayout(event.target.value);if(event.target.value==='auto')refreshDisplayLayout();notify(result.effective==='dual'?'Dual-screen layout enabled.':'Single-screen layout enabled.');});
$('#makeDefaultHome')?.addEventListener('click',requestDefaultHome);
$('#defaultHomeSettings')?.addEventListener('click',requestDefaultHome);
$('#settingsDisplayLayout')?.addEventListener('change',event=>{localStorage.setItem('eclipse-display-layout',event.target.value);applyDisplayLayout(event.target.value);if(event.target.value==='auto')refreshDisplayLayout();notify('Display layout saved.');});
let displayRefreshTimer;
window.addEventListener('resize',()=>{if((localStorage.getItem('eclipse-display-layout')||'auto')==='auto'){clearTimeout(displayRefreshTimer);displayRefreshTimer=setTimeout(refreshDisplayLayout,180);}});
window.addEventListener('deviceposture',()=>{if((localStorage.getItem('eclipse-display-layout')||'auto')==='auto')refreshDisplayLayout();});
$('#onboardingLocal')?.addEventListener('click',()=>{finishOnboarding();notify('ECLIPSE will keep its data on this device.');});
$('#onboardingFolder')?.addEventListener('click',async()=>{finishOnboarding();showView('settings');document.querySelector('[data-settings-tab="library"]')?.click();await chooseEclipseDataFolder();});
$('#onboardingSkip')?.addEventListener('click',finishOnboarding);
document.querySelectorAll('.text-link[data-view]').forEach(button=>button.addEventListener('click',()=>showView(button.dataset.view)));

$('#themeSelect').addEventListener('change',e=>setTheme(e.target.value));
$('#settingsTheme').addEventListener('change',e=>setTheme(e.target.value));
document.querySelectorAll('.rail-btn').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$('#backToLibrary').addEventListener('click',()=>showView('library'));
$('#scanGamesBtn').addEventListener('click',chooseGameFolder);
$('#librarySearch').addEventListener('input',renderGames);
$('#homeScanBtn').addEventListener('click',()=>{showView('library');chooseGameFolder();});
$('#gameFolderPicker').addEventListener('change',e=>{if(e.target.files?.length)scanSelectedFolder(e.target.files,'browser');e.target.value='';});

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
$('#interfaceModeSetting')?.addEventListener('change',e=>{interfaceMode=['console','konsoru','cocoon','hybrid'].includes(e.target.value)?e.target.value:'hybrid';localStorage.setItem('eclipse-interface-mode',JSON.stringify(interfaceMode));applyInterfaceMode();notify(interfaceMode==='hybrid'?'Hybrid interface enabled.':interfaceMode==='cocoon'?'Cocoon-style home enabled.':interfaceMode==='konsoru'?'Konsoru console enabled.':'Console interface enabled.');});
 $('#systemShelfRowsSetting')?.addEventListener('change',e=>{systemShelfRows=Math.max(1,Math.min(4,Number(e.target.value)||2));localStorage.setItem('eclipse-system-shelf-rows',JSON.stringify(systemShelfRows));if(activePage==='console'&&activeConsoleName)renderConsoleHome(systems.find(item=>item.name===activeConsoleName)||{name:activeConsoleName,icon:'✦',family:'Platform'});notify('Game shelf layout saved.');});
$('#addFolderPath').addEventListener('click',chooseGameFolder);

$('#rescanFolders').addEventListener('click',rescanGameFolder);
$('#chooseDataFolder').addEventListener('click',chooseEclipseDataFolder);
$('#saveDataBackup').addEventListener('click',saveEclipseDataBackup);
$('#restoreDataBackup').addEventListener('click',restoreEclipseDataBackup);
$('#resetAllDefaults').addEventListener('click',()=>{if(!confirm('Restore ECLIPSE default settings?'))return;activeTheme='violet';localStorage.setItem('eclipse-theme',activeTheme);document.documentElement.dataset.theme=activeTheme;$('#themeSelect').value=activeTheme;widgets=['recent','systems','favorites'];pageNames=['Home','Discover','Collections'];currentPage=0;preferences={showHero:true,compactRows:false,systemCounts:true,startPage:'home'};localStorage.setItem('eclipse-preferences',JSON.stringify(preferences));saveLayout();renderWidgets();renderSettings();document.querySelector('.feature-hero').classList.remove('hidden');notify('Default settings restored.');});
document.querySelectorAll('[data-settings-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-settings-tab]').forEach(x=>x.classList.toggle('active',x===b));['personal','library','controls','players','system'].forEach(k=>$('#settings'+k[0].toUpperCase()+k.slice(1)).classList.toggle('hidden',k!==b.dataset.settingsTab));}));
$('#scanInstalledPlayers').addEventListener('click',()=>scanInstalledApps());
$('#scanAppsPage')?.addEventListener('click',()=>scanInstalledApps());
$('#appLibrarySearch')?.addEventListener('input',renderAndroidApps);
$('#saveSgdbKey')?.addEventListener('click',()=>{const value=$('#sgdbApiKey')?.value.trim();if(!value){notify('Paste your SteamGridDB API key first.');return;}localStorage.setItem('eclipse-steamgriddb-key',value);$('#sgdbKeyStatus').textContent='API key saved on this device.';notify('SteamGridDB key saved locally.');});
$('#clearSgdbKey')?.addEventListener('click',()=>{localStorage.removeItem('eclipse-steamgriddb-key');if($('#sgdbApiKey'))$('#sgdbApiKey').value='';if($('#sgdbKeyStatus'))$('#sgdbKeyStatus').textContent='No API key saved yet.';notify('SteamGridDB key cleared.');});
$('#autoFetchArtwork')?.addEventListener('click',autoFetchSgdbArtwork);
$('#openArtworkBrowser')?.addEventListener('click',openSgdbBrowser);
$('#sgdbSearchButton')?.addEventListener('click',searchSgdbGames);
$('#sgdbSearchInput')?.addEventListener('keydown',event=>{if(event.key==='Enter')searchSgdbGames();});
$('#sgdbCategoryTabs')?.addEventListener('click',event=>{const button=event.target.closest('[data-sgdb-type]');if(button)loadSgdbAssets(button.dataset.sgdbType);});
$('#closeGameDetail').addEventListener('click',()=>$('#gameDetailModal').classList.add('hidden'));
$('#gameDetailLaunch').addEventListener('click',launchSelectedGame);
$('#gameDetailModal').addEventListener('click',event=>{if(event.target.id==='gameDetailModal')$('#gameDetailModal').classList.add('hidden');});
$('#gameDetailFavorite').addEventListener('click',()=>{
 const game=games.find(item=>item.id===selectedGameDetailId);if(!game)return;
 favorites=favorites.includes(game.id)?favorites.filter(id=>id!==game.id):[...favorites,game.id];
 localStorage.setItem('eclipse-favorites',JSON.stringify(favorites));
 $('#gameDetailFavorite').textContent=favorites.includes(game.id)?'★ REMOVE FROM FAVORITES':'☆ ADD TO FAVORITES';
 renderWidgets();renderHomeHero();notify(favorites.includes(game.id)?'Added to favorites.':'Removed from favorites.');
});
$('#gameDetailRemove').addEventListener('click',()=>{
 const index=games.findIndex(item=>item.id===selectedGameDetailId);if(index<0)return;
 if(!confirm('Remove this game from your ECLIPSE library? The original file will not be deleted.'))return;
 const title=games[index].title;
 games.splice(index,1);favorites=favorites.filter(id=>id!==selectedGameDetailId);
 localStorage.setItem('eclipse-games',JSON.stringify(games));localStorage.setItem('eclipse-favorites',JSON.stringify(favorites));
 $('#gameDetailModal').classList.add('hidden');renderLibrary();renderWidgets();renderHomeHero();
 if(activePage==='console'&&activeConsoleName)renderConsoleHome(systems.find(system=>system.name===activeConsoleName)||{name:activeConsoleName,icon:'✦',family:'Platform'});
 notify(title+' removed from your ECLIPSE library.');
});
$('#checkUpdates').addEventListener('click',checkUpdates);
$('#checkCompatibility').addEventListener('click',checkCompatibility);
$('#androidInfo')?.addEventListener('click',()=>notify('Android app detection needs a native Android bridge and package visibility permission.'));
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){$('#widgetModal').classList.add('hidden');if(activePage!=='home')showView('home');return;}
 if(['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Enter',' '].includes(e.key)&&!e.target.matches('select,input,textarea,button')){
  const cards=[...$('#gameGrid').querySelectorAll('[data-game]')];if(!cards.length)return;
  if(e.key==='ArrowRight'||e.key==='ArrowDown')selectedGame=(selectedGame+1)%games.length;
  if(e.key==='ArrowLeft'||e.key==='ArrowUp')selectedGame=(selectedGame-1+games.length)%games.length;
  renderGames();$('#gameGrid').querySelector('[data-game="'+selectedGame+'"]')?.focus();
 }
});

/* Physical gamepad support for Android handhelds (AYN Odin and similar). */
(function enableGamepadNavigation(){
 let lastMove=0, wasConfirm=false, wasBack=false, wasX=false, wasY=false, wasL1=false, wasR1=false;
 let activePadIndex=null, lastStatus='';
 const isVisible=el=>!!(el&&el.getClientRects().length&&!el.closest('.hidden'));
 const focusables=()=>[...document.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(isVisible);
 const status=message=>{const node=document.querySelector('#controllerStatus');if(node&&message!==lastStatus){node.textContent=message;lastStatus=message;}};
 function moveFocus(direction){
  const items=focusables();if(!items.length)return;
  const current=document.activeElement;
  if(!items.includes(current)){items[0].focus();items[0].scrollIntoView({block:'nearest',inline:'nearest'});return;}
  const a=current.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2;
  const candidates=items.filter(el=>el!==current).map(el=>{const r=el.getBoundingClientRect(),dx=r.left+r.width/2-ax,dy=r.top+r.height/2-ay;const primary=direction==='left'?-dx:direction==='right'?dx:direction==='up'?-dy:dy;const cross=direction==='left'||direction==='right'?Math.abs(dy):Math.abs(dx);return {el,score:primary>2?primary+cross*1.8:Infinity};}).filter(x=>Number.isFinite(x.score)).sort((x,y)=>x.score-y.score);
  const next=candidates[0]?.el;if(next){next.focus({preventScroll:true});next.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});}
 }
 function back(){
  const modal=document.querySelector('.modal-backdrop:not(.hidden),.mascot-welcome:not(.hidden),.onboarding-backdrop:not(.hidden),.control-center-backdrop:not(.hidden)');
  if(modal){modal.classList.add('hidden');return;}
  if(activePage!=='home'){showView('home');return;}
 }
 const wasPressed=(buttons,index)=>!!buttons[index]?.pressed;
 function poll(){
  let pads=[];
  try{pads=[...(navigator.getGamepads?.()||[])].filter(p=>p&&p.connected!==false);}catch{}
  const pad=pads.find(p=>p.index===activePadIndex)||pads[0];
  if(!pad){
   activePadIndex=null;
   status('No controller detected. Connect a Bluetooth or USB gamepad, then press any button.');
   wasConfirm=wasBack=wasX=wasY=wasL1=wasR1=false;
   return;
  }
  activePadIndex=pad.index;
  status('Controller connected: '+(pad.id||'Gamepad')+'. D-pad / left stick to move · A to select · B to go back.');
  const b=pad.buttons||[],axis=pad.axes||[];
  const pressed=i=>wasPressed(b,i);
  const now=performance.now();
  let direction=null;
  if(pressed(14)||axis[0]<-.5)direction='left';
  else if(pressed(15)||axis[0]>.5)direction='right';
  else if(pressed(12)||axis[1]<-.5)direction='up';
  else if(pressed(13)||axis[1]>.5)direction='down';
  if(direction&&now-lastMove>190){moveFocus(direction);lastMove=now;}
  const confirm=pressed(0), cancel=pressed(1)||pressed(2);
  if(confirm&&!wasConfirm){
   const active=document.activeElement;
   if(active&&active!==document.body&&typeof active.click==='function')active.click();
   else focusables()[0]?.click();
  }
  if(cancel&&!wasBack)back();
  const l1=pressed(4),r1=pressed(5);
  if((l1&&!wasL1)||(r1&&!wasR1)){
   const menu=[...document.querySelectorAll('#systemMenu [data-system-menu]')];
   if(menu.length){const current=menu.findIndex(item=>item.classList.contains('active'));const step=r1?1:-1;const next=(current+step+menu.length)%menu.length;menu[next].click();menu[next].focus();}
   else if(activePage==='home'&&document.documentElement.dataset.interfaceMode==='konsoru'){
    const worlds=[...document.querySelectorAll('#konsoruWorldGrid [data-konsoru-family]')];const current=worlds.indexOf(document.activeElement);const step=r1?1:-1;worlds[(current+step+worlds.length)%worlds.length]?.focus();
   }
  }
  wasConfirm=confirm;wasBack=cancel;wasX=pressed(2);wasY=pressed(3);wasL1=l1;wasR1=r1;
 }
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'||event.key==='Backspace'){event.preventDefault();event.stopImmediatePropagation();back();return;}
  const directions={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
  if(directions[event.key]&&!event.target.matches('input,textarea,select')){
   event.preventDefault();event.stopImmediatePropagation();moveFocus(directions[event.key]);return;
  }
  if((event.key==='Enter'||event.key===' ')&&(document.activeElement===document.body||!document.activeElement)){
   event.preventDefault();event.stopImmediatePropagation();const first=focusables()[0];if(first){first.focus();first.click();}
  }
 });
 window.addEventListener('gamepadconnected',event=>{
  activePadIndex=event.gamepad?.index??null;
  status('Controller connected: '+(event.gamepad?.id||'Gamepad')+'. D-pad / left stick to move · A to select · B to go back.');
  if(!document.activeElement||document.activeElement===document.body)focusables()[0]?.focus();
 });
 window.addEventListener('gamepaddisconnected',event=>{
  if(event.gamepad?.index===activePadIndex)activePadIndex=null;
  status('Controller disconnected. Connect another controller to use gamepad navigation.');
 });
 // Poll continuously: some Android WebViews expose pads through getGamepads without firing connection events.
 window.setInterval(poll,50);
 poll();
})();

applyInterfaceMode();
applyDisplayLayout(localStorage.getItem('eclipse-display-layout')||'auto');
refreshDisplayLayout();
mountExperience({ $, themes, setTheme, notify, systems, games, favorites, widgets, renderWidgets });
mountControlCenter({ notify });
renderSystemPicker();renderWidgets();renderLibrary();renderAndroidApps();renderHomeHero();
// Polished launcher startup: keep the first frame intentional while local UI initializes.
(function showLauncherBoot(){
 const boot=document.createElement('div');boot.className='eclipse-launch-boot';boot.innerHTML='<div class="launch-boot-mark">E<span>.</span></div><p class="eyebrow">YOUR WORLD IS LOADING</p><h1>ECLIPSE</h1><div class="launch-boot-track"><i></i></div><small>PREPARING YOUR SYSTEMS</small>';
 document.body.append(boot);
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 window.setTimeout(()=>{boot.classList.add('ready');window.setTimeout(()=>boot.remove(),reduced?0:480);},reduced?350:1050);
})();

if(Capacitor.isNativePlatform())window.setTimeout(()=>scanInstalledApps(),900);
window.setTimeout(openOnboarding,1450);if(preferences.startPage&&preferences.startPage!=='home')showView(preferences.startPage);
