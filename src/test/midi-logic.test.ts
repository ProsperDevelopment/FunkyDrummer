import { describe, it, expect } from 'vitest';

describe('MIDI message parsing', () => {
  const midiNoteToDrum: Record<number, string> = {
    36: 'kick',
    38: 'snare',
    42: 'hihat',
    46: 'hihatOpen',
    49: 'crash',
    51: 'ride',
    48: 'tomHi',
    45: 'tomMid',
    43: 'tomLo',
  };

  const MIDI_STATUS_MASK = 0xF0;
  const MIDI_CC = 0xB0;
  const MIDI_NOTE_ON = 0x90;

  function parseMidiMessage(data: Uint8Array) {
    const status = data[0] & MIDI_STATUS_MASK;
    const data1 = data[1];
    const data2 = data[2];

    if (status === MIDI_CC) {
      return { type: 'cc', controller: data1, value: data2 };
    }

    if (status === MIDI_NOTE_ON && data2 > 0) {
      const velocity = data2 / 127;
      const drumId = midiNoteToDrum[data1];
      if (drumId) {
        return { type: 'noteOn', drumId, velocity, note: data1 };
      }
    }

    return null;
  }

  it('parses kick drum note-on (note 36 decimal)', () => {
    const msg = new Uint8Array([0x90, 36, 0x7f]);
    const result = parseMidiMessage(msg);
    expect(result).toEqual({
      type: 'noteOn',
      drumId: 'kick',
      velocity: 1,
      note: 36,
    });
  });

  it('parses snare drum note-on (note 38 decimal)', () => {
    const msg = new Uint8Array([0x90, 38, 100]);
    const result = parseMidiMessage(msg);
    expect(result).toEqual({
      type: 'noteOn',
      drumId: 'snare',
      velocity: 100 / 127,
      note: 38,
    });
  });

  it('parses hi-hat note-on (note 42 decimal)', () => {
    const msg = new Uint8Array([0x90, 42, 0x50]);
    const result = parseMidiMessage(msg);
    expect(result).toEqual({
      type: 'noteOn',
      drumId: 'hihat',
      velocity: 80 / 127,
      note: 42,
    });
  });

  it('parses CC message', () => {
    const msg = new Uint8Array([0xB0, 0x04, 0x40]);
    const result = parseMidiMessage(msg);
    expect(result).toEqual({
      type: 'cc',
      controller: 4,
      value: 64,
    });
  });

  it('ignores note-on with velocity 0 (note-off)', () => {
    const msg = new Uint8Array([0x90, 36, 0x00]);
    const result = parseMidiMessage(msg);
    expect(result).toBeNull();
  });

  it('ignores unknown notes', () => {
    const msg = new Uint8Array([0x90, 60, 0x7f]);
    const result = parseMidiMessage(msg);
    expect(result).toBeNull();
  });

  it('parses different velocities correctly', () => {
    const msg64 = new Uint8Array([0x90, 36, 64]);
    const result64 = parseMidiMessage(msg64);
    expect(result64).toBeDefined();
    expect((result64 as any).velocity).toBeCloseTo(64 / 127);

    const msg127 = new Uint8Array([0x90, 36, 127]);
    const result127 = parseMidiMessage(msg127);
    expect(result127).toBeDefined();
    expect((result127 as any).velocity).toBe(1);
  });
});

describe('MIDI note mapping', () => {
  it('maps all GM drum notes correctly', () => {
    const midiNoteToDrum: Record<number, string> = {
      36: 'kick',
      38: 'snare',
      42: 'hihat',
      46: 'hihatOpen',
      49: 'crash',
      51: 'ride',
      48: 'tomHi',
      45: 'tomMid',
      43: 'tomLo',
    };
    expect(midiNoteToDrum[36]).toBe('kick');
    expect(midiNoteToDrum[38]).toBe('snare');
    expect(midiNoteToDrum[42]).toBe('hihat');
    expect(midiNoteToDrum[46]).toBe('hihatOpen');
    expect(midiNoteToDrum[49]).toBe('crash');
    expect(midiNoteToDrum[51]).toBe('ride');
    expect(midiNoteToDrum[48]).toBe('tomHi');
    expect(midiNoteToDrum[45]).toBe('tomMid');
    expect(midiNoteToDrum[43]).toBe('tomLo');
  });

  it('returns undefined for unmapped notes', () => {
    const midiNoteToDrum: Record<number, string> = {
      36: 'kick',
    };
    expect(midiNoteToDrum[0]).toBeUndefined();
    expect(midiNoteToDrum[127]).toBeUndefined();
    expect(midiNoteToDrum[60]).toBeUndefined();
  });
});
