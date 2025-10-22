// src/services/api.js
import { characters as fallbackChars } from '../data/characters.js';

const LIVE_BASE = 'https://dragonball-api.com/api'; // or keep your Vite proxy and set to '/api/api'

/**
 * Try the live API first. On any failure, return a normalized object using the local dataset.
 * We also do name filtering + pagination in the fallback so the UI behaves the same.
 */
export async function fetchCharacters({ name = '', page = 1, limit = 50 } = {}) {
  // ---- Live call (best effort)
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (name?.trim()) params.set('name', name.trim());
    const res = await fetch(`${LIVE_BASE}/characters?${params.toString()}`, { mode: 'cors' });

    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    // normalize shape to { items, meta }
    const items = Array.isArray(data) ? data : (data.items ?? data);
    const meta = data.meta ?? { page, total: items.length, limit };

    return { items, meta, source: 'live' };
  } catch (err) {
    // ---- Fallback to local dataset
    const q = name.trim().toLowerCase();
    const filtered = q
      ? fallbackChars.filter(c => c.name.toLowerCase().includes(q))
      : fallbackChars;

    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
        items,                     // current page slice
        allItems: filtered,        // full list (name-filtered)
        meta: { page, total: filtered.length, limit },
        source: 'fallback',
        error: err?.message ?? 'Live API unavailable'
      };
  }
}
