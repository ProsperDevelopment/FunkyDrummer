import { useRef, useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { drumConfig } from '../config/drumConfig';
import './Timeline.css';

const STEP_WIDTH = 40;
const ROW_HEIGHT = 40;
const HEADER_WIDTH = 100;

function getScrollX(step, stageWidth) {
  return stageWidth / 2 - step * STEP_WIDTH - STEP_WIDTH / 2;
}

export default function Timeline({ pattern, currentStep, isPlaying, userHits = [], trainingMode = false }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const stepRef = useRef(currentStep);
  const patternRef = useRef(pattern);
  const rafRef = useRef(null);

  stepRef.current = currentStep;
  patternRef.current = pattern;

  const canvasWidth = dimensions.width;
  const canvasHeight = dimensions.height;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rows = useMemo(() =>
    pattern ? drumConfig.filter(d => d.id in pattern.grid) : [],
    [pattern]
  );

  const steps = pattern ? pattern.measures * 16 : 0;
  const totalWidth = steps * STEP_WIDTH;

  const userHitColors = {
    perfect: '#4ade80',
    good: '#fbbf24',
    off: '#fb923c',
    miss: '#f87171',
  };

  function draw(ctx, scrollX) {
    const w = canvasWidth;
    const h = canvasHeight;
    ctx.clearRect(0, 0, w, h);

    const contentH = Math.max(rows.length * ROW_HEIGHT, h);

    if (!pattern) return;

    // backgrounds
    for (let i = 0; i < rows.length; i++) {
      ctx.fillStyle = '#16162a';
      ctx.fillRect(scrollX, i * ROW_HEIGHT, totalWidth, ROW_HEIGHT);
    }

    // beat dividers
    for (let i = 0; i <= steps; i++) {
      const x = scrollX + i * STEP_WIDTH;
      if (i % 16 === 0) {
        ctx.strokeStyle = '#4a4a6a';
        ctx.lineWidth = 2;
      } else if (i % 4 === 0) {
        ctx.strokeStyle = '#2a2a4a';
        ctx.lineWidth = 1;
      } else {
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, contentH);
      ctx.stroke();
    }

    // beat numbers
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#555';
    for (let i = 0; i < steps; i += 4) {
      ctx.fillText(`${Math.floor(i / 4) + 1}`, scrollX + i * STEP_WIDTH + 4, 12);
    }

    // row dividers
    ctx.strokeStyle = '#1e1e3a';
    ctx.lineWidth = 1;
    for (let i = 1; i < rows.length; i++) {
      const y = i * ROW_HEIGHT;
      ctx.beginPath();
      ctx.moveTo(scrollX, y);
      ctx.lineTo(scrollX + totalWidth, y);
      ctx.stroke();
    }

    // drum hit blocks
    for (const drum of rows) {
      const row = pattern.grid[drum.id];
      if (!row) continue;
      const rowIdx = rows.indexOf(drum);
      for (let s = 0; s < steps; s++) {
        if (row[s]) {
          ctx.globalAlpha = 0.6 + row[s] * 0.4;
          ctx.fillStyle = drum.color;
          roundRect(ctx, scrollX + s * STEP_WIDTH + 4, rowIdx * ROW_HEIGHT + 4, STEP_WIDTH - 8, ROW_HEIGHT - 8, 4);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    }

    // current step highlight
    const offsetStep = currentStep % steps;
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(scrollX + offsetStep * STEP_WIDTH, 0, STEP_WIDTH, contentH);

    // user hits (training mode)
    if (trainingMode && userHits.length > 0) {
      const accLabels = { perfect: 'P', good: 'G', off: 'O', miss: 'X' };
      for (const hit of userHits) {
        const rowIdx = rows.findIndex(r => r.id === hit.drumId);
        if (rowIdx === -1) continue;
        const cx = scrollX + hit.step * STEP_WIDTH + STEP_WIDTH / 2;
        const cy = rowIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
        const color = userHitColors[hit.accuracy] || userHitColors.miss;

        // faint line to nearest pattern note (show offset)
        const patternRow = pattern.grid[hit.drumId];
        if (patternRow && hit.accuracy !== 'miss') {
          let nearestPatternStep = -1;
          let nearestDist = Infinity;
          const steps2 = pattern.measures * 16;
          for (let s = 0; s < steps2; s++) {
            if (patternRow[s]) {
              const dist = Math.abs(hit.step - s);
              const wrapped = Math.min(dist, steps2 - dist);
              if (wrapped < nearestDist) {
                nearestDist = wrapped;
                nearestPatternStep = s;
              }
            }
          }
          if (nearestPatternStep >= 0 && nearestDist > 0) {
            const px = scrollX + nearestPatternStep * STEP_WIDTH + STEP_WIDTH / 2;
            ctx.save();
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.25;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(px, cy);
            ctx.stroke();
            ctx.restore();
          }
        }

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(cx, cy, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(accLabels[hit.accuracy] || '?', cx, cy);
        ctx.restore();
      }
    }

    // playhead (fixed)
    const midX = w / 2;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, contentH);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  const drawRef = useRef(draw);
  drawRef.current = draw;

  // handle DPI scaling — must run BEFORE draw useLayoutEffect below
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = containerRef.current.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }, [dimensions]);

  // immediate draw on step/pattern/isPlaying change
  useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !pattern) return;
    const scrollX = getScrollX(currentStep % steps, canvasWidth);
    drawRef.current(ctx, scrollX);
  }, [currentStep, pattern, isPlaying, canvasWidth, rows, userHits, trainingMode, steps]);

  // RAF loop during playback
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pattern) return;
    const ctx = canvas.getContext('2d');

    const tick = () => {
      const s = stepRef.current % steps;
      const scrollX = getScrollX(s, canvasWidth);
      drawRef.current(ctx, scrollX);
      rafRef.current = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [pattern, isPlaying, canvasWidth, steps, rows]);

  if (!pattern) {
    return <div className="timeline-empty">Select a pattern to begin</div>;
  }

  return (
    <div className="timeline-container">
      <div className="timeline-drum-labels" style={{ width: HEADER_WIDTH }}>
        {rows.map(drum => (
          <div key={drum.id} className="drum-label" style={{ height: ROW_HEIGHT }}>
            <span className="drum-indicator" style={{ backgroundColor: drum.color }} />
            {drum.name}
          </div>
        ))}
      </div>
      <div className="timeline-canvas-wrapper" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
