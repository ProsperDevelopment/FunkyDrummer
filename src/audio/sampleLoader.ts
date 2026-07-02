let audioCtx: AudioContext | null = null;

export function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

const bufferCache = new Map<string, AudioBuffer>();

export async function loadSample(url: string): Promise<AudioBuffer> {
  if (bufferCache.has(url)) return bufferCache.get(url)!;
  const ctx = getContext();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load sample: ${url} (${res.status})`);
  const arrayBuf = await res.arrayBuffer();
  const audioBuf = await ctx.decodeAudioData(arrayBuf);
  bufferCache.set(url, audioBuf);
  return audioBuf;
}

export function getBuffer(url: string): AudioBuffer | null {
  return bufferCache.get(url) || null;
}

export function playSampleBuffer(url: string, velocity = 0.8): void {
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
