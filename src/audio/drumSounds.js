import { loadSample, playSampleBuffer } from './sampleLoader';
import { drumKits } from '../config/drumKits';

let audioCtx = null;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function noiseBuffer(ctx, length) {
  const size = ctx.sampleRate * length;
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

function playNoise(ctx, duration, filterFreq, gain) {
  const noise = noiseBuffer(ctx, duration);
  const source = ctx.createBufferSource();
  source.buffer = noise;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + duration);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start(ctx.currentTime);
  source.stop(ctx.currentTime + duration);
}

function playTone(ctx, freq, duration, gain, type = 'sine') {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

const synthSounds = {
  kick(velocity = 0.8) {
    const ctx = getContext();
    const v = Math.min(1, velocity) * 0.8;
    playTone(ctx, 150, 0.15, v, 'sine');
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(60, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.1);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(v, ctx.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc2.connect(g2);
    g2.connect(ctx.destination);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.15);
  },

  snare(velocity = 0.8) {
    const ctx = getContext();
    const v = Math.min(1, velocity) * 0.7;
    playTone(ctx, 180, 0.08, v * 0.4, 'triangle');
    playNoise(ctx, 0.15, 5000, v * 0.6);
  },

  hihat(velocity = 0.7) {
    const ctx = getContext();
    const v = Math.min(1, velocity) * 0.5;
    playNoise(ctx, 0.05, 12000, v * 0.5);
    playNoise(ctx, 0.01, 16000, v * 0.3);
  },

  hihatOpen(velocity = 0.7) {
    const ctx = getContext();
    const v = Math.min(1, velocity) * 0.5;
    playNoise(ctx, 0.3, 14000, v * 0.4);
    playNoise(ctx, 0.05, 18000, v * 0.2);
  },

  crash(velocity = 0.9) {
    const ctx = getContext();
    const v = Math.min(1, velocity) * 0.6;
    playNoise(ctx, 0.6, 14000, v * 0.5);
    playNoise(ctx, 0.8, 8000, v * 0.3);
  },

  ride(velocity = 0.8) {
    const ctx = getContext();
    const v = Math.min(1, velocity) * 0.5;
    playNoise(ctx, 0.3, 10000, v * 0.3);
    playNoise(ctx, 0.1, 4000, v * 0.2);
  },

  tomHi(velocity = 0.7) {
    const ctx = getContext();
    const v = Math.min(1, velocity) * 0.7;
    playTone(ctx, 350, 0.2, v, 'sine');
    playTone(ctx, 300, 0.15, v * 0.3, 'triangle');
  },

  tomMid(velocity = 0.7) {
    const ctx = getContext();
    const v = Math.min(1, velocity) * 0.7;
    playTone(ctx, 260, 0.25, v, 'sine');
    playTone(ctx, 220, 0.18, v * 0.3, 'triangle');
  },

  tomLo(velocity = 0.7) {
    const ctx = getContext();
    const v = Math.min(1, velocity) * 0.7;
    playTone(ctx, 180, 0.3, v, 'sine');
    playTone(ctx, 150, 0.2, v * 0.3, 'triangle');
  },

  clap(velocity = 0.7) {
    const ctx = getContext();
    const v = Math.min(1, velocity) * 0.6;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => playNoise(ctx, 0.03, 8000, v * 0.4), i * 10);
    }
    playNoise(ctx, 0.1, 6000, v * 0.5);
  },
};

let activeKit = drumKits[0];
let kitLoading = false;
let loadCallbacks = [];

export function getActiveKit() {
  return activeKit;
}

export function isKitLoading() {
  return kitLoading;
}

export function onKitLoaded(cb) {
  if (!kitLoading) cb();
  else loadCallbacks.push(cb);
}

export async function setKit(kitId) {
  const kit = drumKits.find(k => k.id === kitId);
  if (!kit || kit.id === activeKit.id) return;
  activeKit = kit;
  kitLoading = true;

  if (kit.type === 'samples' && kit.samples) {
    const promises = Object.values(kit.samples).map(url => loadSample(url));
    await Promise.all(promises);
  }

  kitLoading = false;
  loadCallbacks.forEach(cb => cb());
  loadCallbacks = [];
}

export function playDrum(drumId, velocity = 0.8) {
  const kit = activeKit;

  if (kit.type === 'samples' && kit.samples && kit.samples[drumId]) {
    playSampleBuffer(kit.samples[drumId], velocity);
  } else if (synthSounds[drumId]) {
    synthSounds[drumId](velocity);
  }
}

export function playMetronomeClick(accent = false) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(accent ? 1500 : 1000, ctx.currentTime);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(accent ? 0.15 : 0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.04);
}
