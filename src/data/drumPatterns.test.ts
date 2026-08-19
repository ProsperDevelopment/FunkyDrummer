import { describe, it, expect } from 'vitest';
import { drumPatterns } from './drumPatterns';
import { STEPS_PER_MEASURE } from '../config/constants';

describe('drumPatterns', () => {
  it('has at least one pattern', () => {
    expect(drumPatterns.length).toBeGreaterThan(0);
  });

  it('has unique ids', () => {
    const ids = drumPatterns.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every pattern has a valid bpm', () => {
    for (const p of drumPatterns) {
      expect(p.bpm, p.id).toBeGreaterThan(0);
      expect(p.bpm, p.id).toBeLessThanOrEqual(400);
    }
  });

  it('every pattern has a groove array of 16 entries', () => {
    for (const p of drumPatterns) {
      expect(p.groove, p.id).toHaveLength(16);
      for (const g of p.groove) {
        expect(Number.isFinite(g), p.id).toBe(true);
      }
    }
  });

  it('every pattern has grid rows whose length matches measures * steps-per-measure', () => {
    for (const p of drumPatterns) {
      const expectedLen = p.measures * STEPS_PER_MEASURE;
      for (const [drumId, row] of Object.entries(p.grid)) {
        expect(row, `${p.id}.${drumId}`).toHaveLength(expectedLen);
      }
    }
  });

  it('every pattern grid references known drum ids', () => {
    const knownIds = new Set(['kick', 'snare', 'hihat', 'hihatOpen', 'hihatEdge', 'hihatMute', 'crash', 'ride', 'tomHi', 'tomMid', 'tomLo']);
    for (const p of drumPatterns) {
      for (const drumId of Object.keys(p.grid)) {
        expect(knownIds.has(drumId), `${p.id}.${drumId}`).toBe(true);
      }
    }
  });

  it('every non-edge pattern has at least one scheduled hit', () => {
    for (const p of drumPatterns) {
      if (p.id.endsWith('-edge')) continue;
      const totalHits = Object.values(p.grid).reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0), 0);
      expect(totalHits, p.id).toBeGreaterThan(0);
    }
  });

  it('every pattern has a name and description', () => {
    for (const p of drumPatterns) {
      expect(p.name?.length ?? 0, p.id).toBeGreaterThan(0);
      expect(p.desc?.length ?? 0, p.id).toBeGreaterThan(0);
    }
  });
});
