import { useState, useRef, useEffect } from 'react';
import './FullscreenControls.css';

export default function FullscreenControls({
  isPlaying, onTogglePlay, onStop, bpm, onBpmChange,
  drumPlaybackOn, onToggleDrumPlayback,
  trainingMode, onTrainingToggle,
  stopAfterReps, onStopAfterRepsChange, currentLoop,
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

  return (
    <div className="fullscreen-controls">
      <div className="fs-controls-row">
        <button
          className={`fs-btn fs-btn-play ${isPlaying ? 'playing' : ''}`}
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
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

        <div className="fs-separator" />

        {trainingMode && (
          <div className="fs-reps-wrap" ref={repsRef}>
            <button
              className={`fs-btn fs-btn-reps ${showReps ? 'active' : ''}`}
              onClick={() => setShowReps(v => !v)}
              title="Reps"
            >
              <span className="fs-reps-value">{stopAfterReps || 5}</span>
            </button>
            {showReps && (
              <div className="fs-reps-popup">
                <input
                  type="range"
                  className="fs-reps-slider"
                  min="5"
                  max="50"
                  step="1"
                  value={stopAfterReps || 5}
                  onChange={e => onStopAfterRepsChange(Number(e.target.value))}
                />
                <input
                  type="number"
                  className="fs-reps-input"
                  min="5"
                  max="50"
                  value={stopAfterReps}
                  onChange={e => {
                    const v = Number(e.target.value);
                    if (v >= 5 && v <= 50) onStopAfterRepsChange(v);
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
                min="30"
                max="300"
                step="1"
                value={bpm}
                onChange={e => onBpmChange(Number(e.target.value))}
              />
              <input
                type="number"
                className="fs-bpm-input"
                min="30"
                max="300"
                value={bpm}
                onChange={e => {
                  const v = Number(e.target.value);
                  if (v >= 30 && v <= 300) onBpmChange(v);
                }}
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
