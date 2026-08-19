<script lang="ts">
  import './App.css';
  import Timeline from './components/Timeline.svelte';
  import PatternTrackTabs from './components/PatternTrackTabs.svelte';
  import Controls from './components/Controls.svelte';
  import DrumVisualizer from './components/DrumVisualizer.svelte';
  import HelpModal from './components/HelpModal.svelte';
  import FullscreenControls from './components/FullscreenControls.svelte';
  import SettingsModal from './components/SettingsModal.svelte';
  import TrainingStats from './components/TrainingStats.svelte';
  import FeedbackPopup from './components/FeedbackPopup.svelte';
  import { drumPatterns } from './data/drumPatterns';
  import { trackList } from './data/trackList';
  import { playback } from './stores/playback.svelte';
  import { training } from './stores/training.svelte';
  import { activeDrums } from './stores/activeDrums.svelte';
  import { midi } from './stores/midi.svelte';
  import { keyboard } from './stores/keyboard.svelte';
  import { playDrum, setKit, getActiveKit, getHihatPedalPressed, setHihatPedalAmount } from './audio/drumSounds';
  import { midiConfigs, getNoteMap } from './config/midiConfigs';
  import { drumLayouts } from './config/drumLayouts';
  import { BPM_MIN, BPM_MAX, BPM_STEP, REPS_MIN, PEDAL_CC, PEDAL_THRESHOLD } from './config/constants';
  import type { DrumPattern, SessionResult, Track } from './types';

  const edgePatternIds = new Set(
    drumPatterns.filter(p => p.id.endsWith('-edge')).map(p => p.id.slice(0, -5))
  );

  function getPattern(id: string, edgeMode = false): DrumPattern {
    if (edgeMode && edgePatternIds.has(id)) {
      const edgeP = drumPatterns.find(p => p.id === id + '-edge');
      if (edgeP) return edgeP;
    }
    return drumPatterns.find(p => p.id === id) || drumPatterns[0];
  }

  let selectedPatternId = $state(drumPatterns[0].id);
  let selectedTrackId = $state<string | null>(null);
  let bpmOverride = $state<number | null>(null);
  let stopAfterReps = $state(REPS_MIN);
  let sessionResult = $state<SessionResult | null>(null);
  let activeKitId = $state(getActiveKit().id);
  let kitBusy = $state(false);
  let showVisualizer = $state(false);
  let metronomeOn = $state(false);
  let drumPlaybackOn = $state(true);
  let midiConfigId = $state(midiConfigs[0].id);
  let drumLayoutId = $state(drumLayouts[0].id);
  let showPatterns = $state(true);
  let showHelp = $state(false);
  let fullscreenMode = $state(false);
  let showSettings = $state(false);
  let hihatPedalPressed = $state(getHihatPedalPressed());
  let countdownOn = $state(false);
  let grooveOn = $state(false);
  let edgeMode = $state(false);
  let sessionSet = $state(false);
  let positiveMode = $state(false);
  let feedbackText = $state('');
  let feedbackColor = $state('#4ade80');
  let feedbackVisible = $state(false);
  let feedbackTimer: ReturnType<typeof setTimeout> | null = null;

  let isTrackMode = $derived(selectedTrackId !== null);
  let selectedTrack: Track | null = $derived(isTrackMode ? trackList.find(t => t.id === selectedTrackId!) || null : null);
  let midiNoteMap = $derived(getNoteMap(midiConfigId));
  let pattern = $derived(getPattern(selectedPatternId, edgeMode));
  let patternDefaultBpm = $derived(pattern.bpm);
  let trackDefaultBpm = $derived(selectedTrack?.bpm ?? patternDefaultBpm);
  let defaultBpm = $derived(isTrackMode ? trackDefaultBpm : patternDefaultBpm);
  let effectiveBpm = $derived(bpmOverride || defaultBpm);
  let trainingPattern = $derived(isTrackMode ? (playback.currentPattern || pattern) : pattern);
  let trainingCurrentStep = $derived(playback.currentStep);
  let trainingIsPlaying = $derived(playback.isPlaying);

  function onPatternDrumPlayed(drumId: string, vel: number) {
    activeDrums.hit(drumId, vel);
    hihatPedalPressed = getHihatPedalPressed();
  }

  function onDrumHit(drumId: string, velocity = 0.8) {
    const resolvedId = drumId === 'hihat'
      ? (hihatPedalPressed ? 'hihat' : 'hihatOpen')
      : drumId;
    const prev = getHihatPedalPressed();
    playDrum(resolvedId, velocity);
    training.handleDrumHit(drumId);
    activeDrums.hit(resolvedId, velocity);
    const next = getHihatPedalPressed();
    if (prev !== next) {
      hihatPedalPressed = next;
    }
  }

  function handleCC(controller: number, value: number) {
    if (controller === PEDAL_CC) {
      const amount = Math.min(1, value / 127);
      setHihatPedalAmount(amount);
      hihatPedalPressed = getHihatPedalPressed();
      console.log('pedal', amount.toFixed(2), amount >= PEDAL_THRESHOLD / 127 ? 'closed' : 'open');
    }
  }

  function handleBpmUp() {
    const next = Math.min(BPM_MAX, effectiveBpm + BPM_STEP);
    bpmOverride = next === defaultBpm ? null : next;
  }

  function handleBpmDown() {
    const next = Math.max(BPM_MIN, effectiveBpm - BPM_STEP);
    bpmOverride = next === defaultBpm ? null : next;
  }

  function dismissResult() {
    sessionResult = null;
    sessionSet = false;
    playback.clearRepsComplete();
    playback.stop();
    training.clearHits();
  }

  function handlePatternSelect(id: string) {
    playback.stop();
    selectedTrackId = null;
    selectedPatternId = id;
    bpmOverride = null;
    sessionResult = null;
    sessionSet = false;
  }

  function handleTrackSelect(id: string) {
    playback.stop();
    selectedTrackId = id;
    bpmOverride = null;
    sessionResult = null;
    sessionSet = false;
  }

  function handleBpmChange(value: number) {
    bpmOverride = value === defaultBpm ? null : value;
  }

  function handleToggleVisualizer() {
    showVisualizer = !showVisualizer;
  }

  function handleToggleMetronome() {
    metronomeOn = !metronomeOn;
  }

  function handleToggleDrumPlayback() {
    drumPlaybackOn = !drumPlaybackOn;
  }

  function handleMidiConfigChange(id: string) {
    midiConfigId = id;
  }

  function handleLayoutChange(id: string) {
    drumLayoutId = id;
  }

  function handleHihatPedalToggle() {
    const next = !getHihatPedalPressed();
    setHihatPedalAmount(next ? 1 : 0);
    hihatPedalPressed = next;
  }

  async function handleKitChange(kitId: string) {
    if (kitId === activeKitId) return;
    kitBusy = true;
    try {
      await setKit(kitId);
      activeKitId = kitId;
    } finally {
      kitBusy = false;
    }
  }

  function handleToggleFullscreen() {
    fullscreenMode = !fullscreenMode;
  }

  function handleOpenSettings() {
    showSettings = true;
  }

  function handleCloseSettings() {
    showSettings = false;
  }

  function handleTrainingToggle() {
    sessionResult = null;
    training.setTrainingMode(!training.trainingMode);
  }

  function handleCountdownToggle() {
    countdownOn = !countdownOn;
  }

  function handleGrooveToggle() {
    grooveOn = !grooveOn;
  }

  function handleEdgeModeToggle() {
    edgeMode = !edgeMode;
  }

  function handlePositiveModeToggle() {
    positiveMode = !positiveMode;
  }

  function getTextsForRatio(accuracy: string, ratio: number): string[] {
    if (ratio >= 0.8) return ['Perfect!', 'Excellent!', 'Master!', 'Flawless!'];
    if (ratio >= 0.6) return ['Very Good!', 'You Got It!', 'Great!', 'Nailed It!'];
    return ['Good!', 'Funky!', 'Beat It!', 'Nice!'];
  }

  function getColorForRatio(ratio: number): string {
    if (ratio >= 0.8) return '#ef4444';
    if (ratio >= 0.6) return '#eab308';
    return '#22c55e';
  }

  function keyboardTogglePlay() {
    playback.togglePlay();
  }

  function keyboardStop() {
    playback.stop();
  }

  // Sync pattern/track to playback store
  $effect(() => {
    if (isTrackMode) {
      playback.setTrack(selectedTrack);
    } else {
      playback.setTrack(null);
      playback.setPattern(pattern);
    }
  });

  // Sync BPM to playback store
  $effect(() => {
    playback.setBpm(bpmOverride);
  });

  // Sync stopAfterReps to playback store
  $effect(() => {
    playback.setStopAfter(stopAfterReps);
  });

  // Sync onDrumPlayed to playback store
  $effect(() => {
    playback.setOnDrumPlayed(onPatternDrumPlayed);
  });

  // Sync metronomeOn to playback store
  $effect(() => {
    playback.setMetronome(metronomeOn);
  });

  // Sync drumPlaybackOn to playback store
  $effect(() => {
    playback.setDrumPlayback(drumPlaybackOn);
  });

  // Sync countdownOn to playback store
  $effect(() => {
    playback.setCountdown(countdownOn);
  });

  // Sync grooveOn to playback store
  $effect(() => {
    playback.setGroove(grooveOn);
  });

  // Sync pattern to training store
  $effect(() => {
    training.setPattern(trainingPattern);
  });

  // Sync currentStep to training store
  $effect(() => {
    training.setCurrentStep(trainingCurrentStep);
  });

  // Sync isPlaying to training store
  $effect(() => {
    training.setPlaying(trainingIsPlaying);
  });

  // Positive reinforcement feedback
  $effect(() => {
    const accuracy = training.lastHitAccuracy;
    if (positiveMode && accuracy && accuracy !== 'miss') {
      const ratio = training.hitRatio;
      const texts = getTextsForRatio(accuracy, ratio);
      feedbackText = texts[Math.floor(Math.random() * texts.length)];
      feedbackColor = getColorForRatio(ratio);
      feedbackVisible = true;
      if (feedbackTimer) clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => { feedbackVisible = false; }, 800);
    }
  });

  // Session result: pattern mode
  $effect(() => {
    if (playback.repsComplete && training.trainingMode && !isTrackMode && !sessionSet) {
      sessionSet = true;
      sessionResult = {
        stats: training.accuracyStats || { perfect: 0, good: 0, off: 0, miss: 0, total: 0, score: 0 },
        missedHits: training.missedHits,
      };
    }
  });

  // Session result: track mode
  $effect(() => {
    if (playback.isFinished && training.trainingMode && isTrackMode && !sessionSet) {
      sessionSet = true;
      sessionResult = {
        stats: training.accuracyStats || { perfect: 0, good: 0, off: 0, miss: 0, total: 0, score: 0 },
        missedHits: training.missedHits,
      };
    }
  });

  // Set initial kit
  $effect(() => {
    setKit(getActiveKit().id);
  });

  // Setup MIDI
  $effect(() => {
    midi.setOnNoteOn(onDrumHit);
    midi.setNoteMap(midiNoteMap);
    midi.setOnCC(handleCC);
    midi.init();
    return () => { midi.destroy(); };
  });

  // Setup keyboard
  $effect(() => {
    keyboard.setOnNoteOn(onDrumHit);
    keyboard.setActions({
      onTogglePlay: keyboardTogglePlay,
      onStop: keyboardStop,
      onToggleMetronome: handleToggleMetronome,
      onToggleDrumPlayback: handleToggleDrumPlayback,
      onTrainingToggle: handleTrainingToggle,
      onGrooveToggle: handleGrooveToggle,
      onEdgeModeToggle: handleEdgeModeToggle,
      onBpmUp: handleBpmUp,
      onBpmDown: handleBpmDown,
    });
    keyboard.setDisabled(showSettings);
    keyboard.init();
    return () => { keyboard.destroy(); };
  });
