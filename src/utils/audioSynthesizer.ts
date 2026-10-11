import { MeditationTrack } from '../types/meditation';

const blobUrlCache = new Map<string, string>();
const blobDataCache = new Map<string, Blob>();

/**
 * Generates a warm, meditative WAV audio Blob for a given MeditationTrack.
 * Includes Tibetan singing bowl bell strikes at each guided phase transition,
 * gentle breathing swells, and harmonic temple resonance in 432Hz/528Hz/396Hz.
 */
export function synthesizeMeditationWavBlob(track: MeditationTrack): Blob {
  const cachedBlob = blobDataCache.get(track.id);
  if (cachedBlob) {
    return cachedBlob;
  }

  const sampleRate = 22050; // Crisp meditative quality while keeping file size fast & compact (~3.5MB per 90s)
  const duration = Math.max(15, Math.min(track.durationSeconds || 90, 300));
  const numSamples = sampleRate * duration;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF identifier
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const baseFreq = track.baseFrequencyHz || 432;
  const subFreq = baseFreq / 2;
  const fifthFreq = track.harmonicFrequencyHz || baseFreq * 1.5;
  const bellTimes = track.steps.map((s) => s.atSecond);
  // Add final closing bell 4 seconds before end
  if (duration > 10) {
    bellTimes.push(duration - 4);
  }

  const twoPi = 2 * Math.PI;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Smooth global fade-in (2.5s) and fade-out (3.5s)
    let masterEnv = 1.0;
    if (t < 2.5) {
      masterEnv = t / 2.5;
    } else if (t > duration - 3.5) {
      masterEnv = Math.max(0, (duration - t) / 3.5);
    }

    // Slow, serene breathing modulation (0.1 Hz => 10-second respiratory cycle)
    const breathCycle = 0.65 + 0.35 * Math.sin(twoPi * 0.1 * t - Math.PI / 2);

    // Warm temple pad / harmonic drone
    const pad1 = Math.sin(twoPi * subFreq * t) * 0.22;
    const pad2 = Math.sin(twoPi * baseFreq * t) * 0.16;
    const pad3 = Math.sin(twoPi * (fifthFreq * 0.5) * t) * 0.09;
    const pad4 = Math.sin(twoPi * (baseFreq * 2) * t) * 0.03 * Math.sin(twoPi * 0.07 * t);

    let sample = (pad1 + pad2 + pad3 + pad4) * breathCycle;

    // Tibetan singing bowl chime at each guided step timestamp
    for (let b = 0; b < bellTimes.length; b++) {
      const dt = t - bellTimes[b];
      if (dt >= 0 && dt < 6.0) {
        const bellAttack = dt < 0.04 ? dt / 0.04 : 1.0;
        const bellDecay = Math.exp(-dt * 0.85);
        const bellShimmer = 0.85 + 0.15 * Math.sin(twoPi * 3.2 * dt);
        const bellFundamental = Math.sin(twoPi * (baseFreq * 1.5) * dt) * 0.26;
        const bellOvertone = Math.sin(twoPi * (baseFreq * 2.99) * dt) * 0.11 * Math.exp(-dt * 1.4);
        sample += (bellFundamental + bellOvertone) * bellAttack * bellDecay * bellShimmer;
      }
    }

    const finalSample = Math.max(-0.95, Math.min(0.95, sample * masterEnv));
    view.setInt16(44 + i * 2, finalSample * 32767, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  blobDataCache.set(track.id, blob);
  return blob;
}

export function getOrCreateTrackBlobUrl(track: MeditationTrack, existingBlob?: Blob): string {
  const cachedUrl = blobUrlCache.get(track.id);
  if (cachedUrl) {
    return cachedUrl;
  }
  const blob = existingBlob || synthesizeMeditationWavBlob(track);
  blobDataCache.set(track.id, blob);
  const url = URL.createObjectURL(blob);
  blobUrlCache.set(track.id, url);
  return url;
}

export function setCustomTrackBlob(trackId: string, blob: Blob): string {
  const prevUrl = blobUrlCache.get(trackId);
  if (prevUrl) {
    URL.revokeObjectURL(prevUrl);
  }
  blobDataCache.set(trackId, blob);
  const newUrl = URL.createObjectURL(blob);
  blobUrlCache.set(trackId, newUrl);
  return newUrl;
}

export function getTrackBlobForDownload(track: MeditationTrack): Blob {
  const existing = blobDataCache.get(track.id);
  if (existing) return existing;
  return synthesizeMeditationWavBlob(track);
}
