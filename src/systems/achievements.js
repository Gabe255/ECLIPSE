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
  return { refresh, renderCache };
}
