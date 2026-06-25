import { drumConfig } from '../config/drumConfig';
import './HelpModal.css';

export default function HelpModal({ onClose }) {
  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-modal" onClick={e => e.stopPropagation()}>
        <div className="help-header">
          <h2 className="help-title">Help</h2>
          <button className="help-close" onClick={onClose}>✕</button>
        </div>

        <div className="help-body">
          <section className="help-section">
            <h3>Playback</h3>
            <table className="help-table">
              <tbody>
                <tr><td>▶ Play / ⏸ Pause</td><td>Start or pause the pattern</td></tr>
                <tr><td>⏹ Stop</td><td>Stop and reset to the start</td></tr>
                <tr><td>🚦 Countdown</td><td>Count in 3…2…1…0 before playback starts</td></tr>
                <tr><td>🔊 Click</td><td>Toggle metronome click on/off</td></tr>
                <tr><td>🥁 Pattern On/Off</td><td>Mute or unmute the pattern drums</td></tr>
              </tbody>
            </table>
          </section>

          <section className="help-section">
            <h3>BPM & Reps</h3>
            <p>Use the slider or number input to adjust tempo (30–300). Switching patterns or tracks resets to the default BPM for that selection.</p>
            <p>In training mode, set <strong>Reps</strong> to auto-stop after a number of pattern repetitions. A slim progress bar tracks your session progress.</p>
          </section>

          <section className="help-section">
            <h3>Keyboard Shortcuts</h3>
            <table className="help-table">
              <thead>
                <tr><th>Key</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td><kbd className="help-key">Space</kbd></td><td>Play / Pause</td></tr>
                <tr><td><kbd className="help-key">Esc</kbd></td><td>Stop</td></tr>
                <tr><td><kbd className="help-key">M</kbd></td><td>Toggle metronome</td></tr>
                <tr><td><kbd className="help-key">P</kbd></td><td>Toggle pattern playback</td></tr>
                <tr><td><kbd className="help-key">T</kbd></td><td>Toggle training mode</td></tr>
                <tr><td><kbd className="help-key">G</kbd></td><td>Toggle groove</td></tr>
                <tr><td><kbd className="help-key">+</kbd> / <kbd className="help-key">-</kbd></td><td>BPM up / down by 5</td></tr>
              </tbody>
            </table>
          </section>

          <section className="help-section">
            <h3>Drum Keys</h3>
            <table className="help-table">
              <thead>
                <tr><th>Key</th><th>Drum</th></tr>
              </thead>
              <tbody>
                {drumConfig.map(d => (
                  <tr key={d.id}>
                    <td><kbd className="help-key" style={{ color: d.color }}>{d.key.toUpperCase()}</kbd></td>
                    <td>{d.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="help-section">
            <h3>MIDI</h3>
            <p>Connect a USB MIDI controller and select it from <strong>Settings → MIDI Input</strong>. Pads map automatically using the selected note map. Use the <strong>Map</strong> dropdown to switch between General MIDI and Roland TD-02K assignments.</p>
            <p>The hi-hat pedal (CC 4) opens and closes the hi-hat — press to close, release to open.</p>
          </section>

          <section className="help-section">
            <h3>Training Mode</h3>
            <p>Enable training to track your hitting accuracy. Play along with the pattern and see real-time stats for Perfect, Good, Off, Extra, and Missed hits.</p>
            <table className="help-table">
              <thead>
                <tr><th>Rating</th><th>Meaning</th></tr>
              </thead>
              <tbody>
                <tr><td className="acc-perfect">Perfect</td><td>Hit exactly on the beat</td></tr>
                <tr><td className="acc-good">Good</td><td>Within 1 sixteenth-note</td></tr>
                <tr><td className="acc-off">Off</td><td>Within 2 sixteenth-notes</td></tr>
                <tr><td className="acc-miss">Extra</td><td>No matching pattern note</td></tr>
              </tbody>
            </table>
            <p>When reps are set, the session stops automatically after the last repetition and shows a summary with your overall accuracy score. Press any key to dismiss the summary.</p>
          </section>

          <section className="help-section">
            <h3>Groove</h3>
            <p>Turn on <strong>Groove (🔀)</strong> to add micro-timing offsets to each 16th-note position. Each pattern has a tailored groove profile — swing, shuffle, or funk feels — that shifts off-beat notes slightly behind the beat for a more human, organic rhythm. Toggle it on/off at any time, even during playback.</p>
          </section>

          <section className="help-section">
            <h3>Fullscreen Mode</h3>
            <p>Click the <strong>⛶</strong> button to enter fullscreen. The timeline, drum visualizer, and training stats fill the entire screen. Controls collapse into a compact header row with toggle buttons. Click <strong>⛶</strong> again to exit.</p>
          </section>

          <section className="help-section">
            <h3>Patterns</h3>
            <p>Browse patterns grouped by style. Use the <strong>style filter</strong> dropdown above the list to show only patterns from a specific genre. Scroll the list to see all available patterns.</p>
          </section>

          <section className="help-section">
            <h3>Tracks</h3>
            <p>Select a track to play a sequence of patterns one after another. Each part repeats a configurable number of times before advancing to the next. The timeline shows a continuous 3-iteration view with the current pattern in the center and upcoming/previous patterns previewed on the sides.</p>
            <p>BPM can be overridden during track playback using the BPM slider. Training mode works with tracks — accuracy is tracked across all parts and a session summary is shown when the track finishes.</p>
          </section>

          <section className="help-section">
            <h3>Drum Visualizer</h3>
            <p>Toggle <strong>View</strong> to show a top-down SVG drum kit. Tap or click any drum to play it. Drums light up when triggered by the pattern, MIDI, or keyboard. Multi-touch supported on touch devices.</p>
            <p>Switch kit <strong>Layout</strong> in Settings between Standard and Roland TD-02K layouts.</p>
          </section>

          <section className="help-section">
            <h3>Settings</h3>
            <p>Open <strong>Settings (⚙)</strong> to configure:</p>
            <ul className="help-list">
              <li>Drum Kit — Stock (synthesized) or Boom Bap (WAV samples)</li>
              <li>Drum Layout — Standard or Roland TD-02K</li>
              <li>MIDI Input — Select your controller</li>
              <li>MIDI Map — Note assignment scheme</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
