export const drumLayouts = [
  {
    id: 'default',
    name: 'Standard',
    positions: [
      { id: 'crash',  cx: 100, cy: 62,  r: 46 },
      { id: 'ride',   cx: 500, cy: 62,  r: 46 },
      { id: 'hihat',  cx: 92,  cy: 172, r: 36, group: ['hihatOpen'] },
      { id: 'tomHi',  cx: 200, cy: 152, r: 38 },
      { id: 'tomMid', cx: 310, cy: 152, r: 38 },
      { id: 'tomLo',  cx: 420, cy: 172, r: 40 },
      { id: 'snare',  cx: 208, cy: 252, r: 40 },
      { id: 'clap',   cx: 392, cy: 252, r: 30 },
      { id: 'kick',   cx: 300, cy: 340, r: 50 },
    ],
  },
  {
    id: 'td-02k',
    name: 'Roland TD-02K',
    positions: [
      { id: 'crash',  cx: 80,  cy: 50,  r: 38 },
      { id: 'ride',   cx: 520, cy: 50,  r: 38 },
      { id: 'hihat',  cx: 90,  cy: 155, r: 32, group: ['hihatOpen'] },
      { id: 'tomHi',  cx: 195, cy: 125, r: 34 },
      { id: 'tomMid', cx: 300, cy: 118, r: 34 },
      { id: 'tomLo',  cx: 405, cy: 135, r: 36 },
      { id: 'snare',  cx: 195, cy: 235, r: 36 },
      { id: 'clap',   cx: 405, cy: 235, r: 26 },
      { id: 'kick',   cx: 300, cy: 335, r: 44 },
    ],
  },
];

export function getLayoutById(id) {
  return drumLayouts.find(l => l.id === id) || drumLayouts[0];
}
