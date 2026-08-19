import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTrackPlayback } from './useTrackPlayback';
import { trackList } from '../data/trackList';
import { drumPatterns } from '../data/drumPatterns';

vi.mock('../audio/drumSounds', () => ({
  playDrum: vi.fn(),
  playMetronomeClick: vi.fn(),
}));

const track = trackList[0];

describe('useTrackPlayback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts stopped with the first pattern visible', () => {
    const { result } = renderHook(() => useTrackPlayback(track));
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentPattern).not.toBeNull();
    expect(result.current.currentPartIndex).toBe(0);
  });

  it('plays and advances steps', () => {
    const { result } = renderHook(() => useTrackPlayback(track, undefined, false, true, null, false, false));
    act(() => result.current.play());
    expect(result.current.isPlaying).toBe(true);

    const intervalMs = (60 / track.bpm) * 1000 / 4;
    act(() => { vi.advanceTimersByTime(intervalMs * 4); });
    expect(result.current.currentStep).toBe(4);

    act(() => result.current.stop());
    expect(result.current.isPlaying).toBe(false);
  });

  it('restores the first pattern when stopped', () => {
    const { result } = renderHook(() => useTrackPlayback(track));
    act(() => result.current.play());
    const intervalMs = (60 / track.bpm) * 1000 / 4;
    act(() => { vi.advanceTimersByTime(intervalMs * 8); });
    act(() => result.current.stop());
    expect(result.current.currentPattern).not.toBeNull();
    expect(result.current.currentPartIndex).toBe(0);
  });

  it('advances parts after repeats complete', () => {
    const multiTrack = trackList.find(t => t.parts.length > 1) || track;
    const { result } = renderHook(() => useTrackPlayback(multiTrack, undefined, false, true, null, false, false));
    act(() => result.current.play());

    const firstPart = multiTrack.parts[0];
    const stepsPerRepeat = (drumPatterns.find(p => p.id === firstPart.patternId)?.measures ?? 2) * 16;
    const intervalMs = (60 / multiTrack.bpm) * 1000 / 4;

    for (let r = 0; r < firstPart.repeats; r++) {
      act(() => { vi.advanceTimersByTime(intervalMs * stepsPerRepeat); });
    }

    expect(result.current.currentPartIndex).toBe(1);
  });

  it('does not restart the part when bpm changes mid-playback', () => {
    const { result, rerender } = renderHook(
      ({ bpm }: { bpm: number | null }) => useTrackPlayback(track, undefined, false, true, bpm, false, false),
      { initialProps: { bpm: null } as { bpm: number | null } }
    );
    act(() => result.current.play());
    const intervalMs = (60 / track.bpm) * 1000 / 4;
    act(() => { vi.advanceTimersByTime(intervalMs * 4); });
    expect(result.current.currentStep).toBe(4);

    rerender({ bpm: track.bpm + 30 });
    expect(result.current.currentStep).toBe(4);

    const newInterval = (60 / (track.bpm + 30)) * 1000 / 4;
    act(() => { vi.advanceTimersByTime(newInterval); });
    expect(result.current.currentStep).toBe(5);
  });

  it('runs countdown before playing when enabled', () => {
    const { result } = renderHook(() => useTrackPlayback(track, undefined, false, true, null, true, false));
    act(() => result.current.play());
    expect(result.current.isCountdown).toBe(true);
    expect(result.current.isPlaying).toBe(false);

    const intervalMs = (60 / track.bpm) * 1000 / 4;
    act(() => { vi.advanceTimersByTime(intervalMs * 16); });
    expect(result.current.isCountdown).toBe(false);
    expect(result.current.isPlaying).toBe(true);
  });
});
