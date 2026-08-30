import { playDrum, playMetronomeClick } from '../audio/drumSounds';
import { drumPatterns } from '../data/drumPatterns';
import { STEPS_PER_MEASURE, BEAT_INTERVAL, MEASURE_INTERVAL, COUNT_IN_BEATS } from '../config/constants';
import type { DrumPattern, Track } from '../types';

function getPattern(id: string): DrumPattern {
  return drumPatterns.find(p => p.id === id) || drumPatterns[0];
}

class PlaybackStore {
  isPlaying = $state(false);
  isCountdown = $state(false);
  currentStep = $state(0);
  totalSteps = $state(0);
  currentLoop = $state(0);
  repsComplete = $state(false);
  countdownCount = $state(0);
  currentPattern = $state<DrumPattern | null>(null);
  currentPartIndex = $state(0);
  isFinished = $state(false);

  private mode: 'pattern' | 'track' = 'pattern';
  private patternRef: DrumPattern | null = null;
  private trackRef: Track | null = null;
  private partIndexRef = 0;
  private repeatCountRef = 0;
  private intervalRef: ReturnType<typeof setTimeout> | null = null;
  private countdownTimerRef: ReturnType<typeof setTimeout> | null = null;
  private intervalMs = 1000;
  private stepRef = 0;
  private stepsRef = STEPS_PER_MEASURE * 2;
  private loopCountRef = 0;
  private bpmRef: number | null = null;
  private stopAfterRef = 0;
  private metronomeRef = false;
  private drumPlaybackRef = true;
  private countdownRef = false;
  private grooveOnRef = false;
  private onDrumPlayed?: (drumId: string, vel: number) => void;
  private drumTimeoutsRef: ReturnType<typeof setTimeout>[] = [];
  private hasPreScheduled = false;
  private rhythmModeRef = false;

  setPattern(p: DrumPattern | null) {
    this.mode = 'pattern';
    this.patternRef = p;
    this.currentPattern = p;
    if (p) {
      const steps = p.measures * STEPS_PER_MEASURE;
      this.stepsRef = steps;
      this.totalSteps = steps;
    }
  }

  setTrack(t: Track | null) {
    this.trackRef = t;
    if (t && t.parts && t.parts.length > 0) {
      this.mode = 'track';
      const firstPart = t.parts[0];
      const firstPattern = getPattern(firstPart.patternId);
      this.currentPattern = firstPattern;
      this.currentPartIndex = 0;
      this.partIndexRef = 0;
      this.repeatCountRef = 0;
      this.currentStep = 0;
      this.stepRef = 0;
      const steps = firstPattern.measures * STEPS_PER_MEASURE;
      this.stepsRef = steps;
      this.totalSteps = steps;
    } else {
      this.mode = 'pattern';
      this.currentPattern = this.patternRef;
      this.currentPartIndex = 0;
      this.partIndexRef = 0;
      this.repeatCountRef = 0;
    }
  }

  setBpm(bpm: number | null) {
    this.bpmRef = bpm;
    if (this.isPlaying) {
      const resolvedBpm = this.resolveBpm();
      if (!resolvedBpm) return;
      this.intervalMs = (60 / resolvedBpm) * 1000 / 4;
      if (this.intervalRef) clearTimeout(this.intervalRef);
      this.intervalRef = setTimeout(() => this.tick(), this.intervalMs);
    }
  }

  setStopAfter(n: number) {
    this.stopAfterRef = n;
  }

  setOnDrumPlayed(cb?: (drumId: string, vel: number) => void) {
    this.onDrumPlayed = cb;
  }

  setMetronome(on: boolean) {
    this.metronomeRef = on;
  }

  setDrumPlayback(on: boolean) {
    this.drumPlaybackRef = on;
  }

  setCountdown(on: boolean) {
    this.countdownRef = on;
  }

  setGroove(on: boolean) {
    this.grooveOnRef = on;
  }

  setRhythmMode(on: boolean) {
    this.rhythmModeRef = on;
  }

  jumpToStep(step: number) {
    if (!this.isPlaying) return;
    
    const p = this.getCurrentPatternForTick();
    if (!p) return;
    
    const steps = p.measures * STEPS_PER_MEASURE;
    const normalizedStep = ((step % steps) + steps) % steps;
    
    // Clear any pending intervals
    if (this.intervalRef) {
      clearTimeout(this.intervalRef);
      this.intervalRef = null;
    }
    
    // Clear pending drum timeouts
    for (const t of this.drumTimeoutsRef) clearTimeout(t);
    this.drumTimeoutsRef = [];
    
    // Jump to the target step
    this.stepRef = normalizedStep;
    this.currentStep = normalizedStep;
    this.hasPreScheduled = false;
    
    // Play the drums at this step
    this.playDrumsAtStep(normalizedStep);
    
    // Schedule next tick
    this.intervalRef = setTimeout(() => this.tick(), this.intervalMs);
  }

