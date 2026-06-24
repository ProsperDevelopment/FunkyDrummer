import { drumConfig } from '../config/drumConfig';
import { getLayoutById } from '../config/drumLayouts';
import { setUserPressingPedal } from '../audio/drumSounds';
import './DrumVisualizer.css';

const drumColorMap = Object.fromEntries(
  drumConfig.map(d => [d.id, d.color])
);

const drumAbbr = {
  kick: 'KCK', snare: 'SNR', hihat: 'HH', hihatOpen: 'HO',
  crash: 'CR', ride: 'RD', tomHi: 'HT', tomMid: 'MT',
  tomLo: 'FT',
};

function handlePointerDown(id, onDrumClick, e) {
  e.preventDefault();
  e.target.setPointerCapture(e.pointerId);
  onDrumClick?.(id);
}

function handlePedalDown(onHihatPedalDown, e) {
  e.preventDefault();
  e.target.setPointerCapture(e.pointerId);
  setUserPressingPedal(true);
  onHihatPedalDown?.();
}

function handlePedalUp(onHihatPedalUp, e) {
  setUserPressingPedal(false);
  onHihatPedalUp?.();
}

export default function DrumVisualizer({ activeDrums, onDrumClick, layoutId, hihatPedalPressed, onHihatPedalDown, onHihatPedalUp }) {
  const layout = getLayoutById(layoutId);
  const getVel = (id, group) => {
    const v = activeDrums.get(id) || (group || []).reduce((a, g) => a || activeDrums.get(g), 0);
    return v || 0;
  };
  const kickPos = layout.positions.find(p => p.id === 'kick');
  const pedalW = kickPos ? kickPos.r * 2 : 100;
  const pedalH = kickPos ? kickPos.r : 50;
  const pedalCx = kickPos ? kickPos.cx - kickPos.r - pedalW / 2 - 16 : 130;
  const pedalCy = kickPos ? kickPos.cy : 340;
  const pedalActive = hihatPedalPressed
    ? { active: true, color: drumColorMap.hihat, label: 'CL' }
    : { active: true, color: '#f39c12', label: 'OP' };

  return (
    <div className="drum-visualizer">
      <svg viewBox="0 0 600 410" className="drum-visualizer-svg">
        {layout.positions.map(({ id, cx, cy, r, group }) => {
          const vel = getVel(id, group);
          const active = vel > 0;
          const color = drumColorMap[id] || '#888';
          return (
            <g key={id}>
              <circle
                cx={cx} cy={cy} r={r}
                fill={active ? color : 'transparent'}
                stroke={active ? color : '#8a8aba'}
                strokeWidth={active ? 6 : 4}
                fillOpacity={active ? 0.3 + vel * 0.7 : 1}
                opacity={active ? 1 : 0.7}
                className={`drum-piece${active ? ' active' : ''}`}
                style={{ cursor: 'pointer', touchAction: 'none' }}
                onPointerDown={(e) => handlePointerDown(id, onDrumClick, e)}
              />
              {active && (
                <circle
                  cx={cx} cy={cy} r={r + 6}
                  fill="none"
                  stroke={color}
                  strokeWidth={4}
                  opacity={0.2 + vel * 0.5}
                  className="drum-glow-ring"
                />
              )}
              <text
                x={cx} y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill={active ? '#fff' : '#888'}
                fontSize={14}
                fontWeight={active ? 700 : 400}
                className="drum-label"
              >
                {drumAbbr[id] || id}
              </text>
            </g>
          );
        })}
        <rect
          x={pedalCx - pedalW / 2} y={pedalCy - pedalH / 2}
          width={pedalW} height={pedalH} rx={6}
          fill={pedalActive.active ? pedalActive.color : 'transparent'}
          stroke={pedalActive.active ? pedalActive.color : '#8a8aba'}
          strokeWidth={4}
          opacity={pedalActive.active ? 1 : 0.7}
          className="drum-piece"
          style={{ cursor: 'pointer', touchAction: 'none' }}
          onPointerDown={(e) => handlePedalDown(onHihatPedalDown, e)}
          onPointerUp={(e) => handlePedalUp(onHihatPedalUp, e)}
          onPointerCancel={(e) => handlePedalUp(onHihatPedalUp, e)}
          onPointerLeave={(e) => handlePedalUp(onHihatPedalUp, e)}
        />
        <text
          x={pedalCx} y={pedalCy}
          textAnchor="middle" dominantBaseline="central"
          fill={pedalActive.active ? '#fff' : '#888'}
          fontSize={16} fontWeight={700}
          className="drum-label"
        >
          {pedalActive.label}
        </text>
        <rect
          x={pedalCx - pedalW / 2 - 4} y={pedalCy - pedalH / 2 - 4}
          width={pedalW + 8} height={pedalH + 8} rx={8}
          fill="none"
          stroke={pedalActive.color}
          strokeWidth={4}
          opacity={0.5}
          className="drum-glow-ring"
        />
      </svg>
    </div>
  );
}
