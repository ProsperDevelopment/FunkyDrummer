import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = globalThis.ResizeObserver || (ResizeObserverMock as unknown as typeof ResizeObserver);

const canvasCtx = {
  canvas: {},
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  font: '',
  textAlign: '',
  textBaseline: '',
  globalAlpha: 1,
  shadowBlur: 0,
  shadowColor: '',
  setLineDash: vi.fn(),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  arc: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  quadraticCurveTo: vi.fn(),
  createLinearGradient: vi.fn(),
  createRadialGradient: vi.fn(),
  drawImage: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  createPattern: vi.fn(),
  ellipse: vi.fn(),
  rect: vi.fn(),
} as unknown as CanvasRenderingContext2D;

if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();
}
if (!SVGElement.prototype.setPointerCapture) {
  SVGElement.prototype.setPointerCapture = vi.fn();
  SVGElement.prototype.releasePointerCapture = vi.fn();
}

HTMLCanvasElement.prototype.getContext = ((ctxId: string) =>
  ctxId === '2d' ? canvasCtx : null) as typeof HTMLCanvasElement.prototype.getContext;

HTMLCanvasElement.prototype.toDataURL = () => '';

if (typeof window.requestAnimationFrame !== 'function') {
  window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16) as unknown as number;
  window.cancelAnimationFrame = (id) => clearTimeout(id);
}

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }) as unknown as MediaQueryList;
}

if (!navigator.requestMIDIAccess) {
  Object.defineProperty(navigator, 'requestMIDIAccess', {
    value: vi.fn().mockResolvedValue({
      inputs: { values: () => [] },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    configurable: true,
  });
}
