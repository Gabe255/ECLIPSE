const FAMILY_ART = {
  Nintendo:{ accent:'#ff6b80', secondary:'#ffc1cb', mark:'✦', shape:'split' },
  PlayStation:{ accent:'#78a7ff', secondary:'#d0e0ff', mark:'△', shape:'orbit' },
  Xbox:{ accent:'#76df91', secondary:'#d0ffdc', mark:'✕', shape:'ring' },
  Sega:{ accent:'#64baff', secondary:'#cceaff', mark:'◉', shape:'scan' },
  Atari:{ accent:'#f1b66e', secondary:'#ffe0bd', mark:'▥', shape:'grid' },
  Arcade:{ accent:'#df83ff', secondary:'#f4d1ff', mark:'✧', shape:'pixel' },
  PC:{ accent:'#b7a0ff', secondary:'#e1d8ff', mark:'⌘', shape:'grid' },
  'PC Gaming':{ accent:'#b7a0ff', secondary:'#e1d8ff', mark:'⌘', shape:'grid' },
  Computer:{ accent:'#80d8d0', secondary:'#d2fff7', mark:'⌘', shape:'scan' },
  Mobile:{ accent:'#86e3b0', secondary:'#d5ffe6', mark:'▣', shape:'glass' },
  Android:{ accent:'#86e3b0', secondary:'#d5ffe6', mark:'▣', shape:'glass' },
  Other:{ accent:'#c1a4ff', secondary:'#e6d9ff', mark:'◇', shape:'orbit' }
};

const SYSTEM_MARKS = {
  'NES':'▦','SNES':'▤','Nintendo 64':'◉','Game Boy':'▣','Game Boy Advance':'▣',
  'Nintendo DS':'▤','Nintendo 3DS':'▤','GameCube':'◆','Wii':'◎','Wii U':'▣',
  'PlayStation 2':'Ⅱ','PlayStation 3':'Ⅲ','PlayStation 4 / Pro':'Ⅳ','PlayStation 5 / Pro':'Ⅴ',
  'PSP':'▰','PS Vita':'▰','Xbox 360':'◉','Xbox One':'◉','Xbox Series X|S':'✕',
  'Genesis / Mega Drive':'◈','Master System':'◫','Saturn':'◉','Dreamcast':'◇',
  'Atari 2600':'▥','Atari 5200':'▥','Atari 7800':'▥','Atari Lynx':'▰',
  'Nintendo Switch':'▥','Nintendo Switch 2':'▥'
};

export function systemArtwork(system) {
  const family = typeof system === 'string' ? 'Other' : (system?.family || 'Other');
  const name = typeof system === 'string' ? system : (system?.name || 'System');
  const art = FAMILY_ART[family] || FAMILY_ART.Other;
  return { ...art, name, family, mark:SYSTEM_MARKS[name] || art.mark };
}

export function decorateSystemArtwork(root, systems) {
  if (!root) return;
  root.querySelectorAll('[data-pick-system], [data-console], [data-konsoru-family]').forEach(card => {
    const name = card.dataset.pickSystem || card.dataset.console || '';
    const familyName = card.dataset.konsoruFamily || systems.find(item => item.name === name)?.family || name;
    const art = systemArtwork(systems.find(item => item.name === name) || { name, family:familyName });
    card.dataset.eclipseFamily = art.family.toLowerCase().replace(/[^a-z]+/g,'-');
    card.style.setProperty('--system-art-accent', art.accent);
    card.style.setProperty('--system-art-secondary', art.secondary);
    card.style.setProperty('--system-art-mark', '"' + art.mark + '"');
    const mark = card.querySelector('.cube-front, .konsoru-world-symbol, .console-card > span');
    if (mark) mark.textContent = art.mark;
  });
}
