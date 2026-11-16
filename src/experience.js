const KEYS = [
  'eclipse-theme','eclipse-custom-accent','eclipse-wallpaper','eclipse-motion-speed',
  'eclipse-system-themes','eclipse-profiles','eclipse-active-profile','eclipse-games',
  'eclipse-favorites','eclipse-widgets','eclipse-pages','eclipse-preferences',
  'eclipse-app-games','eclipse-app-playtime','eclipse-emulator-assignments',
  'eclipse-folders','eclipse-system-folders'
];

export function mountExperience({ $, themes, setTheme, notify, systems, games, favorites, widgets, renderWidgets }) {
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const systemThemes = read('eclipse-system-themes', {});
  let activeProfile = localStorage.getItem('eclipse-active-profile') || 'Default';
  let profiles = read('eclipse-profiles', [{ name: 'Default', values: {} }]);
  let motionSpeed = Number(localStorage.getItem('eclipse-motion-speed') || 1);
  let wallpaper = localStorage.getItem('eclipse-wallpaper') || '';

  const trigger = document.createElement('button');
  trigger.className = 'studio-launcher';
  trigger.type = 'button';
  trigger.textContent = '✦ STUDIO';
  trigger.setAttribute('aria-label', 'Open ECLIPSE Experience Studio');
  $('.top-actions')?.append(trigger);

  const modal = document.createElement('div');
  modal.className = 'experience-backdrop hidden';
  modal.id = 'experienceStudio';
  modal.innerHTML = `
    <section class="experience-panel" role="dialog" aria-modal="true" aria-labelledby="experienceTitle">
      <header class="experience-head"><div><p class="eyebrow">YOUR WORLD. YOUR RULES.</p><h2 id="experienceTitle">ECLIPSE <em>STUDIO</em></h2></div><button class="experience-close" type="button" aria-label="Close">×</button></header>
      <nav class="experience-tabs" aria-label="Studio sections">
        <button class="active" data-studio-tab="themes">THEMES</button><button data-studio-tab="systems">SYSTEM WORLDS</button><button data-studio-tab="profiles">PROFILES</button><button data-studio-tab="performance">PERFORMANCE</button><button data-studio-tab="backup">BACKUP</button><button data-studio-tab="hub">HUB</button>
      </nav>
      <div class="experience-content">
        <section data-studio-panel="themes">
          <div class="studio-preview"><span class="preview-orb"></span><div><small>LIVE PREVIEW</small><b>YOUR NEXT ADVENTURE</b><p>Changes apply instantly and save on this device.</p></div></div>
          <h3>Choose a visual preset</h3><div class="studio-theme-grid">${themes.map(([id,name])=>`<button type="button" class="studio-theme" data-theme-choice="${id}"><i data-swatch="${id}"></i><span>${name}</span></button>`).join('')}</div>
          <div class="studio-controls"><label>Custom accent color<input id="studioAccent" type="color" value="${localStorage.getItem('eclipse-custom-accent') || '#a8f2c7'}"></label><button class="studio-secondary" id="resetAccent" type="button">RESET ACCENT</button></div>
          <div class="studio-controls"><label>Wallpaper image<input id="studioWallpaper" type="file" accept="image/png,image/jpeg,image/webp"></label><button class="studio-secondary" id="clearWallpaper" type="button">CLEAR WALLPAPER</button></div>
          <p class="studio-hint">Wallpaper images are stored locally in this browser/app. Keep them under 1.5 MB for reliable storage.</p>
        </section>
        <section data-studio-panel="systems" class="hidden">
          <h3>Give each platform its own identity</h3><p class="studio-hint">Pick a system and accent. Its theme activates when you open that system's page.</p>
          <label class="studio-field">System<select id="systemThemeTarget">${systems.map(s=>`<option value="${escapeText(s.name)}">${escapeText(s.name)}</option>`).join('')}</select></label>
          <div class="studio-controls"><label>System accent<input id="systemThemeColor" type="color" value="#a8f2c7"></label><button class="studio-secondary" id="saveSystemTheme" type="button">SAVE SYSTEM THEME</button><button class="studio-secondary" id="clearSystemTheme" type="button">RESET THIS SYSTEM</button></div>
          <div id="systemThemeList" class="studio-list"></div>
        </section>
        <section data-studio-panel="profiles" class="hidden">
          <h3>Player profiles</h3><p class="studio-hint">Profiles keep separate theme, wallpaper, layout, and system-theme preferences on this device. Your game files are not duplicated.</p>
          <div class="studio-controls"><label>Active profile<select id="profileSelect"></select></label><button class="studio-secondary" id="switchProfile" type="button">SWITCH</button></div>
          <div class="studio-controls"><label>New profile name<input id="newProfileName" maxlength="24" placeholder="e.g. Couch Setup"></label><button class="studio-secondary" id="createProfile" type="button">CREATE PROFILE</button></div>
          <div class="studio-controls"><button class="studio-secondary" id="saveProfile" type="button">SAVE CURRENT SETUP TO PROFILE</button><button class="studio-secondary" id="deleteProfile" type="button">DELETE ACTIVE PROFILE</button></div>
          <p class="studio-hint" id="profileStatus"></p>
        </section>
        <section data-studio-panel="performance" class="hidden">
          <h3>Motion & performance</h3><p class="studio-hint">Tune visual effects for your device. This adjusts ECLIPSE animations, not Android's system performance settings.</p>
          <label class="studio-field">Animation speed <output id="motionValue">${motionSpeed.toFixed(1)}×</output><input id="motionSpeed" type="range" min="0" max="1.5" step="0.1" value="${motionSpeed}"></label>
          <div class="studio-controls"><button class="studio-secondary" id="motionReduced" type="button">REDUCED MOTION</button><button class="studio-secondary" id="motionDefault" type="button">DEFAULT MOTION</button></div>
          <label class="studio-check"><input type="checkbox" id="performanceLite" ${localStorage.getItem('eclipse-performance-lite')==='true'?'checked':''}> Lightweight mode (reduce decorative effects)</label>
          <p class="studio-hint">Your device's Reduce Motion accessibility setting is always respected.</p>
        </section>
        <section data-studio-panel="backup" class="hidden">
          <h3>Backup & restore</h3><p class="studio-hint">Export your ECLIPSE settings and library metadata as a JSON backup. Original game files are never copied.</p>
          <div class="studio-controls"><button class="studio-primary" id="exportBackup" type="button">EXPORT BACKUP</button><label class="studio-file">Import backup<input id="importBackup" type="file" accept="application/json,.json"></label></div>
          <p class="studio-hint" id="backupStatus">Backups stay on the device unless you choose to share or store the exported file.</p>
        </section>
        <section data-studio-panel="hub" class="hidden">
          <h3>ECLIPSE Hub</h3><p class="studio-hint">Project updates, documentation, and community feedback in one place.</p>
          <div class="studio-hub-grid">
            <a href="https://github.com/Gabe255/ECLIPSE/releases" target="_blank" rel="noopener noreferrer"><b>RELEASES ↗</b><span>Published builds and changelogs</span></a>
            <a href="https://github.com/Gabe255/ECLIPSE" target="_blank" rel="noopener noreferrer"><b>SOURCE CODE ↗</b><span>Follow development</span></a>
            <a href="https://github.com/Gabe255/ECLIPSE/issues" target="_blank" rel="noopener noreferrer"><b>REPORT A BUG ↗</b><span>Share issues and ideas</span></a>
          </div>
          <p class="studio-hint">A built-in downloadable theme/add-on store is a future service; these links are the live project hub for now.</p>
        </section>
      </div>
      <footer class="experience-foot"><span id="studioProfileLabel">PROFILE: ${escapeText(activeProfile)}</span><span>LOCAL SETTINGS · ECLIPSE</span></footer>
    </section>`;
  document.body.append(modal);

  function escapeText(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function applyWallpaper() {
    document.documentElement.style.setProperty('--eclipse-wallpaper', wallpaper ? 'url("' + wallpaper.replace(/["\\\\]/g, '') + '")' : 'none');
    document.body.classList.toggle('eclipse-wallpaper-on', !!wallpaper);
  }
  function applyMotion() {
    document.documentElement.style.setProperty('--eclipse-motion', String(motionSpeed));
    document.documentElement.classList.toggle('eclipse-performance-lite', localStorage.getItem('eclipse-performance-lite') === 'true');
  }
  function applySystemTheme(name) {
    const color = systemThemes[name];
    document.documentElement.style.setProperty('--system-accent', color || 'var(--accent)');
    document.documentElement.classList.toggle('eclipse-system-themed', !!color);
  }
  function renderSystemThemeList() {
    $('#systemThemeList').innerHTML = Object.entries(systemThemes).map(([name,color]) => `<div><span>${escapeText(name)}</span><i style="background:${color}"></i></div>`).join('') || '<p class="studio-hint">No custom system themes yet.</p>';
  }
  function renderProfiles() {
    $('#profileSelect').innerHTML = profiles.map(p => `<option value="${escapeText(p.name)}" ${p.name===activeProfile?'selected':''}>${escapeText(p.name)}</option>`).join('');
    $('#studioProfileLabel').textContent = 'PROFILE: ' + activeProfile;
  }
  function snapshot() {
    const values = {};
    KEYS.forEach(key => { const value = localStorage.getItem(key); if (value !== null) values[key] = value; });
    return values;
  }
  function restore(values) {
    KEYS.forEach(key => { if (Object.prototype.hasOwnProperty.call(values,key)) localStorage.setItem(key, values[key]); });
    window.location.reload();
  }
  function open() { modal.classList.remove('hidden'); renderProfiles(); renderSystemThemeList(); }
  function close() { modal.classList.add('hidden'); }
  trigger.addEventListener('click', open);
  modal.querySelector('.experience-close').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) close(); });
  modal.querySelectorAll('[data-studio-tab]').forEach(button => button.addEventListener('click', () => {
    modal.querySelectorAll('[data-studio-tab]').forEach(b => b.classList.toggle('active', b === button));
    modal.querySelectorAll('[data-studio-panel]').forEach(panel => panel.classList.toggle('hidden', panel.dataset.studioPanel !== button.dataset.studioTab));
  }));
  modal.querySelectorAll('[data-theme-choice]').forEach(button => button.addEventListener('click', () => {
    localStorage.removeItem('eclipse-custom-accent'); document.documentElement.style.removeProperty('--custom-accent');
    setTheme(button.dataset.themeChoice); $('#studioAccent').value = '#a8f2c7';
  }));
  $('#studioAccent').addEventListener('input', e => {
    localStorage.setItem('eclipse-custom-accent', e.target.value);
    document.documentElement.style.setProperty('--custom-accent', e.target.value);
    document.documentElement.classList.add('eclipse-custom-accent');
  });
  $('#resetAccent').addEventListener('click', () => { localStorage.removeItem('eclipse-custom-accent'); document.documentElement.style.removeProperty('--custom-accent'); document.documentElement.classList.remove('eclipse-custom-accent'); $('#studioAccent').value='#a8f2c7'; notify('Custom accent reset.'); });
  $('#studioWallpaper').addEventListener('change', e => {
    const file=e.target.files?.[0]; if(!file)return;
    if(file.size>1.5*1024*1024){notify('Choose an image under 1.5 MB.');e.target.value='';return;}
    const reader=new FileReader(); reader.onload=()=>{wallpaper=String(reader.result);localStorage.setItem('eclipse-wallpaper',wallpaper);applyWallpaper();notify('Wallpaper applied.');}; reader.onerror=()=>notify('Could not read that image.');reader.readAsDataURL(file);
  });
  $('#clearWallpaper').addEventListener('click',()=>{wallpaper='';localStorage.removeItem('eclipse-wallpaper');applyWallpaper();$('#studioWallpaper').value='';notify('Wallpaper cleared.');});
  $('#systemThemeTarget').addEventListener('change',e=>$('#systemThemeColor').value=systemThemes[e.target.value]||'#a8f2c7');
  $('#saveSystemTheme').addEventListener('click',()=>{systemThemes[$('#systemThemeTarget').value]=$('#systemThemeColor').value;save('eclipse-system-themes',systemThemes);renderSystemThemeList();notify('System theme saved.');});
  $('#clearSystemTheme').addEventListener('click',()=>{delete systemThemes[$('#systemThemeTarget').value];save('eclipse-system-themes',systemThemes);applySystemTheme($('#systemThemeTarget').value);renderSystemThemeList();notify('System theme reset.');});
  $('#motionSpeed').addEventListener('input',e=>{motionSpeed=Number(e.target.value);$('#motionValue').textContent=motionSpeed.toFixed(1)+'×';localStorage.setItem('eclipse-motion-speed',String(motionSpeed));applyMotion();});
  $('#motionReduced').addEventListener('click',()=>{motionSpeed=0;$('#motionSpeed').value='0';$('#motionValue').textContent='0×';localStorage.setItem('eclipse-motion-speed','0');applyMotion();});
  $('#motionDefault').addEventListener('click',()=>{motionSpeed=1;$('#motionSpeed').value='1';$('#motionValue').textContent='1.0×';localStorage.setItem('eclipse-motion-speed','1');applyMotion();});
  $('#performanceLite').addEventListener('change',e=>{localStorage.setItem('eclipse-performance-lite',String(e.target.checked));applyMotion();});
  $('#createProfile').addEventListener('click',()=>{const name=$('#newProfileName').value.trim();if(!name){notify('Enter a profile name first.');return;}if(profiles.some(p=>p.name.toLowerCase()===name.toLowerCase())){notify('That profile already exists.');return;}profiles.push({name,values:{}});activeProfile=name;save('eclipse-profiles',profiles);localStorage.setItem('eclipse-active-profile',name);renderProfiles();$('#newProfileName').value='';$('#profileStatus').textContent='Profile created. Save your current setup to it.';});
  $('#saveProfile').addEventListener('click',()=>{const profile=profiles.find(p=>p.name===activeProfile);if(!profile)return;profile.values=snapshot();save('eclipse-profiles',profiles);$('#profileStatus').textContent='Saved the current ECLIPSE setup to '+activeProfile+'.';notify('Profile saved.');});
  $('#switchProfile').addEventListener('click',()=>{const name=$('#profileSelect').value;const profile=profiles.find(p=>p.name===name);if(!profile)return;if(!Object.keys(profile.values).length){activeProfile=name;localStorage.setItem('eclipse-active-profile',name);renderProfiles();$('#profileStatus').textContent='This profile is empty. Save a setup to it.';return;}activeProfile=name;localStorage.setItem('eclipse-active-profile',name);restore(profile.values);});
  $('#deleteProfile').addEventListener('click',()=>{if(activeProfile==='Default'){notify('The Default profile cannot be deleted.');return;}if(!confirm('Delete profile '+activeProfile+'?'))return;profiles=profiles.filter(p=>p.name!==activeProfile);activeProfile='Default';save('eclipse-profiles',profiles);localStorage.setItem('eclipse-active-profile','Default');renderProfiles();$('#profileStatus').textContent='Profile deleted. Current settings were not changed.';});
  $('#exportBackup').addEventListener('click',()=>{const backup={format:'eclipse-experience-backup',version:1,createdAt:new Date().toISOString(),values:snapshot()};const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='eclipse-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(url);$('#backupStatus').textContent='Backup exported. Store the JSON somewhere safe.';});
  $('#importBackup').addEventListener('change',e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const backup=JSON.parse(String(reader.result));if(backup.format!=='eclipse-experience-backup'||!backup.values||typeof backup.values!=='object')throw new Error('Invalid ECLIPSE backup');if(!confirm('Import this ECLIPSE backup? Current saved settings and library metadata will be replaced.'))return;restore(backup.values);}catch(error){$('#backupStatus').textContent='Import failed: '+error.message;}};reader.readAsText(file);e.target.value='';});
  applyWallpaper(); applyMotion();
  const custom=localStorage.getItem('eclipse-custom-accent');
  if(custom){document.documentElement.style.setProperty('--custom-accent',custom);document.documentElement.classList.add('eclipse-custom-accent');$('#studioAccent').value=custom;}
  renderProfiles(); renderSystemThemeList();
  window.EclipseExperienceApplySystemTheme=applySystemTheme;
}