  private playDrumsAtStep(step: number) {
    const p = this.getCurrentPatternForTick();
    if (!p) return;
    
    const steps = p.measures * STEPS_PER_MEASURE;
    const modStep = step % steps;
    
    if (this.drumPlaybackRef) {
      for (const [drumId, row] of Object.entries(p.grid)) {
        if (row[modStep]) {
          const vel = row[modStep];
          playDrum(drumId, vel);
          this.onDrumPlayed?.(drumId, vel);
        }
      }
    }
    
    if (this.metronomeRef && modStep % BEAT_INTERVAL === 0) {
      playMetronomeClick(modStep % MEASURE_INTERVAL === 0);
    }
  }

  stop() {
    if (this.intervalRef) {
      clearTimeout(this.intervalRef);
      this.intervalRef = null;
    }
    if (this.countdownTimerRef) {
      clearTimeout(this.countdownTimerRef);
      this.countdownTimerRef = null;
    }
    for (const t of this.drumTimeoutsRef) clearTimeout(t);
    this.drumTimeoutsRef = [];
    this.isPlaying = false;
    this.isCountdown = false;
    this.currentStep = 0;
    this.countdownCount = 0;
    this.stepRef = 0;
    this.loopCountRef = 0;
    this.currentLoop = 0;
    this.hasPreScheduled = false;

    if (this.mode === 'track' && this.trackRef && this.trackRef.parts.length > 0) {
      const firstPattern = getPattern(this.trackRef.parts[0].patternId);
      this.currentPattern = firstPattern;
      this.currentPartIndex = 0;
      this.partIndexRef = 0;
      this.repeatCountRef = 0;
      const steps = firstPattern.measures * STEPS_PER_MEASURE;
      this.stepsRef = steps;
      this.totalSteps = steps;
    }
    this.isFinished = false;
  }

  play() {
    if (this.mode === 'track') {
      this.playTrack();
    } else {
      this.playPattern();
    }
  }

  private playPattern() {
    if (!this.patternRef) return;
    const p = this.patternRef;
    const bpm = this.bpmRef || p.bpm;
    this.intervalMs = (60 / bpm) * 1000 / 4;

    this.stepRef = 0;
    this.currentStep = 0;
    this.loopCountRef = 0;
    this.currentLoop = 0;
    this.repsComplete = false;
    this.isFinished = false;
    this.hasPreScheduled = false;

    if (this.intervalRef) clearTimeout(this.intervalRef);

    const begin = () => {
      this.isPlaying = true;
      this.isCountdown = false;
      this.countdownCount = 0;
      this.intervalRef = setTimeout(() => this.tick(), this.intervalMs);
    };

    if (this.countdownRef) {
      this.isCountdown = true;
      let count = COUNT_IN_BEATS;
      const tick = () => {
        this.countdownCount = count;
        if (count % 4 === 0) playMetronomeClick(true);
        count--;
        if (count > 0) {
          this.countdownTimerRef = setTimeout(tick, this.intervalMs);
        } else {
          this.countdownTimerRef = null;
          this.isCountdown = false;
          this.countdownCount = 0;
          begin();
        }
      };
      tick();
    } else {
      begin();
    }
  }

  private playTrack() {
    const t = this.trackRef;
    if (!t || !t.parts || t.parts.length === 0) return;

    const bpm = this.bpmRef || t.bpm;
    this.intervalMs = (60 / bpm) * 1000 / 4;

    this.stepRef = 0;
    this.partIndexRef = 0;
    this.repeatCountRef = 0;
    this.currentStep = 0;
    this.currentPartIndex = 0;
    this.isFinished = false;
    this.countdownCount = 0;
    this.hasPreScheduled = false;

    const firstPart = t.parts[0];
    const firstPattern = getPattern(firstPart.patternId);
    this.currentPattern = firstPattern;
    this.stepsRef = firstPattern.measures * STEPS_PER_MEASURE;
    this.totalSteps = this.stepsRef;

    if (this.intervalRef) clearTimeout(this.intervalRef);
    if (this.countdownTimerRef) clearTimeout(this.countdownTimerRef);

    const begin = () => {
      this.isPlaying = true;
      this.isCountdown = false;
      this.countdownCount = 0;
      this.intervalRef = setTimeout(() => this.tick(), this.intervalMs);
    };

    if (this.countdownRef) {
      this.isCountdown = true;
      let count = COUNT_IN_BEATS;
      const countTick = () => {
        this.countdownCount = count;
        if (count % 4 === 0) playMetronomeClick(true);
        count--;
        if (count > 0) {
          this.countdownTimerRef = setTimeout(countTick, this.intervalMs);
        } else {
          this.countdownTimerRef = null;
          begin();
        }
      };
      countTick();
    } else {
      begin();
    }
  }

  togglePlay() {
    if (this.isPlaying || this.isCountdown) this.stop();
    else this.play();
  }

