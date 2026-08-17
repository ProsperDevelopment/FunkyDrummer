# Funky Drummer

A browser-based drum machine and practice trainer with a scrolling timeline, MIDI support, hi-hat articulation, edge/top mode, and accuracy scoring.

**Live demo:** https://ProsperDevelopment.github.io/FunkyDrummer/

## Features

- **Scrolling timeline** — Canvas-based pattern grid with centered playhead
- **41 drum patterns** — Rock, Funk, Jazz, Metal, Hip Hop, Drum & Bass, House, Breakbeats, and more
- **5 edge-mode variants** — Patterns with hi-hat edge articulation on downbeats
- **Hi-hat articulation** — Edge, top, open, mute, half-open, and choke groups
- **MIDI support** — Connect any USB/MIDI drum controller (General MIDI + Roland TD-02K presets)
- **MIDI pedal control** — Continuous hi-hat pedal (CC 4) with half-open support
- **Keyboard controls** — Play drums from your computer keyboard
- **Metronome** — Togglable click track with accented downbeats
- **Groove** — Togglable micro-timing variations per pattern
- **Pattern mute** — Mute the pattern playback to practice along with just the metronome
- **Training mode** — Real-time accuracy scoring (Perfect/Good/Off/Extra) with session results
- **Track mode** — Multi-pattern arrangements with configurable repeats
- **Drum visualizer** — Top-down SVG drum kit that lights up on each hit
- **Edge/top mode toggle** — Swap patterns to edge articulation variants
- **5 drum kits** — Stock synthesized, Boom Bap, Jungle Classic, Heavy Jungle, Old School Jungle
- **Countdown timer** — 4-beat lead-in before playback starts
- **Fullscreen mode** — Focused practice view with compact timeline and stats
- **Adjustable BPM** — Tempo slider from 30–300 BPM
- **Repetition counter** — Auto-stop after N pattern repetitions (training mode)
- **Built with TypeScript** — Full type safety across all modules

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

### Play Mode
| Button | Description |
|--------|-------------|
| **Pattern** | Single-pattern practice mode |
| **Track** | Multi-pattern arrangement mode |

### BPM
Use the slider or number input to adjust tempo (30–300). Each pattern has a default BPM that resets when you switch patterns.

### Keyboard Drum Map
| Key | Drum |
|-----|------|
| A | Kick |
| S | Snare |
| D | Hi-Hat (closed) |
| F | Hi-Hat (open) |
| X | Hi-Hat (edge) |
| Z | Hi-Hat (mute) |
| G | Crash |
| H | Ride |
| J | Hi Tom |
| K | Mid Tom |
| L | Floor Tom |

### MIDI
Connect a USB MIDI controller, select it from the MIDI dropdown, and the pads map automatically. Use the **Map** dropdown to switch between General MIDI and Roland TD-02K note assignments.

**Pedal:** Connect a hi-hat pedal (MIDI CC 4) for continuous half-open control.

### Metronome
Toggle the **Click** button to hear a metronome tick on every quarter note, with an accented tick on beat 1.

### Groove
Toggle the **Groove** button to apply each pattern's built-in micro-timing deviations for a more human feel.

### Countdown
Toggle the **Count** button for a 4-beat lead-in before playback begins.

### Pattern Mute
Toggle the **Pattern** button to silence the pattern's drum sounds while keeping the sequencer running. Useful for practicing along with just the metronome.

### Edge/Top Mode
Toggle the **🎛** button to swap patterns to their edge articulation variants. When active, compatible patterns (Funk, Funky Drummer, Hip Hop, Drum & Bass, Trap) play with hi-hat edge hits on downbeats and muted/softer hi-hat on offbeats. Edge variants are hidden from the pattern menu — the toggle happens transparently.

### Fullscreen
Click **⛶** or press `F` to enter fullscreen practice mode with a compact timeline, drum visualizer, and training stats.

## Hi-Hat Articulation

The hi-hat supports five distinct articulations, all feeding into a shared choke group:

| Articulation | Trigger | Description |
|-------------|---------|-------------|
| **Top** | Key D / MIDI 42/46 | Standard closed hat (respects pedal for half-open) |
| **Open** | Key F / MIDI 46 (GM) | Sustained open hat (400ms decay) |
| **Edge** | Key X / MIDI 22/26 | Short, crisp chick sound (played from dedicated WAV sample) |
| **Mute** | Key Z / MIDI 44 | Percussive 15ms chick transient |
| **Half-open** | Pedal CC 4 (0.2–0.8) | Crossfade between closed and open samples |

Any hi-hat articulation chokes all others in the group with a 5ms fade-out.

## Drum Kits

| Kit | Type | Description |
|-----|------|-------------|
| Stock Kit | Synth | Synthesized drum sounds via Web Audio |
| Boom Bap | Samples | WAV-based classic hip-hop kit (kick, snare, hihat, hihatOpen, hihatEdge, crash, ride) |
| Jungle Classic | Samples | Classic jungle/breakbeat hardcore kit |
| Heavy Jungle | Samples | Heavier, more aggressive jungle kit |
| Old School Jungle | Samples | Vintage old-school jungle sounds |

Sample kits load asynchronously — a "loading..." indicator appears while samples are fetched and decoded. All sample kits include hi-hat edge samples.

## Patterns

### Core Patterns

