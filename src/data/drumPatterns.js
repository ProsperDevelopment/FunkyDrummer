function grid(measures, ...rows) {
  const totalSteps = measures * 16;
  const grid = {};
  for (const [drumId, hits] of rows) {
    const row = new Array(totalSteps).fill(0);
    for (const step of hits) {
      if (step < totalSteps) row[step] = 1;
    }
    grid[drumId] = row;
  }
  return { measures, grid };
}

export const drumPatterns = [
  {
    id: 'basic-rock',
    name: 'Basic Rock',
    bpm: 120,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const offset = i * 16;
        this.grid.kick[offset + 0] = 1;
        this.grid.kick[offset + 8] = 1;
        this.grid.snare[offset + 4] = 1;
        this.grid.snare[offset + 12] = 1;
        for (let j = 0; j < 16; j++) {
          this.grid.hihat[offset + j] = 1;
        }
      }
      return this;
    }
  },
  {
    id: 'funk',
    name: 'Funk',
    bpm: 100,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 6] = 1;
        this.grid.kick[o + 10] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        this.grid.hihat[o + 0] = 1;
        this.grid.hihat[o + 2] = 1;
        this.grid.hihat[o + 4] = 1;
        this.grid.hihat[o + 6] = 1;
        this.grid.hihat[o + 8] = 1;
        this.grid.hihat[o + 10] = 1;
        this.grid.hihat[o + 12] = 1;
        this.grid.hihat[o + 14] = 0;
      }
      return this;
    }
  },
  {
    id: 'half-time',
    name: 'Half-Time Shuffle',
    bpm: 70,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 12] = 1;
        this.grid.snare[o + 8] = 1;
        for (let j = 0; j < 16; j++) {
          if (j % 3 === 0) this.grid.hihat[o + j] = 1;
        }
      }
      return this;
    }
  },
  {
    id: 'metal',
    name: 'Metal',
    bpm: 160,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['crash', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.crash = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        for (let j = 0; j < 16; j++) {
          if (j % 2 === 0) this.grid.kick[o + j] = 1;
        }
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        this.grid.crash[o + 0] = 1;
        for (let j = 0; j < 16; j++) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 14] = 0;
      }
      return this;
    }
  },
  {
    id: 'jazz',
    name: 'Jazz',
    bpm: 130,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['ride',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.ride = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 6] = 1;
        this.grid.kick[o + 10] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        this.grid.hihat[o + 2] = 1;
        this.grid.hihat[o + 6] = 1;
        this.grid.hihat[o + 10] = 1;
        this.grid.hihat[o + 14] = 1;
        for (let j = 0; j < 16; j++) {
          this.grid.ride[o + j] = j % 2 === 0 ? 1 : 0;
        }
      }
      return this;
    }
  },
  {
    id: 'reggae',
    name: 'Reggae',
    bpm: 90,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 4] = 1;
        this.grid.kick[o + 12] = 1;
        this.grid.snare[o + 8] = 1;
        this.grid.snare[o + 0] = 1;
        for (let j = 0; j < 16; j++) {
          this.grid.hihat[o + j] = j % 2 === 0 ? 1 : 0;
        }
      }
      return this;
    }
  },
  {
    id: 'funky-drummer',
    name: 'Funky Drummer',
    bpm: 100,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihatOpen', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.hihatOpen = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 0.9;
        this.grid.kick[o + 6] = 0.7;
        this.grid.kick[o + 10] = 0.6;
        this.grid.kick[o + 12] = 0.7;
        this.grid.kick[o + 14] = 0.8;
        this.grid.snare[o + 4] = 0.8;
        this.grid.snare[o + 12] = 0.8;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.5;
        }
        this.grid.hihat[o + 15] = 0.7;
      }
      return this;
    }
  },
  {
    id: 'amen-break',
    name: 'Amen Break',
    bpm: 136,
    ...grid(2,
      ['kick',   [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['crash',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.crash = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 6] = 0.7;
        this.grid.kick[o + 11] = 0.6;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 6] = 0.4;
        this.grid.snare[o + 8] = 0.5;
        this.grid.snare[o + 12] = 1.0;
        this.grid.snare[o + 14] = 0.6;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.5;
        }
        this.grid.hihat[o + 0] = 0.6;
        this.grid.hihat[o + 4] = 0.6;
        this.grid.hihat[o + 8] = 0.6;
        this.grid.hihat[o + 12] = 0.6;
        this.grid.crash[o + 0] = 0.7;
      }
      return this;
    }
  },
  {
    id: 'hot-pants',
    name: 'Hot Pants Break',
    bpm: 108,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['ride',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.ride = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 5] = 0.6;
        this.grid.kick[o + 10] = 0.7;
        this.grid.kick[o + 12] = 0.8;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.4;
        }
        this.grid.hihat[o + 4] = 0.5;
        this.grid.hihat[o + 12] = 0.5;
        for (let j = 0; j < 16; j += 2) {
          this.grid.ride[o + j] = 0.5;
        }
        this.grid.ride[o + 0] = 0.7;
      }
      return this;
    }
  },
  {
    id: 'think-break',
    name: 'Think Break',
    bpm: 112,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 6] = 0.6;
        this.grid.kick[o + 10] = 0.7;
        this.grid.kick[o + 12] = 0.8;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.4;
        }
        this.grid.hihat[o + 4] = 0.5;
        this.grid.hihat[o + 8] = 0.5;
        this.grid.hihat[o + 12] = 0.5;
      }
      return this;
    }
  },
  {
    id: 'two-step',
    name: '2-Step',
    bpm: 135,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 6] = 0.6;
        this.grid.kick[o + 8] = 0.8;
        this.grid.kick[o + 14] = 0.6;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 8] = 0.5;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.4;
        }
        this.grid.hihat[o + 3] = 0.3;
        this.grid.hihat[o + 7] = 0.3;
        this.grid.hihat[o + 11] = 0.3;
        this.grid.hihat[o + 15] = 0.3;
      }
      return this;
    }
  },
  {
    id: 'uk-garage',
    name: 'UK Garage',
    bpm: 132,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihatOpen', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['ride',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.hihatOpen = new Array(steps).fill(0);
      this.grid.ride = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 4] = 0.5;
        this.grid.kick[o + 8] = 0.9;
        this.grid.kick[o + 12] = 0.5;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.4;
        }
        this.grid.hihatOpen[o + 3] = 0.5;
        this.grid.hihatOpen[o + 7] = 0.5;
        this.grid.hihatOpen[o + 11] = 0.5;
        this.grid.hihatOpen[o + 15] = 0.5;
        for (let j = 2; j < 16; j += 4) {
          this.grid.ride[o + j] = 0.3;
        }
      }
      return this;
    }
  },
  {
    id: 'house',
    name: 'House',
    bpm: 125,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihatOpen', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.hihatOpen = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 4] = 0.8;
        this.grid.kick[o + 8] = 0.9;
        this.grid.kick[o + 12] = 0.8;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.4;
        }
        this.grid.hihatOpen[o + 14] = 0.6;
      }
      return this;
    }
  },
  {
    id: 'hiphop',
    name: 'Hip Hop',
    bpm: 95,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihatOpen', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.hihatOpen = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 5] = 0.6;
        this.grid.kick[o + 8] = 0.9;
        this.grid.kick[o + 10] = 0.6;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.4;
        }
        this.grid.hihat[o + 4] = 0.5;
        this.grid.hihat[o + 8] = 0.5;
        this.grid.hihat[o + 12] = 0.5;
      }
      return this;
    }
  },
  {
    id: 'disco',
    name: 'Disco',
    bpm: 120,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        for (let j = 0; j < 16; j += 2) {
          this.grid.kick[o + j] = 1;
        }
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j++) {
          this.grid.hihat[o + j] = j % 4 < 2 ? 1 : 0;
        }
        this.grid.hihat[o + 10] = 1;
      }
      return this;
    }
  },
];

for (const pattern of drumPatterns) {
  pattern.rebuild();
}
