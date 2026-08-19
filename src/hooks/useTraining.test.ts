import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTraining } from './useTraining';
import { drumPatterns } from '../data/drumPatterns';
import type { DrumPattern } from '../types';

const pattern = drumPatterns.find(p => p.id === 'funk') || drumPatterns[0];

function makePattern(): DrumPattern {
  return {
    ...pattern,
    grid: {
      kick: new Array(pattern.measures * 16).fill(0).map((_, i) => (i % 16 === 0 ? 1 : 0)),
      snare: new Array(pattern.measures * 16).fill(0).map((_, i) => (i % 16 === 4 ? 1 : 0)),
    },
  };
}

describe('useTraining', () => {
  beforeEach(() => {
    // ensure the pattern's grid is a plain object we can read
  });

  it('starts with zero stats', () => {
    const { result } = renderHook(() => useTraining(makePattern(), 0, false));
    expect(result.current.trainingMode).toBe(false);
    expect(result.current.missedHits).toBe(0);
    expect(result.current.accuracyStats).toBeNull();
  });

  it('enables training mode', () => {
    const { result } = renderHook(() => useTraining(makePattern(), 0, false));
    act(() => result.current.setTrainingMode(true));
    expect(result.current.trainingMode).toBe(true);
  });

  it('counts a perfect hit', () => {
    const { result } = renderHook(() => useTraining(makePattern(), 0, true));
    act(() => result.current.setTrainingMode(true));
    act(() => result.current.handleDrumHit('kick'));
    expect(result.current.accuracyStats?.perfect).toBe(1);
    expect(result.current.accuracyStats?.score).toBeGreaterThan(0);
  });

  it('counts an off-pattern drum as a miss', () => {
    const { result } = renderHook(() => useTraining(makePattern(), 0, true));
    act(() => result.current.setTrainingMode(true));
    act(() => result.current.handleDrumHit('crash'));
    expect(result.current.accuracyStats?.miss).toBe(1);
  });

  it('counts missed hits once per pattern loop', () => {
    const p = makePattern();
    const steps = p.measures * 16;
    const { result, rerender } = renderHook(
      ({ step, playing }) => useTraining(p, step, playing),
      { initialProps: { step: 0, playing: true } }
    );
    act(() => result.current.setTrainingMode(true));

    for (let s = 1; s <= steps; s++) {
      rerender({ step: s, playing: true });
    }
    const firstLoopMisses = result.current.missedHits;
    expect(firstLoopMisses).toBeGreaterThan(0);

    for (let s = steps + 1; s <= steps * 2; s++) {
      rerender({ step: s, playing: true });
    }
    const secondLoopMisses = result.current.missedHits;
    expect(secondLoopMisses).toBeGreaterThanOrEqual(firstLoopMisses * 2);
  });

  it('clears hits when disabled', () => {
    const { result } = renderHook(() => useTraining(makePattern(), 0, true));
    act(() => result.current.setTrainingMode(true));
    act(() => result.current.handleDrumHit('kick'));
    expect(result.current.userHits.length).toBeGreaterThan(0);
    act(() => result.current.setTrainingMode(false));
    expect(result.current.userHits.length).toBe(0);
    expect(result.current.accuracyStats).toBeNull();
  });
});
