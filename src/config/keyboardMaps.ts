export interface KeyboardMap {
  id: string;
  name: string;
  description: string;
  keys: Record<string, { drumId: string; velocity?: number }>;
}

// Velocity modifiers
export const VELOCITY_SOFT = 0.4;
export const VELOCITY_NORMAL = 0.8;
export const VELOCITY_HARD = 1.0;

// Default layout: left hand on bass drums, right hand on cymbals/toms
// Mirrors a real drum kit layout from drummer's perspective
export const keyboardMaps: KeyboardMap[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Left hand: bass drums, Right hand: cymbals & toms',
    keys: {
      // Left hand - bass drums & snare
      'a': { drumId: 'kick', velocity: VELOCITY_HARD },
      's': { drumId: 'snare', velocity: VELOCITY_NORMAL },
      'd': { drumId: 'hihat', velocity: VELOCITY_NORMAL },
      'f': { drumId: 'hihatOpen', velocity: VELOCITY_NORMAL },
      'z': { drumId: 'hihatMute', velocity: VELOCITY_SOFT },
      'x': { drumId: 'hihatEdge', velocity: VELOCITY_NORMAL },

      // Right hand - cymbals & toms
      'g': { drumId: 'crash', velocity: VELOCITY_HARD },
      'h': { drumId: 'ride', velocity: VELOCITY_NORMAL },
      'j': { drumId: 'tomHi', velocity: VELOCITY_NORMAL },
      'k': { drumId: 'tomMid', velocity: VELOCITY_NORMAL },
      'l': { drumId: 'tomLo', velocity: VELOCITY_NORMAL },
    },
  },
  {
    id: 'qwerty',
    name: 'QWERTY Layout',
    description: 'Top row: cymbals, Bottom row: drums',
    keys: {
      // Top row - cymbals & ride
      'q': { drumId: 'crash', velocity: VELOCITY_HARD },
      'w': { drumId: 'ride', velocity: VELOCITY_NORMAL },
      'e': { drumId: 'hihatOpen', velocity: VELOCITY_NORMAL },
      'r': { drumId: 'hihat', velocity: VELOCITY_NORMAL },

      // Bottom row - drums
      'a': { drumId: 'kick', velocity: VELOCITY_HARD },
      's': { drumId: 'snare', velocity: VELOCITY_NORMAL },
      'd': { drumId: 'tomHi', velocity: VELOCITY_NORMAL },
      'f': { drumId: 'tomMid', velocity: VELOCITY_NORMAL },
      'g': { drumId: 'tomLo', velocity: VELOCITY_NORMAL },

      // Extras
      'z': { drumId: 'hihatMute', velocity: VELOCITY_SOFT },
      'x': { drumId: 'hihatEdge', velocity: VELOCITY_NORMAL },
    },
  },
  {
    id: 'two-hands',
    name: 'Two-Handed',
    description: 'Split between hands like a real kit',
    keys: {
      // Left hand (hi-hat side)
      'a': { drumId: 'hihat', velocity: VELOCITY_NORMAL },
      's': { drumId: 'hihatOpen', velocity: VELOCITY_NORMAL },
      'd': { drumId: 'hihatEdge', velocity: VELOCITY_NORMAL },
      'f': { drumId: 'hihatMute', velocity: VELOCITY_SOFT },
      'q': { drumId: 'crash', velocity: VELOCITY_HARD },

      // Right hand (ride side)
      'j': { drumId: 'ride', velocity: VELOCITY_NORMAL },
      'k': { drumId: 'tomHi', velocity: VELOCITY_NORMAL },
      'l': { drumId: 'tomMid', velocity: VELOCITY_NORMAL },
      ';': { drumId: 'tomLo', velocity: VELOCITY_NORMAL },

      // Center - kick & snare
      'g': { drumId: 'kick', velocity: VELOCITY_HARD },
      'h': { drumId: 'snare', velocity: VELOCITY_NORMAL },
    },
  },
  {
    id: 'eight-pad',
    name: '8-Pad Controller',
    description: 'Maps to 8 pad controller layout',
    keys: {
      // Pad 1-4 (top row)
      'q': { drumId: 'kick', velocity: VELOCITY_HARD },
      'w': { drumId: 'snare', velocity: VELOCITY_NORMAL },
      'e': { drumId: 'hihat', velocity: VELOCITY_NORMAL },
      'r': { drumId: 'hihatOpen', velocity: VELOCITY_NORMAL },

      // Pad 5-8 (bottom row)
      'a': { drumId: 'tomHi', velocity: VELOCITY_NORMAL },
      's': { drumId: 'tomMid', velocity: VELOCITY_NORMAL },
      'd': { drumId: 'crash', velocity: VELOCITY_HARD },
      'f': { drumId: 'ride', velocity: VELOCITY_NORMAL },

      // Extras
      'z': { drumId: 'hihatMute', velocity: VELOCITY_SOFT },
      'x': { drumId: 'hihatEdge', velocity: VELOCITY_NORMAL },
    },
  },
];

export function getKeyboardMap(id: string): KeyboardMap {
  return keyboardMaps.find(m => m.id === id) || keyboardMaps[0];
}
