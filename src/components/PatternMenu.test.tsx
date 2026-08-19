import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PatternMenu from './PatternMenu';
import { drumPatterns } from '../data/drumPatterns';

const visiblePatterns = drumPatterns.filter(p => !p.id.endsWith('-edge'));

function patternButton(name: string): HTMLElement {
  const btn = screen.getAllByRole('button').find(b => {
    const nameEl = b.querySelector('.pattern-name');
    return !!nameEl && nameEl.textContent === name;
  });
  if (!btn) throw new Error(`pattern button not found: ${name}`);
  return btn;
}

function patternName(name: string): HTMLElement {
  const el = Array.from(screen.getAllByText(name, { selector: '.pattern-name' }))
    .find(e => e.textContent === name);
  if (!el) throw new Error(`pattern-name not found: ${name}`);
  return el;
}

describe('PatternMenu', () => {
  it('renders all visible patterns', () => {
    render(<PatternMenu selectedPatternId={visiblePatterns[0].id} onSelectPattern={vi.fn()} activeStyles={[]} />);
    for (const p of visiblePatterns.slice(0, 5)) {
      expect(patternName(p.name)).toBeInTheDocument();
    }
    expect(screen.getAllByRole('button').length).toBe(visiblePatterns.length);
  });

  it('highlights the selected pattern', () => {
    const selected = visiblePatterns[1];
    render(<PatternMenu selectedPatternId={selected.id} onSelectPattern={vi.fn()} activeStyles={[]} />);
    expect(patternButton(selected.name).className).toContain('active');
  });

  it('calls onSelectPattern when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const target = visiblePatterns[2];
    render(<PatternMenu selectedPatternId={visiblePatterns[0].id} onSelectPattern={onSelect} activeStyles={[]} />);
    await user.click(patternButton(target.name));
    expect(onSelect).toHaveBeenCalledWith(target.id);
  });

  it('filters patterns by active style', () => {
    const style = visiblePatterns[0].style;
    render(<PatternMenu selectedPatternId={visiblePatterns[0].id} onSelectPattern={vi.fn()} activeStyles={[style]} />);
    const expected = visiblePatterns.filter(p => p.style === style);
    for (const p of expected) {
      expect(patternName(p.name)).toBeInTheDocument();
    }
    const excluded = visiblePatterns.find(p => p.style !== style);
    if (excluded) {
      expect(screen.queryByText(excluded.name, { selector: '.pattern-name' })).not.toBeInTheDocument();
    }
  });

  it('renders without embedded wrapper by default', () => {
    render(<PatternMenu selectedPatternId={visiblePatterns[0].id} onSelectPattern={vi.fn()} activeStyles={[]} />);
    expect(screen.getByText('Patterns')).toBeInTheDocument();
  });
});
