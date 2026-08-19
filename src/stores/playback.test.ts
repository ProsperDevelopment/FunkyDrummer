import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { playback } from './playback.svelte';
import { drumPatterns } from '../data/drumPatterns';

vi.mock('../audio/drumSounds', () => ({
  playDrum: vi.fn(),
  playMetronomeClick: vi.fn(),
}));

const pattern = drumPatterns.find(p => p.id === 'funk') || drumPatterns[0];

describe('playback store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    playback.stop();
    playback.setPattern(pattern);
    playback.setBpm(null);
    playback.setStopAfter(0);
    playback.setMetronome(false);
    playback.setDrumPlayback(true);
    playback.setCountdown(false);
    playback.setGroove(false);
    playback.clearRepsComplete();
  });

  afterEach(() => {
    vi.useRealTimers();
    playback.stop();
  });

  it('starts stopped', () => {
    expect(playback.isPlaying).toBe(false);
    expect(playback.isCountdown).toBe(false);
  });

  it('toggles play state', () => {
    playback.togglePlay();
    expect(playback.isPlaying).toBe(true);
    playback.togglePlay();
    expect(playback.isPlaying).toBe(false);
  });

  it('advances the step while playing', () => {
    playback.play();
    expect(playback.currentStep).toBe(0);

    const intervalMs = (60 / pattern.bpm) * 1000 / 4;
    vi.advanceTimersByTime(intervalMs);
    expect(playback.currentStep).toBe(1);
    vi.advanceTimersByTime(intervalMs);
    expect(playback.currentStep).toBe(2);

    playback.stop();
    expect(playback.isPlaying).toBe(false);
    expect(playback.currentStep).toBe(0);
  });

  it('does not restart the pattern when bpm changes mid-playback', () => {
    playback.play();
    const intervalMs = (60 / pattern.bpm) * 1000 / 4;
    vi.advanceTimersByTime(intervalMs * 4);
    expect(playback.currentStep).toBe(4);

    playback.setBpm(pattern.bpm + 20);
    expect(playback.currentStep).toBe(4);

    const newInterval = (60 / (pattern.bpm + 20)) * 1000 / 4;
    vi.advanceTimersByTime(newInterval);
    expect(playback.currentStep).toBe(5);
  });

  it('runs a countdown before starting when enabled', () => {
    playback.setCountdown(true);
    playback.play();
    expect(playback.isPlaying).toBe(false);
    expect(playback.isCountdown).toBe(true);

    const intervalMs = (60 / pattern.bpm) * 1000 / 4;
    vi.advanceTimersByTime(intervalMs * 16);
    expect(playback.isCountdown).toBe(false);
    expect(playback.isPlaying).toBe(true);
  });

  it('keeps countdown state separate from play state', () => {
    playback.setCountdown(true);
    playback.play();
    expect(playback.isCountdown).toBe(true);
    playback.togglePlay();
    expect(playback.isCountdown).toBe(false);
    expect(playback.isPlaying).toBe(false);
  });
});
