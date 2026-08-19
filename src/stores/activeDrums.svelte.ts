import { DRUM_GLOW_MS, DEFAULT_VELOCITY } from '../config/constants';

class ActiveDrumsStore {
  activeDrums = $state<Map<string, number>>(new Map());
  private timers: Record<string, ReturnType<typeof setTimeout>> = {};

  hit(drumId: string, velocity = DEFAULT_VELOCITY) {
    this.activeDrums = new Map(this.activeDrums).set(drumId, velocity);
    if (this.timers[drumId]) {
      clearTimeout(this.timers[drumId]);
    }
    this.timers[drumId] = setTimeout(() => {
      const next = new Map(this.activeDrums);
      next.delete(drumId);
      this.activeDrums = next;
      delete this.timers[drumId];
    }, DRUM_GLOW_MS);
  }

  destroy() {
    Object.values(this.timers).forEach(clearTimeout);
  }
}

export const activeDrums = new ActiveDrumsStore();
