import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Controls from './Controls.svelte';

const baseProps = {
  isPlaying: false,
  onTogglePlay: vi.fn(),
  onStop: vi.fn(),
  bpm: 100,
  trainingMode: false,
  onTrainingToggle: vi.fn(),
  missedHits: 0,
  bpmOverride: null,
  onBpmChange: vi.fn(),
  stopAfterReps: 5,
  onStopAfterRepsChange: vi.fn(),
  currentLoop: 0,
  sessionResult: null,
  onDismissResult: vi.fn(),
  showVisualizer: false,
  onToggleVisualizer: vi.fn(),
  metronomeOn: false,
  onToggleMetronome: vi.fn(),
  drumPlaybackOn: true,
  onToggleDrumPlayback: vi.fn(),
  countdownOn: false,
  onCountdownToggle: vi.fn(),
  grooveOn: false,
  onGrooveToggle: vi.fn(),
  edgeMode: false,
  onEdgeModeToggle: vi.fn(),
  trackMode: false,
  trackPart: 0,
  trackTotalParts: 0,
};

describe('Controls', () => {
  it('renders play and stop buttons', () => {
    render(Controls, { props: baseProps });
    expect(screen.getByText('▶')).toBeInTheDocument();
    expect(screen.getByText('⏹')).toBeInTheDocument();
  });

  it('shows a pause icon when playing', () => {
    render(Controls, { props: { ...baseProps, isPlaying: true } });
    expect(screen.getByText('⏸')).toBeInTheDocument();
  });

  it('calls onTogglePlay when play is clicked', async () => {
    const user = userEvent.setup();
    const onTogglePlay = vi.fn();
    render(Controls, { props: { ...baseProps, onTogglePlay } });
    await user.click(screen.getByText('▶'));
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });

  it('calls onStop when stop is clicked', async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    render(Controls, { props: { ...baseProps, onStop } });
    await user.click(screen.getByText('⏹'));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('shows the bpm', () => {
    render(Controls, { props: { ...baseProps, bpm: 120 } });
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('calls onCountdownToggle when countdown pressed', async () => {
    const user = userEvent.setup();
    const onCountdownToggle = vi.fn();
    render(Controls, { props: { ...baseProps, onCountdownToggle } });
    await user.click(screen.getByText('🚦'));
    expect(onCountdownToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onGrooveToggle when groove pressed', async () => {
    const user = userEvent.setup();
    const onGrooveToggle = vi.fn();
    render(Controls, { props: { ...baseProps, onGrooveToggle } });
    await user.click(screen.getByText('🔀'));
    expect(onGrooveToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onTrainingToggle when training pressed', async () => {
    const user = userEvent.setup();
    const onTrainingToggle = vi.fn();
    render(Controls, { props: { ...baseProps, onTrainingToggle } });
    await user.click(screen.getByText('🎯'));
    expect(onTrainingToggle).toHaveBeenCalledTimes(1);
  });

  it('renders track info in track mode', () => {
    render(Controls, { props: { ...baseProps, trackMode: true, trackName: 'Rock to Funk', trackTotalParts: 4 } });
    expect(screen.getByText('Rock to Funk')).toBeInTheDocument();
    expect(screen.getByText('Part 1/4')).toBeInTheDocument();
  });

  it('shows the session result overlay when present', () => {
    const sessionResult = {
      stats: { perfect: 10, good: 5, near: 2, miss: 1, total: 18, score: 80 },
      missedHits: 3,
    };
    render(Controls, { props: { ...baseProps, sessionResult } });
    expect(screen.getByText('Session Complete')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('calls onDismissResult on dismiss button', async () => {
    const user = userEvent.setup();
    const onDismissResult = vi.fn();
    const sessionResult = { stats: { perfect: 1, good: 0, near: 0, miss: 0, total: 1, score: 100 }, missedHits: 0 };
    render(Controls, { props: { ...baseProps, sessionResult, onDismissResult } });
    await user.click(screen.getByText('Dismiss'));
    expect(onDismissResult).toHaveBeenCalledTimes(1);
  });
});
