import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { training } from './training.svelte';
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

describe('training store', () => {
  beforeEach(() => {
    training.setTrainingMode(false);
    training.clearHits();
    training.setPattern(makePattern());
    training.setPlaying(false);
  });

  afterEach(() => {
    training.setTrainingMode(false);
  });

  it('starts with zero stats', () => {
    expect(training.trainingMode).toBe(false);
    expect(training.missedHits).toBe(0);
    expect(training.accuracyStats).toBeNull();
  });

  it('enables training mode', () => {
    training.setTrainingMode(true);
    expect(training.trainingMode).toBe(true);
  });

  it('counts a perfect hit', () => {
    training.setPlaying(true);
    training.setTrainingMode(true);
    training.handleDrumHit('kick');
    expect(training.accuracyStats?.perfect).toBe(1);
    expect(training.accuracyStats?.score).toBeGreaterThan(0);
  });

  it('counts an off-pattern drum as a miss', () => {
    training.setPlaying(true);
    training.setTrainingMode(true);
    training.handleDrumHit('crash');
    expect(training.accuracyStats?.miss).toBe(1);
  });

  it('counts missed hits once per pattern loop', () => {
    const p = makePattern();
    const steps = p.measures * 16;
    training.setPattern(p);
    training.setPlaying(true);
    training.setTrainingMode(true);

    for (let s = 1; s <= steps; s++) {
      training.setCurrentStep(s);
    }
    const firstLoopMisses = training.missedHits;
    expect(firstLoopMisses).toBeGreaterThan(0);

    for (let s = steps + 1; s <= steps * 2; s++) {
      training.setCurrentStep(s);
    }
    const secondLoopMisses = training.missedHits;
    expect(secondLoopMisses).toBeGreaterThanOrEqual(firstLoopMisses * 2);
  });

  it('clears hits when disabled', () => {
    training.setPlaying(true);
    training.setTrainingMode(true);
    training.handleDrumHit('kick');
    expect(training.userHits.length).toBeGreaterThan(0);
    training.setTrainingMode(false);
    expect(training.userHits.length).toBe(0);
    expect(training.accuracyStats).toBeNull();
  });
});
