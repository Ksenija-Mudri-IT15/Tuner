import { NAMES } from './tunings.js';

export const noteToFreq = note => {
  const [, name, octave] = note.match(/^([A-G]#?)(\d)$/);
  return 440 * 2 ** ((NAMES.indexOf(name) + 12 * (+octave + 1) - 69) / 12);
};

export const freqToNote = freq => {
  const midi = Math.round(69 + 12 * Math.log2(freq / 440));
  return NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
};

export const cents = (freq, ref) => 1200 * Math.log2(freq / ref);

// Opens the microphone and returns read(minFreq, maxFreq) -> frequency in Hz, or null when there is no clear tone
export async function startMic() {
  const ctx = new AudioContext();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  await ctx.resume();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 8192;
  ctx.createMediaStreamSource(stream).connect(analyser);

  // Halving the sample rate keeps the work small, guitar and bass fundamentals stay far below the new limit
  const raw = new Float32Array(analyser.fftSize);
  const buf = new Float32Array(raw.length / 2);
  return (minFreq, maxFreq) => {
    analyser.getFloatTimeDomainData(raw);
    for (let i = 0; i < buf.length; i++) buf[i] = (raw[2 * i] + raw[2 * i + 1]) / 2;
    return detect(buf, ctx.sampleRate / 2, minFreq, maxFreq);
  };
}

// Normalized autocorrelation (McLeod pitch method)
function detect(x, rate, minFreq, maxFreq) {
  const minLag = Math.max(2, Math.floor(rate / maxFreq));
  const maxLag = Math.min(Math.ceil(rate / minFreq), x.length >> 1);
  const n = x.length - maxLag - 1;

  // sq[i] = energy of the first i samples
  const sq = new Float64Array(x.length + 1);
  for (let i = 0; i < x.length; i++) sq[i + 1] = sq[i] + x[i] * x[i];
  if (Math.sqrt(sq[n] / n) < 0.01) return null;

  const nsdf = new Float32Array(maxLag + 2);
  for (let lag = minLag - 1; lag <= maxLag + 1; lag++) {
    let r = 0;
    for (let i = 0; i < n; i++) r += x[i] * x[i + lag];
    nsdf[lag] = 2 * r / (sq[n] + sq[lag + n] - sq[lag]);
  }

  // Skip the lobe around lag 0, then take the first peak close to the highest one to avoid octave errors
  let start = minLag;
  while (nsdf[start] > 0) if (++start > maxLag) return null;
  let best = start;
  for (let lag = start; lag <= maxLag; lag++) if (nsdf[lag] > nsdf[best]) best = lag;
  if (nsdf[best] < 0.6) return null;
  for (let lag = start; lag < best; lag++) {
    if (nsdf[lag] >= 0.9 * nsdf[best] && nsdf[lag] >= nsdf[lag - 1] && nsdf[lag] >= nsdf[lag + 1]) { best = lag; break; }
  }

  // Parabolic interpolation between neighbouring lags for sub-sample precision
  const [a, b, c] = [nsdf[best - 1], nsdf[best], nsdf[best + 1]];
  return rate / (best + ((a - c) / (2 * (a - 2 * b + c)) || 0));
}
