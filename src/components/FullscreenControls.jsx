import { useState, useRef, useEffect } from 'react';
import './FullscreenControls.css';

export default function FullscreenControls({
  isPlaying, onTogglePlay, onStop, bpm, onBpmChange,
  metronomeOn, onToggleMetronome,
  drumPlaybackOn, onToggleDrumPlayback,
  trainingMode, onTrainingToggle,
}) {
  const [showBpm, setShowBpm] = useState(false);
  const bpmRef = useRef(null);

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

        <div className="fs-separator" />

        <button
          className={`fs-btn ${metronomeOn ? 'active' : ''}`}
          onClick={onToggleMetronome}
          title={metronomeOn ? 'Click On' : 'Click Off'}
        >
          🔊
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
