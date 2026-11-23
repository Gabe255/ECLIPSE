const RAWG_BASE = 'https://api.rawg.io/api';
const normalize = value => String(value || '').toLowerCase().normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');

async function requestJSON(url, signal) {
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (response.status === 401 || response.status === 403) throw new Error('Metadata provider rejected the API key.');
  if (response.status === 429) throw new Error('Metadata provider rate limit reached. Try again later.');
  if (!response.ok) throw new Error('Metadata provider returned HTTP ' + response.status + '.');
  return response.json();
}

export async function enrichLibraryMetadata({ games, apiKey, limit = 8, gameId = null, save = () => {}, onProgress = () => {} }) {
  if (!apiKey) throw new Error('Add a RAWG API key in Settings before starting metadata scraping.');
  const pending = games.filter(game => (!gameId || game.id === gameId) && !game.metadata?.providerId).slice(0, Math.max(1, Math.min(8, limit)));
  const result = { updated: 0, skipped: 0, failed: 0, paused: false, errors: [] };
  for (let index = 0; index < pending.length; index++) {
    const game = pending[index];
    onProgress({ processed:index, total:pending.length, currentTitle:game.title, ...result });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const query = new URLSearchParams({ key:apiKey, search:game.title, page_size:'8' });
      const search = await requestJSON(RAWG_BASE + '/games?' + query, controller.signal);
      const target = normalize(game.title);
      const matches = (search.results || []).filter(item => normalize(item.name) === target);
      if (!matches.length) {
        result.skipped++;
        result.errors.push({ title:game.title, reason:'No exact title match found; left unchanged.' });
        continue;
      }
      const match = matches[0];
      const detail = await requestJSON(RAWG_BASE + '/games/' + encodeURIComponent(match.slug || match.id) + '?key=' + encodeURIComponent(apiKey), controller.signal);
      const metadata = {
        provider:'RAWG', providerId:String(detail.id), slug:detail.slug || match.slug || '',
        name:detail.name || match.name || game.title,
        released:detail.released || match.released || null,
        description:detail.description_raw || '',
        developers:(detail.developers || []).map(item => item.name).filter(Boolean),
        publishers:(detail.publishers || []).map(item => item.name).filter(Boolean),
        genres:(detail.genres || []).map(item => item.name).filter(Boolean),
        platforms:(detail.platforms || []).map(item => item.platform?.name).filter(Boolean),
        metacritic:detail.metacritic ?? match.metacritic ?? null,
        website:detail.website || '',
        backgroundImage:detail.background_image || match.background_image || '',
        fetchedAt:new Date().toISOString()
      };
      game.metadata = metadata;
      if (!game.year && metadata.released) game.year = metadata.released.slice(0,4);
      if (!game.tag && metadata.genres.length) game.tag = metadata.genres[0];
      result.updated++;
      save();
    } catch (error) {
      result.failed++;
      const reason = error?.name === 'AbortError' ? 'Request timed out.' : (error?.message || 'Metadata request failed.');
      result.errors.push({ title:game.title, reason });
      if (/rate limit|API key/i.test(reason)) { result.paused = true; break; }
    } finally {
      clearTimeout(timeout);
    }
  }
  onProgress({ processed:Math.min(pending.length, result.updated + result.skipped + result.failed), total:pending.length, currentTitle:'', ...result });
  return result;
}
