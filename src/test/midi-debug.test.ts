import { describe, it, expect } from 'vitest';

describe('MIDI parsing debug', () => {
  it('byte values are correct', () => {
    const data = new Uint8Array([0x90, 0x36, 0x7f]);
    expect(data[0]).toBe(0x90); // 144
    expect(data[1]).toBe(0x36); // 54 (kick in GM)
    expect(data[2]).toBe(0x7f); // 127
  });

  it('object lookup with hex keys', () => {
    const map: Record<number, string> = {
      0x36: 'kick',
      0x26: 'snare',
    };
    expect(map[0x36]).toBe('kick');
    expect(map[54]).toBe('kick');
    expect(map[0x26]).toBe('snare');
  });
});
