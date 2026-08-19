import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getActiveKit,
  getHihatPedalPressed,
  setHihatPedalPressed,
  getHihatPedalAmount,
  setHihatPedalAmount,
  setUserPressingPedal,
  setKit,
  isKitLoading,
} from './drumSounds';
import { drumKits } from '../config/drumKits';

vi.mock('./sampleLoader', () => ({
  loadSample: vi.fn(async () => ({ duration: 1 } as AudioBuffer)),
  playSampleBuffer: vi.fn(),
  getContext: vi.fn(() => ({
    state: 'running',
    resume: vi.fn(),
    currentTime: 0,
    createBufferSource: vi.fn(() => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn(), buffer: null })),
    createGain: vi.fn(() => ({
      gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn() },
      connect: vi.fn(),
    })),
    createBiquadFilter: vi.fn(() => ({
      type: '', frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      Q: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
    })),
    createOscillator: vi.fn(() => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn(), type: '', frequency: { setValueAtTime: vi.fn() } })),
    createBuffer: vi.fn(() => ({ getChannelData: vi.fn(() => new Float32Array(100)) })),
    destination: {},
    decodeAudioData: vi.fn(async () => ({ duration: 1 } as AudioBuffer)),
  })),
  getBuffer: vi.fn(() => null),
}));

describe('drumSounds', () => {
  beforeEach(() => {
    setHihatPedalPressed(false);
    setHihatPedalAmount(0);
    setUserPressingPedal(false);
  });

  it('exposes an active kit', () => {
    const kit = getActiveKit();
    expect(kit).toBeDefined();
    expect(kit.id.length).toBeGreaterThan(0);
  });

  it('tracks hihat pedal pressed state', () => {
    setHihatPedalPressed(true);
    expect(getHihatPedalPressed()).toBe(true);
    setHihatPedalPressed(false);
    expect(getHihatPedalPressed()).toBe(false);
  });

  it('maps pedal amount to pressed state at the 0.5 threshold', () => {
    setHihatPedalAmount(0.8);
    expect(getHihatPedalAmount()).toBe(0.8);
    expect(getHihatPedalPressed()).toBe(true);
    setHihatPedalAmount(0.2);
    expect(getHihatPedalAmount()).toBe(0.2);
    expect(getHihatPedalPressed()).toBe(false);
  });

  it('setKit swaps to a valid kit and stops loading', async () => {
    const synthKit = drumKits.find(k => k.id === 'stock');
    if (!synthKit) throw new Error('missing stock kit');
    await setKit(synthKit.id);
    expect(getActiveKit().id).toBe(synthKit.id);
    expect(isKitLoading()).toBe(false);
  });

  it('setKit is a no-op for an unknown kit id', async () => {
    const before = getActiveKit();
    await setKit('does-not-exist');
    expect(getActiveKit()).toBe(before);
    expect(isKitLoading()).toBe(false);
  });
});
