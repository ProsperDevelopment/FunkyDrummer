import { describe, it, expect } from 'vitest';
import { drumConfig, drumMap, midiNoteToDrum, keyToDrum } from './drumConfig';

describe('drumConfig', () => {
  it('has a non-empty set of drums', () => {
    expect(drumConfig.length).toBeGreaterThan(0);
  });

  it('has unique drum ids', () => {
    const ids = drumConfig.map(d => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has unique keyboard keys and midi notes', () => {
    const keys = drumConfig.map(d => d.key);
    const notes = drumConfig.map(d => d.midiNote);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(notes).size).toBe(notes.length);
  });

  it('exposes a drumMap keyed by id', () => {
    for (const d of drumConfig) {
      expect(drumMap[d.id]).toBe(d);
    }
  });

  it('exposes midiNoteToDrum and keyToDrum reverse maps', () => {
    for (const d of drumConfig) {
      expect(midiNoteToDrum[d.midiNote]).toBe(d.id);
      expect(keyToDrum[d.key]).toBe(d.id);
    }
  });
});
