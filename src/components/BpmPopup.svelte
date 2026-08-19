<script lang="ts">
  import { BPM_MIN, BPM_MAX } from '../config/constants';

  interface Props {
    bpm: number;
    onBpmChange: (bpm: number) => void;
    buttonClass?: string;
    popupClass?: string;
    sliderClass?: string;
    inputClass?: string;
    wrapperClass?: string;
  }

  let {
    bpm,
    onBpmChange,
    buttonClass = 'btn btn-bpm',
    popupClass = 'bpm-popup',
    sliderClass = 'bpm-slider',
    inputClass = 'bpm-input',
    wrapperClass = 'bpm-wrap',
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
    title="BPM"
  >
    <span class="bpm-value">{bpm}</span>
  </button>
  {#if showPopup}
    <div class={popupClass}>
      <input
        type="range"
        class={sliderClass}
        min={BPM_MIN}
        max={BPM_MAX}
        step="1"
        value={bpm}
        oninput={(e) => onBpmChange(Number((e.target as HTMLInputElement).value))}
      />
      <input
        type="number"
        class={inputClass}
        min={BPM_MIN}
        max={BPM_MAX}
        value={bpm}
        oninput={(e) => {
          const v = Number((e.target as HTMLInputElement).value);
          if (v >= BPM_MIN && v <= BPM_MAX) onBpmChange(v);
        }}
      />
    </div>
  {/if}
</div>
