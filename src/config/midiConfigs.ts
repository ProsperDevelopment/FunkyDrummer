import type { MidiConfig } from '../types';
import { drumConfig } from './drumConfig';

function buildMap(overrides: Record<number, string | null>): Record<number, string | null> {
  const base: Record<number, string | null> = Object.fromEntries(
    drumConfig.map(d => [d.midiNote, d.id])
  );
  return { ...base, ...overrides };
}

export const midiConfigs: MidiConfig[] = [
  {
    id: 'default',
    name: 'Default (GM)',
    noteMap: buildMap({}),
  },
  {
    id: 'td-02k',
    name: 'Roland TD-02K',
    noteMap: buildMap({
      22: 'hihatEdge',
      26: 'hihatEdge',
      42: 'hihat',
      46: 'hihat',
      48: 'tomLo',
      41: null,
    }),
  },
];

export function getNoteMap(configId: string): Record<number, string | null> {
  const c = midiConfigs.find(m => m.id === configId) || midiConfigs[0];
  return c.noteMap;
}
