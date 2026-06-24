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
                <tr><td>▶ Play / ⏸ Pause</td><td>Start/stop pattern</td></tr>
                <tr><td>⏹ Stop</td><td>Stop and reset</td></tr>
                <tr><td>🔊 Click</td><td>Toggle metronome</td></tr>
                <tr><td>🥁 Pattern On/Off</td><td>Mute pattern drums</td></tr>
              </tbody>
            </table>
          </section>

          <section className="help-section">
            <h3>BPM</h3>
            <p>Use the slider or number input to adjust tempo (30–300). Switching patterns resets to the pattern's default BPM.</p>
          </section>

          <section className="help-section">
            <h3>Keyboard Shortcuts</h3>
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
            <p>Connect a USB MIDI controller, select it from the MIDI dropdown, and the pads map automatically. Use the <strong>Map</strong> dropdown to switch between General MIDI and Roland TD-02K note assignments.</p>
          </section>

          <section className="help-section">
            <h3>Training Mode</h3>
            <p>Enable training to track your hitting accuracy. Play along with the pattern and see real-time stats.</p>
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
            <p>Set <strong>Reps</strong> to auto-stop after a number of pattern repetitions. After stopping, a session summary shows your accuracy.</p>
          </section>

          <section className="help-section">
            <h3>Drum Visualizer</h3>
            <p>Toggle the <strong>View</strong> button to show a top-down SVG drum kit. Tap or click any drum to play it. Drums light up when triggered by the pattern, MIDI, or keyboard. Multi-touch is supported on touch devices.</p>
            <p>Use the <strong>Layout</strong> dropdown to switch between kit layouts (Standard, Roland TD-02K).</p>
          </section>

          <section className="help-section">
            <h3>Drum Kits</h3>
            <p>Switch between <strong>Stock Kit</strong> (synthesized) and <strong>Boom Bap</strong> (WAV samples) using the Kit dropdown.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
