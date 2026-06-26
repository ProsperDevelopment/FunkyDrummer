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
    style: "Rock",
    desc: "Straight-ahead rock beat with kick on 1 & 3, snare backbeats, and steady 16th-note hi-hats",
    groove: [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
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
    style: "Funk",
    desc: "Syncopated kick pattern with snare backbeats and open hi-hat on the & of 4",
    groove: [0,3,1,4,0,3,1,4,0,3,1,4,0,3,1,4],
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
    style: "Rock",
    desc: "Half-time feel with kick on 1 & 4, snare on 3, and a swung triplet hi-hat shuffle",
    groove: [0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0],
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
    style: "Metal",
    desc: "Double-time eighth-note kick pattern with crash accents and driving 16th-note hi-hats",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
    style: "Jazz",
    desc: "Walking ride cymbal pattern with syncopated kick and spang-a-lang hi-hat figures",
    groove: [0,4,0,4,0,4,0,4,0,4,0,4,0,4,0,4],
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
    style: "World",
    desc: "One-drop feel with kick on the off-beats, snare on 3, and steady 8th-note hi-hats",
    groove: [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3],
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
    style: "Funk",
    desc: "Inspired by Clyde Stubblefield — ghost notes, open hi-hat accents, and a syncopated kick-snare groove",
    groove: [0,3,1,4,0,3,1,4,0,3,1,4,0,3,1,4],
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
        this.grid.hihatOpen[o + 5] = 0.6;
        this.grid.hihatOpen[o + 13] = 0.5;
      }
      return this;
    }
  },
  {
    id: 'amen-break',
    name: 'Amen Break',
    style: "Breakbeat",
    desc: "The classic breakbeat from Amen, Brother — rolling snares, syncopated kick, and ride cymbal accents",
    groove: [0,2,0,3,0,2,0,3,0,2,0,3,0,2,0,3],
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
    style: "Breakbeat",
    desc: "Fire-breathing funk break with tight kick variations and rolling ride cymbal work",
    groove: [0,3,1,4,0,3,1,4,0,3,1,4,0,3,1,4],
    bpm: 108,
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
        this.grid.hihatOpen[o + 5] = 0.6;
        this.grid.hihatOpen[o + 13] = 0.5;
      }
      return this;
    }
  },
  {
    id: 'think-break',
    name: 'Think Break',
    style: "Breakbeat",
    desc: "Soulful breakbeat with a driving kick-snare conversation and crisp hi-hat patterns",
    groove: [0,2,0,3,0,2,0,3,0,2,0,3,0,2,0,3],
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
    style: "Electronic",
    desc: "Broken 2-step garage rhythm with off-kilter kicks and shuffle hi-hats",
    groove: [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3],
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
    style: "Electronic",
    desc: "Classic UKG beat with syncopated kick pattern, shuffling hats, and open hi-hat flourishes",
    groove: [0,4,0,4,0,4,0,4,0,4,0,4,0,4,0,4],
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
    style: "Electronic",
    desc: "Four-on-the-floor kick with snare claps on 2 & 4 and open hi-hat on the off-beat",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
    style: "Hip Hop",
    desc: "Laid-back hip-hop groove with swung kick placements and accent hi-hats on the beat",
    groove: [0,3,0,4,0,3,0,4,0,3,0,4,0,3,0,4],
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
    style: "Funk",
    desc: "Four-on-the-floor kick with snare backbeats and a driving 8th-note open/closed hi-hat pattern",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
  {
    id: 'tom-fill',
    name: 'Tom Fill',
    style: "Practice",
    desc: "Rock pattern with tom fills alternating every measure — hi, mid, low toms with crash accents",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    bpm: 110,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihatOpen', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['crash', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['tomHi', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['tomMid',[0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['tomLo', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.hihatOpen = new Array(steps).fill(0);
      this.grid.crash = new Array(steps).fill(0);
      this.grid.tomHi = new Array(steps).fill(0);
      this.grid.tomMid = new Array(steps).fill(0);
      this.grid.tomLo = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 8] = 0.7;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.4;
        }
        this.grid.crash[o + 0] = 0.7;
        if (i % 2 === 0) {
          this.grid.tomHi[o + 10] = 0.8;
          this.grid.tomMid[o + 11] = 0.7;
          this.grid.tomLo[o + 12] = 0.8;
          this.grid.tomHi[o + 14] = 0.6;
          this.grid.tomMid[o + 15] = 0.6;
        } else {
          this.grid.tomHi[o + 6] = 0.6;
          this.grid.tomMid[o + 7] = 0.7;
          this.grid.tomLo[o + 8] = 0.8;
          this.grid.tomMid[o + 10] = 0.6;
          this.grid.tomLo[o + 12] = 0.6;
          this.grid.hihatOpen[o + 14] = 0.5;
        }
      }
      return this;
    }
  },
  {
    id: 'kick-only',
    name: 'Kick Only',
    style: "Practice",
    desc: "Simple four-on-the-floor kick drum pattern — just the kick, no other drums",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    bpm: 120,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 0.9;
        this.grid.kick[o + 4] = 0.7;
        this.grid.kick[o + 8] = 0.9;
        this.grid.kick[o + 12] = 0.7;
      }
      return this;
    }
  },
  {
    id: 'kick-snare',
    name: 'Kick & Snare',
    style: "Practice",
    desc: "Minimal rock pattern with kick on 1 & 3, snare on 2 & 4 — no hi-hats or cymbals",
    groove: [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    bpm: 110,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 8] = 0.9;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
      }
      return this;
    }
  },
  {
    id: 'easy-rock',
    name: 'Easy Rock',
    style: "Rock",
    desc: "Clean, approachable rock pattern with steady kick, backbeat snare, and eighth-note hi-hats",
    groove: [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    bpm: 115,
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
        this.grid.kick[o + 8] = 1.0;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.6;
        }
      }
      return this;
    }
  },
  {
    id: 'drum-bass',
    name: 'Drum & Bass',
    style: "Electronic",
    desc: "Fast D&B roller with broken kick patterns, snare on 2 & 4, and rapid-fire hi-hats",
    groove: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    bpm: 170,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['crash', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
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
        this.grid.kick[o + 3] = 0.6;
        this.grid.kick[o + 6] = 0.7;
        this.grid.kick[o + 10] = 0.5;
        this.grid.kick[o + 14] = 0.6;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        this.grid.snare[o + 15] = 0.4;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.3;
        }
        this.grid.hihat[o + 1] = 0.2;
        this.grid.hihat[o + 5] = 0.2;
        this.grid.hihat[o + 9] = 0.2;
        this.grid.hihat[o + 13] = 0.2;
        this.grid.crash[o + 0] = 0.8;
      }
      return this;
    }
  },
  {
    id: 'swing',
    name: 'Swing',
    style: "Jazz",
    desc: "Laid-back swing feel with syncopated kick, snare backbeats, and a relaxed ride pattern",
    groove: [0,5,0,5,0,5,0,5,0,5,0,5,0,5,0,5],
    bpm: 100,
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
        this.grid.kick[o + 0] = 0.8;
        this.grid.kick[o + 6] = 0.6;
        this.grid.kick[o + 10] = 0.6;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        this.grid.ride[o + 0] = 0.6;
        this.grid.ride[o + 6] = 0.5;
        this.grid.ride[o + 8] = 0.6;
        this.grid.ride[o + 14] = 0.5;
        for (let j = 0; j < 16; j += 4) {
          this.grid.hihat[o + j] = 0.4;
          this.grid.hihat[o + j + 2] = 0.2;
        }
      }
      return this;
    }
  },
  {
    id: 'funk-2',
    name: 'Funk 2',
    style: "Funk",
    desc: "Deep funk groove with ghost snare notes, syncopated kick hits, and open hi-hat accents",
    groove: [0,3,1,4,0,3,1,4,0,3,1,4,0,3,1,4],
    bpm: 105,
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
        this.grid.kick[o + 3] = 0.5;
        this.grid.kick[o + 6] = 0.7;
        this.grid.kick[o + 10] = 0.5;
        this.grid.kick[o + 13] = 0.6;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 8] = 0.3;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.5;
        }
        this.grid.hihatOpen[o + 11] = 0.6;
        this.grid.hihatOpen[o + 15] = 0.5;
      }
      return this;
    }
  },
  {
    id: 'punk',
    name: 'Punk',
    style: "Punk",
    desc: "High-energy punk beat with eighth-note kick, snare backbeats, and non-stop 16th-note hi-hats",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    bpm: 185,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['crash', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
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
        for (let j = 0; j < 16; j += 2) {
          this.grid.kick[o + j] = 0.8;
        }
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j++) {
          this.grid.hihat[o + j] = 0.5;
        }
        this.grid.crash[o + 0] = 0.7;
      }
      return this;
    }
  },
  {
    id: 'blues',
    name: 'Blues',
    style: "Blues",
    desc: "Slow blues shuffle with triplet-based hi-hat, kick on 1 & 3, and ghost snare embellishments",
    groove: [0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0],
    bpm: 80,
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
        this.grid.kick[o + 0] = 0.8;
        this.grid.kick[o + 3] = 0.5;
        this.grid.kick[o + 8] = 0.6;
        this.grid.snare[o + 4] = 0.9;
        this.grid.snare[o + 10] = 0.4;
        this.grid.snare[o + 12] = 0.9;
        for (let j = 0; j < 16; j += 3) {
          this.grid.hihat[o + j] = 0.3;
        }
        this.grid.ride[o + 0] = 0.5;
        this.grid.ride[o + 4] = 0.5;
        this.grid.ride[o + 8] = 0.5;
        this.grid.ride[o + 12] = 0.5;
      }
      return this;
    }
  },
  {
    id: 'reggaeton',
    name: 'Reggaeton',
    style: "Latin",
    desc: "Dem Bow rhythm with kick on 1/3/5/7, snare accents on the &s, and syncopated hi-hats",
    groove: [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    bpm: 95,
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
        this.grid.kick[o + 4] = 0.5;
        this.grid.kick[o + 8] = 0.8;
        this.grid.kick[o + 10] = 0.6;
        this.grid.kick[o + 12] = 1.0;
        this.grid.snare[o + 6] = 0.8;
        this.grid.snare[o + 14] = 0.8;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.4;
        }
        this.grid.hihat[o + 1] = 0.3;
        this.grid.hihat[o + 5] = 0.3;
        this.grid.hihat[o + 9] = 0.3;
        this.grid.hihat[o + 13] = 0.3;
      }
      return this;
    }
  },
  {
    id: 'crash-fill',
    name: 'Crash Fill',
    style: "Practice",
    desc: "Alternating crash and ride accent patterns over a solid rock foundation with fill variations",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    bpm: 130,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['crash', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['ride',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.crash = new Array(steps).fill(0);
      this.grid.ride = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 0.9;
        this.grid.kick[o + 8] = 0.7;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.5;
        }
        if (i % 2 === 0) {
          this.grid.crash[o + 0] = 0.8;
          this.grid.crash[o + 10] = 0.6;
          this.grid.crash[o + 12] = 0.5;
        } else {
          this.grid.ride[o + 0] = 0.6;
          this.grid.crash[o + 6] = 0.7;
          this.grid.crash[o + 14] = 0.6;
        }
      }
      return this;
    }
  },
  {
    id: 'quarter-notes',
    name: 'Quarter Notes',
    style: "Practice",
    desc: "Kick on every quarter note, snare on 2 & 4 — the simplest possible beat to build coordination",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    bpm: 80,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures, steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 4] = 0.8;
        this.grid.kick[o + 8] = 1.0;
        this.grid.kick[o + 12] = 0.8;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
      }
      return this;
    }
  },
  {
    id: 'eighth-kick',
    name: 'Eighth Note Kick',
    style: "Practice",
    desc: "Kick on every eighth note with snare backbeats — builds stamina and limb independence",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    bpm: 90,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures, steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        for (let j = 0; j < 16; j += 2) this.grid.kick[o + j] = 0.8;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
      }
      return this;
    }
  },
  {
    id: 'kick-variations',
    name: 'Kick Variations',
    style: "Practice",
    desc: "Simple rock pattern but the kick changes every measure — trains you to listen and adapt",
    groove: [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    bpm: 100,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures, steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) this.grid.hihat[o + j] = 0.5;
        if (i % 2 === 0) {
          this.grid.kick[o + 0] = 0.9;
          this.grid.kick[o + 4] = 0.7;
          this.grid.kick[o + 8] = 0.9;
          this.grid.kick[o + 10] = 0.5;
        } else {
          this.grid.kick[o + 0] = 0.9;
          this.grid.kick[o + 6] = 0.6;
          this.grid.kick[o + 8] = 0.8;
          this.grid.kick[o + 14] = 0.6;
        }
      }
      return this;
    }
  },
  {
    id: 'snare-accents',
    name: 'Snare Accents',
    style: "Practice",
    desc: "Focus on snare dynamics — ghost notes and accented backbeats over steady kick and hi-hat",
    groove: [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    bpm: 90,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures, steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 0.9;
        this.grid.kick[o + 8] = 0.9;
        for (let j = 0; j < 16; j += 2) this.grid.hihat[o + j] = 0.5;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 8] = 0.3;
        this.grid.snare[o + 12] = 1.0;
        this.grid.snare[o + 14] = 0.2;
      }
      return this;
    }
  },
  {
    id: 'hihat-control',
    name: 'Hi-Hat Control',
    style: "Practice",
    desc: "Steady kick and snare with varied hi-hat patterns — open and closed combinations",
    groove: [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    bpm: 100,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihatOpen', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures, steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.hihatOpen = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 0.9;
        this.grid.kick[o + 4] = 0.7;
        this.grid.kick[o + 8] = 0.9;
        this.grid.kick[o + 12] = 0.7;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        if (i % 2 === 0) {
          for (let j = 0; j < 16; j += 2) this.grid.hihat[o + j] = 0.5;
          this.grid.hihatOpen[o + 11] = 0.6;
          this.grid.hihatOpen[o + 15] = 0.6;
        } else {
          this.grid.hihat[o + 0] = 0.5;
          this.grid.hihat[o + 2] = 0.5;
          this.grid.hihat[o + 4] = 0.5;
          this.grid.hihat[o + 6] = 0.5;
          this.grid.hihat[o + 8] = 0.5;
          this.grid.hihat[o + 10] = 0.5;
          this.grid.hihat[o + 12] = 0.5;
          this.grid.hihat[o + 14] = 0.5;
          this.grid.hihatOpen[o + 7] = 0.5;
          this.grid.hihatOpen[o + 15] = 0.5;
        }
      }
      return this;
    }
  },
  {
    id: 'slow-rock',
    name: 'Slow Rock',
    style: "Practice",
    desc: "A very slow rock beat at 60 BPM — perfect for beginners learning to coordinate all four limbs",
    groove: [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    bpm: 60,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures, steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 8] = 0.9;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) this.grid.hihat[o + j] = 0.6;
      }
      return this;
    }
  },
  {
    id: 'ride-practice',
    name: 'Ride Practice',
    style: "Practice",
    desc: "Basic rock beat using the ride cymbal instead of hi-hat — essential for jazz and swing styles",
    groove: [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    bpm: 90,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['ride',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures, steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.ride = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 0.9;
        this.grid.kick[o + 8] = 0.9;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) this.grid.ride[o + j] = 0.6;
      }
      return this;
    }
  },
  {
    id: 'shuffle-easy',
    name: 'Easy Shuffle',
    style: "Practice",
    desc: "A simplified half-time shuffle at a comfortable tempo — triplet feel without the complexity",
    groove: [0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0],
    bpm: 70,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures, steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 0.9;
        this.grid.kick[o + 12] = 0.8;
        this.grid.snare[o + 8] = 1.0;
        for (let j = 0; j < 16; j += 4) {
          this.grid.hihat[o + j] = 0.5;
          this.grid.hihat[o + j + 2] = 0.3;
        }
      }
      return this;
    }
  },
  {
    id: 'boom-bap',
    name: 'Boom Bap',
    style: "Hip Hop",
    desc: "Classic 90s boom bap — hard kick on 1, snare on 2 & 4, with swung hi-hats and open hats for accent",
    groove: [0,4,0,4,0,4,0,4,0,4,0,4,0,4,0,4],
    bpm: 90,
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
        this.grid.kick[o + 8] = 0.9;
        this.grid.kick[o + 11] = 0.6;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.3;
        }
        this.grid.hihat[o + 4] = 0.5;
        this.grid.hihatOpen[o + 7] = 0.5;
        this.grid.hihatOpen[o + 15] = 0.4;
      }
      return this;
    }
  },
  {
    id: 'trap',
    name: 'Trap',
    style: "Hip Hop",
    desc: "Modern trap beat with rolling 16th-note hi-hats, heavy kick with rapid doubles, and snare on 3",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    bpm: 140,
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
        this.grid.kick[o + 2] = 0.8;
        this.grid.kick[o + 12] = 0.9;
        this.grid.kick[o + 14] = 0.7;
        this.grid.snare[o + 8] = 1.0;
        for (let j = 0; j < 16; j++) {
          this.grid.hihat[o + j] = 0.2;
        }
        this.grid.hihat[o + 0] = 0.4;
        this.grid.hihat[o + 8] = 0.4;
        this.grid.hihatOpen[o + 13] = 0.5;
        this.grid.hihatOpen[o + 15] = 0.5;
      }
      return this;
    }
  },
  {
    id: 'lo-fi',
    name: 'Lo-Fi',
    style: "Hip Hop",
    desc: "Chilled lo-fi hip-hop with soft kick, brushed snare, and gentle hi-hats — perfect for relaxing practice",
    groove: [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3],
    bpm: 75,
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
        this.grid.kick[o + 0] = 0.9;
        this.grid.kick[o + 8] = 0.8;
        this.grid.snare[o + 4] = 0.8;
        this.grid.snare[o + 12] = 0.8;
        for (let j = 0; j < 16; j += 3) {
          this.grid.hihat[o + j] = 0.2;
        }
        this.grid.hihat[o + 2] = 0.15;
        this.grid.hihat[o + 6] = 0.15;
      }
      return this;
    }
  },
  {
    id: 'west-coast',
    name: 'West Coast',
    style: "Hip Hop",
    desc: "G-funk inspired groove with syncopated kick, laid-back snare, and a swaggering hi-hat pattern",
    groove: [0,5,0,3,0,5,0,3,0,5,0,3,0,5,0,3],
    bpm: 92,
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
        this.grid.kick[o + 4] = 0.7;
        this.grid.kick[o + 11] = 0.8;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.35;
        }
        this.grid.hihat[o + 6] = 0.5;
        this.grid.hihatOpen[o + 9] = 0.5;
        this.grid.hihatOpen[o + 15] = 0.3;
      }
      return this;
    }
  },
  {
    id: 'dilla-swing',
    name: 'Dilla Swing',
    style: "Hip Hop",
    desc: "J Dilla-inspired off-kilter groove with displaced kick placements, late snare, and lazy hi-hats",
    groove: [0,6,0,5,0,6,0,5,0,6,0,5,0,6,0,5],
    bpm: 88,
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
        this.grid.kick[o + 3] = 0.7;
        this.grid.kick[o + 7] = 0.6;
        this.grid.kick[o + 12] = 0.9;
        this.grid.snare[o + 5] = 0.9;
        this.grid.snare[o + 13] = 0.9;
        for (let j = 0; j < 16; j += 4) {
          this.grid.hihat[o + j] = 0.3;
          this.grid.hihat[o + j + 1] = 0.15;
        }
        this.grid.hihatOpen[o + 10] = 0.4;
      }
      return this;
    }
  },
  {
    id: 'techno',
    name: 'Techno',
    style: "Techno",
    desc: "Driving four-on-the-floor kick with closed hi-hat on every eighth and snare/rimshot accents for a classic warehouse vibe",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    bpm: 130,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihatOpen', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihatOpen = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        for (let j = 0; j < 16; j += 4) this.grid.kick[o + j] = 1.0;
        for (let j = 0; j < 16; j += 2) this.grid.hihat[o + j] = 0.3;
        this.grid.snare[o + 4] = 0.7;
        this.grid.snare[o + 12] = 0.7;
        this.grid.hihatOpen[o + 11] = 0.4;
        this.grid.hihatOpen[o + 15] = 0.4;
      }
      return this;
    }
  },
  {
    id: 'techno-dark',
    name: 'Dark Techno',
    style: "Techno",
    desc: "Minimal dark techno with off-beat open hi-hats, delayed snare hits, and a pulsing kick foundation",
    groove: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    bpm: 128,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihatOpen', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['ride',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihatOpen = new Array(steps).fill(0);
      this.grid.ride = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        for (let j = 0; j < 16; j += 4) this.grid.kick[o + j] = 1.0;
        this.grid.kick[o + 2] = 0.6;
        this.grid.hihat[o + 0] = 0.2;
        this.grid.hihat[o + 4] = 0.2;
        this.grid.hihat[o + 8] = 0.2;
        this.grid.hihat[o + 12] = 0.2;
        this.grid.hihatOpen[o + 6] = 0.5;
        this.grid.hihatOpen[o + 14] = 0.5;
        this.grid.snare[o + 5] = 0.7;
        this.grid.snare[o + 13] = 0.7;
        this.grid.ride[o + 10] = 0.4;
      }
      return this;
    }
  },
  {
    id: 'electro',
    name: 'Electro',
    style: "Electro",
    desc: "Classic electro beat with syncopated kick pattern, crisp snare on 2 & 4, and robotic open hi-hat",
    groove: [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    bpm: 125,
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
        this.grid.kick[o + 4] = 0.7;
        this.grid.kick[o + 8] = 0.9;
        this.grid.kick[o + 10] = 0.8;
        this.grid.kick[o + 12] = 0.6;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) this.grid.hihat[o + j] = 0.3;
        this.grid.hihat[o + 2] = 0.2;
        this.grid.hihat[o + 6] = 0.2;
      }
      return this;
    }
  },
  {
    id: 'electro-funk',
    name: 'Electro Funk',
    style: "Electro",
    desc: "Electro-funk hybrid with grooving kick patterns, tight snare, and syncopated hi-hats with open accents",
    groove: [0,3,0,2,0,3,0,2,0,3,0,2,0,3,0,2],
    bpm: 110,
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
        this.grid.kick[o + 3] = 0.6;
        this.grid.kick[o + 8] = 0.9;
        this.grid.kick[o + 14] = 0.7;
        this.grid.snare[o + 4] = 1.0;
        this.grid.snare[o + 12] = 1.0;
        for (let j = 0; j < 16; j += 2) this.grid.hihat[o + j] = 0.25;
        this.grid.hihatOpen[o + 5] = 0.4;
        this.grid.hihatOpen[o + 13] = 0.4;
      }
      return this;
    }
  },
  {
    id: 'tribal',
    name: 'Tribal',
    style: "World",
    desc: "World-influenced tom groove with interlocking kick-snare patterns and rolling tom phrases",
    groove: [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3],
    bpm: 120,
    ...grid(2,
      ['kick',  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['snare', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['hihat', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['tomHi', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['tomMid',[0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['tomLo', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
      ['crash', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]],
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.tomHi = new Array(steps).fill(0);
      this.grid.tomMid = new Array(steps).fill(0);
      this.grid.tomLo = new Array(steps).fill(0);
      this.grid.crash = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1.0;
        this.grid.kick[o + 6] = 0.7;
        this.grid.kick[o + 12] = 0.9;
        this.grid.snare[o + 4] = 0.8;
        this.grid.snare[o + 8] = 0.5;
        this.grid.snare[o + 12] = 0.8;
        this.grid.hihat[o + 0] = 0.3;
        this.grid.hihat[o + 4] = 0.3;
        this.grid.hihat[o + 8] = 0.3;
        this.grid.hihat[o + 12] = 0.3;
        this.grid.crash[o + 0] = 0.7;
        if (i % 2 === 0) {
          this.grid.tomHi[o + 2] = 0.7;
          this.grid.tomMid[o + 3] = 0.6;
          this.grid.tomLo[o + 4] = 0.7;
          this.grid.tomMid[o + 10] = 0.5;
          this.grid.tomHi[o + 11] = 0.6;
        } else {
          this.grid.tomLo[o + 2] = 0.7;
          this.grid.tomMid[o + 3] = 0.6;
          this.grid.tomHi[o + 4] = 0.7;
          this.grid.tomLo[o + 10] = 0.6;
          this.grid.tomMid[o + 11] = 0.5;
          this.grid.tomHi[o + 12] = 0.4;
        }
      }
      return this;
    }
  },
];

for (const pattern of drumPatterns) {
  pattern.rebuild();
}
