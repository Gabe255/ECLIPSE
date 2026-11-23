const SUMMARY_URL = 'https://retroachievements.org/API/API_GetUserSummary.php';
const CACHE_KEY = 'eclipse-ra-cache';

export function mountAchievements({ showView, notify }) {
  const rail = document.querySelector('.rail');
  const settingsGrid = document.querySelector('#settingsSystem .settings-grid');
  if (!rail || !settingsGrid) return {};

  const view = document.createElement('section');
  view.id = 'achievementsView';
  view.className = 'view hidden';
  view.innerHTML = `
    <div class="section-head"><div><p class="eyebrow">YOUR GAMING MILESTONES</p><h2>ACHIEVEMENT CENTER</h2><p class="settings-note">Your RetroAchievements profile, recent unlocks and game progress.</p></div><button class="subtle-btn" id="refreshAchievements">REFRESH</button></div>
    <div id="achievementStatus" class="update-result" role="status">Connect your RetroAchievements account in Settings → System to load your stats.</div>
    <div class="achievement-profile-grid" id="achievementProfile"></div>
    <section class="achievement-section"><div class="home-shelf-heading"><div><p class="eyebrow">RECENT ACTIVITY</p><h3>RECENT UNLOCKS</h3></div></div><div id="recentAchievements" class="achievement-list"></div></section>
    <section class="achievement-section"><div class="home-shelf-heading"><div><p class="eyebrow">YOUR COLLECTION</p><h3>RECENTLY PLAYED</h3></div></div><div id="raRecentGames" class="achievement-games"></div></section>`;
  document.querySelector('#settingsView')?.before(view);

  let nav = rail.querySelector('[data-view="achievements"]');
  if (!nav) {
    nav = document.createElement('button');
    nav.className = 'rail-btn'; nav.type = 'button'; nav.dataset.view = 'achievements';
    nav.textContent = '✧'; nav.title = 'Achievement Center'; nav.setAttribute('aria-label','Achievement Center');
    rail.insertBefore(nav, rail.querySelector('[data-view="settings"]'));
    nav.addEventListener('click', () => { showView('achievements'); renderCache(); });
  }

  const card = document.createElement('article');
  card.className = 'settings-card';
  card.innerHTML = `<p class="eyebrow">ACHIEVEMENTS</p><h3>RETROACHIEVEMENTS</h3>
    <label>Username<input id="raUsername" autocomplete="username" placeholder="Your RetroAchievements username"></label>
    <label>Web API key<input id="raApiKey" type="password" autocomplete="off" placeholder="Paste your personal web API key"></label>
    <p class="settings-note">Credentials stay in this app's local storage and are not included in ECLIPSE backups or source code.</p>
    <div class="sgdb-settings-actions"><button class="primary-btn" id="saveRaCredentials">SAVE & CONNECT</button><button class="subtle-btn" id="clearRaCredentials">DISCONNECT</button></div>
    <p class="settings-note" id="raConnectionStatus">Not connected.</p>`;
  settingsGrid.append(card);

  const status = document.getElementById('achievementStatus');
  const profile = document.getElementById('achievementProfile');
  const unlocks = document.getElementById('recentAchievements');
  const recentGames = document.getElementById('raRecentGames');
  const usernameInput = document.getElementById('raUsername');
  const keyInput = document.getElementById('raApiKey');
  const connectionStatus = document.getElementById('raConnectionStatus');
  usernameInput.value = localStorage.getItem('eclipse-ra-username') || '';
  keyInput.value = localStorage.getItem('eclipse-ra-key') || '';

  function readCache() {
    try { const value = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); return value && Date.now() - value.savedAt < 5 * 60 * 1000 ? value.data : null; } catch { return null; }
  }
  function renderCache() {
    const data = readCache();
    if (data) render(data);
  }
  function metric(label, value) {
    const item = document.createElement('article');
    const small = document.createElement('small'); small.textContent = label;
    const strong = document.createElement('b'); strong.textContent = value == null ? '—' : String(value);
    item.append(small,strong); return item;
  }
  function render(data) {
    profile.replaceChildren();
    profile.append(
      metric('PLAYER', data.User || localStorage.getItem('eclipse-ra-username') || 'PLAYER'),
      metric('HARDCORE POINTS', Number(data.TotalPoints || 0).toLocaleString()),
      metric('RETROPOINTS', Number(data.TotalTruePoints || 0).toLocaleString()),
      metric('GLOBAL RANK', data.Rank ? '#' + Number(data.Rank).toLocaleString() : 'Unranked')
    );
    unlocks.replaceChildren();
    const grouped = data.RecentAchievements || {};
    const earned = Object.values(grouped).flatMap(group => Object.values(group || {}))
      .sort((a,b) => String(b.DateAwarded || '').localeCompare(String(a.DateAwarded || ''))).slice(0,12);
    if (!earned.length) {
      const empty = document.createElement('p'); empty.className='settings-note'; empty.textContent='No recent unlocks were returned for this profile.'; unlocks.append(empty);
    } else earned.forEach(item => {
      const row = document.createElement('article'); row.className='achievement-row';
      const mark = document.createElement('span'); mark.className='achievement-mark'; mark.textContent='✦';
      const copy = document.createElement('div'); const title = document.createElement('b'); title.textContent=item.Title || 'Achievement';
      const description = document.createElement('small'); description.textContent=(item.GameTitle || 'Game')+' · '+(item.Points || 0)+' points'+(Number(item.HardcoreAchieved)===1?' · HARDCORE':'');
      const detail = document.createElement('p'); detail.textContent=item.Description || '';
      copy.append(title,description,detail); row.append(mark,copy); unlocks.append(row);
    });
    recentGames.replaceChildren();
    const played = (data.RecentlyPlayed || []).slice(0,8);
    if (!played.length) { const empty=document.createElement('p');empty.className='settings-note';empty.textContent='No recently played games were returned.';recentGames.append(empty); }
    played.forEach(game => {
      const row=document.createElement('article');row.className='achievement-game';
      const title=document.createElement('b');title.textContent=game.Title || 'Game';
      const consoleName=document.createElement('small');consoleName.textContent=game.ConsoleName || 'SYSTEM';
      const total=document.createElement('span');const award=data.Awarded?.[String(game.GameID)] || {};
      total.textContent=Number(award.NumAchieved || 0)+' / '+Number(award.NumPossibleAchievements || game.AchievementsTotal || 0)+' unlocked';
      row.append(title,consoleName,total);recentGames.append(row);
    });
    if (status) status.textContent='Connected as '+(data.User || localStorage.getItem('eclipse-ra-username'))+'. Profile and recent activity loaded.';
    if (connectionStatus) connectionStatus.textContent='Connected. Last refreshed just now.';
  }
  async function refresh() {
    const username=localStorage.getItem('eclipse-ra-username') || usernameInput.value.trim();
    const key=localStorage.getItem('eclipse-ra-key') || keyInput.value.trim();
    if (!username || !key) { if(status)status.textContent='Enter your username and web API key in Settings → System.'; return; }
    if (status) status.textContent='Loading RetroAchievements profile…';
    if (connectionStatus) connectionStatus.textContent='Connecting…';
    try {
      const params=new URLSearchParams({u:username,y:key,g:'8',a:'12'});
      const response=await fetch(SUMMARY_URL+'?'+params.toString(),{headers:{Accept:'application/json'}});
      if (!response.ok) throw new Error(response.status===401||response.status===403?'RetroAchievements rejected the API key.':'RetroAchievements returned HTTP '+response.status+'.');
      const data=await response.json();
      if (!data || !data.User) throw new Error('That profile could not be loaded. Check the username and API key.');
      localStorage.setItem(CACHE_KEY,JSON.stringify({savedAt:Date.now(),data}));
      render(data);
    } catch(error) {
      const message=error?.message || 'Could not connect to RetroAchievements.';
      if(status)status.textContent=message+' Check your connection and try again.';
      if(connectionStatus)connectionStatus.textContent='Not connected: '+message;
    }
  }
  document.getElementById('saveRaCredentials').addEventListener('click',()=>{
    const username=usernameInput.value.trim(),key=keyInput.value.trim();
    if(!username||!key){notify('Enter both your RetroAchievements username and API key.');return;}
    localStorage.setItem('eclipse-ra-username',username);localStorage.setItem('eclipse-ra-key',key);refresh();
  });
  document.getElementById('clearRaCredentials').addEventListener('click',()=>{
    localStorage.removeItem('eclipse-ra-username');localStorage.removeItem('eclipse-ra-key');localStorage.removeItem(CACHE_KEY);
    usernameInput.value='';keyInput.value='';profile.replaceChildren();unlocks.replaceChildren();recentGames.replaceChildren();
    if(status)status.textContent='Disconnected. Your local ECLIPSE game library was not changed.';
    if(connectionStatus)connectionStatus.textContent='Not connected.';
    notify('RetroAchievements disconnected.');
  });
  document.getElementById('refreshAchievements').addEventListener('click',refresh);

  function normalizeTitle(value) {
    return String(value || '').toLowerCase().normalize('NFKD')
      .replace(/[\\u0300-\\u036f]/g, '').replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\\s+/g, ' ');
  }

  function renderGamePanel(game, root, saveGames = () => {}) {
    if (!root || !game) return;
    root.replaceChildren();
    const heading = document.createElement('div');
    heading.className = 'game-achievements-heading';
    const title = document.createElement('b'); title.textContent = 'RETROACHIEVEMENTS';
    const note = document.createElement('small'); note.textContent = 'Link this ROM to its official achievement set to view your progress.';
    heading.append(title, note);
    const form = document.createElement('div'); form.className = 'game-achievements-form';
    const input = document.createElement('input');
    input.type = 'number'; input.min = '1'; input.step = '1'; input.inputMode = 'numeric';
    input.placeholder = 'RetroAchievements Game ID';
    input.value = game.retroAchievements?.gameId || '';
    input.setAttribute('aria-label', 'RetroAchievements game ID');
    const button = document.createElement('button'); button.type = 'button'; button.className = 'primary-btn'; button.textContent = 'LINK & LOAD PROGRESS';
    form.append(input, button);
    const statusLine = document.createElement('p'); statusLine.className = 'settings-note'; statusLine.setAttribute('role','status');
    const progress = document.createElement('div'); progress.className = 'game-achievements-progress';
    root.append(heading, form, statusLine, progress);

    function showSaved() {
      const saved = game.retroAchievements;
      progress.replaceChildren();
      if (!saved) return;
      const metrics = document.createElement('div'); metrics.className = 'game-achievement-metrics';
      [[ 'UNLOCKED', saved.awarded + ' / ' + saved.total ],['COMPLETION', saved.completion || '—'],['HARDCORE', saved.hardcoreCompletion || '—']].forEach(([label,value]) => {
        const item=document.createElement('article');const small=document.createElement('small');small.textContent=label;const strong=document.createElement('b');strong.textContent=value;item.append(small,strong);metrics.append(item);
      });
      const matched = document.createElement('p'); matched.className='settings-note';
      matched.textContent='Linked set: '+saved.title+' · '+saved.consoleName;
      const link = document.createElement('a'); link.href='https://retroachievements.org/game/'+encodeURIComponent(saved.gameId);link.target='_blank';link.rel='noopener noreferrer';link.textContent='OPEN ACHIEVEMENT SET ↗';
      progress.append(metrics,matched,link);
      const recent = (saved.achievements || []).filter(item=>item.earned).slice(0,8);
      if(recent.length){const list=document.createElement('div');list.className='game-achievement-unlocks';recent.forEach(item=>{const row=document.createElement('p');row.textContent='✦ '+item.title+' · '+item.points+' pts';list.append(row);});progress.append(list);}
    }
    if (game.retroAchievements) { statusLine.textContent='Saved achievement link. Refresh to check for new unlocks.'; showSaved(); }

    button.addEventListener('click', async () => {
      const gameId = Number(input.value);
      const username = localStorage.getItem('eclipse-ra-username') || '';
      const key = localStorage.getItem('eclipse-ra-key') || '';
      if (!username || !key) { statusLine.textContent='Connect your RetroAchievements account in Settings → System first.'; return; }
      if (!Number.isSafeInteger(gameId) || gameId < 1) { statusLine.textContent='Enter a valid positive game ID.'; return; }
      button.disabled = true; button.textContent='LOADING…'; statusLine.textContent='Checking the game ID and loading your achievement progress…';
      const controller = new AbortController(); const timeout = setTimeout(()=>controller.abort(),15000);
      try {
        const params = new URLSearchParams({g:String(gameId),u:username,y:key,a:'1'});
        const response = await fetch('https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php?'+params.toString(),{headers:{Accept:'application/json'},signal:controller.signal});
        if(!response.ok) throw new Error(response.status===401||response.status===403?'RetroAchievements rejected the API key.':response.status===404?'That game ID was not found.':'RetroAchievements returned HTTP '+response.status+'.');
        const data = await response.json();
        if(!data || !data.Title || !data.NumAchievements) throw new Error('No achievement set was returned for that game ID.');
        if(normalizeTitle(data.Title)!==normalizeTitle(game.title)) {
          throw new Error('That ID belongs to “'+data.Title+'”, not “'+game.title+'”. No link was saved. Check the game ID.');
        }
        const achievements=Object.values(data.Achievements||{}).map(item=>({
          title:item.Title||'Achievement',description:item.Description||'',points:Number(item.Points||0),
          earned:Boolean(item.DateEarned||item.DateEarnedHardcore),hardcore:Boolean(item.DateEarnedHardcore)
        }));
        game.retroAchievements={
          gameId,title:data.Title,consoleName:data.ConsoleName||'Unknown system',
          total:Number(data.NumAchievements||achievements.length),
          awarded:Number(data.NumAwardedToUser||achievements.filter(item=>item.earned).length),
          awardedHardcore:Number(data.NumAwardedToUserHardcore||0),
          completion:data.UserCompletion||'0%',hardcoreCompletion:data.UserCompletionHardcore||'0%',
          achievements,fetchedAt:new Date().toISOString()
        };
        saveGames();
        statusLine.textContent='Achievement set linked and progress saved.';
        showSaved();
      } catch(error) {
        statusLine.textContent=error?.name==='AbortError'?'RetroAchievements timed out. Try again.':(error?.message||'Could not load game progress.');
      } finally {
        clearTimeout(timeout);button.disabled=false;button.textContent='LINK & LOAD PROGRESS';
      }
    });
  }
  return { refresh, renderCache, renderGamePanel };
}
