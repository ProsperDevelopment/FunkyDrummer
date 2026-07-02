import { useMemo } from 'react';
import { drumPatterns } from '../data/drumPatterns';
import './PatternMenu.css';

interface PatternMenuProps {
  selectedPatternId: string;
  onSelectPattern: (id: string) => void;
  embedded?: boolean;
  activeStyles: string[];
}

export default function PatternMenu({ selectedPatternId, onSelectPattern, embedded, activeStyles }: PatternMenuProps) {
  const visiblePatterns = useMemo(() =>
    drumPatterns.filter(p => !p.id.endsWith('-edge')),
  []);

  const grouped = useMemo(() => {
    const filtered = activeStyles.length === 0
      ? visiblePatterns
      : visiblePatterns.filter(p => activeStyles.includes(p.style));
    const map: Record<string, typeof drumPatterns> = {};
    for (const p of filtered) {
      const s = p.style || 'Other';
      if (!map[s]) map[s] = [];
      map[s].push(p);
    }
    return map;
  }, [activeStyles]);

  const content = (
    <div className="pattern-list">
      {Object.entries(grouped).map(([style, patterns]) => (
        <div key={style}>
          <div className="style-group-header">{style}</div>
          {patterns.map(pattern => (
            <button
              key={pattern.id}
              className={`pattern-item ${pattern.id === selectedPatternId ? 'active' : ''}`}
              onClick={() => onSelectPattern(pattern.id)}
            >
              <div className="pattern-info">
                <span className="pattern-name">{pattern.name}</span>
                <span className="pattern-desc">{pattern.desc}</span>
              </div>
              <span className="pattern-bpm">{pattern.bpm} BPM</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );

  if (embedded) return content;

  return (
    <div className="pattern-menu">
      <div className="menu-section">
        <h2 className="menu-section-title">Patterns</h2>
        {content}
      </div>
    </div>
  );
}
