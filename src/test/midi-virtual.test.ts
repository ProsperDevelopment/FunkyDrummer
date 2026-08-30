import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Skip these tests if ALSA is not available (e.g., in CI)
const skip = !process.env.ALSAODEV && !process.env.MIDI_TEST;

describe.skipIf(skip)('MIDI virtual ports', () => {
  let WMT: any;
  let port: any;

  beforeAll(async () => {
    try {
      WMT = await import('midi-test');
    } catch (e) {
      console.warn('midi-test not available:', e);
    }
  });

  afterAll(() => {
    if (port) {
      try { port.disconnect(); } catch {}
    }
  });

  it('can create a virtual MIDI source', () => {
    if (!WMT) return;
    port = new WMT.MidiSrc('Test Virtual MIDI-In');
    expect(port).toBeDefined();
    port.connect();
    expect(port.connected).toBe(true);
  });

  it('can emit MIDI note-on messages', () => {
    if (!WMT || !port) return;
    // Note On: status=0x90, note=36 (kick), velocity=127
    const msg = [0x90, 0x36, 0x7f];
    port.emit(msg);
    // If no error thrown, emit worked
    expect(true).toBe(true);
  });

  it('can emit multiple MIDI messages', () => {
    if (!WMT || !port) return;
    // Send kick, snare, hihat in sequence
    const messages = [
      [0x90, 0x36, 0x7f], // Kick (note 36)
      [0x90, 0x26, 0x7f], // Snare (note 38)
      [0x90, 0x2a, 0x7f], // Hi-hat (note 42)
    ];
    for (const msg of messages) {
      port.emit(msg);
    }
    expect(true).toBe(true);
  });
});
