import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { activeDrums } from './activeDrums.svelte';

describe('activeDrums store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    activeDrums.destroy();
  });

  afterEach(() => {
    vi.useRealTimers();
    activeDrums.destroy();
  });

  it('starts empty', () => {
    expect(activeDrums.activeDrums.size).toBe(0);
  });

  it('lights up a drum when hit', () => {
    activeDrums.hit('kick', 0.9);
    expect(activeDrums.activeDrums.get('kick')).toBe(0.9);
  });

  it('clears a drum after the glow duration', () => {
    activeDrums.hit('snare', 0.5);
    vi.advanceTimersByTime(151);
    expect(activeDrums.activeDrums.has('snare')).toBe(false);
  });

  it('uses the default velocity when none given', () => {
    activeDrums.hit('kick');
    expect(activeDrums.activeDrums.get('kick')).toBe(0.8);
  });
});
