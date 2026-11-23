const API_ROOT = 'https://www.steamgriddb.com/api/v2/';
const ART_TYPES = [['grids', 'grid'], ['heroes', 'hero'], ['logos', 'logo'], ['icons', 'icon']];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const normalizeTitle = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

async function request(path, apiKey) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(API_ROOT + path, {
      headers: { Authorization: 'Bearer ' + apiKey, Accept: 'application/json' },
      signal: controller.signal
    });
    if ([401, 403, 429].includes(response.status)) {
      const error = new Error(response.status === 429
        ? 'SteamGridDB rate limit reached. The artwork scan has paused safely.'
        : 'SteamGridDB rejected the saved API key. Check it in Settings.');
      error.fatal = true;
      throw error;
    }
    if (!response.ok) throw new Error('SteamGridDB request failed (' + response.status + ').');
    const payload = await response.json();
    if (!payload.success || !Array.isArray(payload.data)) throw new Error('SteamGridDB returned an unexpected response.');
    return payload.data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function enrichLibraryArtwork({ games, apiKey, save, onProgress = () => {}, limit = 8 }) {
  if (!apiKey) throw new Error('Add your SteamGridDB API key in Settings first.');
  if (!Array.isArray(games) || typeof save !== 'function') throw new Error('The game library could not be prepared for artwork scanning.');

  const candidates = games.filter(game => game && game.title)
    .filter(game => ART_TYPES.some(([, field]) => !game.artwork?.[field]))
    .slice(0, Math.max(1, Math.min(8, Number(limit) || 8)));

  const result = { total: candidates.length, processed: 0, updated: 0, skipped: 0, failed: 0, paused: false, errors: [] };
  if (!candidates.length) return result;

  for (const game of candidates) {
    onProgress({ ...result, currentTitle: game.title });
    try {
      const matches = await request('search/autocomplete/' + encodeURIComponent(game.title), apiKey);
      await pause(300);
      const title = normalizeTitle(game.title);
      const match = matches.find(item => normalizeTitle(item.name) === title);
      if (!match) {
        result.skipped++;
        result.errors.push({ title: game.title, reason: 'No exact title match; choose the edition manually.' });
        result.processed++;
        continue;
      }

      const previousArtwork = game.artwork || {};
      const nextArtwork = { ...previousArtwork, source: 'SteamGridDB', gameId: match.id };
      let found = 0;
      for (const [type, field] of ART_TYPES) {
        if (nextArtwork[field]) continue;
        try {
          const assets = await request(type + '/game/' + match.id + '?types=static', apiKey);
          await pause(300);
          const asset = assets.find(item => {
            try { return new URL(item.url).protocol === 'https:'; } catch { return false; }
          });
          if (asset) { nextArtwork[field] = new URL(asset.url).href; found++; }
        } catch (error) {
          if (error.fatal) throw error;
          result.errors.push({ title: game.title, reason: type + ': ' + error.message });
        }
      }

      if (!found && !ART_TYPES.some(([, field]) => nextArtwork[field])) {
        result.skipped++;
        result.errors.push({ title: game.title, reason: 'No artwork was available.' });
      } else {
        game.artwork = nextArtwork;
        try { save(); result.updated++; }
        catch (error) {
          game.artwork = previousArtwork;
          throw new Error('Could not save artwork for this game. Check available device storage.');
        }
      }
    } catch (error) {
      result.failed++;
      result.errors.push({ title: game.title, reason: error.message || 'Artwork lookup failed.' });
      if (error.fatal) {
        result.paused = true;
        result.errors.push({ title: 'Scan paused', reason: error.message });
        result.processed++;
        onProgress({ ...result, currentTitle: game.title });
        break;
      }
    }
    result.processed++;
    onProgress({ ...result, currentTitle: game.title });
  }
  return result;
}
