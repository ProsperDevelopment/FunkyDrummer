import type { DrumGrid, DrumPattern } from "../types";

interface PatternObject extends DrumPattern {
  rebuild?(this: PatternObject): PatternObject;
}

function grid(
  measures: number,
  ...rows: [string, number[]][]
): { measures: number; grid: DrumGrid } {
  const totalSteps = measures * 16;
  const grid: DrumGrid = {};
  for (const [drumId, hits] of rows) {
    const row = new Array(totalSteps).fill(0);
    for (const step of hits) {
      if (step < totalSteps) row[step] = 1;
    }
    grid[drumId] = row;
  }
  return { measures, grid };
}

export const drumPatterns: PatternObject[] = [
  {
    id: "funk",
    name: "Funk",
    style: "Funk",
    desc: "Syncopated kick pattern with snare backbeats and open hi-hat on the & of 4",
    groove: [0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4],
    bpm: 100,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.hihat[o + 14] = 1;
      }
      return this;
    },
  },
  {
    id: "half-time",
    name: "Half-Time Shuffle",
    style: "Rock",
    desc: "Half-time feel with kick on 1 & 4, snare on 3, and a swung triplet hi-hat shuffle",
    groove: [0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0],
    bpm: 70,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
          this.grid.hihat[o + j] = 1;
        }
        for (let j = 1; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.8;
        }
        this.grid.hihat[o + 3] = 0.4;
        this.grid.hihat[o + 7] = 0.4;
        this.grid.hihat[o + 11] = 0.4;
        this.grid.hihat[o + 15] = 0.4;
      }
      return this;
    },
  },
  {
    id: "basic-rock",
    name: "Basic Rock",
    style: "Rock",
    desc: "Straight-ahead rock pattern with kick on 1 & 3, snare backbeat on 2 & 4, and steady hi-hat 8ths",
    groove: [0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3],
    bpm: 120,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 8] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
      }
      return this;
    },
  },
  {
    id: "easy-rock",
    name: "Easy Rock",
    style: "Rock",
    desc: "Simpler rock pattern with kick on 1 & 3, snare on 3 (half-time feel), and gentle hi-hat 8ths",
    groove: [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    bpm: 100,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 8] = 1;
        this.grid.snare[o + 8] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
      }
      return this;
    },
  },
  {
    id: "kick-only",
    name: "Kick Only",
    style: "Rock",
    desc: "Just quarter-note kick drums on the beat — a simple coordination foundation",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 90,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 4] = 1;
        this.grid.kick[o + 8] = 1;
        this.grid.kick[o + 12] = 1;
      }
      return this;
    },
  },
  {
    id: "kick-snare",
    name: "Kick & Snare",
    style: "Rock",
    desc: "Alternating kick and snare on quarter notes — kick 1&3, snare 2&4",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 90,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 8] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
      }
      return this;
    },
  },
  {
    id: "slow-rock",
    name: "Slow Rock",
    style: "Rock",
    desc: "Slow rock with quarter-note kick, snare backbeat, and gentle hi-hat 8ths",
    groove: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    bpm: 70,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 4] = 1;
        this.grid.kick[o + 8] = 1;
        this.grid.kick[o + 12] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
      }
      return this;
    },
  },
  {
    id: "kick-variations",
    name: "Kick Variations",
    style: "Rock",
    desc: "Varied kick patterns on quarter notes with snare backbeat",
    groove: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    bpm: 80,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 4] = 1;
        this.grid.kick[o + 10] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 6] = 1;
        this.grid.hihat[o + 10] = 1;
        this.grid.hihat[o + 14] = 1;
      }
      return this;
    },
  },
  {
    id: "punk",
    name: "Punk",
    style: "Punk",
    desc: "Fast eighth-note kick and hi-hat with snare backbeats",
    groove: [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    bpm: 160,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 4] = 1;
        this.grid.kick[o + 8] = 1;
        this.grid.kick[o + 12] = 1;
        for (let j = 0; j < 16; j++) {
          this.grid.kick[o + j] = 1;
        }
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j++) {
          this.grid.hihat[o + j] = 1;
        }
      }
      return this;
    },
  },
  {
    id: "metal",
    name: "Metal",
    style: "Metal",
    desc: "Aggressive double-kick with snare backbeats and fast hi-hat 8ths",
    groove: [0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    bpm: 180,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
          this.grid.hihat[o + j] = 1;
        }
      }
      return this;
    },
  },
  {
    id: "blues",
    name: "Blues",
    style: "Blues",
    desc: "Shuffle-based blues with kick on 1 & 3, snare on 2 & 4, and a swung hi-hat",
    groove: [0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4],
    bpm: 90,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 8] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 3] = 1;
        this.grid.hihat[o + 7] = 1;
        this.grid.hihat[o + 11] = 1;
        this.grid.hihat[o + 15] = 1;
      }
      return this;
    },
  },
  {
    id: "jazz",
    name: "Jazz",
    style: "Jazz",
    desc: "Ride cymbal-driven jazz with syncopated kick and snare comping",
    groove: [0, 3, 0, 4, 0, 3, 0, 4, 0, 3, 0, 4, 0, 3, 0, 4],
    bpm: 120,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "ride",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.snare[o + 4] = 0.8;
        this.grid.snare[o + 14] = 0.6;
        for (let j = 0; j < 16; j += 2) {
          this.grid.ride[o + j] = 1;
        }
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.3;
        }
        this.grid.hihat[o + 10] = 1;
      }
      return this;
    },
  },
  {
    id: "swing",
    name: "Swing",
    style: "Jazz",
    desc: "Swing feel with a triplet-based hi-hat pattern and syncopated kick",
    groove: [0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4],
    bpm: 110,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 12] = 0.8;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 0.6;
        for (let j = 0; j < 16; j += 4) {
          this.grid.hihat[o + j] = 1;
          this.grid.hihat[o + j + 2] = 0.6;
        }
        this.grid.hihat[o + 10] = 0.8;
      }
      return this;
    },
  },
  {
    id: "shuffle-easy",
    name: "Easy Shuffle",
    style: "Blues",
    desc: "A gentle shuffle with kick on 1 & 3, snare on 2 & 4, and a relaxed swung hi-hat",
    groove: [0, 0, 2, 3, 0, 0, 2, 3, 0, 0, 2, 3, 0, 0, 2, 3],
    bpm: 80,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 8] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 3] = 0.7;
        this.grid.hihat[o + 7] = 0.7;
        this.grid.hihat[o + 11] = 0.7;
        this.grid.hihat[o + 15] = 0.7;
      }
      return this;
    },
  },
  {
    id: "quarter-notes",
    name: "Quarter Notes",
    style: "Practice",
    desc: "Simple quarter-note pattern — kick on beat 1, snare on beat 3",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 60,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.snare[o + 8] = 1;
        for (let j = 0; j < 16; j += 4) {
          this.grid.hihat[o + j] = 1;
        }
      }
      return this;
    },
  },
  {
    id: "eighth-kick",
    name: "Eighth Note Kicks",
    style: "Practice",
    desc: "Kick on every eighth note (1 & 2 & 3 & 4 &) with snare on 2 & 4",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 70,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
      }
      return this;
    },
  },
  {
    id: "snare-accents",
    name: "Snare Accents",
    style: "Practice",
    desc: "Accent patterns on the snare with alternating strong/weak hits",
    groove: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    bpm: 80,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 8] = 1;
        for (let j = 0; j < 16; j++) {
          this.grid.snare[o + j] = j % 2 === 0 ? 1 : 0.5;
        }
        for (let j = 0; j < 16; j += 4) {
          this.grid.hihat[o + j] = 1;
        }
      }
      return this;
    },
  },
  {
    id: "hihat-control",
    name: "Hi-Hat Control",
    style: "Practice",
    desc: "Hi-hat variations with open and closed sounds at different dynamics",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 80,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatOpen",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 8] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 6] = 0.5;
        this.grid.hihat[o + 10] = 0.5;
        this.grid.hihat[o + 14] = 0.5;
        this.grid.hihatOpen[o + 14] = 1;
      }
      return this;
    },
  },
  {
    id: "ride-practice",
    name: "Ride Practice",
    style: "Practice",
    desc: "Ride cymbal pattern with swing and accent variations",
    groove: [0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3],
    bpm: 90,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "ride",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.ride = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 8] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.ride[o + j] = 1;
        }
        this.grid.ride[o + 7] = 0.7;
        this.grid.ride[o + 15] = 0.7;
      }
      return this;
    },
  },
  {
    id: "two-step",
    name: "Two-Step",
    style: "Electronic",
    desc: "Syncopated two-step garage rhythm with shuffling hi-hats and sparse kick placement",
    groove: [0, 2, 0, 3, 0, 0, 0, 3, 0, 2, 0, 3, 0, 0, 0, 3],
    bpm: 130,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 10] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 1; j < 16; j += 4) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 8] = 1;
        this.grid.hihat[o + 12] = 1;
      }
      return this;
    },
  },
  {
    id: "funk-2",
    name: "Funk 2",
    style: "Funk",
    desc: "A different funk pocket with ghost notes, syncopation, and open hi-hat accents",
    groove: [0, 3, 2, 4, 1, 3, 2, 4, 0, 3, 2, 4, 1, 3, 2, 4],
    bpm: 100,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 10] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 14] = 0;
      }
      return this;
    },
  },
  {
    id: "drum-bass",
    name: "Drum & Bass",
    style: "Electronic",
    desc: "High-energy drum & bass with syncopated kicks, snare on 2 & 4, and fast hi-hat rolls",
    groove: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
    bpm: 160,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 13] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 5] = 0.5;
        this.grid.hihat[o + 7] = 0.5;
        this.grid.hihat[o + 9] = 0.5;
        this.grid.hihat[o + 15] = 0.5;
      }
      return this;
    },
  },
  {
    id: "house",
    name: "House",
    style: "Electronic",
    desc: "Four-on-the-floor kick with clap/snare on 2 & 4 and open hi-hat on offbeats",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 128,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatOpen",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        for (let j = 0; j < 16; j += 4) {
          this.grid.kick[o + j] = 1;
        }
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 2; j < 16; j += 4) {
          this.grid.hihatOpen[o + j] = 1;
        }
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.5;
        }
      }
      return this;
    },
  },
  {
    id: "techno",
    name: "Techno",
    style: "Techno",
    desc: "Driving four-on-the-floor techno kick with clap on 2 & 4 and closed hi-hat 8ths",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 130,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        for (let j = 0; j < 16; j += 4) {
          this.grid.kick[o + j] = 1;
        }
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 6] = 0.5;
        this.grid.hihat[o + 14] = 0.5;
      }
      return this;
    },
  },
  {
    id: "techno-dark",
    name: "Dark Techno",
    style: "Techno",
    desc: "Minimal, driving techno with off-kilter kick and industrial hi-hat patterns",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 130,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 4] = 1;
        this.grid.kick[o + 8] = 1;
        this.grid.kick[o + 12] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 4) {
          this.grid.hihat[o + j] = 0.7;
        }
        this.grid.hihat[o + 2] = 0.3;
        this.grid.hihat[o + 6] = 0.3;
        this.grid.hihat[o + 10] = 0.3;
        this.grid.hihat[o + 14] = 0.3;
      }
      return this;
    },
  },
  {
    id: "electro",
    name: "Electro",
    style: "Electro",
    desc: "Electro-funk with syncopated kick on 1 and offbeats, snare on 2 & 4, and robotic hi-hat",
    groove: [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    bpm: 115,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 6] = 0.7;
        this.grid.kick[o + 10] = 0.7;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 1] = 0.5;
        this.grid.hihat[o + 5] = 0.5;
        this.grid.hihat[o + 9] = 0.5;
        this.grid.hihat[o + 13] = 0.5;
      }
      return this;
    },
  },
  {
    id: "electro-funk",
    name: "Electro Funk",
    style: "Electro",
    desc: "Syncopated electro-funk with tight kick patterns and crisp hi-hats",
    groove: [0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2],
    bpm: 110,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 3] = 0.7;
        this.grid.kick[o + 6] = 0.7;
        this.grid.kick[o + 11] = 0.7;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 4) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 2] = 0.5;
        this.grid.hihat[o + 6] = 0.5;
        this.grid.hihat[o + 10] = 0.5;
        this.grid.hihat[o + 14] = 0.8;
      }
      return this;
    },
  },
  {
    id: "trap",
    name: "Trap",
    style: "Hip Hop",
    desc: "808-heavy trap with rapid hi-hat rolls, syncopated kick triplets, and snare/clap accents",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 140,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 12] = 0.8;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.7;
        }
        for (let j = 0; j < 16; j++) {
          if (j >= 8 && j <= 15) this.grid.hihat[o + j] = 0.9;
        }
        this.grid.hihat[o + 10] = 0.3;
        this.grid.hihat[o + 11] = 0.3;
        this.grid.hihat[o + 14] = 0.3;
        this.grid.hihat[o + 15] = 0.3;
      }
      return this;
    },
  },
  {
    id: "reggae",
    name: "Reggae",
    style: "World",
    desc: "One-drop reggae with kick on 3, snare on 2 & 4, and off-beat hi-hat skank",
    groove: [0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3],
    bpm: 90,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 8] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 2; j < 16; j += 4) {
          this.grid.hihat[o + j] = 1;
        }
        for (let j = 0; j < 16; j += 4) {
          this.grid.hihat[o + j] = 0.3;
        }
        this.grid.hihat[o + 6] = 0.5;
        this.grid.hihat[o + 14] = 0.5;
      }
      return this;
    },
  },
  {
    id: "hiphop",
    name: "Hip Hop",
    style: "Hip Hop",
    desc: "Laid-back hip hop with kick on 1, 3, & 4, snare on 2 & 4, and swung hi-hat 8ths",
    groove: [0, 3, 0, 4, 0, 3, 0, 4, 0, 3, 0, 4, 0, 3, 0, 4],
    bpm: 95,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 8] = 1;
        this.grid.kick[o + 12] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 14] = 0;
      }
      return this;
    },
  },
  {
    id: "reggaeton",
    name: "Reggaeton",
    style: "Latin",
    desc: "Reggaeton dembow rhythm with kick on 1, 3, 5, 7 and snare on 4 & 8",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 95,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 4] = 1;
        this.grid.kick[o + 8] = 1;
        this.grid.kick[o + 12] = 1;
        this.grid.snare[o + 6] = 1;
        this.grid.snare[o + 14] = 1;
        for (let j = 2; j < 16; j += 4) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 0] = 0.5;
        this.grid.hihat[o + 4] = 0.5;
        this.grid.hihat[o + 8] = 0.5;
        this.grid.hihat[o + 12] = 0.5;
      }
      return this;
    },
  },
  {
    id: "disco",
    name: "Disco",
    style: "Funk",
    desc: "Four-on-the-floor disco with open hi-hat on offbeats and syncopated ride",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 120,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatOpen",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        for (let j = 0; j < 16; j += 4) {
          this.grid.kick[o + j] = 1;
        }
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 0.7;
        }
        this.grid.hihatOpen[o + 2] = 0.6;
        this.grid.hihatOpen[o + 6] = 0.6;
        this.grid.hihatOpen[o + 10] = 0.6;
        this.grid.hihatOpen[o + 14] = 0.6;
      }
      return this;
    },
  },
  {
    id: "tribal",
    name: "Tribal",
    style: "World",
    desc: "Tribal rhythm with syncopated kick and tom patterns",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 100,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "tomHi",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "tomLo",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.tomHi = new Array(steps).fill(0);
      this.grid.tomLo = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 4] = 1;
        this.grid.kick[o + 10] = 0.7;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        this.grid.tomHi[o + 2] = 0.6;
        this.grid.tomHi[o + 8] = 0.6;
        this.grid.tomLo[o + 6] = 0.6;
        this.grid.tomLo[o + 14] = 0.6;
      }
      return this;
    },
  },
  {
    id: "amen-break",
    name: "Amen Break",
    style: "Breakbeat",
    desc: "The classic Amen break with syncopated kicks, ghost snares, and steady ride pattern",
    groove: [0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3],
    bpm: 136,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "ride",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.ride = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 2] = 0.8;
        this.grid.kick[o + 10] = 0.9;
        this.grid.kick[o + 11] = 0.6;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 7] = 0.5;
        this.grid.snare[o + 9] = 0.5;
        this.grid.snare[o + 12] = 0.8;
        this.grid.snare[o + 15] = 0.6;
        for (let j = 0; j < 16; j += 2) {
          this.grid.ride[o + j] = 0.4;
        }
      }
      return this;
    },
  },
  {
    id: "funky-drummer",
    name: "Funky Drummer",
    style: "Funk",
    desc: "The iconic Clyde Stubblefield break — 16th-note hi-hat with syncopated kick and snare ghost notes",
    groove: [0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4],
    bpm: 100,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 3] = 0.7;
        this.grid.kick[o + 6] = 0.6;
        this.grid.kick[o + 10] = 1;
        this.grid.kick[o + 13] = 0.7;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 7] = 0.5;
        this.grid.snare[o + 9] = 0.5;
        this.grid.snare[o + 12] = 1;
        this.grid.snare[o + 15] = 0.5;
        for (let j = 0; j < 16; j++) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 14] = 0;
      }
      return this;
    },
  },
  {
    id: "think-break",
    name: "Think Break",
    style: "Breakbeat",
    desc: "The Lyn Collins 'Think' break — funky syncopation with tight hi-hats and a steady snare",
    groove: [0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3],
    bpm: 130,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 3] = 1;
        this.grid.kick[o + 8] = 1;
        this.grid.kick[o + 11] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j++) {
          this.grid.hihat[o + j] = 0.9;
        }
        this.grid.hihat[o + 14] = 0;
      }
      return this;
    },
  },
  {
    id: "hot-pants",
    name: "Hot Pants",
    style: "Breakbeat",
    desc: "The Hot Pants break with a driving kick-snare pattern and crisp hi-hats",
    groove: [0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3],
    bpm: 120,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 10] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.hihat[o + 14] = 0;
      }
      return this;
    },
  },
  {
    id: "uk-garage",
    name: "UK Garage",
    style: "Electronic",
    desc: "Syncopated UK garage with shuffling hi-hats, sparse kick placements, and a bounce feel",
    groove: [0, 3, 0, 4, 0, 3, 0, 4, 0, 3, 0, 4, 0, 3, 0, 4],
    bpm: 132,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 6] = 0.8;
        this.grid.kick[o + 12] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        this.grid.snare[o + 14] = 0.4;
        for (let j = 0; j < 16; j += 4) {
          this.grid.hihat[o + j] = 0.8;
          this.grid.hihat[o + j + 2] = 0.5;
        }
        this.grid.hihat[o + 3] = 0.3;
        this.grid.hihat[o + 7] = 0.3;
        this.grid.hihat[o + 11] = 0.5;
        this.grid.hihat[o + 15] = 0.3;
      }
      return this;
    },
  },
  {
    id: "tom-fill",
    name: "Tom Fill",
    style: "Rock",
    desc: "A syncopated tom fill rolling from hi to low toms over a kick-snare groove",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 100,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "tomHi",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "tomMid",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "tomLo",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures;
      const steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.tomHi = new Array(steps).fill(0);
      this.grid.tomMid = new Array(steps).fill(0);
      this.grid.tomLo = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 4] = 1;
        this.grid.kick[o + 8] = 1;
        this.grid.kick[o + 12] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        this.grid.tomHi[o + 10] = 0.8;
        this.grid.tomHi[o + 11] = 0.6;
        this.grid.tomMid[o + 12] = 0.8;
        this.grid.tomMid[o + 13] = 0.6;
        this.grid.tomLo[o + 14] = 1;
        this.grid.tomLo[o + 15] = 0.8;
      }
      return this;
    },
  },
  {
    id: "crash-fill",
    name: "Crash Fill",
    style: "Rock",
    desc: "Crash cymbal accents on the downbeat of key measures with a rock groove underneath",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 110,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "crash",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
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
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 8] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        for (let j = 0; j < 16; j += 2) {
          this.grid.hihat[o + j] = 1;
        }
        this.grid.crash[o + 0] = 1;
        if (i === m - 1) this.grid.crash[o + 0] = 0;
      }
      return this;
    },
  },
  {
    id: "amen-midi",
    name: "Amen Break MIDI",
    style: "Breakbeat",
    desc: "Classic Amen Break transcribed from MIDI — kick on 1,2,&,4e, snare with ghost notes, steady ride on 8ths",
    groove: [0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3],
    bpm: 136,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "ride",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures,
        steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.ride = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 0.9;
        this.grid.kick[o + 2] = 0.7;
        this.grid.kick[o + 10] = 0.8;
        this.grid.kick[o + 11] = 0.6;
        this.grid.snare[o + 4] = 0.8;
        this.grid.snare[o + 7] = 0.5;
        this.grid.snare[o + 9] = 0.5;
        this.grid.snare[o + 12] = 0.8;
        this.grid.snare[o + 15] = 0.6;
        for (let j = 0; j < 16; j += 2) {
          this.grid.ride[o + j] = 0.3;
        }
        this.grid.hihat[o + 0] = 0.2;
        this.grid.hihat[o + 6] = 0.2;
        this.grid.hihat[o + 8] = 0.2;
        this.grid.hihat[o + 14] = 0.2;
      }
      return this;
    },
  },
  // --- Edge/Top articulation versions (replace originals when Edge Mode is on) ---
  {
    id: "funk-edge",
    name: "Funk [Edge]",
    style: "Funk",
    desc: "Funk with hi-hat edge on downbeats — brighter, percussive closed-hat articulation",
    groove: [0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4],
    bpm: 100,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatEdge",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatMute",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures,
        steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.hihatEdge = new Array(steps).fill(0);
      this.grid.hihatMute = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 6] = 1;
        this.grid.kick[o + 10] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        this.grid.hihatEdge[o + 0] = 1;
        this.grid.hihatEdge[o + 4] = 1;
        this.grid.hihatEdge[o + 8] = 1;
        this.grid.hihatEdge[o + 12] = 1;
        this.grid.hihat[o + 2] = 0.7;
        this.grid.hihat[o + 6] = 0.7;
        this.grid.hihat[o + 10] = 0.7;
        this.grid.hihatMute[o + 14] = 1;
      }
      return this;
    },
  },
  {
    id: "funky-drummer-edge",
    name: "Funky Drummer [Edge]",
    style: "Funk",
    desc: "Funky Drummer with hi-hat edge accents on downbeats and softer hat on offbeats",
    groove: [0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4],
    bpm: 100,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatEdge",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatMute",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures,
        steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.hihatEdge = new Array(steps).fill(0);
      this.grid.hihatMute = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 3] = 0.7;
        this.grid.kick[o + 6] = 0.6;
        this.grid.kick[o + 10] = 1;
        this.grid.kick[o + 13] = 0.7;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 7] = 0.5;
        this.grid.snare[o + 9] = 0.5;
        this.grid.snare[o + 12] = 1;
        this.grid.snare[o + 15] = 0.5;
        this.grid.hihatEdge[o + 0] = 1;
        this.grid.hihatEdge[o + 4] = 1;
        this.grid.hihatEdge[o + 8] = 1;
        this.grid.hihatEdge[o + 12] = 1;
        this.grid.hihat[o + 1] = 0.6;
        this.grid.hihat[o + 2] = 0.6;
        this.grid.hihat[o + 3] = 0.6;
        this.grid.hihat[o + 5] = 0.6;
        this.grid.hihat[o + 6] = 0.6;
        this.grid.hihat[o + 7] = 0.6;
        this.grid.hihat[o + 9] = 0.6;
        this.grid.hihat[o + 10] = 0.6;
        this.grid.hihat[o + 11] = 0.6;
        this.grid.hihat[o + 13] = 0.6;
        this.grid.hihat[o + 14] = 0.6;
        this.grid.hihat[o + 15] = 0.6;
        this.grid.hihatMute[o + 14] = 1;
      }
      return this;
    },
  },
  {
    id: "hiphop-edge",
    name: "Hip Hop [Edge]",
    style: "Hip Hop",
    desc: "Hip Hop with hi-hat edge on downbeats and muted hat on offbeats for tighter articulation",
    groove: [0, 3, 0, 4, 0, 3, 0, 4, 0, 3, 0, 4, 0, 3, 0, 4],
    bpm: 95,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatEdge",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatMute",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures,
        steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.hihatEdge = new Array(steps).fill(0);
      this.grid.hihatMute = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 8] = 1;
        this.grid.kick[o + 12] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        this.grid.hihatEdge[o + 0] = 1;
        this.grid.hihatEdge[o + 4] = 1;
        this.grid.hihatEdge[o + 8] = 1;
        this.grid.hihatEdge[o + 12] = 1;
        this.grid.hihat[o + 2] = 0.7;
        this.grid.hihat[o + 6] = 0.7;
        this.grid.hihat[o + 10] = 0.7;
        this.grid.hihatMute[o + 14] = 10;
      }
      return this;
    },
  },
  {
    id: "drum-bass-edge",
    name: "Drum & Bass [Edge]",
    style: "Electronic",
    desc: "Drum & Bass with hi-hat edge hits on downbeats and muted articulation on fast rolls",
    groove: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
    bpm: 160,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatEdge",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatMute",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures,
        steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.hihatEdge = new Array(steps).fill(0);
      this.grid.hihatMute = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 6] = 1;
        this.grid.kick[o + 10] = 1;
        this.grid.kick[o + 13] = 1;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        this.grid.hihatEdge[o + 0] = 1;
        this.grid.hihatEdge[o + 4] = 1;
        this.grid.hihatEdge[o + 8] = 1;
        this.grid.hihatEdge[o + 12] = 1;
        this.grid.hihat[o + 2] = 0.6;
        this.grid.hihat[o + 6] = 0.6;
        this.grid.hihat[o + 10] = 0.6;
        this.grid.hihat[o + 14] = 0.6;
        this.grid.hihat[o + 5] = 0.4;
        this.grid.hihat[o + 7] = 0.4;
        this.grid.hihat[o + 9] = 0.4;
        this.grid.hihat[o + 15] = 0.4;
      }
      return this;
    },
  },
  {
    id: "trap-edge",
    name: "Trap [Edge]",
    style: "Hip Hop",
    desc: "Trap with hi-hat edge on primary downbeats and muted chick sounds for a tighter feel",
    groove: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 140,
    ...grid(
      2,
      [
        "kick",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "snare",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihat",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatEdge",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ],
      [
        "hihatMute",
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      ]
    ),
    rebuild() {
      const m = this.measures,
        steps = m * 16;
      this.grid.kick = new Array(steps).fill(0);
      this.grid.snare = new Array(steps).fill(0);
      this.grid.hihat = new Array(steps).fill(0);
      this.grid.hihatEdge = new Array(steps).fill(0);
      this.grid.hihatMute = new Array(steps).fill(0);
      for (let i = 0; i < m; i++) {
        const o = i * 16;
        this.grid.kick[o + 0] = 1;
        this.grid.kick[o + 6] = 1;
        this.grid.kick[o + 12] = 0.8;
        this.grid.snare[o + 4] = 1;
        this.grid.snare[o + 12] = 1;
        this.grid.hihatEdge[o + 0] = 1;
        this.grid.hihatEdge[o + 4] = 1;
        this.grid.hihatEdge[o + 8] = 1;
        this.grid.hihatEdge[o + 12] = 1;
        this.grid.hihat[o + 2] = 0.7;
        this.grid.hihat[o + 6] = 0.7;
        this.grid.hihat[o + 10] = 0.7;
        this.grid.hihat[o + 14] = 0.7;
        for (let j = 9; j <= 11; j++) this.grid.hihat[o + j] = 0.8;
        this.grid.hihat[o + 15] = 0.8;
      }
      return this;
    },
  },
  {
    id: "emfunk",
    name: "Em Funk",
    style: "Funk",
    desc: "Crash boom bang.",
    groove: [0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4],
    bpm: 100,
    measures: 2,
    grid: {
      kick: [
        1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0,
        0, 0, 1, 0, 0, 0, 0, 0,
      ],
      snare: [
        0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0,
      ],
      hihat: [
        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
        1, 0, 1, 0, 1, 0, 1, 0,
      ],
      hihatOpen: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      hihatEdge: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      hihatMute: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      crash: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      ride: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      tomHi: [
        0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      tomMid: [
        0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 0, 0, 0, 0, 0,
      ],
      tomLo: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
  },
  {
    id: "emfunk2",
    name: "Em Funk 2",
    style: "Funk",
    desc: "Hi Tom! Bye Tom!",
    groove: [0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4, 0, 3, 1, 4],
    bpm: 100,
    measures: 2,
    grid: {
      kick: [
        1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0,
        0, 0, 1, 0, 0, 0, 0, 0,
      ],
      snare: [
        0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0,
      ],
      hihat: [
        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0,
        1, 0, 1, 0, 1, 0, 1, 0,
      ],
      hihatOpen: [
        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1,
        0, 1, 0, 1, 0, 1, 0, 1,
      ],
      hihatEdge: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      hihatMute: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      crash: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      ride: [
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0,
      ],
      tomHi: [
        0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0,
        0, 0, 1, 0, 1, 0, 1, 0,
      ],
      tomMid: [
        1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 1, 0, 1,
      ],
      tomLo: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
  },
];

// Rebuild all patterns at import time
for (const pattern of drumPatterns) {
  if (pattern.rebuild) pattern.rebuild();
}
