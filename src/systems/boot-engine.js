const DEFAULT_DURATION = 2300;

function playBootSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(196, now);
    oscillator.frequency.exponentialRampToValueAtTime(392, now + 0.22);
    oscillator.frequency.exponentialRampToValueAtTime(587.33, now + 0.42);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.64);
    oscillator.addEventListener('ended', () => context.close().catch(() => {}), { once:true });
  } catch (error) {
    console.info('ECLIPSE boot audio is unavailable.', error);
  }
}

function pulseHaptics() {
  try {
    if (typeof navigator.vibrate === 'function') navigator.vibrate([14, 24, 18]);
  } catch {}
}

export function startSystemBoot({ root, system, config, onComplete = () => {} }) {
  if (!root) {
    onComplete();
    return;
  }

  const enabled = localStorage.getItem('eclipse-system-startup-enabled') !== 'false';
  if (!enabled) {
    root.classList.add('hidden');
    onComplete();
    return;
  }

  let custom = {};
  try { custom = JSON.parse(localStorage.getItem('eclipse-boot-designer') || '{}') || {}; } catch {}
  const variants = ['stereo','split','ribbon','scanline','glass'];
  const safeAccent = value => /^#[0-9a-f]{6}$/i.test(String(value || '')) ? value : null;
  const effective = { ...config };
  if (variants.includes(custom.variant)) effective.variant = custom.variant;
  if (safeAccent(custom.accent)) effective.accent = custom.accent;
  if (typeof custom.line === 'string' && custom.line.trim()) effective.line = custom.line.trim().slice(0,48);
  if (typeof custom.tag === 'string' && custom.tag.trim()) effective.tag = custom.tag.trim().slice(0,48);
  if (typeof custom.title === 'string' && custom.title.trim()) effective.title = custom.title.trim().slice(0,32);
  if (Number.isFinite(Number(custom.duration))) effective.duration = Math.max(1200, Math.min(5000, Number(custom.duration)));
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const duration = reducedMotion ? 550 : Math.max(1200, Number(effective.duration) || DEFAULT_DURATION);
  const skipButton = root.querySelector('#skipSystemBoot');
  const mark = root.querySelector('#bootSystemMark');
  const title = root.querySelector('#bootSystemName');
  const line = root.querySelector('#bootSystemLine');
  const tag = root.querySelector('#bootSystemTag');

  let finished = false;
  let timer = null;
  let transitionTimer = null;

  const finish = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(timer);
    if (skipButton) skipButton.removeEventListener('click', finish);
    root.classList.add('is-entering');
    transitionTimer = window.setTimeout(() => {
      root.classList.add('hidden');
      root.classList.remove('is-active', 'is-entering');
      onComplete();
    }, reducedMotion ? 0 : 240);
  };

  root.dataset.variant = effective.variant || 'stereo';
  root.dataset.family = String(system.family || 'platform').toLowerCase().replace(/[^a-z]+/g, '-');
  root.style.setProperty('--boot-accent', effective.accent || '#a8f2c7');
  root.style.setProperty('--boot-secondary', effective.secondary || '#e1ffef');
  root.style.setProperty('--boot-duration', duration + 'ms');
  if (mark) mark.textContent = system.icon || '✦';
  if (title) title.textContent = String(effective.title || system.name || 'SYSTEM').toUpperCase();
  if (line) line.textContent = effective.line || 'ECLIPSE SYSTEM STARTUP';
  if (tag) tag.textContent = effective.tag || 'SYSTEM READY';

  root.classList.remove('hidden', 'is-entering');
  root.classList.add('is-active');
  if (skipButton) skipButton.addEventListener('click', finish);
  if (localStorage.getItem('eclipse-system-boot-sound') === 'true') playBootSound();
  if (!reducedMotion && localStorage.getItem('eclipse-system-boot-haptics') === 'true') pulseHaptics();
  timer = window.setTimeout(finish, duration);
}
