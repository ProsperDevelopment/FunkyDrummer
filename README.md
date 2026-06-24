# Funky Drummer

A browser-based drum machine and practice trainer with a scrolling timeline, MIDI support, and accuracy scoring.

**Live demo:** https://ProsperDevelopment.github.io/FunkyDrummer/

## Features

- **Scrolling timeline** — Canvas-based pattern grid with centered playhead
- **15 drum patterns** — Basic Rock, Funk, Half-Time Shuffle, Metal, Jazz, Reggae, Disco, Funky Drummer, Amen Break, Hot Pants Break, Think Break, 2-Step, UK Garage, House, Hip Hop
- **MIDI support** — Connect any USB/MIDI drum controller
- **Configurable MIDI mapping** — Presets for General MIDI and Roland TD-02K
- **Keyboard controls** — Play drums from your computer keyboard
- **Metronome** — Togglable click track with accented downbeats
- **Pattern mute** — Mute the pattern playback to practice along with just the metronome
- **Training mode** — Real-time accuracy scoring (Perfect/Good/Off/Extra) with session results
- **Drum visualizer** — Top-down SVG drum kit that lights up on each hit
- **Drum kit switching** — Stock synthesized sounds or Boom Bap sample kit
- **Adjustable BPM** — Tempo slider from 30–300 BPM
- **Repetition counter** — Auto-stop after N pattern repetitions (training mode)

## Quick Start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default: http://localhost:5173).

## Controls

### Playback
| Button | Action |
|--------|--------|
| ▶ Play / ⏸ Pause | Start/stop pattern playback |
| ⏹ Stop | Stop and reset to beginning |

### BPM
Use the slider or number input to adjust tempo (30–300). Each pattern has a default BPM that resets when you switch patterns.

### Keyboard Drum Map
| Key | Drum |
|-----|------|
| A | Kick |
| S | Snare |
| D | Hi-Hat (closed) |
| F | Hi-Hat (open) |
| G | Crash |
| H | Ride |
| J | Hi Tom |
| K | Mid Tom |
| L | Floor Tom |
| ; | Clap |

### MIDI
Connect a USB MIDI controller, select it from the MIDI dropdown, and the pads map automatically. Use the **Map** dropdown to switch between General MIDI and Roland TD-02K note assignments.

### Metronome
Toggle the **Click** button to hear a metronome tick on every quarter note, with an accented tick on beat 1. Works during pattern playback and training.

### Pattern Mute
Toggle the **Pattern On/Off** button to silence the pattern's drum sounds while keeping the sequencer running. Useful for practicing along with just the metronome.

### Drum Kits
Switch between **Stock Kit** (synthesized sounds) and **Boom Bap** (WAV samples) using the Kit dropdown. Sample kits load asynchronously — a "loading..." indicator appears while samples are fetched and decoded.

### Drum Visualizer
Toggle the **View** button to show a top-down SVG drum kit illustration. Drums light up in real-time when hit via the pattern playback, MIDI pads, or keyboard. Each drum is color-coded and positioned from the drummer's perspective.

## Training Mode

Enable training mode to track your hitting accuracy:

1. Click **Training** to enable
2. Click **Play** to start the pattern
3. Play along using your MIDI pads or keyboard
4. Watch real-time accuracy stats (Perfect/Good/Off/Extra)
5. Set **Reps** to auto-stop after a number of pattern repetitions
6. After stopping, a **Session Complete** overlay shows your final accuracy percentage

### Accuracy Ratings
| Rating | Meaning |
|--------|---------|
| Perfect | Hit exactly on the beat (0 steps off) |
| Good | Hit within 1 sixteenth-note of the beat |
| Off | Hit within 2 sixteenth-notes of the beat |
| Extra | Hit with no matching pattern note nearby |

## Patterns

| Pattern | Default BPM |
|---------|-------------|
| Basic Rock | 120 |
| Funk | 100 |
| Half-Time Shuffle | 70 |
| Metal | 180 |
| Jazz | 140 |
| Reggae | 90 |
| Disco | 125 |
| Funky Drummer | 100 |
| Amen Break | 136 |
| Hot Pants Break | 108 |
| Think Break | 112 |
| 2-Step | 135 |
| UK Garage | 132 |
| House | 125 |
| Hip Hop | 95 |

## Development

### Project Structure

```
src/
├── audio/            — Sound engine (synth, sample loader, drum sounds)
├── components/       — React components (Controls, Timeline, PatternMenu, DrumVisualizer)
├── config/           — Configuration (drum mapping, kits, MIDI configs)
├── data/             — Drum patterns
├── hooks/            — React hooks (playback, training, MIDI, keyboard, active drums)
├── App.jsx           — Main app component
└── main.jsx          — Entry point
```

### Adding a Pattern

Add an entry to `src/data/drumPatterns.js`:

```js
{
  id: 'my-pattern',
  name: 'My Pattern',
  bpm: 120,
  measures: 2,
  grid: {
    kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
  },
}
```

Values are velocities (0–1, or empty/0 for no hit). The grid uses 16 positions per measure (sixteenth notes).

### Adding a Drum Kit

1. Place WAV files in a subfolder under `public/drum-kits/`
2. Add an entry to `src/config/drumKits.js`:

```js
{
  id: 'my-kit',
  name: 'My Kit',
  type: 'samples',
  samples: {
    kick: '/drum-kits/my-kit/kick.wav',
    snare: '/drum-kits/my-kit/snare.wav',
    // ... one per drum ID in drumConfig
  },
}
```

### MIDI Configuration

Add presets in `src/config/midiConfigs.js`:

```js
{
  id: 'my-module',
  name: 'My Drum Module',
  noteMap: buildMap({
    36: 'kick',
    38: 'snare',
    // ... override specific notes
  }),
}
```

## Build

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file server:

```bash
npm run preview
```

## Deploy

Push to `master` — the GitHub Actions workflow automatically builds and deploys to GitHub Pages.

Manual trigger: go to **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

## Browser Compatibility

Requires a browser that supports:
- [Web Audio API](https://caniuse.com/web-audio)
- [Canvas 2D](https://caniuse.com/canvas)
- [Web MIDI API](https://caniuse.com/midi) (for MIDI controller support)
