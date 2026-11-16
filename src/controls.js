import { Capacitor, registerPlugin } from '@capacitor/core';

const SystemControls = registerPlugin('SystemControls');

export function mountControlCenter({ notify }) {
  const topActions = document.querySelector('.top-actions');
  if (!topActions || document.getElementById('eclipseControlCenter')) return;

  const trigger = document.createElement('button');
  trigger.className = 'control-center-trigger';
  trigger.type = 'button';
  trigger.innerHTML = '<span aria-hidden="true">⌁</span> CONTROL';
  trigger.setAttribute('aria-label', 'Open ECLIPSE Control Center');
  topActions.prepend(trigger);

  const backdrop = document.createElement('div');
  backdrop.className = 'control-center-backdrop hidden';
  backdrop.id = 'eclipseControlCenter';
  backdrop.innerHTML = `
    <section class="control-center-panel" role="dialog" aria-modal="true" aria-labelledby="controlCenterTitle">
      <header class="control-center-head">
        <div><p class="eyebrow">SYSTEM SHORTCUTS</p><h2 id="controlCenterTitle">CONTROL <em>CENTER</em></h2><p>Quick access without leaving your game library.</p></div>
        <button class="control-center-close" type="button" aria-label="Close control center">×</button>
      </header>
      <div class="control-center-grid">
        <button class="control-tile" data-control-action="wifi" type="button"><span class="control-icon">⌁</span><b>WI-FI</b><small>Open network panel</small></button>
        <button class="control-tile" data-control-action="bluetooth" type="button"><span class="control-icon">ᛒ</span><b>BLUETOOTH</b><small>Open Bluetooth panel</small></button>
        <button class="control-tile" data-control-action="volume" type="button"><span class="control-icon">◖</span><b>VOLUME</b><small>Show device volume</small></button>
        <button class="control-tile" data-control-action="rotation" type="button"><span class="control-icon">⟳</span><b>ROTATION</b><small>Open display settings</small></button>
        <button class="control-tile" data-control-action="dnd" type="button"><span class="control-icon">◐</span><b>DO NOT DISTURB</b><small>Open DND permissions</small></button>
        <button class="control-tile game-mode-tile" id="eclipseGameMode" type="button" aria-pressed="false"><span class="control-icon">✦</span><b>GAME MODE</b><small>Reduce ECLIPSE effects</small></button>
      </div>
      <section class="control-slider-card">
        <div><b>DISPLAY BRIGHTNESS</b><span id="controlBrightnessValue">100%</span></div>
        <input id="controlBrightness" type="range" min="5" max="100" value="100" step="1" aria-label="ECLIPSE app brightness">
        <small>Adjusts ECLIPSE only. Android controls system-wide brightness.</small>
      </section>
      <section class="control-status-card">
        <div class="control-status-orb">◉</div>
        <div><b>DEVICE BATTERY</b><strong id="controlBatteryValue">Checking…</strong><small id="controlBatteryNote">Live status from Android when available</small></div>
        <button class="control-refresh" id="refreshDeviceStatus" type="button">REFRESH</button>
      </section>
      <p class="control-center-footnote">Wi-Fi, Bluetooth, rotation and DND open Android's own controls. ECLIPSE cannot silently change restricted system settings.</p>
    </section>`;
  document.body.append(backdrop);

  const close = () => backdrop.classList.add('hidden');
  const open = () => {
    backdrop.classList.remove('hidden');
    refreshBattery();
  };
  const isNative = Capacitor.isNativePlatform();
  let brightness = 1;
  let gameMode = localStorage.getItem('eclipse-game-mode') === 'true';

  const applyGameMode = () => {
    document.documentElement.dataset.gameMode = gameMode ? 'on' : 'off';
    const button = backdrop.querySelector('#eclipseGameMode');
    if (button) {
      button.classList.toggle('active', gameMode);
      button.setAttribute('aria-pressed', String(gameMode));
      button.querySelector('small').textContent = gameMode ? 'Reduced effects enabled' : 'Reduce ECLIPSE effects';
    }
  };

  async function refreshBattery() {
    const value = backdrop.querySelector('#controlBatteryValue');
    const note = backdrop.querySelector('#controlBatteryNote');
    if (!isNative) {
      value.textContent = 'Android APK only';
      note.textContent = 'Battery status appears in the installed app';
      return;
    }
    try {
      const status = await SystemControls.getDeviceStatus();
      value.textContent = status.batteryPercent >= 0 ? status.batteryPercent + '%' : 'Unavailable';
      note.textContent = status.charging ? 'Charging' : 'Device battery';
    } catch {
      value.textContent = 'Unavailable';
      note.textContent = 'Android did not return battery information';
    }
  }

  async function runAction(action) {
    if (!isNative) {
      notify('This shortcut is available in the Android APK.');
      return;
    }
    const methods = {
      wifi: 'openWifiSettings',
      bluetooth: 'openBluetoothSettings',
      volume: 'showVolumePanel',
      rotation: 'openRotationSettings',
      dnd: 'openDndSettings'
    };
    try {
      await SystemControls[methods[action]]();
      const labels = {wifi:'Wi-Fi controls opened.',bluetooth:'Bluetooth controls opened.',volume:'Volume panel opened.',rotation:'Display settings opened.',dnd:'Do Not Disturb settings opened.'};
      notify(labels[action]);
    } catch {
      notify('Android could not open that control.');
    }
  }

  trigger.addEventListener('click', open);
  backdrop.querySelector('.control-center-close').addEventListener('click', close);
  backdrop.addEventListener('click', event => { if (event.target === backdrop) close(); });
  backdrop.querySelectorAll('[data-control-action]').forEach(button => {
    button.addEventListener('click', () => runAction(button.dataset.controlAction));
  });
  backdrop.querySelector('#refreshDeviceStatus').addEventListener('click', refreshBattery);
  backdrop.querySelector('#eclipseGameMode').addEventListener('click', () => {
    gameMode = !gameMode;
    localStorage.setItem('eclipse-game-mode', String(gameMode));
    applyGameMode();
    notify(gameMode ? 'ECLIPSE Game Mode enabled.' : 'ECLIPSE Game Mode disabled.');
  });
  backdrop.querySelector('#controlBrightness').addEventListener('input', async event => {
    brightness = Number(event.target.value) / 100;
    backdrop.querySelector('#controlBrightnessValue').textContent = event.target.value + '%';
    if (isNative) {
      try { await SystemControls.setWindowBrightness({ value: brightness }); }
      catch { notify('Could not adjust ECLIPSE brightness.'); }
    } else {
      document.documentElement.style.setProperty('--eclipse-preview-brightness', String(brightness));
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !backdrop.classList.contains('hidden')) close();
  });
  applyGameMode();
}
