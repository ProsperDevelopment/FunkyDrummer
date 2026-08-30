import { STEPS_PER_MEASURE, TRAINING_HIT_TOLERANCE, TRAINING_SCORE_GOOD_WEIGHT, TRAINING_SCORE_MULTIPLIER } from '../config/constants';
import { getHitRate, saveHitRate } from '../lib/hitRates';
import type { DrumPattern, UserHit, TrainingStats } from '../types';

class TrainingStore {
  trainingMode = $state(false);
  userHits = $state<UserHit[]>([]);
  missedHits = $state(0);
  lastHitAccuracy = $state<string | null>(null);
  lastHitTimestamp = $state(0);
  savedHitRate = $state(0);
  rhythmBpm = $state<number | null>(null);
  jumpTarget = $state<number | null>(null);

  private runningCounts: Record<string, number> = { perfect: 0, good: 0, near: 0, miss: 0 };
  private hitId = 0;
  private currentStepRef = 0;
  private prevStepRef = 0;
  private patternRef: DrumPattern | null = null;
  private patternId: string | undefined = undefined;
  private missedSteps = new Set<number>();
  private userHitsRef: UserHit[] = [];
  private isPlaying = false;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;
  private feedbackTimer: ReturnType<typeof setTimeout> | null = null;
  private lastHitTimeRef = 0;
  private hitIntervalsRef: number[] = [];

  get hitRatio(): number {
    const c = this.runningCounts;
    const total = (c.perfect || 0) + (c.good || 0) + (c.near || 0) + (c.miss || 0);
    if (total === 0) return 0;
    return (c.perfect + c.good) / total;
  }

  get accuracyStats(): TrainingStats | null {
    const c = this.runningCounts;
    const total = (c.perfect || 0) + (c.good || 0) + (c.near || 0) + (c.miss || 0);
    if (total === 0) return null;
    const score = Math.round(((c.perfect + c.good * TRAINING_SCORE_GOOD_WEIGHT) / total) * TRAINING_SCORE_MULTIPLIER);
    return { perfect: c.perfect, good: c.good, near: c.near, miss: c.miss, total, score };
  }

  private findNearestPatternStep(drumId: string, currentStep: number): number | null {
    const p = this.patternRef;
    if (!p) return null;
    const steps = p.measures * STEPS_PER_MEASURE;
    const row = p.grid[drumId];
    if (!row) return null;

    // Search forward from current step + 1 for the next note
    for (let offset = 1; offset <= steps; offset++) {
      const checkStep = (currentStep + offset) % steps;
      if (row[checkStep]) {
        return checkStep;
      }
    }
    return null;
  }

  setPattern(pattern: DrumPattern | null) {
    if (pattern?.id !== this.patternId) {
      this.patternId = pattern?.id;
      this.patternRef = pattern;
      this.userHits = [];
      this.missedHits = 0;
      this.runningCounts = { perfect: 0, good: 0, near: 0, miss: 0 };
      this.lastHitAccuracy = null;
      // Load saved hit rate for this pattern
      if (pattern) {
        const saved = getHitRate(pattern.id);
        this.savedHitRate = saved ? saved.avgHitRate : 0;
      } else {
        this.savedHitRate = 0;
      }
    }
  }

  setTrackId(trackId: string | null) {
    if (trackId && trackId !== this.patternId) {
      this.patternId = trackId;
      this.userHits = [];
      this.missedHits = 0;
      this.runningCounts = { perfect: 0, good: 0, near: 0, miss: 0 };
      this.lastHitAccuracy = null;
      const saved = getHitRate(trackId);
      this.savedHitRate = saved ? saved.avgHitRate : 0;
    }
  }

  setCurrentStep(step: number) {
    this.currentStepRef = step;

    if (!this.trainingMode || !this.isPlaying) return;
    const p = this.patternRef;
    if (!p) return;
    const steps = p.measures * STEPS_PER_MEASURE;
    const prevMod = this.prevStepRef % steps;
    const currMod = step % steps;
    this.prevStepRef = step;

    if (step % steps === 0) {
      this.missedSteps = new Set();
      this.userHits = [];
      this.userHitsRef = [];
    }

    if (prevMod === currMod || this.missedSteps.has(prevMod)) return;

    const drumsWithNotes: string[] = [];
    for (const [drumId, row] of Object.entries(p.grid)) {
      if (row[prevMod]) {
        drumsWithNotes.push(drumId);
      }
    }

    if (drumsWithNotes.length === 0) return;

    const currentHits = this.userHitsRef;
    let uncovered = 0;
    for (const drumId of drumsWithNotes) {
      const covered = currentHits.some(h =>
        h.drumId === drumId && Math.abs(h.step - prevMod) <= TRAINING_HIT_TOLERANCE
      );
      if (!covered) uncovered++;
    }
    if (uncovered > 0) {
      this.missedHits += uncovered;
    }

    this.missedSteps.add(prevMod);
  }

