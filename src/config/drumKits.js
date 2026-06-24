const base = import.meta.env.BASE_URL || '/';

export const drumKits = [
  {
    id: 'stock',
    name: 'Stock Kit',
    type: 'synth',
  },
  {
    id: 'boom-bap',
    name: 'Boom Bap',
    type: 'samples',
    samples: {
      kick: `${base}drum-kits/boom-bap/kick.wav`,
      snare: `${base}drum-kits/boom-bap/snare.wav`,
      hihat: `${base}drum-kits/boom-bap/hihat.wav`,
      hihatOpen: `${base}drum-kits/boom-bap/hihatOpen.wav`,
      crash: `${base}drum-kits/boom-bap/crash.wav`,
      ride: `${base}drum-kits/boom-bap/ride.wav`,
      clap: `${base}drum-kits/boom-bap/clap.wav`,
    },
  },
];
