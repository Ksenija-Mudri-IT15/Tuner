export const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Notes offered when creating a tuning, C0 to B5
export const ALL_NOTES = Array.from({ length: 72 }, (_, i) => NAMES[i % 12] + Math.floor(i / 12));

// Strings listed from lowest to highest
export const TUNINGS = {
  guitar: {
    'Standard': 'E2 A2 D3 G3 B3 E4',
    'Drop D': 'D2 A2 D3 G3 B3 E4',
    'Half-step down': 'D#2 G#2 C#3 F#3 A#3 D#4',
    'D Standard': 'D2 G2 C3 F3 A3 D4',
    'Drop C': 'C2 G2 C3 F3 A3 D4',
    'DADGAD': 'D2 A2 D3 G3 A3 D4',
    'Open G': 'D2 G2 D3 G3 B3 D4',
  },
  bass4: {
    'Standard': 'E1 A1 D2 G2',
    'Drop D': 'D1 A1 D2 G2',
    'Half-step down': 'D#1 G#1 C#2 F#2',
    'Drop C': 'C1 G1 C2 F2',
  },
  bass5: {
    'Standard': 'B0 E1 A1 D2 G2',
    'Half-step down': 'A#0 D#1 G#1 C#2 F#2',
    'Drop A': 'A0 E1 A1 D2 G2',
    'Drop C': 'C1 E1 A1 D2 G2',
  },
  bass6: {
    'Standard': 'B0 E1 A1 D2 G2 C3',
    'Half-step down': 'A#0 D#1 G#1 C#2 F#2 B2',
    'Drop A': 'A0 E1 A1 D2 G2 C3',
    'Drop C': 'C1 E1 A1 D2 G2 C3',
  },
};
