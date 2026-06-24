import { drumPatterns } from '../data/drumPatterns';
import './PatternMenu.css';

export default function PatternMenu({ selectedPatternId, onSelectPattern }) {
  return (
    <div className="pattern-menu">
      <div className="menu-section">
        <h2 className="menu-section-title">Patterns</h2>
        <div className="pattern-list">
          {drumPatterns.map(pattern => (
            <button
              key={pattern.id}
              className={`pattern-item ${pattern.id === selectedPatternId ? 'active' : ''}`}
              onClick={() => onSelectPattern(pattern.id)}
            >
              <span className="pattern-name">{pattern.name}</span>
              <span className="pattern-bpm">{pattern.bpm} BPM</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
