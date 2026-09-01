<script lang="ts">
  import { GOOD_SCORE_THRESHOLD, OK_SCORE_THRESHOLD } from '../config/constants';
  import type { SessionResult } from '../types';
  import PixelIcon from '../lib/PixelIcon.svelte';
  import BpmPopup from './BpmPopup.svelte';
  import RepsPopup from './RepsPopup.svelte';
  import './Controls.css';

  interface Props {
    isPlaying: boolean;
    onTogglePlay: () => void;
    onStop: () => void;
    bpm: number;
    trainingMode: boolean;
    onTrainingToggle: () => void;
    accuracyStats?: { score: number; perfect: number; good: number; near: number; miss: number; total: number } | null;
    missedHits: number;
    bpmOverride: number | null;
    onBpmChange: (bpm: number) => void;
    stopAfterReps: number;
    onStopAfterRepsChange: (reps: number) => void;
    currentLoop: number;
    sessionResult: SessionResult | null;
    onDismissResult: () => void;
    showVisualizer: boolean;
    onToggleVisualizer: () => void;
    metronomeOn: boolean;
    onToggleMetronome: () => void;
    drumPlaybackOn: boolean;
    onToggleDrumPlayback: () => void;
    grooveOn: boolean;
    onGrooveToggle: () => void;
    edgeMode: boolean;
    onEdgeModeToggle: () => void;
    trackMode: boolean;
    trackName?: string;
    trackPart: number;
    trackTotalParts: number;
    trackingMode: 'fixed' | 'rhythm' | 'adaptive';
    onTrackingModeCycle: () => void;
  }

  let {
    isPlaying,
    onTogglePlay,
    onStop,
    bpm,
    trainingMode,
    onTrainingToggle,
    bpmOverride: _bpmOverride,
    onBpmChange,
    stopAfterReps,
    onStopAfterRepsChange,
    currentLoop,
    sessionResult,
    onDismissResult,
    showVisualizer,
    onToggleVisualizer,
    metronomeOn,
    onToggleMetronome,
    drumPlaybackOn,
    onToggleDrumPlayback,
    grooveOn,
    onGrooveToggle,
    edgeMode,
    onEdgeModeToggle,
    trackMode,
    trackName,
    trackPart,
    trackTotalParts,
    trackingMode,
    onTrackingModeCycle,
  }: Props = $props();

  let hasSessionResult = $derived(sessionResult && sessionResult.stats);

  $effect(() => {
    if (!hasSessionResult) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onDismissResult();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });
</script>

<div class="controls">
  <div class="controls-row">
    <div class="controls-group">
      <button class="btn btn-play {isPlaying ? 'playing' : ''}" onclick={onTogglePlay} title={isPlaying ? 'Pause' : 'Play'}>
        {#if isPlaying}
          <PixelIcon name="pause" size={24} />
        {:else}
          <PixelIcon name="play" size={24} />
        {/if}
      </button>
    </div>

    <div class="controls-group">
      <button class="btn btn-stop" onclick={onStop} title="Stop">
        <PixelIcon name="times-square" size={24} />
      </button>
    </div>

    {#if trackMode}
      <div class="controls-group track-info-group">
        <span class="track-info-label">{trackName}</span>
        <span class="track-info-progress">Part {trackPart + 1}/{trackTotalParts}</span>
      </div>
    {/if}

    <div class="controls-group">
      <button
        class="btn btn-drum-playback {drumPlaybackOn ? 'active' : 'off'}"
        onclick={onToggleDrumPlayback}
        title="Pattern"
      >
        <PixelIcon name="disc" size={20} />
      </button>
    </div>

    <div class="controls-group">
      <button
        class="btn btn-training {trainingMode ? 'active' : 'off'}"
        onclick={onTrainingToggle}
        title="Training"
      >
        <PixelIcon name="shapes" size={20} />
      </button>
    </div>

    <div class="controls-group">
      <button
        class="btn btn-groove {grooveOn ? 'active' : 'off'}"
        onclick={onGrooveToggle}
        title="Groove"
      >
        <PixelIcon name="shuffle" size={20} />
      </button>
    </div>

    <div class="controls-group">
      <button
        class="btn btn-edge {edgeMode ? 'active' : 'off'}"
        onclick={onEdgeModeToggle}
        title="Edge"
      >
        <PixelIcon name="filter" size={20} />
      </button>
    </div>

    <div class="controls-group">
      <button
        class="btn btn-metronome {metronomeOn ? 'active' : 'off'}"
        onclick={onToggleMetronome}
        title="Metronome"
      >
        <PixelIcon name="sound-on" size={20} />
      </button>
    </div>

    <div class="controls-group">
      <button
        class="btn btn-tracking"
        onclick={onTrackingModeCycle}
        title="Tracking: {trackingMode === 'fixed' ? 'Fixed BPM' : trackingMode === 'rhythm' ? 'Your Rhythm' : 'Adaptive'}"
      >
        {#if trackingMode === 'fixed'}
          <PixelIcon name="chart-line" size={20} />
        {:else if trackingMode === 'rhythm'}
          <PixelIcon name="disc" size={20} />
        {:else}
          <PixelIcon name="chart-network" size={20} />
        {/if}
      </button>
    </div>

    <div class="controls-group">
      <button
        class="btn btn-visualizer {showVisualizer ? 'active' : 'off'}"
        onclick={onToggleVisualizer}
      >
        <PixelIcon name="chart-line" size={20} />
      </button>
    </div>

    {#if trainingMode}
      <div class="controls-group">
        <RepsPopup
          {stopAfterReps}
          {onStopAfterRepsChange}
          {isPlaying}
          {currentLoop}
          buttonClass="btn btn-reps"
          popupClass="reps-popup"
          sliderClass="reps-slider"
          inputClass="reps-input"
          wrapperClass="reps-wrap"
          counterClass="reps-counter"
        />
      </div>
    {/if}

    <div class="controls-group">
      <BpmPopup
        {bpm}
        {onBpmChange}
        buttonClass="btn btn-bpm"
        popupClass="bpm-popup"
        sliderClass="bpm-slider"
        inputClass="bpm-input"
        wrapperClass="bpm-wrap"
      />
    </div>
  </div>

  {#if hasSessionResult}
    <div class="session-overlay" onclick={onDismissResult}>
      <div class="session-modal" onclick={(e) => e.stopPropagation()}>
        <h2 class="session-modal-title">Session Complete</h2>
        <div class="session-modal-score">
          <span class="score-value {sessionResult.stats.score >= GOOD_SCORE_THRESHOLD ? 'good' : sessionResult.stats.score >= OK_SCORE_THRESHOLD ? 'ok' : 'bad'}">
            {sessionResult.stats.score}%
          </span>
          <span class="score-label">Accuracy</span>
        </div>
        <div class="session-modal-stats">
          <div class="stat">
            <span class="stat-label">Perfect</span>
            <span class="stat-value perfect">{sessionResult.stats.perfect}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Good</span>
            <span class="stat-value good">{sessionResult.stats.good}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Near</span>
            <span class="stat-value near">{sessionResult.stats.near}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Extra</span>
            <span class="stat-value miss">{sessionResult.stats.miss}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Missed</span>
            <span class="stat-value miss">{sessionResult.missedHits ?? 0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Total</span>
            <span class="stat-value total">{sessionResult.stats.total}</span>
          </div>
        </div>
        <button class="btn btn-dismiss" onclick={onDismissResult}>Dismiss</button>
      </div>
    </div>
  {/if}
</div>
