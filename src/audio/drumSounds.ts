import { loadSample, playSampleBuffer, getContext, getBuffer } from './sampleLoader';
import { drumKits } from '../config/drumKits';
import type { DrumKit, Voice } from '../types';

function noiseBuffer(ctx: AudioContext, length: number): AudioBuffer {
  const size = ctx.sampleRate * length;
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

function playNoise(ctx: AudioContext, duration: number, filterFreq: number, gain: number): void {
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

function playTone(ctx: AudioContext, freq: number, duration: number, gain: number, type: OscillatorType = 'sine'): void {
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

const CHICK_DURATION = 0.015;

function playSampleChick(ctx: AudioContext): Voice {
  const noise = noiseBuffer(ctx, CHICK_DURATION);
  const source = ctx.createBufferSource();
  source.buffer = noise;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(10000, ctx.currentTime);
  bp.Q.setValueAtTime(2, ctx.currentTime);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(7000, ctx.currentTime);
  const gn = ctx.createGain();
  gn.gain.setValueAtTime(0.15, ctx.currentTime);
  gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + CHICK_DURATION);
  source.connect(bp);
  bp.connect(hp);
  hp.connect(gn);
  gn.connect(ctx.destination);
  source.start(ctx.currentTime);
  source.stop(ctx.currentTime + CHICK_DURATION);
  return { stop: () => { try { source.stop(); } catch (_e) { /* ignore */ } } };
}

const activeVoices: Record<string, Voice> = {};

function chokeHihat(excludeId: string): void {
  const chokeGroup = ['hihat', 'hihatOpen', 'hihatMute', 'hihatEdge'];
  for (const id of chokeGroup) {
    if (id !== excludeId && activeVoices[id]) {
      activeVoices[id].stop();
      delete activeVoices[id];
    }
  }
}

function registerVoice(id: string, voice: Voice): void {
  chokeHihat(id);
  if (activeVoices[id]) {
    try { activeVoices[id].stop(); } catch (_e) { /* ignore */ }
  }
  activeVoices[id] = voice;
}

function playSampleTracked(url: string, velocity: number): Voice {
  const ctx = getContext();
  const buf = getBuffer(url);
  if (!buf) {
    playSampleChick(ctx);
    return { stop() {} };
  }
  const source = ctx.createBufferSource();
  source.buffer = buf;
  const gn = ctx.createGain();
  const v = Math.min(1, velocity) * 0.8;
  gn.gain.setValueAtTime(v, ctx.currentTime);
  gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + buf.duration);
  source.connect(gn);
  gn.connect(ctx.destination);
  source.start(ctx.currentTime);
  const stop = () => {
    try {
      gn.gain.cancelScheduledValues(ctx.currentTime);
      gn.gain.setValueAtTime(gn.gain.value, ctx.currentTime);
      gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.005);
      source.stop(ctx.currentTime + 0.005);
    } catch (_e) { /* ignore */ }
  };
  return { stop };
}

