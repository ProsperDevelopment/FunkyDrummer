import { useState, useCallback, useEffect, useRef } from 'react';
import Timeline from './components/Timeline';
import PatternMenu from './components/PatternMenu';
import Controls from './components/Controls';
import DrumVisualizer from './components/DrumVisualizer';
import HelpModal from './components/HelpModal';
import FullscreenControls from './components/FullscreenControls';
import SettingsModal from './components/SettingsModal';
import { drumPatterns } from './data/drumPatterns';
import { useMIDI } from './hooks/useMIDI';
import { useKeyboard } from './hooks/useKeyboard';
import { usePlayback } from './hooks/usePlayback';
import { useTraining } from './hooks/useTraining';
import { useActiveDrums } from './hooks/useActiveDrums';
import { playDrum, setKit, getActiveKit, isKitLoading, getHihatPedalPressed, setHihatPedalPressed } from './audio/drumSounds';
import { drumKits } from './config/drumKits';
import { midiConfigs, getNoteMap } from './config/midiConfigs';
import { drumLayouts } from './config/drumLayouts';
import './App.css';

function getPattern(id) {
  return drumPatterns.find(p => p.id === id) || drumPatterns[0];
}

export default function App() {
  const [selectedPatternId, setSelectedPatternId] = useState(drumPatterns[0].id);
  const [bpmOverride, setBpmOverride] = useState(null);
  const [stopAfterReps, setStopAfterReps] = useState(0);
  const [sessionResult, setSessionResult] = useState(null);
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
  const midiNoteMap = getNoteMap(midiConfigId);

  const { activeDrums, hit: hitVisualizer } = useActiveDrums();

  const pattern = getPattern(selectedPatternId);

  const onPatternDrumPlayed = useCallback((drumId, vel) => {
    hitVisualizer(drumId, vel);
    setHihatPedalPressedState(getHihatPedalPressed());
  }, [hitVisualizer]);

  const playback = usePlayback(pattern, bpmOverride, stopAfterReps, onPatternDrumPlayed, metronomeOn, drumPlaybackOn);

  const defaultBpm = pattern.bpm;
  const effectiveBpm = bpmOverride || defaultBpm;

  const {
    trainingMode,
    setTrainingMode,
    userHits,
    handleDrumHit,
    clearHits,
    accuracyStats,
  } = useTraining(pattern, playback.currentStep);

  const onDrumHit = useCallback((drumId, velocity) => {
    const resolvedId = drumId === 'hihat'
      ? (hihatPedalPressed ? 'hihat' : 'hihatOpen')
      : drumId;
    const prev = getHihatPedalPressed();
    playDrum(resolvedId, velocity);
    handleDrumHit(drumId);
    hitVisualizer(resolvedId);
    const next = getHihatPedalPressed();
    if (prev !== next) {
      setHihatPedalPressedState(next);
    }
  }, [handleDrumHit, hitVisualizer, hihatPedalPressed]);

  const { inputs, activeInput, setActiveInput } = useMIDI(onDrumHit, midiNoteMap);
  useKeyboard(onDrumHit);

  const wasPlayingRef = useRef(false);
  useEffect(() => {
    if (wasPlayingRef.current && !playback.isPlaying && trainingMode) {
      setSessionResult({
        stats: accuracyStats || { perfect: 0, good: 0, off: 0, miss: 0, total: 0, score: 0 }
      });
    }
    wasPlayingRef.current = playback.isPlaying;
  }, [playback.isPlaying, trainingMode, accuracyStats]);

  const dismissResult = useCallback(() => {
    setSessionResult(null);
    clearHits();
  }, [clearHits]);

  const handlePatternSelect = useCallback((id) => {
    playback.stop();
    setSelectedPatternId(id);
    setBpmOverride(null);
    setSessionResult(null);
  }, [playback.stop]);

  const handleBpmChange = useCallback((value) => {
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

  const handleMidiConfigChange = useCallback((id) => {
    setMidiConfigId(id);
  }, []);

  const handleLayoutChange = useCallback((id) => {
    setDrumLayoutId(id);
  }, []);

  const handleHihatPedalDown = useCallback(() => {
    setHihatPedalPressedState(true);
    setHihatPedalPressed(true);
  }, []);

  const handleHihatPedalUp = useCallback(() => {
    setHihatPedalPressedState(false);
    setHihatPedalPressed(false);
  }, []);

  const handleKitChange = useCallback(async (kitId) => {
    if (kitId === activeKitId) return;
    setKitBusy(true);
    await setKit(kitId);
    setActiveKitId(kitId);
    setKitBusy(false);
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
            <PatternMenu
              selectedPatternId={selectedPatternId}
              onSelectPattern={handlePatternSelect}
            />
          </aside>
        )}

        <main className={`app-main${showPatterns ? '' : ' app-main-full'}`}>
          <Controls
            isPlaying={playback.isPlaying}
            onTogglePlay={playback.togglePlay}
            onStop={playback.stop}
            midiInputs={inputs}
            activeInput={activeInput}
            onInputChange={setActiveInput}
            bpm={effectiveBpm}
            trainingMode={trainingMode}
            onTrainingToggle={handleTrainingToggle}
            accuracyStats={accuracyStats}
            bpmOverride={bpmOverride}
            onBpmChange={handleBpmChange}
            stopAfterReps={stopAfterReps}
            onStopAfterRepsChange={setStopAfterReps}
            currentLoop={playback.currentLoop}
            sessionResult={sessionResult}
            onDismissResult={dismissResult}
            activeKitId={activeKitId}
            onKitChange={handleKitChange}
            kitBusy={kitBusy}
            showVisualizer={showVisualizer}
            onToggleVisualizer={handleToggleVisualizer}
            metronomeOn={metronomeOn}
            onToggleMetronome={handleToggleMetronome}
            drumPlaybackOn={drumPlaybackOn}
            onToggleDrumPlayback={handleToggleDrumPlayback}
            midiConfigId={midiConfigId}
            onMidiConfigChange={handleMidiConfigChange}
            drumLayoutId={drumLayoutId}
            onLayoutChange={handleLayoutChange}
          />

          <Timeline
            pattern={pattern}
            currentStep={playback.currentStep}
            isPlaying={playback.isPlaying}
            userHits={userHits}
            trainingMode={trainingMode}
          />

          {showVisualizer && (
            <DrumVisualizer activeDrums={activeDrums} onDrumClick={onDrumHit} layoutId={drumLayoutId} hihatPedalPressed={hihatPedalPressed} onHihatPedalDown={handleHihatPedalDown} onHihatPedalUp={handleHihatPedalUp} />
          )}
        </main>
      </div>

      {fullscreenMode && (
        <div className="fullscreen-overlay">
          <header className="app-header fullscreen-header">
            <h1 className="app-title">Funky Drummer</h1>
            <span className="app-subtitle">Drum Machine & Trainer</span>
            <div className="header-spacer" />
            <button
              className="header-btn settings-btn"
              onClick={handleOpenSettings}
              title="Settings"
            >⚙</button>
            <button
              className="header-btn fullscreen-btn"
              onClick={handleToggleFullscreen}
              title="Exit fullscreen"
            >⛶</button>
          </header>
          <div className="fullscreen-content">
            <Timeline
              pattern={pattern}
              currentStep={playback.currentStep}
              isPlaying={playback.isPlaying}
              userHits={userHits}
              trainingMode={trainingMode}
            />
            <div className="fullscreen-col">
              <FullscreenControls
                isPlaying={playback.isPlaying}
                onTogglePlay={playback.togglePlay}
                onStop={playback.stop}
                bpm={effectiveBpm}
                onBpmChange={handleBpmChange}
                metronomeOn={metronomeOn}
                onToggleMetronome={handleToggleMetronome}
                drumPlaybackOn={drumPlaybackOn}
                onToggleDrumPlayback={handleToggleDrumPlayback}
                trainingMode={trainingMode}
                onTrainingToggle={handleTrainingToggle}
              />
              <DrumVisualizer activeDrums={activeDrums} onDrumClick={onDrumHit} layoutId={drumLayoutId} hihatPedalPressed={hihatPedalPressed} onHihatPedalDown={handleHihatPedalDown} onHihatPedalUp={handleHihatPedalUp} />
            </div>
          </div>
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
        />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
