import { useState, useRef, useEffect } from 'react';
import './StyleFilter.css';

const ALL_STYLES = ['Rock', 'Funk', 'Electronic', 'Techno', 'Electro', 'Breakbeat', 'Jazz', 'Metal', 'Hip Hop', 'World', 'Practice', 'Punk', 'Blues', 'Latin'];

export default function StyleFilter({ activeStyles, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (style) => {
    const next = activeStyles.includes(style)
      ? activeStyles.filter(s => s !== style)
      : [...activeStyles, style];
    onChange(next);
  };

  const count = activeStyles.length;

  return (
    <div className="style-filter" ref={ref}>
      <button className="style-filter-btn" onClick={() => setOpen(!open)} title="Filter by style">
        ≡{count > 0 && <span className="style-filter-badge">{count}</span>}
      </button>
      {open && (
        <div className="style-filter-popup">
          <button
            className={`style-filter-option ${activeStyles.length === 0 ? 'on' : ''}`}
            onClick={() => onChange([])}
          >All</button>
          {ALL_STYLES.map(style => (
            <button
              key={style}
              className={`style-filter-option ${activeStyles.includes(style) ? 'on' : ''}`}
              onClick={() => toggle(style)}
            >{style}</button>
          ))}
        </div>
      )}
    </div>
  );
}
