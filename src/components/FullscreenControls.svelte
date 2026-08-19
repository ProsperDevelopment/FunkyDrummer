<script lang="ts">
  import BpmPopup from './BpmPopup.svelte';
  import RepsPopup from './RepsPopup.svelte';
  import './FullscreenControls.css';

  interface Props {
    isPlaying: boolean;
    onTogglePlay: () => void;
    onStop: () => void;
    bpm: number;
    onBpmChange: (bpm: number) => void;
    drumPlaybackOn: boolean;
    onToggleDrumPlayback: () => void;
    trainingMode: boolean;
    onTrainingToggle: () => void;
    stopAfterReps: number;
    onStopAfterRepsChange: (reps: number) => void;
    currentLoop: number;
    grooveOn: boolean;
    onGrooveToggle: () => void;
    countdownOn: boolean;
    onCountdownToggle: () => void;
  }

  let {
    isPlaying,
    onTogglePlay,
    onStop,
    bpm,
    onBpmChange,
    drumPlaybackOn,
    onToggleDrumPlayback,
    trainingMode,
    onTrainingToggle,
    stopAfterReps,
    onStopAfterRepsChange,
    currentLoop,
    grooveOn,
    onGrooveToggle,
    countdownOn,
    onCountdownToggle,
  }: Props = $props();

  let showPlaying = $derived(isPlaying);
</script>

<div class="fullscreen-controls">
  <div class="fs-controls-row">
    <button
      class="fs-btn fs-btn-play {showPlaying ? 'playing' : ''}"
      onclick={onTogglePlay}
      title={showPlaying ? 'Pause' : 'Play'}
    >
      {showPlaying ? '⏸' : '▶'}
    </button>
    <button class="fs-btn fs-btn-stop" onclick={onStop} title="Stop">
      ⏹
    </button>

    <button
      class="fs-btn {drumPlaybackOn ? 'active' : 'off'}"
      onclick={onToggleDrumPlayback}
      title={drumPlaybackOn ? 'Pattern On' : 'Pattern Off'}
    >
      🥁
    </button>

    <button
      class="fs-btn {trainingMode ? 'active' : 'off'}"
      onclick={onTrainingToggle}
      title={trainingMode ? 'Training On' : 'Training Off'}
    >
      🎯
    </button>

    <button
      class="fs-btn {grooveOn ? 'active' : 'off'}"
      onclick={onGrooveToggle}
      title={grooveOn ? 'Groove On' : 'Groove Off'}
    >
      🔀
    </button>

    <button
      class="fs-btn {countdownOn ? 'active' : 'off'}"
      onclick={onCountdownToggle}
      title={countdownOn ? 'Countdown On' : 'Countdown Off'}
    >
      🚦
    </button>

    <div class="fs-separator"></div>

    {#if trainingMode}
      <RepsPopup
        {stopAfterReps}
        {onStopAfterRepsChange}
        isPlaying={showPlaying}
        {currentLoop}
        buttonClass="fs-btn fs-btn-reps"
        popupClass="fs-reps-popup"
        sliderClass="fs-reps-slider"
        inputClass="fs-reps-input"
        wrapperClass="fs-reps-wrap"
        counterClass="fs-reps-counter"
      />
    {/if}

    <BpmPopup
      {bpm}
      {onBpmChange}
      buttonClass="fs-btn fs-btn-bpm"
      popupClass="fs-bpm-popup"
      sliderClass="fs-bpm-slider"
      inputClass="fs-bpm-input"
      wrapperClass="fs-bpm-wrap"
    />
  </div>
</div>
