import { describe, it, expect } from 'vitest';
import { trackList } from './trackList';
import { drumPatterns } from './drumPatterns';

const patternIds = new Set(drumPatterns.map(p => p.id));

describe('trackList', () => {
  it('has at least one track', () => {
    expect(trackList.length).toBeGreaterThan(0);
  });

  it('has unique track ids', () => {
    const ids = trackList.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every track references existing patterns', () => {
    for (const t of trackList) {
      for (const part of t.parts) {
        expect(patternIds.has(part.patternId), `${t.id}.${part.patternId}`).toBe(true);
      }
    }
  });

  it('every track has at least one part with a positive repeat count', () => {
    for (const t of trackList) {
      expect(t.parts.length, t.id).toBeGreaterThan(0);
      for (const part of t.parts) {
        expect(part.repeats, `${t.id}.${part.patternId}`).toBeGreaterThan(0);
      }
    }
  });

  it('every track has a valid bpm', () => {
    for (const t of trackList) {
      expect(t.bpm, t.id).toBeGreaterThan(0);
    }
  });
});