  setPlaying(playing: boolean) {
    const wasPlaying = this.isPlaying;
    this.isPlaying = playing;
    if (wasPlaying && !playing) {
      // Save hit rate for this pattern/track when session ends
      const c = this.runningCounts;
      const total = (c.perfect || 0) + (c.good || 0) + (c.near || 0) + (c.miss || 0);
      if (total > 0 && this.patternId) {
        saveHitRate(this.patternId, c.perfect, c.good, c.miss, c.near);
        const saved = getHitRate(this.patternId);
        this.savedHitRate = saved ? saved.avgHitRate : 0;
      }
      this.userHits = [];
      this.userHitsRef = [];
      this.lastHitAccuracy = null;
    }
  }

  setTrainingMode(v: boolean) {
    this.userHits = [];
    this.missedHits = 0;
    this.missedSteps = new Set();
    this.runningCounts = { perfect: 0, good: 0, near: 0, miss: 0 };
    this.trainingMode = v;
    this.rhythmBpm = null;
    this.hitIntervalsRef = [];
    this.lastHitTimeRef = 0;

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    if (v) {
      this.cleanupInterval = setInterval(() => {
        const cutoff = Date.now() - 2500;
        this.userHits = this.userHits.filter(h => h.timestamp > cutoff);
      }, 300);
    }
  }

  handleDrumHit(drumId: string) {
    if (!this.trainingMode || !this.isPlaying) return;

    const p = this.patternRef;
    if (!p) return;

    const step = this.currentStepRef;
    const steps = p.measures * 16;
    const modStep = step % steps;

    let accuracy: string;
    if (!p.grid[drumId]) {
      accuracy = 'miss';
    } else {
      let nearestDist = Infinity;
      for (let offset = -TRAINING_HIT_TOLERANCE * 2; offset <= TRAINING_HIT_TOLERANCE * 2; offset++) {
        const checkStep = ((modStep + offset) % steps + steps) % steps;
        if (p.grid[drumId][checkStep]) {
          const dist = Math.abs(offset);
          if (dist < nearestDist) nearestDist = dist;
        }
      }

      if (nearestDist === Infinity) {
        accuracy = 'miss';
      } else if (nearestDist === 0) {
        accuracy = 'perfect';
      } else if (nearestDist <= TRAINING_HIT_TOLERANCE) {
        accuracy = 'good';
      } else {
        accuracy = 'near';
      }
    }

    this.runningCounts[accuracy]++;
    this.runningCounts.total = this.runningCounts.perfect + this.runningCounts.good + this.runningCounts.near + this.runningCounts.miss;

    const hit: UserHit = {
      id: this.hitId++,
      drumId,
      step: modStep,
      accuracy,
      timestamp: Date.now(),
    };

    const next = [...this.userHitsRef, hit];
    this.userHitsRef = next.slice(-200);
    this.userHits = this.userHitsRef;

    // Rhythm tracking: measure interval between hits and compute BPM
    const now = Date.now();
    if (this.lastHitTimeRef > 0) {
      const interval = now - this.lastHitTimeRef;
      if (interval > 100 && interval < 5000) {
        this.hitIntervalsRef.push(interval);
        if (this.hitIntervalsRef.length > 8) this.hitIntervalsRef.shift();
        const avgInterval = this.hitIntervalsRef.reduce((a, b) => a + b, 0) / this.hitIntervalsRef.length;
        this.rhythmBpm = Math.round((60 * 1000) / avgInterval);
      }
    }
    this.lastHitTimeRef = now;

    this.lastHitAccuracy = accuracy;
    this.lastHitTimestamp = Date.now();
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
    this.feedbackTimer = setTimeout(() => {
      this.lastHitAccuracy = null;
    }, 800);

    // In rhythm mode, find the nearest pattern step for this drum
    const nearestStep = this.findNearestPatternStep(drumId, modStep);
    if (nearestStep !== null) {
      this.jumpTarget = nearestStep;
    }
  }

  clearHits() {
    this.userHits = [];
    this.missedHits = 0;
    this.missedSteps = new Set();
    this.runningCounts = { perfect: 0, good: 0, near: 0, miss: 0 };
    this.lastHitAccuracy = null;
    this.rhythmBpm = null;
    this.hitIntervalsRef = [];
    this.lastHitTimeRef = 0;
    // Reload saved hit rate (in case it was updated by another session)
    if (this.patternId) {
      const saved = getHitRate(this.patternId);
      this.savedHitRate = saved ? saved.avgHitRate : 0;
    }
  }
}

export const training = new TrainingStore();
