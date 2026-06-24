import { drumKits } from '../config/drumKits';
import { midiConfigs } from '../config/midiConfigs';
import { drumLayouts } from '../config/drumLayouts';
import './Controls.css';

export default function Controls({
  isPlaying, onTogglePlay, onStop, midiInputs, activeInput, onInputChange, bpm,
  trainingMode, onTrainingToggle, accuracyStats,
  bpmOverride: _bpmOverride, onBpmChange,
  stopAfterReps, onStopAfterRepsChange, currentLoop,
  sessionResult, onDismissResult,
  activeKitId, onKitChange, kitBusy,
  showVisualizer, onToggleVisualizer,
  metronomeOn, onToggleMetronome,
  drumPlaybackOn, onToggleDrumPlayback,
  midiConfigId, onMidiConfigChange,
  drumLayoutId, onLayoutChange,
}) {
  const hasSessionResult = sessionResult && sessionResult.stats;

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
            min="30"
            max="300"
            step="1"
            value={bpm}
            onChange={e => onBpmChange(Number(e.target.value))}
          />
          <input
            type="number"
            className="bpm-input"
            min="30"
            max="300"
            value={bpm}
            onChange={e => {
              const v = Number(e.target.value);
              if (v >= 30 && v <= 300) onBpmChange(v);
            }}
          />
        </div>

        {trainingMode && (
          <div className="controls-group reps-group">
            <label className="control-label">Reps</label>
            <input
              type="number"
              className="reps-input"
              min="0"
              max="50"
              step="1"
              value={stopAfterReps}
              title="0 = continuous"
              onChange={e => onStopAfterRepsChange(Math.max(0, Math.min(50, Number(e.target.value) || 0)))}
            />
            {isPlaying && stopAfterReps > 0 && (
              <span className="reps-counter">{currentLoop}/{stopAfterReps}</span>
            )}
          </div>
        )}

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
          {showVisualizer && (
            <>
              <label className="control-label">Layout:</label>
              <select
                className="layout-select"
                value={drumLayoutId}
                onChange={e => onLayoutChange(e.target.value)}
              >
                {drumLayouts.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </>
          )}
        </div>

        <div className="controls-group">
          <label className="control-label">Kit:</label>
          <select
            className="kit-select"
            value={activeKitId}
            disabled={kitBusy}
            onChange={e => onKitChange(e.target.value)}
          >
            {drumKits.map(kit => (
              <option key={kit.id} value={kit.id}>{kit.name}</option>
            ))}
          </select>
          {kitBusy && <span className="kit-loading">loading…</span>}
        </div>

        {midiInputs.length > 0 && (
          <div className="controls-group">
            <label className="control-label">MIDI:</label>
            <select
              className="midi-select"
              value={activeInput || ''}
              onChange={e => onInputChange(e.target.value)}
            >
              {midiInputs.map(input => (
                <option key={input.id} value={input.id}>{input.name}</option>
              ))}
            </select>
          </div>
        )}

        {midiInputs.length > 0 && (
          <div className="controls-group">
            <label className="control-label">Map:</label>
            <select
              className="midi-select"
              value={midiConfigId}
              onChange={e => onMidiConfigChange(e.target.value)}
            >
              {midiConfigs.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {midiInputs.length === 0 && (
          <div className="controls-group">
            <span className="no-midi">No MIDI devices</span>
          </div>
        )}
      </div>

      {hasSessionResult && (
        <div className="session-result">
          <div className="session-result-header">
            <span className="session-result-title">Session Complete</span>
          </div>
          <div className="session-result-body">
            <div className="session-result-score">
              <span className={`score-value ${sessionResult.stats.score >= 80 ? 'good' : sessionResult.stats.score >= 50 ? 'ok' : 'bad'}`}>
                {sessionResult.stats.score}%
              </span>
              <span className="score-label">Accuracy</span>
            </div>
            <div className="session-result-stats">
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
                <span className="stat-label">Total</span>
                <span className="stat-value total">{sessionResult.stats.total}</span>
              </div>
            </div>
          </div>
          <button className="btn btn-dismiss" onClick={onDismissResult}>Dismiss</button>
        </div>
      )}

      {trainingMode && !hasSessionResult && (
        <div className="training-stats">
          {accuracyStats ? (
            <>
              <div className="stat">
                <span className="stat-label">Accuracy</span>
                <span className={`stat-value ${accuracyStats.score >= 80 ? 'good' : accuracyStats.score >= 50 ? 'ok' : 'bad'}`}>
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
                <span className="stat-label">Total</span>
                <span className="stat-value total">{accuracyStats.total}</span>
              </div>
            </>
          ) : (
            <div className="stat">
              <span className="stat-label">Waiting for hits...</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}