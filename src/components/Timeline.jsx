import { useRef, useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { drumConfig } from '../config/drumConfig';
import { STEPS_PER_MEASURE, BEAT_INTERVAL, MEASURE_INTERVAL, CANVAS_STEP_WIDTH, CANVAS_ROW_HEIGHT, CANVAS_HEADER_WIDTH, CANVAS_HIT_RADIUS, CANVAS_HIT_FONT_SIZE, CANVAS_BEAT_FONT_SIZE } from '../config/constants';
import './Timeline.css';

const STEP_WIDTH = CANVAS_STEP_WIDTH;
const ROW_HEIGHT = CANVAS_ROW_HEIGHT;
const HEADER_WIDTH = CANVAS_HEADER_WIDTH;
const MAX_GROOVE = 5;
const GROOVE_VISUAL_SCALE = 0.4;

function getScrollX(step, stageWidth) {
  return stageWidth / 2 - step * STEP_WIDTH - STEP_WIDTH / 2;
}

function getGrooveShift(groove, stepIdx) {
  if (!groove) return 0;
  return (groove[stepIdx % 16] || 0) / MAX_GROOVE * STEP_WIDTH * GROOVE_VISUAL_SCALE;
}

export default function Timeline({ pattern, currentStep, isPlaying, userHits = [], trainingMode = false, compact = false, grooveOn = false }) {
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
  }, [pattern]);

  const rows = useMemo(() =>
    pattern ? drumConfig.filter(d => d.id in pattern.grid) : [],
    [pattern]
  );

  const steps = pattern ? pattern.measures * STEPS_PER_MEASURE : 0;
  const totalWidth = steps * 3 * STEP_WIDTH;

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

    // backgrounds for 3 iterations
    for (let i = 0; i < rows.length; i++) {
      ctx.fillStyle = '#16162a';
      ctx.fillRect(scrollX, i * ROW_HEIGHT, totalWidth, ROW_HEIGHT);
    }

    const viewSteps = steps * 3;

    // beat dividers
    for (let i = 0; i <= viewSteps; i++) {
      const x = scrollX + i * STEP_WIDTH;
      if (i > 0 && i < viewSteps && i % steps === 0) {
        ctx.strokeStyle = '#6b21a8';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, contentH);
        ctx.stroke();
        ctx.setLineDash([]);
        continue;
      }
      if (i % MEASURE_INTERVAL === 0) {
        ctx.strokeStyle = '#4a4a6a';
        ctx.lineWidth = 2;
      } else if (i % BEAT_INTERVAL === 0) {
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
    ctx.font = `${CANVAS_BEAT_FONT_SIZE}px sans-serif`;
    ctx.fillStyle = '#555';
    for (let i = 0; i < viewSteps; i += BEAT_INTERVAL) {
      ctx.fillText(`${Math.floor((i % steps) / BEAT_INTERVAL) + 1}`, scrollX + i * STEP_WIDTH + 4, 12);
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

    // drum hit blocks (3 iterations)
    for (const drum of rows) {
      const row = pattern.grid[drum.id];
      if (!row) continue;
      const rowIdx = rows.indexOf(drum);
      for (let s = 0; s < viewSteps; s++) {
        if (row[s % steps]) {
          const shift = grooveOn ? getGrooveShift(pattern.groove, s) : 0;
          ctx.globalAlpha = 0.6 + row[s % steps] * 0.4;
          ctx.fillStyle = drum.color;
          roundRect(ctx, scrollX + s * STEP_WIDTH + 4 + shift, rowIdx * ROW_HEIGHT + 4, STEP_WIDTH - 8, ROW_HEIGHT - 8, 4);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    }

    // current step highlight (middle iteration)
    const offsetStep = steps + (currentStep % steps);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(scrollX + offsetStep * STEP_WIDTH, 0, STEP_WIDTH, contentH);

    // user hits (training mode) — drawn in the middle iteration
    if (trainingMode && userHits.length > 0) {
      const accLabels = { perfect: 'P', good: 'G', off: 'O', miss: 'X' };
      for (const hit of userHits) {
        const rowIdx = rows.findIndex(r => r.id === hit.drumId);
        if (rowIdx === -1) continue;
        const cx = scrollX + (steps + hit.step) * STEP_WIDTH + STEP_WIDTH / 2;
        const cy = rowIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
        const color = userHitColors[hit.accuracy] || userHitColors.miss;

        // faint line to nearest pattern note (show offset)
        const patternRow = pattern.grid[hit.drumId];
        if (patternRow && hit.accuracy !== 'miss') {
          let nearestPatternStep = -1;
          let nearestDist = Infinity;
          const steps2 = pattern.measures * STEPS_PER_MEASURE;
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
            const px = scrollX + (steps + nearestPatternStep) * STEP_WIDTH + STEP_WIDTH / 2;
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
        ctx.arc(cx, cy, CANVAS_HIT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = `bold ${CANVAS_HIT_FONT_SIZE}px sans-serif`;
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
  }, [dimensions, pattern]);

  // immediate draw on step/pattern/isPlaying change
  useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !pattern) return;
    const scrollX = getScrollX(steps + (currentStep % steps), canvasWidth);
    drawRef.current(ctx, scrollX);
  }, [currentStep, pattern, isPlaying, canvasWidth, rows, userHits, trainingMode, steps, grooveOn]);

  // RAF loop during playback
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pattern) return;
    const ctx = canvas.getContext('2d');

    const tick = () => {
      const s = steps + (stepRef.current % steps);
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
  }, [pattern, isPlaying, canvasWidth, steps, rows, grooveOn]);

  if (!pattern) {
    return <div className="timeline-empty">Select a pattern to begin</div>;
  }

  return (
    <div className="timeline-container">
      <div className="timeline-drum-labels" style={{ width: compact ? 32 : HEADER_WIDTH }}>
        {rows.map(drum => (
          <div key={drum.id} className={`drum-label${compact ? ' compact' : ''}`} style={{ height: ROW_HEIGHT }}>
            <span className="drum-indicator" style={{ backgroundColor: drum.color }} />
            {!compact && drum.name}
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
