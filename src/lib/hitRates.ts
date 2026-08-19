const STORAGE_KEY = 'funky-drummer-hit-rates';

interface HitRateData {
  totalSessions: number;
  totalHits: number;
  totalPerfect: number;
  totalGood: number;
  avgHitRate: number; // (perfect + good) / total
}

export function getHitRate(id: string): HitRateData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data[id] || null;
  } catch {
    return null;
  }
}

export function saveHitRate(id: string, perfect: number, good: number, miss: number, off: number): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, HitRateData> = raw ? JSON.parse(raw) : {};
    const prev = data[id];
    const totalHits = perfect + good + off + miss;

    if (prev) {
      const newTotal = prev.totalHits + totalHits;
      const newPerfect = prev.totalPerfect + perfect;
      const newGood = prev.totalGood + good;
      prev.totalSessions++;
      prev.totalHits = newTotal;
      prev.totalPerfect = newPerfect;
      prev.totalGood = newGood;
      prev.avgHitRate = newTotal > 0 ? (newPerfect + newGood) / newTotal : 0;
    } else {
      data[id] = {
        totalSessions: 1,
        totalHits: totalHits,
        totalPerfect: perfect,
        totalGood: good,
        avgHitRate: totalHits > 0 ? (perfect + good) / totalHits : 0,
      };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable or full — silently ignore
  }
}
