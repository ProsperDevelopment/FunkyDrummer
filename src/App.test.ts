import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import App from './App.svelte';
import { drumPatterns } from './data/drumPatterns';
import { trackList } from './data/trackList';

vi.mock('./audio/drumSounds', () => {
  let pressed = false;
  let amount = 0;
  return {
    getActiveKit: () => ({ id: 'stock', name: 'Stock Kit', type: 'synth' }),
    setKit: vi.fn(async () => undefined),
    getHihatPedalPressed: () => pressed,
    setHihatPedalPressed: (p: boolean) => { pressed = p; },
    getHihatPedalAmount: () => amount,
    setHihatPedalAmount: (a: number) => { amount = a; },
    setUserPressingPedal: vi.fn(),
    getUserPressingPedal: () => false,
    playDrum: vi.fn(),
    playMetronomeClick: vi.fn(),
    isKitLoading: () => false,
  };
});

const visiblePatterns = drumPatterns.filter(p => !p.id.endsWith('-edge'));

function patternButton(name: string): HTMLElement {
  const btn = screen.getAllByRole('button').find(b => {
    const nameEl = b.querySelector('.pattern-name');
    return !!nameEl && nameEl.textContent === name;
  });
  if (!btn) throw new Error(`pattern button not found: ${name}`);
  return btn;
}

function trackButton(name: string): HTMLElement {
  const btn = screen.getAllByRole('button').find(b => {
    const nameEl = b.querySelector('.track-name');
    return !!nameEl && nameEl.textContent === name;
  });
  if (!btn) throw new Error(`track button not found: ${name}`);
  return btn;
}

describe('App', () => {
  it('renders the app title and controls', () => {
    render(App);
    expect(screen.getByText('Funky Drummer', { selector: '.app-title' })).toBeInTheDocument();
    expect(screen.getByTitle('Play')).toBeInTheDocument();
    expect(screen.getByTitle('Stop')).toBeInTheDocument();
  });

  it('shows the default pattern selected', () => {
    render(App);
    const first = visiblePatterns[0];
    expect(patternButton(first.name).className).toContain('active');
  });

  it('switches patterns on click', async () => {
    const user = userEvent.setup();
    render(App);
    const target = visiblePatterns[1];
    await user.click(patternButton(target.name));
    expect(patternButton(target.name).className).toContain('active');
  });

  it('toggles play when the play button is clicked', async () => {
    const user = userEvent.setup();
    render(App);
    expect(screen.getByTitle('Play')).toBeInTheDocument();
    await user.click(screen.getByTitle('Play'));
    expect(screen.getByTitle('Pause')).toBeInTheDocument();
    await user.click(screen.getByTitle('Pause'));
    expect(screen.getByTitle('Play')).toBeInTheDocument();
  });

  it('opens and closes the settings modal', async () => {
    const user = userEvent.setup();
    render(App);
    await user.click(screen.getByTitle('Settings'));
    expect(screen.getByText('Drum Kit')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '×' }));
    expect(screen.queryByText('Drum Kit')).not.toBeInTheDocument();
  });

  it('switches to track mode and plays a track', async () => {
    const user = userEvent.setup();
    render(App);
    await user.click(screen.getByRole('button', { name: 'Tracks' }));
    const track = trackList[0];
    await user.click(trackButton(track.name));
    expect(screen.getAllByText(track.name).length).toBeGreaterThan(0);
    expect(screen.getByText(/Part 1\/\d+/)).toBeInTheDocument();
  });

  it('opens the help modal', async () => {
    const user = userEvent.setup();
    render(App);
    await user.click(screen.getByTitle('Help'));
    expect(screen.getByText('Help')).toBeInTheDocument();
  });
});
