import { useEffect, useMemo, useState } from 'react'
import CharacterCard from './components/CharacterCards.jsx'
import { fetchCharacters } from './services/api.js'
import { parseKi } from './utils/kiParser.js'

function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}

export default function App() {
  const [name, setName] = useState('')
  const [kiMin, setKiMin] = useState('')
  const [kiMax, setKiMax] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState({ items: [], meta: { page: 1, total: 0, limit: 50 }, source: 'live' })

  const debouncedName = useDebounced(name, 350)
  const limit = 12 // client page size; we pass it to fetch so fallback paginates too

  // re-run fetch when name or page changes
  useEffect(() => {
    let ignore = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const out = await fetchCharacters({ name: debouncedName, page, limit })
        if (!ignore) {
          setData(out)
          // show a soft banner if we’re on the fallback
          if (out.source === 'fallback') {
            setError('Live API unavailable — showing offline dataset.')
          }
        }
      } catch (e) {
        if (!ignore) setError(e.message || 'Failed to load characters')
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [debouncedName, page])

  // Whenever filters change, reset to page 1 (so users see results)
  useEffect(() => { setPage(1) }, [debouncedName, kiMin, kiMax])

  const base = data.allItems ?? data.items; // use full list in fallback, page slice in live

  // Apply KI range filter on whatever items we currently have (live or fallback)
  const kiFiltered = useMemo(() => {
    // base = data.allItems ?? data.items (as you already have)
    const base = data.allItems ?? data.items;
  
    const rawLo = kiMin.trim();
    const rawHi = kiMax.trim();
  
    const parsedLo = rawLo ? parseKi(rawLo) : -Infinity;
    const parsedHi = rawHi ? parseKi(rawHi) : Infinity;
  
    const loValid = rawLo ? !Number.isNaN(parsedLo) : false;
    const hiValid = rawHi ? !Number.isNaN(parsedHi) : false;
  
    const anyValidBound = loValid || hiValid;
  
    // If no valid numeric bounds were provided, DON'T apply KI filtering at all.
    if (!anyValidBound) return base;
  
    // If only one side is valid, use the other as open bound.
    const lo = loValid ? parsedLo : -Infinity;
    const hi = hiValid ? parsedHi : Infinity;
  
    return base.filter(c => {
      const k = parseKi(c.ki);
      if (Number.isNaN(k)) return false;        // exclude Unknown/Unmeasurable only when a valid filter is active
      return k >= lo && k <= hi;
    });
  }, [data.allItems, data.items, kiMin, kiMax, parseKi]);

  const shouldClientPaginate = data.source === 'fallback' || (kiMin.trim() || kiMax.trim());
  const total = shouldClientPaginate ? kiFiltered.length : (data.meta?.total ?? kiFiltered.length);
  const start = (page - 1) * limit;
  const end = start + limit;
  const visible = shouldClientPaginate ? kiFiltered.slice(start, end) : kiFiltered;

  return (
    <div className="container">
      <header>
        <h1>Dragon Ball - Character Search</h1>
        <p className="hint">Type a name and/or set a KI range. Tries live API, falls back if needed.</p>
      </header>

      <section className="search">
        <div className="field">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Goku, Buu, Freeza…"
          />
        </div>

        <div className="field">
          <label>Base ki (min)</label>
          <input
            type="text"
            value={kiMin}
            onChange={(e) => setKiMin(e.target.value)}
            placeholder="min"
          />
        </div>

        <div className="text">
          <label>Base ki (max)</label>
          <input
            type="number"
            value={kiMax}
            onChange={(e) => setKiMax(e.target.value)}
            placeholder="max"
          />
        </div>

        <button
          className="clear"
          onClick={() => { setName(''); setKiMin(''); setKiMax(''); setPage(1); }}
        >
          Clear
        </button>
      </section>

      {error && <div className="error">⚠️ {error}</div>}
      {loading && <div className="loading">Loading…</div>}

      {!loading && (
        <>
          <p className="meta">
            Source: <strong>{data.source}</strong> • Showing <strong>{visible.length}</strong> of <strong>{total}</strong> matches{(kiMin || kiMax) && ' (KI filtered)'}
          </p>

          <div className="grid">
            {visible.map(c => <CharacterCard key={c.id ?? c.name} c={c} />)}
          </div>

          <div className="pager">
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
              ← Prev
            </button>
            <span>Page {page}</span>
            <button
              disabled={page * limit >= total}
              onClick={() => setPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
