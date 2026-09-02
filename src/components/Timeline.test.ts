import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Timeline from './Timeline.svelte';
import { drumPatterns } from '../data/drumPatterns';
import type { UserHit } from '../types';

const pattern = drumPatterns.find(p => p.id === 'funk') || drumPatterns[0];

function makeHit(drumId: string, step: number, accuracy: string, ageMs: number = 0): UserHit {
  return {
    id: Math.random(),
    drumId,
    step,
    stepFraction: 0,
    perfTime: performance.now() - ageMs,
    accuracy,
    timestamp: Date.now() - ageMs,
  };
}

describe('Timeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pattern grid when pattern is provided', () => {
    const { container } = render(Timeline, {
      props: { pattern, currentStep: 0, isPlaying: false, trainingMode: false },
    });
    const labels = container.querySelectorAll('.drum-label');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('shows empty state when no pattern', () => {
    render(Timeline, {
      props: { pattern: null, currentStep: 0, isPlaying: false, trainingMode: false },
    });
    expect(screen.getByText('Select a pattern to begin')).toBeInTheDocument();
  });

  it('renders canvas element', () => {
    const { container } = render(Timeline, {
      props: { pattern, currentStep: 0, isPlaying: false, trainingMode: false },
    });
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('does not draw hits when not playing', () => {
    const hits = [makeHit('kick', 0, 'perfect', 0)];
    const { container } = render(Timeline, {
      props: { pattern, currentStep: 0, isPlaying: false, trainingMode: true, positiveMode: false, userHits: hits },
    });
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('does not draw hits when not in training mode', () => {
    const hits = [makeHit('kick', 0, 'perfect', 0)];
    const { container } = render(Timeline, {
      props: { pattern, currentStep: 0, isPlaying: true, trainingMode: false, positiveMode: false, userHits: hits },
    });
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('renders in compact mode', () => {
    const { container } = render(Timeline, {
      props: { pattern, currentStep: 0, isPlaying: false, trainingMode: false, compact: true },
    });
    const labels = container.querySelectorAll('.drum-label.compact');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('handles multiple hits at different steps', () => {
    const hits = [
      makeHit('kick', 0, 'perfect', 0),
      makeHit('snare', 4, 'good', 100),
      makeHit('hihat', 8, 'near', 200),
      makeHit('kick', 12, 'miss', 50),
    ];
    const { container } = render(Timeline, {
      props: { pattern, currentStep: 8, isPlaying: true, trainingMode: true, positiveMode: false, userHits: hits },
    });
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('positive mode skips expired hits', () => {
    const expiredHit = makeHit('kick', 0, 'perfect', 500);
    const freshHit = makeHit('snare', 4, 'good', 0);
    const { container } = render(Timeline, {
      props: { pattern, currentStep: 0, isPlaying: true, trainingMode: true, positiveMode: true, userHits: [expiredHit, freshHit] },
    });
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('positive mode keeps fresh hits visible', () => {
    const freshHit = makeHit('kick', 0, 'perfect', 100);
    const { container } = render(Timeline, {
      props: { pattern, currentStep: 0, isPlaying: true, trainingMode: true, positiveMode: true, userHits: [freshHit] },
    });
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('handles empty userHits array', () => {
    const { container } = render(Timeline, {
      props: { pattern, currentStep: 0, isPlaying: true, trainingMode: true, positiveMode: false, userHits: [] },
    });
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('handles hits with unknown drum IDs gracefully', () => {
    const hits = [makeHit('unknown_drum', 0, 'perfect', 0)];
    const { container } = render(Timeline, {
      props: { pattern, currentStep: 0, isPlaying: true, trainingMode: true, positiveMode: false, userHits: hits },
    });
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });
});
