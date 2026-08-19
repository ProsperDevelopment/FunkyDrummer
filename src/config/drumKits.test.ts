import { describe, it, expect } from 'vitest';
import { drumKits } from './drumKits';

describe('drumKits', () => {
  it('has at least one kit', () => {
    expect(drumKits.length).toBeGreaterThan(0);
  });

  it('has unique kit ids', () => {
    const ids = drumKits.map(k => k.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every kit has a name', () => {
    for (const k of drumKits) {
      expect(k.name.length).toBeGreaterThan(0);
    }
  });

  it('sample kits define samples for the core drum ids', () => {
    const coreIds = ['kick', 'snare', 'hihat', 'hihatOpen', 'crash', 'ride'];
    for (const k of drumKits) {
      if (k.type !== 'samples') continue;
      for (const id of coreIds) {
        expect(k.samples?.[id], `${k.id}.${id}`).toBeTruthy();
      }
    }
  });

  it('sample kit urls point at audio assets', () => {
    for (const k of drumKits) {
      if (k.type !== 'samples') continue;
      for (const url of Object.values(k.samples)) {
        expect(url, `${k.id}`).toMatch(/\.wav$/);
      }
    }
  });
});
