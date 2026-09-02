export interface DrumDef {
  id: string;
  name: string;
  midiNote: number;
  key: string;
  color: string;
}

export interface SynthKit {
  id: string;
  name: string;
  type: 'synth';
}

export interface SampleKit {
  id: string;
  name: string;
  type: 'samples';
  samples: Record<string, string>;
}

export type DrumKit = SynthKit | SampleKit;

export interface DrumPosition {
  id: string;
  cx: number;
  cy: number;
  r: number;
  group?: string[];
}

export interface DrumLayout {
  id: string;
  name: string;
  positions: DrumPosition[];
}

export type DrumGrid = Record<string, number[]>;

export interface DrumPattern {
  id: string;
  name: string;
  style: string;
  desc: string;
  groove: number[];
  bpm: number;
  measures: number;
  grid: DrumGrid;
  rebuild?(): DrumPattern;
}

export interface TrackPart {
  patternId: string;
  repeats: number;
}

export interface Track {
  id: string;
  name: string;
  style: string;
  bpm: number;
  parts: TrackPart[];
  description: string;
}

export interface TrainingStats {
  perfect: number;
  good: number;
  near: number;
  miss: number;
  total: number;
  score: number;
}

export interface UserHit {
  id: number;
  drumId: string;
  step: number;
  stepFraction: number;
  perfTime: number;
  accuracy: string;
  timestamp: number;
}

export interface MidiConfig {
  id: string;
  name: string;
  noteMap: Record<number, string | null>;
}

export interface MidiInput {
  id: string;
  name: string;
}

export interface SessionResult {
  stats: TrainingStats;
  missedHits: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  isCountdown: boolean;
  currentStep: number;
  totalSteps: number;
  currentLoop: number;
  repsComplete: boolean;
  countdownCount: number;
  togglePlay(): void;
  stop(): void;
  play(): void;
  clearRepsComplete(): void;
}

export interface TrackPlaybackState {
  isPlaying: boolean;
  currentStep: number;
  currentPattern: DrumPattern | null;
  currentPartIndex: number;
  isFinished: boolean;
  togglePlay(): void;
  stop(): void;
  play(): void;
  getCurrentStep(): number;
}

export interface KeyboardActions {
  onTogglePlay?: () => void;
  onStop?: () => void;
  onToggleMetronome?: () => void;
  onToggleDrumPlayback?: () => void;
  onTrainingToggle?: () => void;
  onGrooveToggle?: () => void;
  onEdgeModeToggle?: () => void;
  onBpmUp?: () => void;
  onBpmDown?: () => void;
}

export interface Voice {
  stop(): void;
}
