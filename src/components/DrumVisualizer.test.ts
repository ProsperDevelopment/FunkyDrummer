import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import DrumVisualizer from './DrumVisualizer.svelte';
import { drumLayouts } from '../config/drumLayouts';

vi.mock('../audio/drumSounds', () => ({
  getHihatPedalAmount: vi.fn(() => 0),
  setUserPressingPedal: vi.fn(),
}));

const baseProps = {
  activeDrums: new Map<string, number>(),
  onDrumClick: vi.fn(),
  layoutId: drumLayouts[0].id,
  hihatPedalPressed: false,
  onHihatPedalDown: vi.fn(),
};

describe('DrumVisualizer', () => {
  it('renders all drum pieces from the layout', () => {
    render(DrumVisualizer, { props: baseProps });
    expect(document.querySelectorAll('circle[class*="drum-piece"]').length).toBeGreaterThan(0);
  });

  it('renders the pedal', () => {
    render(DrumVisualizer, { props: baseProps });
    expect(document.querySelector('rect[class*="drum-piece"]')).toBeInTheDocument();
  });

  it('shows the kick label', () => {
    render(DrumVisualizer, { props: baseProps });
    expect(screen.getByText('KCK')).toBeInTheDocument();
  });

  it('calls onDrumClick when a drum is clicked', () => {
    const onDrumClick = vi.fn();
    render(DrumVisualizer, { props: { ...baseProps, onDrumClick } });
    const circles = document.querySelectorAll('circle[class*="drum-piece"]');
    fireEvent.pointerDown(circles[0], { pointerId: 1 });
    expect(onDrumClick).toHaveBeenCalled();
  });

  it('shows the closed label when pedal pressed', () => {
    render(DrumVisualizer, { props: { ...baseProps, hihatPedalPressed: true } });
    expect(screen.getByText('CL')).toBeInTheDocument();
  });

  it('shows the open label when pedal released', () => {
    render(DrumVisualizer, { props: { ...baseProps, hihatPedalPressed: false } });
    expect(screen.getByText('OP')).toBeInTheDocument();
  });

  it('calls onHihatPedalDown when the pedal is pressed', () => {
    const onHihatPedalDown = vi.fn();
    render(DrumVisualizer, { props: { ...baseProps, onHihatPedalDown } });
    const pedal = document.querySelector('rect[class*="drum-piece"]');
    fireEvent.pointerDown(pedal!, { pointerId: 2 });
    expect(onHihatPedalDown).toHaveBeenCalled();
  });
});
