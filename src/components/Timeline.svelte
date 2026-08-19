<script lang="ts">
  import { drumConfig } from '../config/drumConfig';
  import { STEPS_PER_MEASURE, BEAT_INTERVAL, MEASURE_INTERVAL, CANVAS_STEP_WIDTH, CANVAS_ROW_HEIGHT, CANVAS_HEADER_WIDTH, CANVAS_HIT_RADIUS, CANVAS_HIT_FONT_SIZE, CANVAS_BEAT_FONT_SIZE } from '../config/constants';
  import type { DrumPattern, UserHit, DrumDef } from '../types';
  import './Timeline.css';

  interface Props {
    pattern: DrumPattern | null;
    currentStep: number;
    isPlaying: boolean;
    userHits?: UserHit[];
    trainingMode?: boolean;
    compact?: boolean;
    grooveOn?: boolean;
    positiveMode?: boolean;
  }

  let { pattern, currentStep, isPlaying, userHits = [], trainingMode = false, compact = false, grooveOn = false, positiveMode = false }: Props = $props();

  const STEP_WIDTH = CANVAS_STEP_WIDTH;
  const ROW_HEIGHT = CANVAS_ROW_HEIGHT;
  const HEADER_WIDTH = CANVAS_HEADER_WIDTH;
  const MAX_GROOVE = 5;
  const GROOVE_VISUAL_SCALE = 0.4;

  function getScrollX(step: number, stageWidth: number) {
    return stageWidth / 2 - step * STEP_WIDTH - STEP_WIDTH / 2;
  }

  function getGrooveShift(groove: number[] | undefined, stepIdx: number) {
    if (!groove) return 0;
    return (groove[stepIdx % 16] || 0) / MAX_GROOVE * STEP_WIDTH * GROOVE_VISUAL_SCALE;
  }

  let canvasRef = $state<HTMLCanvasElement>();
  let containerRef = $state<HTMLDivElement>();
  let dimensions = $state({ width: 800, height: 400 });

  let canvasWidth = $derived(dimensions.width);
  let canvasHeight = $derived(dimensions.height);

  let rows = $derived(
    pattern ? drumConfig.filter(d => d.id in pattern.grid) : []
  );

  let steps = $derived(pattern ? pattern.measures * STEPS_PER_MEASURE : 0);
  let totalWidth = $derived(steps * 3 * STEP_WIDTH);

  const userHitColors: Record<string, string> = {
    perfect: '#ef4444',
    good: '#22c55e',
    near: '#06b6d4',
    miss: '#f87171',
  };

  let rafId = 0;

  function draw(ctx: CanvasRenderingContext2D, scrollX: number) {
    const w = canvasWidth;
    const h = canvasHeight;
    ctx.clearRect(0, 0, w, h);

    const contentH = Math.max(rows.length * ROW_HEIGHT, h);

    if (!pattern) return;

    for (let i = 0; i < rows.length; i++) {
      ctx.fillStyle = '#16162a';
      ctx.fillRect(scrollX, i * ROW_HEIGHT, totalWidth, ROW_HEIGHT);
    }

    const viewSteps = steps * 3;

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

    ctx.font = `${CANVAS_BEAT_FONT_SIZE}px sans-serif`;
    ctx.fillStyle = '#555';
    for (let i = 0; i < viewSteps; i += BEAT_INTERVAL) {
      ctx.fillText(`${Math.floor((i % steps) / BEAT_INTERVAL) + 1}`, scrollX + i * STEP_WIDTH + 4, 12);
    }

    ctx.strokeStyle = '#1e1e3a';
    ctx.lineWidth = 1;
    for (let i = 1; i < rows.length; i++) {
      const y = i * ROW_HEIGHT;
      ctx.beginPath();
      ctx.moveTo(scrollX, y);
      ctx.lineTo(scrollX + totalWidth, y);
      ctx.stroke();
    }

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

    const offsetStep = steps + (currentStep % steps);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(scrollX + offsetStep * STEP_WIDTH, 0, STEP_WIDTH, contentH);

    if (trainingMode && isPlaying && userHits.length > 0) {
      const now = Date.now();
      const fadeMs = positiveMode ? 400 : 2500;
      const accLabels: Record<string, string> = { perfect: 'P', good: 'G', near: 'N', miss: 'X' };
      for (const hit of userHits) {
        const age = now - hit.timestamp;
        const hitAlpha = positiveMode ? Math.max(0, 1 - age / fadeMs) : 1;
        if (positiveMode && hitAlpha <= 0) continue;

        const rowIdx = rows.findIndex(r => r.id === hit.drumId);
        if (rowIdx === -1) continue;
        const cx = scrollX + (steps + hit.step) * STEP_WIDTH + STEP_WIDTH / 2;
        const cy = rowIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
        const color = userHitColors[hit.accuracy] || userHitColors.miss;

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
        ctx.globalAlpha = 0.85 * hitAlpha;
        ctx.beginPath();
        ctx.arc(cx, cy, CANVAS_HIT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = hitAlpha;
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.globalAlpha = hitAlpha;
        ctx.font = `bold ${CANVAS_HIT_FONT_SIZE}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(accLabels[hit.accuracy] || '?', cx, cy);
        ctx.restore();
      }
    }

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

  $effect(() => {
    const el = containerRef;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        dimensions = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  });

  $effect(() => {
    const canvas = canvasRef;
    if (!canvas || !containerRef) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = containerRef.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  });

  $effect(() => {
    const ctx = canvasRef?.getContext('2d');
    if (!ctx || !pattern) return;
    void positiveMode;
    const scrollX = getScrollX(steps + (currentStep % steps), canvasWidth);
    draw(ctx, scrollX);
  });

  $effect(() => {
    const canvas = canvasRef;
    if (!canvas || !pattern) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Force Svelte to track reactive deps that tick() reads asynchronously
    void currentStep;
    void steps;
    void canvasWidth;
    void userHits;
    void positiveMode;

    const tick = () => {
      const s = steps + (currentStep % steps);
      const scrollX = getScrollX(s, canvasWidth);
      draw(ctx, scrollX);
      rafId = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };
  });

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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
</script>

{#if !pattern}
  <div class="timeline-empty">Select a pattern to begin</div>
{:else}
  <div class="timeline-container">
    <div class="timeline-drum-labels" style="width: {compact ? 32 : HEADER_WIDTH}px">
      {#each rows as drum (drum.id)}
        <div class="drum-label{compact ? ' compact' : ''}" style="height: {ROW_HEIGHT}px">
          <span class="drum-indicator" style="background-color: {drum.color}" />
          {#if !compact}{drum.name}{/if}
        </div>
      {/each}
    </div>
    <div class="timeline-canvas-wrapper" bind:this={containerRef}>
      <canvas bind:this={canvasRef}></canvas>
    </div>
  </div>
{/if}
