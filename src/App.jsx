import { useState, useCallback, useEffect, useRef } from 'react';
import Timeline from './components/Timeline';
import PatternMenu from './components/PatternMenu';
import Controls from './components/Controls';
import DrumVisualizer from './components/DrumVisualizer';
import { drumPatterns } from './data/drumPatterns';
import { useMIDI } from './hooks/useMIDI';
import { useKeyboard } from './hooks/useKeyboard';
import { usePlayback } from './hooks/usePlayback';
import { useTraining } from './hooks/useTraining';
import { useActiveDrums } from './hooks/useActiveDrums';
import { playDrum, setKit, getActiveKit, isKitLoading } from './audio/drumSounds';
import { drumKits } from './config/drumKits';
import { midiConfigs, getNoteMap } from './config/midiConfigs';
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
  const midiNoteMap = getNoteMap(midiConfigId);

  const { activeDrums, hit: hitVisualizer } = useActiveDrums();

  const pattern = getPattern(selectedPatternId);
  const playback = usePlayback(pattern, bpmOverride, stopAfterReps, hitVisualizer, metronomeOn, drumPlaybackOn);

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
    playDrum(drumId, velocity);
    handleDrumHit(drumId);
    hitVisualizer(drumId);
  }, [handleDrumHit, hitVisualizer]);

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

  const handleTrainingToggle = useCallback(() => {
    setSessionResult(null);
    setTrainingMode(!trainingMode);
  }, [trainingMode]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Funky Drummer</h1>
        <span className="app-subtitle">Drum Machine & Trainer</span>
      </header>

      <div className="app-layout">
        <aside className="app-sidebar">
          <PatternMenu
            selectedPatternId={selectedPatternId}
            onSelectPattern={handlePatternSelect}
          />
        </aside>

        <main className="app-main">
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
          />

          {showVisualizer && (
            <DrumVisualizer activeDrums={activeDrums} />
          )}
          <Timeline
            pattern={pattern}
            currentStep={playback.currentStep}
            isPlaying={playback.isPlaying}
            userHits={userHits}
            trainingMode={trainingMode}
          />
        </main>
      </div>
    </div>
  );
}
