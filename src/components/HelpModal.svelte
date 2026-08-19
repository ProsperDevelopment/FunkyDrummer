<script lang="ts">
  import { drumConfig } from '../config/drumConfig';
  import './HelpModal.css';

  interface Props {
    onClose: () => void;
  }

  let { onClose }: Props = $props();
</script>

<div class="help-overlay" onclick={onClose}>
  <div class="help-modal" onclick={(e) => e.stopPropagation()}>
    <div class="help-header">
      <h2 class="help-title">Help</h2>
      <button class="help-close" onclick={onClose}>&times;</button>
    </div>

    <div class="help-body">
      <section class="help-section">
        <h3>Playback</h3>
        <table class="help-table">
          <tbody>
            <tr><td>&#9654; Play / &#9208; Pause</td><td>Start or pause the pattern</td></tr>
            <tr><td>&#9209; Stop</td><td>Stop and reset to the start</td></tr>
            <tr><td>&#128678; Countdown</td><td>Count in 3&#8230;2&#8230;1&#8230;0 before playback starts</td></tr>
            <tr><td>&#128266; Click</td><td>Toggle metronome click on/off</td></tr>
            <tr><td>&#129345; Pattern On/Off</td><td>Mute or unmute the pattern drums</td></tr>
          </tbody>
        </table>
      </section>

      <section class="help-section">
        <h3>BPM & Reps</h3>
        <p>Use the slider or number input to adjust tempo (30&#8211;300). Switching patterns or tracks resets to the default BPM for that selection.</p>
        <p>In training mode, set <strong>Reps</strong> to auto-stop after a number of pattern repetitions. A slim progress bar tracks your session progress.</p>
      </section>

      <section class="help-section">
        <h3>Keyboard Shortcuts</h3>
        <table class="help-table">
          <thead>
            <tr><th>Key</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr><td><kbd class="help-key">Space</kbd></td><td>Play / Pause</td></tr>
            <tr><td><kbd class="help-key">Esc</kbd></td><td>Stop</td></tr>
            <tr><td><kbd class="help-key">M</kbd></td><td>Toggle metronome</td></tr>
            <tr><td><kbd class="help-key">P</kbd></td><td>Toggle pattern playback</td></tr>
            <tr><td><kbd class="help-key">T</kbd></td><td>Toggle training mode</td></tr>
            <tr><td><kbd class="help-key">G</kbd></td><td>Toggle groove</td></tr>
            <tr><td><kbd class="help-key">X</kbd></td><td>Hi-hat edge (closed, percussive)</td></tr>
            <tr><td><kbd class="help-key">Z</kbd></td><td>Hi-hat mute (chick sound)</td></tr>
            <tr><td><kbd class="help-key">+</kbd> / <kbd class="help-key">-</kbd></td><td>BPM up / down by 5</td></tr>
          </tbody>
        </table>
      </section>

      <section class="help-section">
        <h3>Drum Keys</h3>
        <table class="help-table">
          <thead>
            <tr><th>Key</th><th>Drum</th></tr>
          </thead>
          <tbody>
            {#each drumConfig as d (d.id)}
              <tr>
                <td><kbd class="help-key" style="color: {d.color}">{d.key.toUpperCase()}</kbd></td>
                <td>{d.name}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>

      <section class="help-section">
        <h3>MIDI</h3>
        <p>Connect a USB MIDI controller and select it from <strong>Settings &#8594; MIDI Input</strong>. Pads map automatically using the selected note map. Use the <strong>Map</strong> dropdown to switch between General MIDI and Roland TD-02K assignments.</p>
        <p>The hi-hat pedal (CC 4) controls openness &#8212; press to close, release to open. Use <kbd class="help-key">X</kbd> for a closed edge hit or <kbd class="help-key">Z</kbd> for a muted chick sound. The hi-hat choke group ensures only one hi-hat voice plays at a time.</p>
      </section>

      <section class="help-section">
        <h3>Training Mode</h3>
        <p>Enable training to track your hitting accuracy. Play along with the pattern and see real-time stats for Perfect, Good, Off, Extra, and Missed hits.</p>
        <table class="help-table">
          <thead>
            <tr><th>Rating</th><th>Meaning</th></tr>
          </thead>
          <tbody>
            <tr><td class="acc-perfect">Perfect</td><td>Hit exactly on the beat</td></tr>
            <tr><td class="acc-good">Good</td><td>Within 1 sixteenth-note</td></tr>
            <tr><td class="acc-off">Off</td><td>Within 2 sixteenth-notes</td></tr>
            <tr><td class="acc-miss">Extra</td><td>No matching pattern note</td></tr>
          </tbody>
        </table>
        <p>When reps are set, the session stops automatically after the last repetition and shows a summary with your overall accuracy score. Press any key to dismiss the summary.</p>
      </section>

      <section class="help-section">
        <h3>Groove</h3>
        <p>Turn on <strong>Groove (&#128256;)</strong> to add micro-timing offsets to each 16th-note position. Each pattern has a tailored groove profile &#8212; swing, shuffle, or funk feels &#8212; that shifts off-beat notes slightly behind the beat for a more human, organic rhythm. Toggle it on/off at any time, even during playback.</p>
      </section>

      <section class="help-section">
        <h3>Fullscreen Mode</h3>
        <p>Click the <strong>&#9966;</strong> button to enter fullscreen. The timeline, drum visualizer, and training stats fill the entire screen. Controls collapse into a compact header row with toggle buttons. Click <strong>&#9966;</strong> again to exit.</p>
      </section>

      <section class="help-section">
        <h3>Patterns</h3>
        <p>Browse patterns grouped by style. Use the <strong>style filter</strong> dropdown above the list to show only patterns from a specific genre. Scroll the list to see all available patterns.</p>
      </section>

      <section class="help-section">
        <h3>Tracks</h3>
        <p>Select a track to play a sequence of patterns one after another. Each part repeats a configurable number of times before advancing to the next. The timeline shows a continuous 3-iteration view with the current pattern in the center and upcoming/previous patterns previewed on the sides.</p>
        <p>BPM can be overridden during track playback using the BPM slider. Training mode works with tracks &#8212; accuracy is tracked across all parts and a session summary is shown when the track finishes.</p>
      </section>

      <section class="help-section">
        <h3>Drum Visualizer</h3>
        <p>Toggle <strong>View</strong> to show a top-down SVG drum kit. Tap or click any drum to play it. Drums light up when triggered by the pattern, MIDI, or keyboard. Multi-touch supported on touch devices.</p>
        <p>Switch kit <strong>Layout</strong> in Settings between Standard and Roland TD-02K layouts.</p>
      </section>

      <section class="help-section">
        <h3>Settings</h3>
        <p>Open <strong>Settings (&#9881;)</strong> to configure:</p>
        <ul class="help-list">
          <li>Drum Kit &#8212; Stock (synthesized) or Boom Bap (WAV samples)</li>
          <li>Drum Layout &#8212; Standard or Roland TD-02K</li>
          <li>MIDI Input &#8212; Select your controller</li>
          <li>MIDI Map &#8212; Note assignment scheme</li>
        </ul>
      </section>
    </div>
  </div>
</div>
