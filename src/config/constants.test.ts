import { describe, it, expect } from 'vitest';
import { STEPS_PER_MEASURE, BPM_MIN, BPM_MAX, REPS_MIN, REPS_MAX, COUNT_IN_BEATS, TRAINING_HIT_TOLERANCE, PEDAL_CC, PEDAL_THRESHOLD } from './constants';

describe('constants', () => {
  it('defines sane tempo bounds', () => {
    expect(BPM_MIN).toBeLessThan(BPM_MAX);
    expect(BPM_MIN).toBeGreaterThan(0);
  });

  it('defines sane reps bounds', () => {
    expect(REPS_MIN).toBeLessThan(REPS_MAX);
    expect(REPS_MIN).toBeGreaterThan(0);
  });

  it('uses 16 steps per measure', () => {
    expect(STEPS_PER_MEASURE).toBe(16);
  });

  it('defines a count-in longer than a single beat', () => {
    expect(COUNT_IN_BEATS).toBeGreaterThan(4);
  });

  it('has a strict hit tolerance', () => {
    expect(TRAINING_HIT_TOLERANCE).toBeGreaterThan(0);
  });

  it('maps the hihat pedal to a CC with a threshold', () => {
    expect(PEDAL_CC).toBeGreaterThan(0);
    expect(PEDAL_THRESHOLD).toBeGreaterThan(0);
    expect(PEDAL_THRESHOLD).toBeLessThanOrEqual(127);
  });
});
