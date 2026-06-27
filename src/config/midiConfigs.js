import { drumConfig } from './drumConfig';

function buildMap(overrides) {
  const base = Object.fromEntries(
    drumConfig.map(d => [d.midiNote, d.id])
  );
  return { ...base, ...overrides };
}

export const midiConfigs = [
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

export function getNoteMap(configId) {
  const c = midiConfigs.find(m => m.id === configId) || midiConfigs[0];
  return c.noteMap;
}
