import './pegasus-ui.css';

/**
 * ECLIPSE's Pegasus-inspired navigation layer.
 * Recreates the slide-in menu and focus-first interaction model in the
 * existing Vite/Capacitor app; the original Pegasus QML runtime is not used.
 */
export function mountPegasusNavigation({ navigate }) {
  const actions = document.querySelector('.top-actions');
  if (!actions || document.querySelector('#pegasusNavigation')) return;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'pegasus-menu-trigger';
  trigger.id = 'pegasusMenuTrigger';
  trigger.setAttribute('aria-label', 'Open navigation menu');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = '<span aria-hidden="true">☰</span><b>MENU</b>';
  actions.prepend(trigger);

  const backdrop = document.createElement('div');
  backdrop.className = 'pegasus-nav-backdrop';
  backdrop.id = 'pegasusNavigation';
  backdrop.innerHTML = `
    <button class="pegasus-nav-scrim" type="button" data-menu-close aria-label="Close navigation"></button>
    <aside class="pegasus-nav-panel" role="dialog" aria-modal="true" aria-labelledby="pegasusNavTitle" tabindex="-1">
      <header class="pegasus-nav-head">
        <div><p class="eyebrow">ECLIPSE SYSTEM MENU</p><h2 id="pegasusNavTitle">YOUR <em>UNIVERSE.</em></h2></div>
        <button class="pegasus-nav-close" type="button" data-menu-close aria-label="Close menu">×</button>
      </header>
      <nav class="pegasus-nav-links" aria-label="Main navigation">
        <button type="button" data-menu-view="home"><span>⌂</span><b>Home</b><small>Featured games and shelves</small><i>↗</i></button>
        <button type="button" data-menu-view="library"><span>▤</span><b>Game library</b><small>Browse every collection</small><i>↗</i></button>
        <button type="button" data-menu-view="android"><span>▣</span><b>Android apps</b><small>Installed games and apps</small><i>↗</i></button>
        <button type="button" data-menu-view="settings"><span>⚙</span><b>Settings</b><small>Customize your setup</small><i>↗</i></button>
      </nav>
      <div class="pegasus-nav-footer"><span class="pegasus-nav-orb">E</span><div><b>ECLIPSE</b><small>ONE HOME FOR EVERY WORLD</small></div><span class="pegasus-nav-key">B / ESC TO CLOSE</span></div>
    </aside>`;
  document.body.append(backdrop);

  let previousFocus = null;
  const close = () => {
    if (!backdrop.classList.contains('is-open')) return;
    backdrop.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('pegasus-menu-open');
    previousFocus?.focus?.();
  };
  const open = () => {
    previousFocus = document.activeElement;
    backdrop.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('pegasus-menu-open');
    backdrop.querySelector('[data-menu-view="home"]')?.focus();
  };

  trigger.addEventListener('click', () => backdrop.classList.contains('is-open') ? close() : open());
  backdrop.addEventListener('click', event => {
    const closeButton = event.target.closest('[data-menu-close]');
    const destination = event.target.closest('[data-menu-view]');
    if (closeButton) return close();
    if (destination) {
      close();
      navigate?.(destination.dataset.menuView);
    }
  });
  document.addEventListener('keydown', event => {
    if (!backdrop.classList.contains('is-open')) return;
    if (event.key === 'Escape' || event.key === 'Backspace' || event.key === 'ArrowLeft') {
      event.preventDefault();
      close();
    }
    if (event.key === 'Tab') {
      const items = [...backdrop.querySelectorAll('button:not([disabled])')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    }
  });
  return { open, close };
}
