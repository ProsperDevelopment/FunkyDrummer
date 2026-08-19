import { useState, useCallback, useEffect, useRef } from 'react';
import Timeline from './components/Timeline';
import PatternTrackTabs from './components/PatternTrackTabs';
import Controls from './components/Controls';
import DrumVisualizer from './components/DrumVisualizer';
import HelpModal from './components/HelpModal';
import FullscreenControls from './components/FullscreenControls';
import SettingsModal from './components/SettingsModal';
import { drumPatterns } from './data/drumPatterns';
import { trackList } from './data/trackList';
import { useMIDI } from './hooks/useMIDI';
import { useKeyboard } from './hooks/useKeyboard';
import { usePlayback } from './hooks/usePlayback';
import { useTrackPlayback } from './hooks/useTrackPlayback';
import { useTraining } from './hooks/useTraining';
import { useActiveDrums } from './hooks/useActiveDrums';
import { playDrum, setKit, getActiveKit, getHihatPedalPressed, setHihatPedalAmount } from './audio/drumSounds';
import { midiConfigs, getNoteMap } from './config/midiConfigs';
import { drumLayouts } from './config/drumLayouts';
import { BPM_MIN, BPM_MAX, BPM_STEP, REPS_MIN, PEDAL_CC, PEDAL_THRESHOLD, GOOD_SCORE_THRESHOLD, OK_SCORE_THRESHOLD } from './config/constants';
import type { DrumPattern, SessionResult, Track } from './types';
import './App.css';

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

