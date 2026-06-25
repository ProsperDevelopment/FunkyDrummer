import { useMemo, useState } from 'react';
import { drumPatterns } from '../data/drumPatterns';
import './PatternMenu.css';

const styles = ['All', 'Rock', 'Funk', 'Electronic', 'Breakbeat', 'Jazz', 'Metal', 'Hip Hop', 'World', 'Practice', 'Punk', 'Blues', 'Latin'];

export default function PatternMenu({ selectedPatternId, onSelectPattern }) {
  const [filter, setFilter] = useState('All');

  const grouped = useMemo(() => {
    const filtered = filter === 'All'
      ? drumPatterns
      : drumPatterns.filter(p => p.style === filter);
    const map = {};
    for (const p of filtered) {
      const s = p.style || 'Other';
      if (!map[s]) map[s] = [];
      map[s].push(p);
    }
    return map;
  }, [filter]);

  return (
    <div className="pattern-menu">
      <div className="menu-section">
        <h2 className="menu-section-title">Patterns</h2>
        <div className="style-filter-row">
          <select className="style-select" value={filter} onChange={e => setFilter(e.target.value)}>
            {styles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
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
      </div>
    </div>
  );
}
