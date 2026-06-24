let audioCtx = null;

export function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

const bufferCache = new Map();

export async function loadSample(url) {
  if (bufferCache.has(url)) return bufferCache.get(url);
  const ctx = getContext();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load sample: ${url} (${res.status})`);
  const arrayBuf = await res.arrayBuffer();
  const audioBuf = await ctx.decodeAudioData(arrayBuf);
  bufferCache.set(url, audioBuf);
  return audioBuf;
}

export function playSampleBuffer(url, velocity = 0.8) {
  const buf = bufferCache.get(url);
  if (!buf) return;
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();
  const source = ctx.createBufferSource();
  source.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.value = Math.min(1, velocity);
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}
