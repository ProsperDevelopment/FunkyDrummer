<script lang="ts">
  import { drumConfig } from '../config/drumConfig';
  import { getLayoutById } from '../config/drumLayouts';
  import { setUserPressingPedal, getHihatPedalAmount } from '../audio/drumSounds';
  import './DrumVisualizer.css';

  interface Props {
    activeDrums: Map<string, number>;
    onDrumClick: (id: string, velocity?: number) => void;
    layoutId: string;
    hihatPedalPressed: boolean;
    onHihatPedalDown: () => void;
  }

  let { activeDrums, onDrumClick, layoutId, hihatPedalPressed, onHihatPedalDown }: Props = $props();

  const drumColorMap: Record<string, string> = Object.fromEntries(
    drumConfig.map(d => [d.id, d.color])
  );

  const drumAbbr: Record<string, string> = {
    kick: 'KCK', snare: 'SNR', hihat: 'HH', hihatOpen: 'HO',
    hihatEdge: 'ED', hihatMute: 'MU',
    crash: 'CR', ride: 'RD', tomHi: 'HT', tomMid: 'MT',
    tomLo: 'FT',
  };

  let layout = $derived(getLayoutById(layoutId));

  function getVel(id: string, group?: string[]): number {
    const v = activeDrums.get(id) || (group || []).reduce((a: number, g: string) => a || activeDrums.get(g) || 0, 0);
    return v || 0;
  }

  let kickPos = $derived(layout.positions.find(p => p.id === 'kick'));
  let pedalW = $derived(kickPos ? kickPos.r * 2 : 100);
  let pedalH = $derived(kickPos ? kickPos.r : 50);
  let pedalCx = $derived(kickPos ? kickPos.cx - kickPos.r - pedalW / 2 - 16 : 130);
  let pedalCy = $derived(kickPos ? kickPos.cy : 340);
  let pedalAmount = $derived(getHihatPedalAmount());
  let pedalActive = $derived(
    hihatPedalPressed
      ? { active: true, color: drumColorMap.hihat || '#888', label: 'CL' }
      : { active: true, color: '#f39c12', label: 'OP' }
  );
  let hihatEdgeActive = $derived((activeDrums.get('hihatEdge') || 0) > 0);
  let hihatMuteActive = $derived((activeDrums.get('hihatMute') || 0) > 0);
  let hihatPos = $derived(layout.positions.find(p => p.id === 'hihat'));

  function handlePointerDown(id: string, e: PointerEvent) {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    onDrumClick(id);
  }

  function handlePedalToggle(e: PointerEvent) {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setUserPressingPedal(true);
    onHihatPedalDown();
  }

  function handlePedalRelease(e: PointerEvent) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setUserPressingPedal(false);
  }
</script>

<div class="drum-visualizer">
  <svg viewBox="0 0 600 410" class="drum-visualizer-svg">
    {#if hihatPos}
      <defs>
        <clipPath id="hihat-clip">
          <circle cx={hihatPos.cx} cy={hihatPos.cy} r={hihatPos.r} />
        </clipPath>
      </defs>
    {/if}

    {#each layout.positions as { id, cx, cy, r, group } (id)}
      {@const vel = getVel(id, group)}
      {@const active = vel > 0}
      {@const color = drumColorMap[id] || '#888'}
      <g>
        <circle
          cx={cx} cy={cy} r={r}
          fill={active ? color : 'transparent'}
          stroke={active ? color : '#8a8aba'}
          stroke-width={active ? 6 : 4}
          fill-opacity={active ? 0.3 + vel * 0.7 : 1}
          opacity={active ? 1 : 0.7}
          class="drum-piece{active ? ' active' : ''}"
          style="cursor: pointer; touch-action: none;"
          onpointerdown={(e) => handlePointerDown(id, e)}
        />
        {#if active}
          <circle
            cx={cx} cy={cy} r={r + 6}
            fill="none"
            stroke={color}
            stroke-width={4}
            opacity={0.2 + vel * 0.5}
            class="drum-glow-ring"
          />
        {/if}
        {#if id === 'hihat' && hihatEdgeActive}
          <g clip-path="url(#hihat-clip)">
            <circle cx={cx + r * 0.5} cy={cy + r * 0.5} r={r * 0.4} fill="#e74c3c" fill-opacity={0.7} />
          </g>
        {/if}

        <text
          x={cx} y={cy}
          text-anchor="middle"
          dominant-baseline="central"
          fill={active ? '#fff' : '#888'}
          font-size={14}
          font-weight={active ? 700 : 400}
          class="drum-label"
        >
          {drumAbbr[id] || id}
        </text>
      </g>
    {/each}

    <rect
      x={pedalCx - pedalW / 2} y={pedalCy - pedalH / 2}
      width={pedalW} height={pedalH} rx={6}
      fill={pedalActive.active ? pedalActive.color : 'transparent'}
      stroke={pedalActive.active ? pedalActive.color : '#8a8aba'}
      stroke-width={4}
      fill-opacity={pedalAmount}
      opacity={pedalActive.active ? 1 : 0.7}
      class="drum-piece"
      style="cursor: pointer; touch-action: none;"
      onpointerdown={(e) => handlePedalToggle(e)}
      onpointerup={(e) => handlePedalRelease(e)}
      onpointercancel={(e) => handlePedalRelease(e)}
      onpointerleave={(e) => handlePedalRelease(e)}
    />
    <text
      x={pedalCx} y={pedalCy}
      text-anchor="middle" dominant-baseline="central"
      fill={pedalActive.active ? '#fff' : '#888'}
      font-size={16} font-weight={700}
      class="drum-label"
    >
      {pedalActive.label}
    </text>
    <rect
      x={pedalCx - pedalW / 2 - 4} y={pedalCy - pedalH / 2 - 4}
      width={pedalW + 8} height={pedalH + 8} rx={8}
      fill="none"
      stroke={pedalActive.color}
      stroke-width={4}
      opacity={0.5}
      class="drum-glow-ring"
    />
    {#if hihatMuteActive}
      <circle cx={pedalCx} cy={pedalCy} r={pedalH * 0.35} fill="#e74c3c" fill-opacity={0.3} stroke="#e74c3c" stroke-width={3} />
    {/if}
  </svg>
</div>