</script>

<div class="app">
  <header class="app-header">
    <button
      class="header-btn sidebar-toggle"
      onclick={() => { showPatterns = !showPatterns; }}
      title={showPatterns ? 'Hide patterns' : 'Show patterns'}
    >
      {showPatterns ? '◀' : '▶'}
    </button>
    <h1 class="app-title">Funky Drummer</h1>
    <span class="app-subtitle">Drum Machine & Trainer</span>
    <div class="header-spacer"></div>
    <button
      class="header-btn help-btn"
      onclick={() => { showHelp = true; }}
      title="Help"
    >
      ?
    </button>
    <button
      class="header-btn settings-btn"
      onclick={handleOpenSettings}
      title="Settings"
    >
      ⚙
    </button>
    <button
      class="header-btn fullscreen-btn"
      onclick={handleToggleFullscreen}
      title="Fullscreen"
    >
      ⛶
    </button>
  </header>

  <div class="app-layout">
    {#if showPatterns}
      <aside class="app-sidebar">
        <PatternTrackTabs
          selectedPatternId={selectedPatternId}
          onSelectPattern={handlePatternSelect}
          selectedTrackId={selectedTrackId}
          currentTrackName={playback.currentPattern?.name}
          onSelectTrack={handleTrackSelect}
          isPlayingTrack={playback.isPlaying}
          trackPart={playback.currentPartIndex}
          trackTotalParts={selectedTrack?.parts.length ?? 0}
        />
      </aside>
    {/if}

    <main class="app-main{showPatterns ? '' : ' app-main-full'}">
      <Controls
        isPlaying={playback.isPlaying}
        onTogglePlay={() => playback.togglePlay()}
        onStop={() => playback.stop()}
        bpm={effectiveBpm}
        trainingMode={training.trainingMode}
        onTrainingToggle={handleTrainingToggle}
        accuracyStats={training.accuracyStats ?? undefined}
        missedHits={training.missedHits}
        bpmOverride={bpmOverride}
        onBpmChange={handleBpmChange}
        stopAfterReps={stopAfterReps}
        onStopAfterRepsChange={(v: number) => { stopAfterReps = v; }}
        currentLoop={playback.currentLoop}
        sessionResult={sessionResult}
        onDismissResult={dismissResult}
        showVisualizer={showVisualizer}
        onToggleVisualizer={handleToggleVisualizer}
        metronomeOn={metronomeOn}
        onToggleMetronome={handleToggleMetronome}
        drumPlaybackOn={drumPlaybackOn}
        onToggleDrumPlayback={handleToggleDrumPlayback}
        countdownOn={countdownOn}
        onCountdownToggle={handleCountdownToggle}
        grooveOn={grooveOn}
        onGrooveToggle={handleGrooveToggle}
        edgeMode={edgeMode}
        onEdgeModeToggle={handleEdgeModeToggle}
        trackMode={isTrackMode}
        trackName={selectedTrack?.name ?? ''}
        trackPart={playback.currentPartIndex}
        trackTotalParts={selectedTrack?.parts.length ?? 0}
        positiveMode={positiveMode}
        onPositiveModeToggle={handlePositiveModeToggle}
      />

      <Timeline
        pattern={isTrackMode ? playback.currentPattern : pattern}
        currentStep={playback.currentStep}
        isPlaying={playback.isPlaying}
        userHits={training.userHits}
        trainingMode={training.trainingMode}
        compact={false}
        grooveOn={grooveOn}
        positiveMode={positiveMode}
      />

      {#if showVisualizer}
        <DrumVisualizer activeDrums={activeDrums.activeDrums} onDrumClick={onDrumHit} layoutId={drumLayoutId} hihatPedalPressed={hihatPedalPressed} onHihatPedalDown={handleHihatPedalToggle} />
      {/if}
      {#if training.trainingMode && !positiveMode}
        <div class="fs-stats-stack">
          {#if stopAfterReps > 0}
            <div class="fs-reps-progress-bar">
              <div
                class="fs-reps-progress-fill"
                style="width: {Math.min((playback.currentLoop / stopAfterReps) * 100, 100)}%"
              ></div>
            </div>
          {/if}
          <TrainingStats accuracyStats={training.accuracyStats} missedHits={training.missedHits} />
        </div>
      {/if}
    </main>
  </div>

  {#if fullscreenMode}
    <div class="fullscreen-overlay">
      <header class="app-header fullscreen-header">
        <h1 class="app-title">
          <span class="app-title-text">Funky Drummer</span>
          <span class="app-title-icon">🥁</span>
        </h1>
        <span class="app-subtitle">Drum Machine & Trainer</span>
        <FullscreenControls
          isPlaying={playback.isPlaying}
          onTogglePlay={() => playback.togglePlay()}
          onStop={() => playback.stop()}
          bpm={effectiveBpm}
          onBpmChange={handleBpmChange}
          drumPlaybackOn={drumPlaybackOn}
          onToggleDrumPlayback={handleToggleDrumPlayback}
          trainingMode={training.trainingMode}
          onTrainingToggle={handleTrainingToggle}
          stopAfterReps={stopAfterReps}
          onStopAfterRepsChange={(v: number) => { stopAfterReps = v; }}
          currentLoop={playback.currentLoop}
          grooveOn={grooveOn}
          onGrooveToggle={handleGrooveToggle}
          countdownOn={countdownOn}
          onCountdownToggle={handleCountdownToggle}
        />
        <div class="header-spacer"></div>
        <button
          class="header-btn fullscreen-btn"
          onclick={handleToggleFullscreen}
          title="Exit fullscreen"
        >⛶</button>
      </header>
      <div class="fullscreen-content">
        {#if training.trainingMode && !positiveMode}
          <div class="fs-stats-stack">
            {#if stopAfterReps > 0}
              <div class="fs-reps-progress-bar">
                <div
                  class="fs-reps-progress-fill"
                  style="width: {Math.min((playback.currentLoop / stopAfterReps) * 100, 100)}%"
                ></div>
              </div>
            {/if}
            <TrainingStats accuracyStats={training.accuracyStats} missedHits={training.missedHits} />
          </div>
        {/if}
        <Timeline
          pattern={isTrackMode ? playback.currentPattern : pattern}
          currentStep={playback.currentStep}
          isPlaying={playback.isPlaying}
          userHits={training.userHits}
          trainingMode={training.trainingMode}
          compact={true}
          grooveOn={grooveOn}
          positiveMode={positiveMode}
        />
        <div class="fs-viz-area">
          <DrumVisualizer activeDrums={activeDrums.activeDrums} onDrumClick={onDrumHit} layoutId={drumLayoutId} hihatPedalPressed={hihatPedalPressed} onHihatPedalDown={handleHihatPedalToggle} />
        </div>
      </div>
    </div>
  {/if}

  {#if playback.isCountdown}
    <div class="countdown-overlay">
      <span class="countdown-number">
        {Math.ceil(playback.countdownCount / 4) - 1}
      </span>
    </div>
  {/if}

  <FeedbackPopup text={feedbackText} color={feedbackColor} visible={feedbackVisible} />

  {#if showSettings}
    <SettingsModal
      onClose={handleCloseSettings}
      activeKitId={activeKitId}
      onKitChange={handleKitChange}
      kitBusy={kitBusy}
      drumLayoutId={drumLayoutId}
      onLayoutChange={handleLayoutChange}
      showVisualizer={showVisualizer}
      midiInputs={midi.inputs}
      activeInput={midi.activeInput}
      onInputChange={midi.selectInput}
      midiConfigId={midiConfigId}
      onMidiConfigChange={handleMidiConfigChange}
    />
  {/if}
  {#if showHelp}
    <HelpModal onClose={() => { showHelp = false; }} />
  {/if}
</div>
