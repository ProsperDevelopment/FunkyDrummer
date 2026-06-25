import { useState, useRef, useEffect } from 'react';
import { BPM_MIN, BPM_MAX, REPS_MIN, REPS_MAX } from '../config/constants';
import './FullscreenControls.css';

export default function FullscreenControls({
  isPlaying, onTogglePlay, onStop, bpm, onBpmChange,
  drumPlaybackOn, onToggleDrumPlayback,
  trainingMode, onTrainingToggle,
  stopAfterReps, onStopAfterRepsChange, currentLoop,
  grooveOn, onGrooveToggle,
}) {
  const [showBpm, setShowBpm] = useState(false);
  const [showReps, setShowReps] = useState(false);
  const bpmRef = useRef(null);
  const repsRef = useRef(null);

  useEffect(() => {
    if (!showBpm) return;
    const handler = (e) => {
      if (bpmRef.current && !bpmRef.current.contains(e.target)) {
        setShowBpm(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [showBpm]);

  useEffect(() => {
    if (!showReps) return;
    const handler = (e) => {
      if (repsRef.current && !repsRef.current.contains(e.target)) {
        setShowReps(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [showReps]);

  const showPlaying = isPlaying;

  return (
    <div className="fullscreen-controls">
      <div className="fs-controls-row">
        <button
          className={`fs-btn fs-btn-play ${showPlaying ? 'playing' : ''}`}
          onClick={onTogglePlay}
          title={showPlaying ? 'Pause' : 'Play'}
        >
          {showPlaying ? '⏸' : '▶'}
        </button>
        <button className="fs-btn fs-btn-stop" onClick={onStop} title="Stop">
          ⏹
        </button>

        <button
          className={`fs-btn ${drumPlaybackOn ? 'active' : ''}`}
          onClick={onToggleDrumPlayback}
          title={drumPlaybackOn ? 'Pattern On' : 'Pattern Off'}
        >
          🥁
        </button>

        <button
          className={`fs-btn ${trainingMode ? 'active' : ''}`}
          onClick={onTrainingToggle}
          title={trainingMode ? 'Training On' : 'Training Off'}
        >
          🎯
        </button>

        <button
          className={`fs-btn ${grooveOn ? 'active' : ''}`}
          onClick={onGrooveToggle}
          title={grooveOn ? 'Groove On' : 'Groove Off'}
        >
          🔀
        </button>

        <div className="fs-separator" />

        {trainingMode && (
          <div className="fs-reps-wrap" ref={repsRef}>
            <button
              className={`fs-btn fs-btn-reps ${showReps ? 'active' : ''}`}
              onClick={() => setShowReps(v => !v)}
              title="Reps"
            >
              <span className="fs-reps-value">{stopAfterReps || REPS_MIN}</span>
            </button>
            {showReps && (
              <div className="fs-reps-popup">
                <input
                  type="range"
                  className="fs-reps-slider"
                  min={REPS_MIN}
                  max={REPS_MAX}
                  step="1"
                  value={stopAfterReps || REPS_MIN}
                  onChange={e => onStopAfterRepsChange(Number(e.target.value))}
                />
                <input
                  type="number"
                  className="fs-reps-input"
                  min={REPS_MIN}
                  max={REPS_MAX}
                  value={stopAfterReps}
                  onChange={e => {
                    const v = Number(e.target.value);
                    if (v >= REPS_MIN && v <= REPS_MAX) onStopAfterRepsChange(v);
                  }}
                />
                {showPlaying && stopAfterReps > 0 && (
                  <span className="fs-reps-counter">{currentLoop}/{stopAfterReps}</span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="fs-bpm-wrap" ref={bpmRef}>
          <button
            className={`fs-btn fs-btn-bpm ${showBpm ? 'active' : ''}`}
            onClick={() => setShowBpm(v => !v)}
            title="BPM"
          >
            <span className="fs-bpm-value">{bpm}</span>
          </button>
          {showBpm && (
            <div className="fs-bpm-popup">
              <input
                type="range"
                className="fs-bpm-slider"
                min={BPM_MIN}
                max={BPM_MAX}
                step="1"
                value={bpm}
                onChange={e => onBpmChange(Number(e.target.value))}
              />
              <input
                type="number"
                className="fs-bpm-input"
                min={BPM_MIN}
                max={BPM_MAX}
                value={bpm}
                onChange={e => {
                  const v = Number(e.target.value);
                  if (v >= BPM_MIN && v <= BPM_MAX) onBpmChange(v);
                }}
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