  clearRepsComplete() {
    this.repsComplete = false;
  }

  getCurrentStep() {
    return this.stepRef;
  }

  private resolveBpm(): number | null {
    if (this.mode === 'track') {
      return this.bpmRef || this.trackRef?.bpm || null;
    }
    return this.bpmRef || this.patternRef?.bpm || null;
  }

  private getCurrentPatternForTick(): DrumPattern | null {
    if (this.mode === 'track') {
      const t = this.trackRef;
      if (!t) return null;
      const part = t.parts[this.partIndexRef];
      if (!part) return null;
      return getPattern(part.patternId);
    }
    return this.patternRef;
  }

  private scheduleDrum(drumId: string, vel: number, delay: number) {
    const t = setTimeout(() => {
      playDrum(drumId, vel);
      this.onDrumPlayed?.(drumId, vel);
    }, delay);
    this.drumTimeoutsRef.push(t);
  }

  private tick() {
    const p = this.getCurrentPatternForTick();
    if (!p) return;

    const step = this.stepRef;
    const steps = p.measures * STEPS_PER_MEASURE;
    const modStep = step % steps;
    const intervalMs = this.intervalMs;

    if (this.drumPlaybackRef) {
      const groove = p.groove;
      const grooveLen = groove ? groove.length : 16;

      if (this.grooveOnRef && groove) {
        const nextModStep = (modStep + 1) % steps;
        for (const [drumId, row] of Object.entries(p.grid)) {
          if (row[nextModStep]) {
            const vel = row[nextModStep];
            const nextGroove = groove[nextModStep % grooveLen] || 0;
            if (nextGroove < 0) {
              this.scheduleDrum(drumId, vel, intervalMs + nextGroove);
            }
          }
        }
      }

      for (const [drumId, row] of Object.entries(p.grid)) {
        if (row[modStep]) {
          const vel = row[modStep];
          const grooveOffset = this.grooveOnRef && groove ? (groove[modStep % grooveLen] || 0) : 0;
          if (grooveOffset > 0) {
            this.scheduleDrum(drumId, vel, grooveOffset);
          } else if (grooveOffset === 0) {
            playDrum(drumId, vel);
            this.onDrumPlayed?.(drumId, vel);
          } else if (!this.hasPreScheduled) {
            playDrum(drumId, vel);
            this.onDrumPlayed?.(drumId, vel);
          }
        }
      }

      this.hasPreScheduled = true;
    }

    if (this.metronomeRef && modStep % BEAT_INTERVAL === 0) {
      playMetronomeClick(modStep % MEASURE_INTERVAL === 0);
    }

    // In rhythm mode, don't auto-advance - wait for user input to trigger jump
    if (this.rhythmModeRef) {
      return;
    }

    const nextStep = step + 1;
    this.stepRef = nextStep;
    this.currentStep = nextStep;

    if (nextStep > 0 && nextStep % steps === 0) {
      if (this.mode === 'track') {
        this.handleTrackLoopBoundary();
      } else {
        this.handlePatternLoopBoundary();
      }
    } else {
      this.intervalRef = setTimeout(() => this.tick(), this.intervalMs);
    }
  }

  private handlePatternLoopBoundary() {
    this.loopCountRef++;
    this.currentLoop = this.loopCountRef;
    if (this.stopAfterRef > 0 && this.loopCountRef >= this.stopAfterRef) {
      this.repsComplete = true;
      this.stop();
      return;
    }
    if (this.stepRef >= this.stepsRef * 2) {
      this.stepRef = 0;
      this.currentStep = 0;
    }
    this.intervalRef = setTimeout(() => this.tick(), this.intervalMs);
  }

  private handleTrackLoopBoundary() {
    const t = this.trackRef;
    if (!t) return;

    this.repeatCountRef++;
    const part = t.parts[this.partIndexRef];
    if (!part) {
      this.stop();
      return;
    }

    if (this.repeatCountRef >= part.repeats) {
      const nextPart = this.partIndexRef + 1;
      if (nextPart >= t.parts.length) {
        this.isPlaying = false;
        this.isFinished = true;
        if (this.intervalRef) {
          clearTimeout(this.intervalRef);
          this.intervalRef = null;
        }
        return;
      }
      this.partIndexRef = nextPart;
      this.repeatCountRef = 0;
      this.stepRef = 0;
      this.currentStep = 0;
      this.currentPartIndex = nextPart;
      const nextPattern = getPattern(t.parts[nextPart].patternId);
      this.currentPattern = nextPattern;
      this.stepsRef = nextPattern.measures * STEPS_PER_MEASURE;
      this.totalSteps = this.stepsRef;
      this.hasPreScheduled = false;
    } else {
      this.stepRef = 0;
      this.currentStep = 0;
    }

    this.intervalRef = setTimeout(() => this.tick(), this.intervalMs);
  }
}

export const playback = new PlaybackStore();