export default function App() {
  const [selectedPatternId, setSelectedPatternId] = useState(drumPatterns[0].id);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const isTrackMode = selectedTrackId !== null;
  const selectedTrack: Track | null = isTrackMode ? trackList.find(t => t.id === selectedTrackId) || null : null;
  const [bpmOverride, setBpmOverride] = useState<number | null>(null);
  const [stopAfterReps, setStopAfterReps] = useState(REPS_MIN);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [activeKitId, setActiveKitId] = useState(getActiveKit().id);
  const [kitBusy, setKitBusy] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [drumPlaybackOn, setDrumPlaybackOn] = useState(true);
  const [midiConfigId, setMidiConfigId] = useState(midiConfigs[0].id);
  const [drumLayoutId, setDrumLayoutId] = useState(drumLayouts[0].id);
  const [showPatterns, setShowPatterns] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hihatPedalPressed, setHihatPedalPressedState] = useState(getHihatPedalPressed());
  const [countdownOn, setCountdownOn] = useState(false);
  const [grooveOn, setGrooveOn] = useState(false);
  const [edgeMode, setEdgeMode] = useState(false);
  const sessionSetRef = useRef(false);
  const midiNoteMap = getNoteMap(midiConfigId);

  const { activeDrums, hit: hitVisualizer } = useActiveDrums();

  const pattern = getPattern(selectedPatternId, edgeMode);

  const onPatternDrumPlayed = useCallback((drumId: string, vel: number) => {
    hitVisualizer(drumId, vel);
    setHihatPedalPressedState(getHihatPedalPressed());
  }, [hitVisualizer]);

  const playback = usePlayback(pattern, bpmOverride, stopAfterReps, onPatternDrumPlayed, metronomeOn, drumPlaybackOn, countdownOn, grooveOn);
  const trackPlayback = useTrackPlayback(selectedTrack, onPatternDrumPlayed, metronomeOn, drumPlaybackOn, bpmOverride, countdownOn, grooveOn);

  const patternDefaultBpm = pattern.bpm;
  const trackDefaultBpm = selectedTrack?.bpm ?? patternDefaultBpm;
  const defaultBpm = isTrackMode ? trackDefaultBpm : patternDefaultBpm;
  const effectiveBpm = bpmOverride || defaultBpm;

  const trainingPattern = isTrackMode ? (trackPlayback.currentPattern || pattern) : pattern;
  const trainingCurrentStep = isTrackMode ? trackPlayback.currentStep : playback.currentStep;
  const trainingIsPlaying = isTrackMode ? trackPlayback.isPlaying : playback.isPlaying;
  const {
    trainingMode,
    setTrainingMode,
    userHits,
    handleDrumHit,
    clearHits,
    accuracyStats,
    missedHits,
  } = useTraining(trainingPattern, trainingCurrentStep, trainingIsPlaying);

  const onDrumHit = useCallback((drumId: string, velocity = 0.8) => {
    const resolvedId = drumId === 'hihat'
      ? (hihatPedalPressed ? 'hihat' : 'hihatOpen')
      : drumId;
    const prev = getHihatPedalPressed();
    playDrum(resolvedId, velocity);
    handleDrumHit(drumId);
    hitVisualizer(resolvedId, velocity);
    const next = getHihatPedalPressed();
    if (prev !== next) {
      setHihatPedalPressedState(next);
    }
  }, [handleDrumHit, hitVisualizer, hihatPedalPressed]);

  const handleCC = useCallback((controller: number, value: number) => {
    if (controller === PEDAL_CC) {
      const amount = Math.min(1, value / 127);
      setHihatPedalAmount(amount);
      setHihatPedalPressedState(getHihatPedalPressed());
      console.log('pedal', amount.toFixed(2), amount >= PEDAL_THRESHOLD / 127 ? 'closed' : 'open');
    }
  }, []);

  const { inputs, activeInput, setActiveInput } = useMIDI(onDrumHit, midiNoteMap, handleCC);

  const handleBpmUp = useCallback(() => {
    const next = Math.min(BPM_MAX, effectiveBpm + BPM_STEP);
    setBpmOverride(next === defaultBpm ? null : next);
  }, [effectiveBpm, defaultBpm]);

  const handleBpmDown = useCallback(() => {
    const next = Math.max(BPM_MIN, effectiveBpm - BPM_STEP);
    setBpmOverride(next === defaultBpm ? null : next);
  }, [effectiveBpm, defaultBpm]);

  useEffect(() => {
    if (playback.repsComplete && trainingMode && !isTrackMode && !sessionSetRef.current) {
      sessionSetRef.current = true;
      setSessionResult({
        stats: accuracyStats || { perfect: 0, good: 0, off: 0, miss: 0, total: 0, score: 0 },
        missedHits,
      });
    }
  }, [playback.repsComplete, trainingMode, accuracyStats, isTrackMode]);

  useEffect(() => {
    if (trackPlayback.isFinished && trainingMode && isTrackMode && !sessionSetRef.current) {
      sessionSetRef.current = true;
      setSessionResult({
        stats: accuracyStats || { perfect: 0, good: 0, off: 0, miss: 0, total: 0, score: 0 },
        missedHits,
      });
    }
  }, [trackPlayback.isFinished, trainingMode, accuracyStats, isTrackMode]);

  const dismissResult = useCallback(() => {
    setSessionResult(null);
    sessionSetRef.current = false;
    playback.clearRepsComplete();
    trackPlayback.stop();
    clearHits();
  }, [clearHits, playback.clearRepsComplete, trackPlayback.stop]);

  const handlePatternSelect = useCallback((id: string) => {
    playback.stop();
    trackPlayback.stop();
    setSelectedTrackId(null);
    setSelectedPatternId(id);
    setBpmOverride(null);
    setSessionResult(null);
    sessionSetRef.current = false;
  }, [playback.stop, trackPlayback.stop]);

  const handleTrackSelect = useCallback((id: string) => {
    playback.stop();
    trackPlayback.stop();
    setSelectedTrackId(id);
    setBpmOverride(null);
    setSessionResult(null);
    sessionSetRef.current = false;
  }, [playback.stop, trackPlayback.stop]);

  const handleBpmChange = useCallback((value: number) => {
    setBpmOverride(value === defaultBpm ? null : value);
  }, [defaultBpm]);

  const handleToggleVisualizer = useCallback(() => {
    setShowVisualizer(v => !v);
  }, []);

  const handleToggleMetronome = useCallback(() => {
    setMetronomeOn(v => !v);
  }, []);

  const handleToggleDrumPlayback = useCallback(() => {
    setDrumPlaybackOn(v => !v);
  }, []);

  const handleMidiConfigChange = useCallback((id: string) => {
    setMidiConfigId(id);
  }, []);

  const handleLayoutChange = useCallback((id: string) => {
    setDrumLayoutId(id);
  }, []);

  const handleHihatPedalToggle = useCallback(() => {
    const next = !getHihatPedalPressed();
    setHihatPedalAmount(next ? 1 : 0);
    setHihatPedalPressedState(next);
  }, []);

  const handleKitChange = useCallback(async (kitId: string) => {
    if (kitId === activeKitId) return;
    setKitBusy(true);
    try {
      await setKit(kitId);
      setActiveKitId(kitId);
    } finally {
      setKitBusy(false);
    }
  }, [activeKitId]);

  useEffect(() => {
    setKit(getActiveKit().id);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    setFullscreenMode(v => !v);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const handleTrainingToggle = useCallback(() => {
    setSessionResult(null);
    setTrainingMode(!trainingMode);
  }, [trainingMode]);

  const handleCountdownToggle = useCallback(() => {
    setCountdownOn(v => !v);
  }, []);

  const handleGrooveToggle = useCallback(() => {
    setGrooveOn(v => !v);
  }, []);

  const handleEdgeModeToggle = useCallback(() => {
    setEdgeMode(v => !v);
  }, []);

  const keyboardTogglePlay = useCallback(() => {
    if (isTrackMode) trackPlayback.togglePlay();
    else playback.togglePlay();
  }, [isTrackMode, trackPlayback.togglePlay, playback.togglePlay]);

  const keyboardStop = useCallback(() => {
    if (isTrackMode) trackPlayback.stop();
    else playback.stop();
  }, [isTrackMode, trackPlayback.stop, playback.stop]);

  useKeyboard(onDrumHit, {
    onTogglePlay: keyboardTogglePlay,
    onStop: keyboardStop,
    onToggleMetronome: handleToggleMetronome,
    onToggleDrumPlayback: handleToggleDrumPlayback,
    onTrainingToggle: handleTrainingToggle,
    onGrooveToggle: handleGrooveToggle,
    onEdgeModeToggle: handleEdgeModeToggle,
    onBpmUp: handleBpmUp,
    onBpmDown: handleBpmDown,
  }, showSettings);

  return (
    <div className="app">
      <header className="app-header">
        <button
          className="header-btn sidebar-toggle"
          onClick={() => setShowPatterns(v => !v)}
          title={showPatterns ? 'Hide patterns' : 'Show patterns'}
        >
          {showPatterns ? '◀' : '▶'}
        </button>
        <h1 className="app-title">Funky Drummer</h1>
        <span className="app-subtitle">Drum Machine & Trainer</span>
        <div className="header-spacer" />
        <button
          className="header-btn help-btn"
          onClick={() => setShowHelp(true)}
          title="Help"
        >
          ?
        </button>
        <button
          className="header-btn settings-btn"
          onClick={handleOpenSettings}
          title="Settings"
        >
          ⚙
        </button>
        <button
          className="header-btn fullscreen-btn"
          onClick={handleToggleFullscreen}
          title="Fullscreen"
        >
          ⛶
        </button>
      </header>

      <div className="app-layout">
        {showPatterns && (
          <aside className="app-sidebar">
            <PatternTrackTabs
              selectedPatternId={selectedPatternId}
              onSelectPattern={handlePatternSelect}
              selectedTrackId={selectedTrackId}
              currentTrackName={trackPlayback.currentPattern?.name}
              onSelectTrack={handleTrackSelect}
              isPlayingTrack={trackPlayback.isPlaying}
              trackPart={trackPlayback.currentPartIndex}
              trackTotalParts={selectedTrack?.parts.length ?? 0}
            />
          </aside>
        )}

        <main className={`app-main${showPatterns ? '' : ' app-main-full'}`}>
          <Controls
            isPlaying={isTrackMode ? trackPlayback.isPlaying : playback.isPlaying}
            onTogglePlay={isTrackMode ? trackPlayback.togglePlay : playback.togglePlay}
            onStop={isTrackMode ? trackPlayback.stop : playback.stop}
            bpm={effectiveBpm}
            trainingMode={trainingMode}
            onTrainingToggle={handleTrainingToggle}
            accuracyStats={accuracyStats ?? undefined}
            missedHits={missedHits}
            bpmOverride={bpmOverride}
            onBpmChange={handleBpmChange}
            stopAfterReps={stopAfterReps}
            onStopAfterRepsChange={setStopAfterReps}
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
            trackPart={trackPlayback.currentPartIndex}
            trackTotalParts={selectedTrack?.parts.length ?? 0}
          />

          <Timeline
            pattern={isTrackMode ? trackPlayback.currentPattern : pattern}
            currentStep={isTrackMode ? trackPlayback.currentStep : playback.currentStep}
            isPlaying={isTrackMode ? trackPlayback.isPlaying : playback.isPlaying}
            userHits={userHits}
            trainingMode={trainingMode}
            compact={false}
            grooveOn={grooveOn}
          />

          {showVisualizer && (
            <DrumVisualizer activeDrums={activeDrums} onDrumClick={onDrumHit} layoutId={drumLayoutId} hihatPedalPressed={hihatPedalPressed} onHihatPedalDown={handleHihatPedalToggle} />
          )}
          {trainingMode && (
            <div className="fs-stats-stack">
              {stopAfterReps > 0 && (
                <div className="fs-reps-progress-bar">
                  <div
                    className="fs-reps-progress-fill"
                    style={{ width: `${Math.min((playback.currentLoop / stopAfterReps) * 100, 100)}%` }}
                  />
                </div>
              )}
              {accuracyStats ? (
                <>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Acc</span>
                    <span className={`fs-stat-value ${accuracyStats.score >= GOOD_SCORE_THRESHOLD ? 'good' : accuracyStats.score >= OK_SCORE_THRESHOLD ? 'ok' : 'bad'}`}>
                      {accuracyStats.score}%
                    </span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Perfect</span>
                    <span className="fs-stat-value perfect">{accuracyStats.perfect}</span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Good</span>
                    <span className="fs-stat-value good">{accuracyStats.good}</span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Off</span>
                    <span className="fs-stat-value off">{accuracyStats.off}</span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Extra</span>
                    <span className="fs-stat-value miss">{accuracyStats.miss}</span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Missed</span>
                    <span className="fs-stat-value miss">{missedHits}</span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Total</span>
                    <span className="fs-stat-value total">{accuracyStats.total}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Acc</span>
                    <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Perfect</span>
                    <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Good</span>
                    <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Off</span>
                    <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Extra</span>
                    <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Missed</span>
                    <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                  </div>
                  <div className="fs-stat">
                    <span className="fs-stat-label">Total</span>
                    <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {fullscreenMode && (
        <div className="fullscreen-overlay">
          <header className="app-header fullscreen-header">
            <h1 className="app-title">
              <span className="app-title-text">Funky Drummer</span>
              <span className="app-title-icon">🥁</span>
            </h1>
            <span className="app-subtitle">Drum Machine & Trainer</span>
            <FullscreenControls
              isPlaying={isTrackMode ? trackPlayback.isPlaying : playback.isPlaying}
              onTogglePlay={isTrackMode ? trackPlayback.togglePlay : playback.togglePlay}
              onStop={isTrackMode ? trackPlayback.stop : playback.stop}
            bpm={effectiveBpm}
              onBpmChange={handleBpmChange}
              drumPlaybackOn={drumPlaybackOn}
              onToggleDrumPlayback={handleToggleDrumPlayback}
              trainingMode={trainingMode}
              onTrainingToggle={handleTrainingToggle}
              stopAfterReps={stopAfterReps}
              onStopAfterRepsChange={setStopAfterReps}
              currentLoop={playback.currentLoop}
              grooveOn={grooveOn}
              onGrooveToggle={handleGrooveToggle}
              countdownOn={countdownOn}
              onCountdownToggle={handleCountdownToggle}
            />
            <div className="header-spacer" />
            <button
              className="header-btn fullscreen-btn"
              onClick={handleToggleFullscreen}
              title="Exit fullscreen"
            >⛶</button>
          </header>
          <div className="fullscreen-content">
            {trainingMode && (
              <div className="fs-stats-stack">
                {stopAfterReps > 0 && (
                  <div className="fs-reps-progress-bar">
                    <div
                      className="fs-reps-progress-fill"
                      style={{ width: `${Math.min((playback.currentLoop / stopAfterReps) * 100, 100)}%` }}
                    />
                  </div>
                )}
                {accuracyStats ? (
                  <>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Acc</span>
                      <span className={`fs-stat-value ${accuracyStats.score >= GOOD_SCORE_THRESHOLD ? 'good' : accuracyStats.score >= OK_SCORE_THRESHOLD ? 'ok' : 'bad'}`}>
                        {accuracyStats.score}%
                      </span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Perfect</span>
                      <span className="fs-stat-value perfect">{accuracyStats.perfect}</span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Good</span>
                      <span className="fs-stat-value good">{accuracyStats.good}</span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Off</span>
                      <span className="fs-stat-value off">{accuracyStats.off}</span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Extra</span>
                      <span className="fs-stat-value miss">{accuracyStats.miss}</span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Missed</span>
                      <span className="fs-stat-value miss">{missedHits}</span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Total</span>
                      <span className="fs-stat-value total">{accuracyStats.total}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Acc</span>
                      <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Perfect</span>
                      <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Good</span>
                      <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Off</span>
                      <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Extra</span>
                      <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Missed</span>
                      <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                    </div>
                    <div className="fs-stat">
                      <span className="fs-stat-label">Total</span>
                      <span className="fs-stat-value" style={{ color: '#555' }}>-</span>
                    </div>
                  </>
                )}
              </div>
            )}
            <Timeline
              pattern={isTrackMode ? trackPlayback.currentPattern : pattern}
              currentStep={isTrackMode ? trackPlayback.currentStep : playback.currentStep}
              isPlaying={isTrackMode ? trackPlayback.isPlaying : playback.isPlaying}
              userHits={userHits}
              trainingMode={trainingMode}
              compact={true}
              grooveOn={grooveOn}
            />
            <div className="fs-viz-area">
              <DrumVisualizer activeDrums={activeDrums} onDrumClick={onDrumHit} layoutId={drumLayoutId} hihatPedalPressed={hihatPedalPressed} onHihatPedalDown={handleHihatPedalToggle} />
            </div>
          </div>
        </div>
      )}

      {(isTrackMode ? trackPlayback.isCountdown : playback.isCountdown) && (
        <div className="countdown-overlay">
          <span className="countdown-number" key={Math.ceil((isTrackMode ? trackPlayback.countdownCount : playback.countdownCount) / 4)}>
            {Math.ceil((isTrackMode ? trackPlayback.countdownCount : playback.countdownCount) / 4) - 1}
          </span>
        </div>
      )}

      {showSettings && (
        <SettingsModal
          onClose={handleCloseSettings}
          activeKitId={activeKitId}
          onKitChange={handleKitChange}
          kitBusy={kitBusy}
          drumLayoutId={drumLayoutId}
          onLayoutChange={handleLayoutChange}
          showVisualizer={showVisualizer}
          midiInputs={inputs}
          activeInput={activeInput}
          onInputChange={setActiveInput}
          midiConfigId={midiConfigId}
          onMidiConfigChange={handleMidiConfigChange}
        />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
