import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlayback } from './usePlayback';
import { drumPatterns } from '../data/drumPatterns';

vi.mock('../audio/drumSounds', () => ({
  playDrum: vi.fn(),
  playMetronomeClick: vi.fn(),
}));

const pattern = drumPatterns.find(p => p.id === 'funk') || drumPatterns[0];

describe('usePlayback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts stopped', () => {
    const { result } = renderHook(() => usePlayback(pattern, null));
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isCountdown).toBe(false);
  });

  it('toggles play state', () => {
    const { result } = renderHook(() => usePlayback(pattern, null, 0, undefined, false, true, false, false));
    act(() => result.current.togglePlay());
    expect(result.current.isPlaying).toBe(true);
    act(() => result.current.togglePlay());
    expect(result.current.isPlaying).toBe(false);
  });

  it('advances the step while playing', () => {
    const { result } = renderHook(() => usePlayback(pattern, null));
    act(() => result.current.play());
    expect(result.current.currentStep).toBe(0);

    const intervalMs = (60 / pattern.bpm) * 1000 / 4;
    act(() => { vi.advanceTimersByTime(intervalMs); });
    expect(result.current.currentStep).toBe(1);
    act(() => { vi.advanceTimersByTime(intervalMs); });
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.stop());
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentStep).toBe(0);
  });

  it('does not restart the pattern when bpm changes mid-playback', () => {
    const { result, rerender } = renderHook(
      ({ bpm }: { bpm: number | null }) => usePlayback(pattern, bpm, 0, undefined, false, true, false, false),
      { initialProps: { bpm: null } as { bpm: number | null } }
    );
    act(() => result.current.play());
    const intervalMs = (60 / pattern.bpm) * 1000 / 4;
    act(() => { vi.advanceTimersByTime(intervalMs * 4); });
    expect(result.current.currentStep).toBe(4);

    rerender({ bpm: pattern.bpm + 20 });
    expect(result.current.currentStep).toBe(4);

    const newInterval = (60 / (pattern.bpm + 20)) * 1000 / 4;
    act(() => { vi.advanceTimersByTime(newInterval); });
    expect(result.current.currentStep).toBe(5);
  });

  it('runs a countdown before starting when enabled', () => {
    const { result } = renderHook(() => usePlayback(pattern, null, 0, undefined, false, true, true, false));
    act(() => result.current.play());
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isCountdown).toBe(true);

    const intervalMs = (60 / pattern.bpm) * 1000 / 4;
    act(() => { vi.advanceTimersByTime(intervalMs * 16); });
    expect(result.current.isCountdown).toBe(false);
    expect(result.current.isPlaying).toBe(true);
  });

  it('keeps countdown state separate from play state', () => {
    const { result } = renderHook(() => usePlayback(pattern, null, 0, undefined, false, true, true, false));
    act(() => result.current.play());
    expect(result.current.isCountdown).toBe(true);
    act(() => result.current.togglePlay());
    expect(result.current.isCountdown).toBe(false);
    expect(result.current.isPlaying).toBe(false);
  });
});
