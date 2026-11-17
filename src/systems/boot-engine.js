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

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const duration = reducedMotion ? 550 : Math.max(1200, Number(config.duration) || DEFAULT_DURATION);
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

  root.dataset.variant = config.variant || 'stereo';
  root.dataset.family = String(system.family || 'platform').toLowerCase().replace(/[^a-z]+/g, '-');
  root.style.setProperty('--boot-accent', config.accent);
  root.style.setProperty('--boot-secondary', config.secondary);
  root.style.setProperty('--boot-duration', duration + 'ms');
  if (mark) mark.textContent = system.icon || '✦';
  if (title) title.textContent = String(system.name || 'SYSTEM').toUpperCase();
  if (line) line.textContent = config.line || 'ECLIPSE SYSTEM STARTUP';
  if (tag) tag.textContent = config.tag || 'SYSTEM READY';

  root.classList.remove('hidden', 'is-entering');
  root.classList.add('is-active');
  if (skipButton) skipButton.addEventListener('click', finish);
  if (localStorage.getItem('eclipse-system-boot-sound') === 'true') playBootSound();
  if (!reducedMotion) pulseHaptics();
  timer = window.setTimeout(finish, duration);
}
