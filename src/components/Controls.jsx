import { useState, useRef, useEffect } from 'react';
import { BPM_MIN, BPM_MAX, REPS_MIN, REPS_MAX, GOOD_SCORE_THRESHOLD, OK_SCORE_THRESHOLD } from '../config/constants';
import './Controls.css';

export default function Controls({
  isPlaying, onTogglePlay, onStop, bpm,
  trainingMode, onTrainingToggle,
  bpmOverride: _bpmOverride, onBpmChange,
  stopAfterReps, onStopAfterRepsChange, currentLoop,
  sessionResult, onDismissResult,
  showVisualizer, onToggleVisualizer,
  metronomeOn, onToggleMetronome,
  drumPlaybackOn, onToggleDrumPlayback,
  countdownOn, onCountdownToggle,
  grooveOn, onGrooveToggle,
  trackMode, trackName, trackPart, trackTotalParts,
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
  const hasSessionResult = sessionResult && sessionResult.stats;

  useEffect(() => {
    if (!hasSessionResult) return;
    const handler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onDismissResult();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [hasSessionResult, onDismissResult]);

  return (
    <div className="controls">
      <div className="controls-row">
        <div className="controls-group">
          <button className={`btn btn-play ${isPlaying ? 'playing' : ''}`} onClick={onTogglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="btn btn-stop" onClick={onStop}>⏹</button>
        </div>

        {trackMode && (
          <div className="controls-group track-info-group">
            <span className="track-info-label">{trackName}</span>
            <span className="track-info-progress">Part {trackPart + 1}/{trackTotalParts}</span>
          </div>
        )}

        <div className="controls-group bpm-wrap" ref={bpmRef}>
          <button
            className={`btn btn-bpm ${showBpm ? 'active' : ''}`}
            onClick={() => setShowBpm(v => !v)}
            title="BPM"
          >
            <span className="bpm-value">{bpm}</span>
          </button>
          {showBpm && (
            <div className="bpm-popup">
              <input
                type="range"
                className="bpm-slider"
                min={BPM_MIN}
                max={BPM_MAX}
                step="1"
                value={bpm}
                onChange={e => onBpmChange(Number(e.target.value))}
              />
              <input
                type="number"
                className="bpm-input"
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

        {trainingMode && (
          <div className="controls-group reps-wrap" ref={repsRef}>
            <button
              className={`btn btn-reps ${showReps ? 'active' : ''}`}
              onClick={() => setShowReps(v => !v)}
              title="Reps"
            >
              <span className="reps-value">{stopAfterReps || REPS_MIN}</span>
            </button>
            {showReps && (
              <div className="reps-popup">
                <input
                  type="range"
                  className="reps-slider"
                  min={REPS_MIN}
                  max={REPS_MAX}
                  step="1"
                  value={stopAfterReps || REPS_MIN}
                  onChange={e => onStopAfterRepsChange(Number(e.target.value))}
                />
                <input
                  type="number"
                  className="reps-input"
                  min={REPS_MIN}
                  max={REPS_MAX}
                  value={stopAfterReps}
                  onChange={e => {
                    const v = Number(e.target.value);
                    if (v >= REPS_MIN && v <= REPS_MAX) onStopAfterRepsChange(v);
                  }}
                />
                {isPlaying && stopAfterReps > 0 && (
                  <span className="reps-counter">{currentLoop}/{stopAfterReps}</span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="controls-group">
          <button
            className={`btn btn-countdown ${countdownOn ? 'active' : 'off'}`}
            onClick={onCountdownToggle}
          >
            🚦
          </button>
        </div>

        <div className="controls-group">
          <button
            className={`btn btn-groove ${grooveOn ? 'active' : 'off'}`}
            onClick={onGrooveToggle}
          >
            🔀
          </button>
        </div>

        <div className="controls-group">
          <button
            className={`btn btn-metronome ${metronomeOn ? 'active' : 'off'}`}
            onClick={onToggleMetronome}
          >
            🔊
          </button>
        </div>

        <div className="controls-group">
          <button
            className={`btn btn-drum-playback ${drumPlaybackOn ? 'active' : 'off'}`}
            onClick={onToggleDrumPlayback}
          >
            🥁
          </button>
        </div>

        <div className="controls-group">
          <button
            className={`btn btn-training ${trainingMode ? 'active' : 'off'}`}
            onClick={onTrainingToggle}
          >
            🎯
          </button>
        </div>

        <div className="controls-group">
          <button
            className={`btn btn-visualizer ${showVisualizer ? 'active' : 'off'}`}
            onClick={onToggleVisualizer}
          >
            📊
          </button>
        </div>


      </div>

      {hasSessionResult && (
        <div className="session-overlay" onClick={onDismissResult}>
          <div className="session-modal" onClick={e => e.stopPropagation()}>
            <h2 className="session-modal-title">Session Complete</h2>
            <div className="session-modal-score">
              <span className={`score-value ${sessionResult.stats.score >= GOOD_SCORE_THRESHOLD ? 'good' : sessionResult.stats.score >= OK_SCORE_THRESHOLD ? 'ok' : 'bad'}`}>
                {sessionResult.stats.score}%
              </span>
              <span className="score-label">Accuracy</span>
            </div>
            <div className="session-modal-stats">
              <div className="stat">
                <span className="stat-label">Perfect</span>
                <span className="stat-value perfect">{sessionResult.stats.perfect}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Good</span>
                <span className="stat-value good">{sessionResult.stats.good}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Off</span>
                <span className="stat-value off">{sessionResult.stats.off}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Extra</span>
                <span className="stat-value miss">{sessionResult.stats.miss}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Missed</span>
                <span className="stat-value miss">{sessionResult.missedHits ?? 0}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total</span>
                <span className="stat-value total">{sessionResult.stats.total}</span>
              </div>
            </div>
            <button className="btn btn-dismiss" onClick={onDismissResult}>Dismiss</button>
          </div>
        </div>
      )}

    </div>
  );
}