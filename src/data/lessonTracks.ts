import type { Track } from '../types';

export const lessonTracks: Track[] = [
  {
    id: 'beginner-switch',
    name: 'Beginner: Rock to Funk',
    bpm: 100,
    style: 'Practice',
    parts: [
      { patternId: 'basic-rock', repeats: 4 },
      { patternId: 'funk', repeats: 4 },
      { patternId: 'basic-rock', repeats: 4 },
      { patternId: 'funk', repeats: 4 },
    ],
    description: 'Alternates between Basic Rock and Funk at a steady tempo',
  },
  {
    id: 'groove-essentials',
    name: 'Groove Essentials',
    bpm: 110,
    style: 'Funk',
    parts: [
      { patternId: 'funk', repeats: 4 },
      { patternId: 'reggae', repeats: 4 },
      { patternId: 'hiphop', repeats: 4 },
      { patternId: 'funky-drummer', repeats: 4 },
    ],
    description: 'Four classic grooves — funk, reggae, hip hop, and the Funky Drummer',
  },
  {
    id: 'speed-builder',
    name: 'Speed Builder',
    bpm: 140,
    style: 'Metal',
    parts: [
      { patternId: 'basic-rock', repeats: 2 },
      { patternId: 'metal', repeats: 2 },
      { patternId: 'basic-rock', repeats: 2 },
      { patternId: 'metal', repeats: 2 },
    ],
    description: 'Build endurance at high tempo with rock and metal patterns',
  },
  {
    id: 'break-beat-journey',
    name: 'Break Beat Journey',
    bpm: 120,
    style: 'Breakbeat',
    parts: [
      { patternId: 'hot-pants', repeats: 2 },
      { patternId: 'think-break', repeats: 2 },
      { patternId: 'amen-break', repeats: 4 },
      { patternId: 'think-break', repeats: 2 },
      { patternId: 'hot-pants', repeats: 2 },
    ],
    description: 'Travel through the classic breakbeats — Hot Pants, Think, and Amen',
  },
  {
    id: 'time-signature-warmup',
    name: 'Time Signature Warmup',
    bpm: 120,
    style: 'Practice',
    parts: [
      { patternId: 'disco', repeats: 2 },
      { patternId: 'half-time', repeats: 2 },
      { patternId: 'jazz', repeats: 2 },
      { patternId: 'house', repeats: 2 },
    ],
    description: 'Warm up with disco, half-time, jazz, and house feels',
  },
  {
    id: 'uk-garage-roller',
    name: 'UK Garage Roller',
    bpm: 132,
    style: 'Electronic',
    parts: [
      { patternId: 'uk-garage', repeats: 2 },
      { patternId: 'two-step', repeats: 2 },
      { patternId: 'uk-garage', repeats: 2 },
      { patternId: 'two-step', repeats: 2 },
    ],
    description: 'UK Garage meets 2-step — shuffle patterns at 132 BPM',
  },
];
