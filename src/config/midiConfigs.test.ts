import { describe, it, expect } from 'vitest';
import { midiConfigs, getNoteMap } from './midiConfigs';
import { drumConfig } from './drumConfig';

const drumIds = new Set(drumConfig.map(d => d.id));

describe('midiConfigs', () => {
  it('has at least one config', () => {
    expect(midiConfigs.length).toBeGreaterThan(0);
  });

  it('has unique config ids', () => {
    const ids = midiConfigs.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('note maps only reference known drums or null', () => {
    for (const c of midiConfigs) {
      for (const [note, drumId] of Object.entries(c.noteMap)) {
        expect(Number.isInteger(Number(note)), `${c.id}.${note}`).toBe(true);
        if (drumId !== null) {
          expect(drumIds.has(drumId), `${c.id}.${note}->${drumId}`).toBe(true);
        }
      }
    }
  });

  it('getNoteMap falls back to the default config', () => {
    expect(getNoteMap('does-not-exist')).toBe(midiConfigs[0].noteMap);
  });
});
