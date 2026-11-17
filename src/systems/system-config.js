const FAMILY_CONFIG = {
  Nintendo: { accent:'#ff5368', secondary:'#ffd0d6', variant:'split', line:'POWERING UP YOUR PLAY WORLD', tag:'READY WHEN YOU ARE' },
  PlayStation: { accent:'#6b9dff', secondary:'#d1e0ff', variant:'stereo', line:'WELCOME BACK, PLAYER', tag:'YOUR NEXT ADVENTURE AWAITS' },
  Xbox: { accent:'#65d979', secondary:'#d3ffda', variant:'ribbon', line:'PREPARING YOUR GAME SPACE', tag:'LET’S PLAY' },
  Sega: { accent:'#5b9dff', secondary:'#c5dcff', variant:'scanline', line:'INSERT COIN. ENTER WORLD.', tag:'SEGA FOREVER' },
  Atari: { accent:'#ffbd65', secondary:'#ffe0ad', variant:'scanline', line:'A CLASSIC WORLD IS LOADING', tag:'PRESS START' },
  Arcade: { accent:'#ff73dc', secondary:'#ffd0f4', variant:'scanline', line:'LOADING THE ARCADE', tag:'PLAYER ONE READY' },
  PC: { accent:'#b59aff', secondary:'#e0d4ff', variant:'stereo', line:'INITIALIZING YOUR LIBRARY', tag:'SYSTEM ONLINE' },
  'PC Gaming': { accent:'#b59aff', secondary:'#e0d4ff', variant:'stereo', line:'INITIALIZING YOUR LIBRARY', tag:'SYSTEM ONLINE' },
  Android: { accent:'#82e5a3', secondary:'#d0ffe0', variant:'glass', line:'CONNECTING YOUR APPS', tag:'DEVICE READY' },
  Mobile: { accent:'#82e5a3', secondary:'#d0ffe0', variant:'glass', line:'CONNECTING YOUR APPS', tag:'DEVICE READY' }
};

const SYSTEM_CONFIG = {
  'Nintendo 3DS': { accent:'#ef6b75', secondary:'#ffd6da', variant:'stereo', line:'3D WORLD COMING INTO VIEW', tag:'WELCOME BACK' },
  'Wii': { accent:'#8ed9ef', secondary:'#d9f8ff', variant:'ribbon', line:'WII WOULD LIKE TO PLAY', tag:'YOUR LIVING ROOM IS READY' },
  'Wii U': { accent:'#54b8e8', secondary:'#ccefff', variant:'split', line:'GAMEPAD LINK ESTABLISHED', tag:'TWO SCREENS. ONE WORLD.' },
  'PSP': { accent:'#6eafff', secondary:'#d4e8ff', variant:'glass', line:'PORTABLE PLAY READY', tag:'TAKE THE GAME WITH YOU' },
  'PS Vita': { accent:'#61c5d9', secondary:'#d0f8ff', variant:'glass', line:'VITA SYSTEM ONLINE', tag:'PLAY IS IN YOUR HANDS' },
  'Nintendo Switch': { accent:'#ff5368', secondary:'#ffd0d6', variant:'split', line:'CONSOLE MODE: READY', tag:'PLAY ANYWHERE' },
  'Nintendo Switch 2': { accent:'#ff596e', secondary:'#ffd7dd', variant:'split', line:'NEXT GENERATION READY', tag:'WELCOME TO YOUR NEXT WORLD' },
  'PlayStation 2': { accent:'#6c83ff', secondary:'#d1d8ff', variant:'stereo', line:'THE NEXT LEVEL IS LOADING', tag:'WELCOME TO YOUR PLAYSTATION 2' },
  'PlayStation 3': { accent:'#d8d8e6', secondary:'#ffffff', variant:'stereo', line:'CELL SYSTEM INITIALIZING', tag:'WELCOME BACK' },
  'PlayStation 4 / Pro': { accent:'#4b9bff', secondary:'#c8e2ff', variant:'stereo', line:'LIVE FROM YOUR PLAYSTATION', tag:'READY TO PLAY' },
  'PlayStation 5 / Pro': { accent:'#b5a2ff', secondary:'#e3d9ff', variant:'stereo', line:'WELCOME TO THE NEW GENERATION', tag:'YOUR NEXT GREAT ADVENTURE' },
  'Xbox 360': { accent:'#8bdc75', secondary:'#e0ffd7', variant:'ribbon', line:'XBOX LIVE SESSION READY', tag:'IT’S GAME TIME' },
  'Xbox One': { accent:'#3bc66c', secondary:'#c8ffda', variant:'ribbon', line:'ALL SYSTEMS GO', tag:'WELCOME HOME' },
  'Xbox Series X|S': { accent:'#50d77d', secondary:'#d0ffe0', variant:'ribbon', line:'VELOCITY ARCHITECTURE ONLINE', tag:'POWER YOUR DREAMS' },
  'Dreamcast': { accent:'#ff805d', secondary:'#ffd8ca', variant:'glass', line:'DREAMCAST CONNECTION READY', tag:'WELCOME TO THE FUTURE' }
};

export function getSystemConfig(system) {
  const seed = Array.from(system.name || 'ECLIPSE').reduce((sum,char)=>sum+char.charCodeAt(0),0);
  const hue = (seed * 47) % 360;
  const fallback = FAMILY_CONFIG[system.family] || {
    accent:`hsl(${hue} 82% 70%)`,
    secondary:`hsl(${hue} 100% 88%)`,
    variant:'stereo',
    line:'BOOTING ' + String(system.name || 'SYSTEM').toUpperCase(),
    tag:String(system.family || 'PLATFORM').toUpperCase() + ' SYSTEM READY'
  };
  return { ...fallback, ...(SYSTEM_CONFIG[system.name] || {}), duration:2300 };
}