const synthSounds: Record<string, (velocity?: number) => void> = {
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

  hihatEdge(velocity = 0.7) {
    const ctx = getContext();
    const v = Math.min(1, velocity) * 0.5;
    playNoise(ctx, 0.03, 14000, v * 0.4);
    playNoise(ctx, 0.01, 18000, v * 0.3);
  },

  hihatMute(_velocity = 0.6) {
    playSampleChick(getContext());
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
};

let activeKit: DrumKit = drumKits[0];
let kitLoading = false;
let loadCallbacks: Array<() => void> = [];
let hihatPedalPressed = true;
let hihatPedalAmount = 1;
let userPressingPedal = false;

export function getActiveKit(): DrumKit {
  return activeKit;
}

export function isKitLoading(): boolean {
  return kitLoading;
}

export function getHihatPedalPressed(): boolean {
  return hihatPedalPressed;
}

export function setHihatPedalPressed(pressed: boolean): void {
  hihatPedalPressed = pressed;
}

export function getHihatPedalAmount(): number {
  return hihatPedalAmount;
}

export function setHihatPedalAmount(amount: number): void {
  hihatPedalAmount = amount;
  hihatPedalPressed = amount >= 0.5;
}

export function setUserPressingPedal(pressing: boolean): void {
  userPressingPedal = pressing;
}

export function getUserPressingPedal(): boolean {
  return userPressingPedal;
}

export function onKitLoaded(cb: () => void): void {
  if (!kitLoading) cb();
  else loadCallbacks.push(cb);
}

export async function setKit(kitId: string): Promise<void> {
  const kit = drumKits.find(k => k.id === kitId);
  if (!kit || kit.id === activeKit.id) return;
  kitLoading = true;

  try {
    if (kit.type === 'samples' && kit.samples) {
      const promises = Object.values(kit.samples).map(url => loadSample(url));
      await Promise.all(promises);
    }
    activeKit = kit;
  } catch (err) {
    console.error('Failed to load kit:', kitId, err);
    throw err;
  } finally {
    kitLoading = false;
    loadCallbacks.forEach(cb => cb());
    loadCallbacks = [];
  }
}

function playCrossfadeHihat(velocity: number): Voice {
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();
  const kit = activeKit;
  const v = Math.min(1, velocity) * 0.8;
  if (kit.type === 'samples' && kit.samples) {
    const closedUrl = kit.samples.hihat;
    const openUrl = kit.samples.hihatOpen;
    const closedBuf = getBuffer(closedUrl);
    const openBuf = getBuffer(openUrl);
    const closedGain = hihatPedalAmount;
    const openGain = 1 - hihatPedalAmount;

    const stopFns: Array<() => void> = [];

    if (closedBuf) {
      const src = ctx.createBufferSource();
      src.buffer = closedBuf;
      const gn = ctx.createGain();
      gn.gain.setValueAtTime(v * closedGain, ctx.currentTime);
      gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + closedBuf.duration);
      src.connect(gn);
      gn.connect(ctx.destination);
      src.start(ctx.currentTime);
      stopFns.push(() => {
        try {
          gn.gain.cancelScheduledValues(ctx.currentTime);
          gn.gain.setValueAtTime(gn.gain.value, ctx.currentTime);
          gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.005);
          src.stop(ctx.currentTime + 0.005);
        } catch (_e) { /* ignore */ }
      });
    }

    if (openBuf) {
      const src2 = ctx.createBufferSource();
      src2.buffer = openBuf;
      const gn2 = ctx.createGain();
      gn2.gain.setValueAtTime(v * openGain, ctx.currentTime);
      gn2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + openBuf.duration);
      src2.connect(gn2);
      gn2.connect(ctx.destination);
      src2.start(ctx.currentTime);
      stopFns.push(() => {
        try {
          gn2.gain.cancelScheduledValues(ctx.currentTime);
          gn2.gain.setValueAtTime(gn2.gain.value, ctx.currentTime);
          gn2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.005);
          src2.stop(ctx.currentTime + 0.005);
        } catch (_e) { /* ignore */ }
      });
    }

    return {
      stop() {
        for (const fn of stopFns) fn();
      },
    };
  }
  // Synth fallback
  const dur = 0.02 + hihatPedalAmount * 0.05;
  playNoise(ctx, dur, 12000, v * 0.4);
  if (hihatPedalAmount < 0.5) {
    playNoise(ctx, 0.2, 14000, v * 0.2 * (1 - hihatPedalAmount));
  }
  return { stop() {} };
}

export function playDrum(drumId: string, velocity = 0.8): void {
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();
  const kit = activeKit;

  if (!userPressingPedal && (drumId === 'hihat' || drumId === 'hihatOpen')) {
    hihatPedalPressed = drumId === 'hihat';
    hihatPedalAmount = drumId === 'hihat' ? 1 : 0;
  }

  if (['hihat', 'hihatOpen', 'hihatEdge', 'hihatMute'].includes(drumId)) {
    chokeHihat(drumId);
  }

  if (drumId === 'hihatEdge') {
    if (kit.type === 'samples' && kit.samples && kit.samples.hihatEdge) {
      const voice = playSampleTracked(kit.samples.hihatEdge, velocity);
      registerVoice(drumId, voice);
    } else {
      const voice = playSampleChick(getContext());
      registerVoice(drumId, voice);
    }
    return;
  }

  if (drumId === 'hihatMute') {
    const voice = playSampleChick(getContext());
    registerVoice(drumId, voice);
    return;
  }

  if (drumId === 'hihat' && kit.type === 'samples') {
    const voice = playCrossfadeHihat(velocity);
    registerVoice(drumId, voice);
    return;
  }

  if (kit.type === 'samples' && kit.samples && kit.samples[drumId]) {
    playSampleBuffer(kit.samples[drumId], velocity);
  } else if (synthSounds[drumId]) {
    synthSounds[drumId](velocity);
  }
}

export function playMetronomeClick(accent = false): void {
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();
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
