<script lang="ts">
  import { REPS_MIN, REPS_MAX } from '../config/constants';

  interface Props {
    stopAfterReps: number;
    onStopAfterRepsChange: (reps: number) => void;
    isPlaying?: boolean;
    currentLoop?: number;
    buttonClass?: string;
    popupClass?: string;
    sliderClass?: string;
    inputClass?: string;
    wrapperClass?: string;
    counterClass?: string;
  }

  let {
    stopAfterReps,
    onStopAfterRepsChange,
    isPlaying = false,
    currentLoop = 0,
    buttonClass = 'btn btn-reps',
    popupClass = 'reps-popup',
    sliderClass = 'reps-slider',
    inputClass = 'reps-input',
    wrapperClass = 'reps-wrap',
    counterClass = 'reps-counter',
  }: Props = $props();

  let showPopup = $state(false);
  let wrapRef = $state<HTMLDivElement>();

  $effect(() => {
    if (!showPopup) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef && !wrapRef.contains(e.target as Node)) {
        showPopup = false;
      }
    };
    const touchHandler = ((e: TouchEvent) => {
      if (wrapRef && !wrapRef.contains(e.target as Node)) {
        showPopup = false;
      }
    }) as EventListener;
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', touchHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', touchHandler);
    };
  });
</script>

<div class={wrapperClass} bind:this={wrapRef}>
  <button
    class="{buttonClass} {showPopup ? 'active' : ''}"
    onclick={() => (showPopup = !showPopup)}
    title="Reps"
  >
    <span class="reps-value">{stopAfterReps || REPS_MIN}</span>
  </button>
  {#if showPopup}
    <div class={popupClass}>
      <input
        type="range"
        class={sliderClass}
        min={REPS_MIN}
        max={REPS_MAX}
        step="1"
        value={stopAfterReps || REPS_MIN}
        oninput={(e) => onStopAfterRepsChange(Number((e.target as HTMLInputElement).value))}
      />
      <input
        type="number"
        class={inputClass}
        min={REPS_MIN}
        max={REPS_MAX}
        value={stopAfterReps}
        oninput={(e) => {
          const v = Number((e.target as HTMLInputElement).value);
          if (v >= REPS_MIN && v <= REPS_MAX) onStopAfterRepsChange(v);
        }}
      />
      {#if isPlaying && stopAfterReps > 0}
        <span class={counterClass}>{currentLoop}/{stopAfterReps}</span>
      {/if}
    </div>
  {/if}
</div>
