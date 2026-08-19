import { describe, it, expect } from 'vitest';
import { drumLayouts, getLayoutById } from './drumLayouts';
import { drumConfig } from './drumConfig';

const drumIds = new Set(drumConfig.map(d => d.id));

describe('drumLayouts', () => {
  it('has at least one layout', () => {
    expect(drumLayouts.length).toBeGreaterThan(0);
  });

  it('has unique layout ids', () => {
    const ids = drumLayouts.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every layout positions reference known drums', () => {
    for (const l of drumLayouts) {
      for (const pos of l.positions) {
        expect(drumIds.has(pos.id), `${l.id}.${pos.id}`).toBe(true);
        for (const g of pos.group || []) {
          expect(drumIds.has(g), `${l.id}.${pos.id}.group.${g}`).toBe(true);
        }
      }
    }
  });

  it('positions are within the viewport', () => {
    for (const l of drumLayouts) {
      for (const pos of l.positions) {
        expect(pos.cx, `${l.id}.${pos.id}`).toBeGreaterThan(0);
        expect(pos.cy, `${l.id}.${pos.id}`).toBeGreaterThan(0);
        expect(pos.r, `${l.id}.${pos.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('getLayoutById falls back to the default layout', () => {
    expect(getLayoutById('does-not-exist')).toBe(drumLayouts[0]);
  });
});
