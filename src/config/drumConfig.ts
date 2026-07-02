import type { DrumDef } from '../types';

export const drumConfig: DrumDef[] = [
  { id: 'kick',     name: 'Kick',        midiNote: 36, key: 'a', color: '#e74c3c' },
  { id: 'snare',    name: 'Snare',       midiNote: 38, key: 's', color: '#3498db' },
  { id: 'hihat',    name: 'Hi-Hat',      midiNote: 42, key: 'd', color: '#f1c40f' },
  { id: 'hihatOpen', name: 'Hi-Hat Open', midiNote: 46, key: 'f', color: '#f39c12' },
  { id: 'hihatEdge', name: 'Hi-Hat Edge', midiNote: 22, key: 'x', color: '#e8c87a' },
  { id: 'hihatMute', name: 'Hi-Hat Mute', midiNote: 44, key: 'z', color: '#c8a84a' },
  { id: 'crash',    name: 'Crash',       midiNote: 49, key: 'g', color: '#9b59b6' },
  { id: 'ride',     name: 'Ride',        midiNote: 51, key: 'h', color: '#1abc9c' },
  { id: 'tomHi',    name: 'Hi Tom',      midiNote: 48, key: 'j', color: '#2ecc71' },
  { id: 'tomMid',   name: 'Mid Tom',     midiNote: 45, key: 'k', color: '#27ae60' },
  { id: 'tomLo',    name: 'Floor Tom',   midiNote: 43, key: 'l', color: '#e67e22' },
];

export const drumMap: Record<string, DrumDef> = Object.fromEntries(
  drumConfig.map(d => [d.id, d])
);

export const midiNoteToDrum: Record<number, string> = Object.fromEntries(
  drumConfig.map(d => [d.midiNote, d.id])
);

export const keyToDrum: Record<string, string> = Object.fromEntries(
  drumConfig.map(d => [d.key, d.id])
);
