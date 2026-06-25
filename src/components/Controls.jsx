import { useEffect } from 'react';
import { BPM_MIN, BPM_MAX, REPS_MIN, REPS_MAX, GOOD_SCORE_THRESHOLD, OK_SCORE_THRESHOLD } from '../config/constants';
import './Controls.css';

export default function Controls({
  isPlaying, onTogglePlay, onStop, bpm,
  trainingMode, onTrainingToggle, accuracyStats, missedHits,
  bpmOverride: _bpmOverride, onBpmChange,
  stopAfterReps, onStopAfterRepsChange, currentLoop,
  sessionResult, onDismissResult,
  showVisualizer, onToggleVisualizer,
  metronomeOn, onToggleMetronome,
  drumPlaybackOn, onToggleDrumPlayback,
  countdownOn, onCountdownToggle,
  grooveOn, onGrooveToggle,
}) {
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
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button className="btn btn-stop" onClick={onStop}>⏹ Stop</button>
        </div>

        <div className="controls-group bpm-group">
          <label className="control-label">BPM</label>
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

        {trainingMode && (
          <div className="controls-group reps-group">
            <label className="control-label">Reps</label>
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

        <div className="controls-group">
          <button
            className={`btn btn-countdown ${countdownOn ? 'active' : ''}`}
            onClick={onCountdownToggle}
          >
            🚦
          </button>
        </div>

        <div className="controls-group">
          <button
            className={`btn btn-groove ${grooveOn ? 'active' : ''}`}
            onClick={onGrooveToggle}
          >
            {grooveOn ? '🔀 Groove On' : '🔀 Groove'}
          </button>
        </div>

        <div className="controls-group">
          <button
            className={`btn btn-metronome ${metronomeOn ? 'active' : ''}`}
            onClick={onToggleMetronome}
          >
            {metronomeOn ? '🔊 Click' : '🔇 Click'}
          </button>
        </div>

        <div className="controls-group">
          <button
            className={`btn btn-drum-playback ${drumPlaybackOn ? 'active' : ''}`}
            onClick={onToggleDrumPlayback}
          >
            {drumPlaybackOn ? '🥁 Pattern On' : '🔇 Pattern Off'}
          </button>
        </div>

        <div className="controls-group">
          <button
            className={`btn btn-training ${trainingMode ? 'active' : ''}`}
            onClick={onTrainingToggle}
          >
            {trainingMode ? '🎯 Training On' : '🎯 Training'}
          </button>
        </div>

        <div className="controls-group">
          <button
            className={`btn btn-visualizer ${showVisualizer ? 'active' : ''}`}
            onClick={onToggleVisualizer}
          >
            {showVisualizer ? '📊 View On' : '📊 View'}
          </button>
        </div>


      </div>

      {trainingMode && !hasSessionResult && (
        <div className="training-stats">
          {accuracyStats ? (
            <div className="stats-box">
              <div className="stat">
                <span className="stat-label">Accuracy</span>
                <span className={`stat-value ${accuracyStats.score >= GOOD_SCORE_THRESHOLD ? 'good' : accuracyStats.score >= OK_SCORE_THRESHOLD ? 'ok' : 'bad'}`}>
                  {accuracyStats.score}%
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Perfect</span>
                <span className="stat-value perfect">{accuracyStats.perfect}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Good</span>
                <span className="stat-value good">{accuracyStats.good}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Off</span>
                <span className="stat-value off">{accuracyStats.off}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Extra</span>
                <span className="stat-value miss">{accuracyStats.miss}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Missed</span>
                <span className="stat-value miss">{missedHits}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total</span>
                <span className="stat-value total">{accuracyStats.total}</span>
              </div>
            </div>
          ) : (
            <div className="stats-box stats-box-empty">
              <span className="stat-label">Waiting for hits...</span>
            </div>
          )}
          {stopAfterReps > 0 && (
            <div className="reps-progress-bar">
              <div
                className="reps-progress-fill"
                style={{ width: `${Math.min((currentLoop / stopAfterReps) * 100, 100)}%` }}
              />
            </div>
          )}
        </div>
      )}

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