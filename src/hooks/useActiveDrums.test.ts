import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActiveDrums } from './useActiveDrums';

describe('useActiveDrums', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts empty', () => {
    const { result } = renderHook(() => useActiveDrums());
    expect(result.current.activeDrums.size).toBe(0);
  });

  it('lights up a drum when hit', () => {
    const { result } = renderHook(() => useActiveDrums());
    act(() => result.current.hit('kick', 0.9));
    expect(result.current.activeDrums.get('kick')).toBe(0.9);
  });

  it('clears a drum after the glow duration', () => {
    const { result } = renderHook(() => useActiveDrums());
    act(() => result.current.hit('snare', 0.5));
    act(() => { vi.advanceTimersByTime(151); });
    expect(result.current.activeDrums.has('snare')).toBe(false);
  });

  it('uses the default velocity when none given', () => {
    const { result } = renderHook(() => useActiveDrums());
    act(() => result.current.hit('kick'));
    expect(result.current.activeDrums.get('kick')).toBe(0.8);
  });
});
