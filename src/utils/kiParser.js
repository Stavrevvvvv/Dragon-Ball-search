export function parseKi(ki) {
    if (typeof ki === 'number') return ki;
  
    const lower = ki.toLowerCase().trim();
  
    if (lower.includes('million')) {
      return parseFloat(lower) * 1_000_000;
    }
    if (lower.includes('quintillion')) {
      return parseFloat(lower) * 1_000_000_000_000_000_000; // 1 quintillion = 1e18
    }
    if (lower.includes('infinity')) {
      return Number.POSITIVE_INFINITY;
    }
    if (lower.includes('unknown') || lower.includes('unmeasurable')) {
      return NaN; // will be excluded from numeric filters
    }
  
    // fallback: try to parse as plain number
    const numeric = Number(ki);
    return isNaN(numeric) ? NaN : numeric;
  }
  