| Pattern | Default BPM |
|---------|-------------|
| Basic Rock | 120 |
| Easy Rock | 100 |
| Slow Rock | 70 |
| Punk | 160 |
| Metal | 180 |
| Funk | 100 |
| Funk 2 | 100 |
| Funky Drummer | 100 |
| Half-Time Shuffle | 70 |
| Jazz | 120 |
| Swing | 110 |
| Blues | 90 |
| Reggae | 90 |
| Reggaeton | 95 |
| Disco | 120 |
| Hip Hop | 95 |
| Drum & Bass | 160 |
| Trap | 140 |
| House | 128 |
| Techno | 130 |
| Dark Techno | 130 |
| Electro | 115 |
| Electro Funk | 110 |
| Two-Step | 130 |
| UK Garage | 132 |
| Amen Break | 136 |
| Amen Break MIDI | 136 |
| Think Break | 130 |
| Hot Pants | 120 |
| Tribal | 100 |
| Tom Fill | 100 |
| Crash Fill | 110 |
| Kick & Snare | 90 |
| Kick Variations | 80 |
| Kick Only | 90 |
| Snare Accents | 80 |
| Quarter Notes | 60 |
| Eighth Note Kicks | 70 |
| Hi-Hat Control | 80 |
| Ride Practice | 90 |
| Easy Shuffle | 80 |

### Edge Variants
5 additional patterns (Funk, Funky Drummer, Hip Hop, Drum & Bass, Trap) have hidden edge articulation variants activated by the Edge/Top Mode toggle.

## Track Mode

Tracks are multi-pattern arrangements for structured practice:

| Track | Patterns |
|-------|----------|
| Rock to Funk | Basic Rock ↔ Funk |
| Groove Essentials | Funk → Reggae → Hip Hop → Funky Drummer |
| Speed Builder | Basic Rock → Metal |
| Break Beat Journey | 9-break sequence (Amen → Funky Drummer → Think → Hot Pants → ...) |
| Odd Meters | Jazz → Swing → Half-Time Shuffle |
| World Beats | Reggae → Reggaeton → Tribal |
| Electronic Run | House → Techno → Drum & Bass → UK Garage |
| Fill Practice | 4 patterns with tom/crash fills |
| +20 more | Beginner to advanced |

## Training Mode

Enable training mode to track your hitting accuracy:

1. Click **Training** to enable
2. Click **Play** to start the pattern
3. Play along using MIDI pads or keyboard
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

## Development

### Project Structure

```
src/
├── audio/            — Sound engine (synth, sample loader, drum sounds)
├── components/       — React components (Controls, Timeline, PatternMenu, DrumVisualizer, etc.)
├── config/           — Configuration (drum mapping, kits, MIDI configs, constants, layouts)
├── data/             — Drum patterns, track lists, lesson tracks
├── hooks/            — React hooks (playback, training, MIDI, keyboard, active drums)
├── App.tsx           — Main app component
├── main.tsx          — Entry point
├── types.ts          — Shared TypeScript interfaces
└── vite-env.d.ts     — Vite + Web MIDI type declarations
```

### Built With

- **TypeScript** — Strict mode with `noUnusedLocals` / `noUnusedParameters`
- **React** — Functional components with hooks
- **Vite** — Fast dev server and bundler
- **Web Audio API** — Sound synthesis and sample playback
- **Web MIDI API** — MIDI controller input
- **Canvas 2D** — Pattern timeline rendering

### Adding a Pattern

Add an entry to `src/data/drumPatterns.ts`:

```ts
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

To define a pattern with the compact `grid()` helper:

```ts
import { drumPatterns } from './drumPatterns';

function grid(measures: number, ...rows: [string, number[]][]): { measures: number; grid: DrumGrid } {
  // ...fills DrumGrid from measure count and step arrays
}
```

### Adding a Drum Kit

1. Place WAV files in a subfolder under `public/drum-kits/`
2. Add an entry to `src/config/drumKits.ts`:

```ts
{
  id: 'my-kit',
  name: 'My Kit',
  type: 'samples',
  samples: {
    kick: `${base}drum-kits/my-kit/kick.wav`,
    snare: `${base}drum-kits/my-kit/snare.wav`,
    // ... one per drum ID in drumConfig
  },
}
```

### MIDI Configuration

Add presets in `src/config/midiConfigs.ts`:

```ts
import { buildMap } from './midiConfigs';

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

### Extracting REX2 Patterns

REX2 files can be parsed and converted to patterns using `scripts/rex2_extract.py`:

```bash
python3 scripts/rex2_extract.py /path/to/breakbeat.rex
```

This extracts slice offsets, quantizes to a 16th-note grid, assigns drum types by position, and computes groove values from timing deviations.

### REX2 Pattern Extraction Details

- REX2 files use Propellerhead "CAT" container format (`CAT ` + size + `REX2` + chunks)
- SLCE entries need padding-aware stepping with byte-by-byte marker scanning
- BPM is derived from the source directory name
- Groove values are clamped to ±5ms from actual timing deviations
- Patterns are cropped to 2 measures maximum

## Build

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file server:

```bash
npm run preview
```

Type-check separately:

```bash
npx tsc --noEmit
```

## Deploy to GitHub Pages

### One-time setup

1. Go to your repo **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. No further configuration needed — the workflow file handles everything

### Automatic deploy

Push to `master` — the GitHub Actions workflow automatically builds and deploys.

### Manual trigger

Go to **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

### How to access

After a successful deployment, the app is live at:
**https://ProsperDevelopment.github.io/FunkyDrummer/**

The deployment URL is also shown in the GitHub Actions run summary under the **deploy** job → **environment** → **page_url**.

If you see a blank page:
- Check the **Actions** tab for any workflow failures
- Make sure **Settings** → **Pages** → **Source** is set to **GitHub Actions**
- Verify the build output has the correct base path — try `npm run build` locally and check that `dist/index.html` references `/FunkyDrummer/` prefixed assets

## Browser Compatibility

Requires a browser that supports:
- [Web Audio API](https://caniuse.com/web-audio)
- [Canvas 2D](https://caniuse.com/canvas)
- [Web MIDI API](https://caniuse.com/midi) (for MIDI controller support)
