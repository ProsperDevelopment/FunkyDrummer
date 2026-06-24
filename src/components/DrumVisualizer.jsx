import { drumConfig } from '../config/drumConfig';
import './DrumVisualizer.css';

const drumColorMap = Object.fromEntries(
  drumConfig.map(d => [d.id, d.color])
);
const drumNameMap = Object.fromEntries(
  drumConfig.map(d => [d.id, d.name])
);

const DRUM_POSITIONS = [
  { id: 'crash',  cx: 100, cy: 62,  r: 46 },
  { id: 'ride',   cx: 500, cy: 62,  r: 46 },
  { id: 'hihat',  cx: 92,  cy: 172, r: 36, group: ['hihatOpen'] },
  { id: 'tomHi',  cx: 200, cy: 152, r: 38 },
  { id: 'tomMid', cx: 310, cy: 152, r: 38 },
  { id: 'tomLo',  cx: 420, cy: 172, r: 40 },
  { id: 'snare',  cx: 208, cy: 252, r: 40 },
  { id: 'clap',   cx: 392, cy: 252, r: 30 },
  { id: 'kick',   cx: 300, cy: 340, r: 50 },
];

export default function DrumVisualizer({ activeDrums, onDrumClick }) {
  const isActive = (id, group) =>
    activeDrums.has(id) || (group || []).some(g => activeDrums.has(g));

  return (
    <div className="drum-visualizer">
      <svg viewBox="0 0 600 410" className="drum-visualizer-svg">
        {DRUM_POSITIONS.map(({ id, cx, cy, r, group }) => {
          const active = isActive(id, group);
          const color = drumColorMap[id] || '#888';
          return (
            <g key={id}>
              <circle
                cx={cx} cy={cy} r={r}
                fill={active ? color : 'transparent'}
                stroke={active ? color : '#3a3a5a'}
                strokeWidth={active ? 3 : 1.5}
                opacity={active ? 0.9 : 0.5}
                className={`drum-piece${active ? ' active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => onDrumClick?.(id)}
              />
              {active && (
                <circle
                  cx={cx} cy={cy} r={r + 4}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  opacity={0.4}
                  className="drum-glow-ring"
                />
              )}
              <text
                x={cx} y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill={active ? '#fff' : '#666'}
                fontSize={id === 'hihat' ? 10 : 11}
                fontWeight={active ? 700 : 400}
                className="drum-label"
              >
                {drumNameMap[id] || id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
