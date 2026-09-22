"use client";

/**
 * Five self-contained sound "pairings" — a recognition chime and a zoom
 * chime tuned to feel like they belong to the same voice — for
 * side-by-side comparison on /sound-lab. Kept separate from
 * lib/feedback.js (the actual in-app sounds) until one of these is
 * picked to replace it, so exploring here can't affect the live
 * experience.
 */

let audioCtx = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

function tone(ctx, { freq, start, duration, gain = 0.16, type = "sine", attack = 0.015, detune = 0 }) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  const t0 = ctx.currentTime + start;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** A short, filtered burst of noise — a percussive "tap" transient. */
function noiseTap(ctx, { start, duration = 0.05, gain = 0.1, filterFreq = 4000 }) {
  const size = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / size);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = filterFreq;
  const g = ctx.createGain();
  g.gain.value = gain;
  const t0 = ctx.currentTime + start;
  src.connect(filter).connect(g).connect(ctx.destination);
  src.start(t0);
}

/** Wraps a synth callback so a blocked/missing Web Audio API no-ops. */
function safe(fn) {
  return () => {
    try {
      const ctx = getContext();
      if (!ctx) return;
      fn(ctx);
    } catch {
      /* Web Audio unavailable or blocked — no-op */
    }
  };
}

export const soundPairings = [
  {
    id: "crystal",
    name: "Crystal",
    description: "Clean, bright, pure sine tones with a faint octave shimmer — minimal and precise.",
    playRecognition: safe((ctx) => {
      tone(ctx, { freq: 1046.5, start: 0, duration: 0.22, gain: 0.14 });
      tone(ctx, { freq: 1318.5, start: 0.09, duration: 0.32, gain: 0.13 });
      tone(ctx, { freq: 2637, start: 0.09, duration: 0.32, gain: 0.03 });
    }),
    playZoom: safe((ctx) => {
      tone(ctx, { freq: 1567.98, start: 0, duration: 0.14, gain: 0.09 });
    }),
  },
  {
    id: "warm-bell",
    name: "Warm Bell",
    description: "Triangle-wave bell tones with a soft overtone layered on top — rounder and richer.",
    playRecognition: safe((ctx) => {
      tone(ctx, { freq: 659.3, start: 0, duration: 0.34, gain: 0.15, type: "triangle" });
      tone(ctx, { freq: 1318.5, start: 0, duration: 0.34, gain: 0.05 });
      tone(ctx, { freq: 880, start: 0.12, duration: 0.4, gain: 0.13, type: "triangle" });
      tone(ctx, { freq: 1760, start: 0.12, duration: 0.4, gain: 0.04 });
    }),
    playZoom: safe((ctx) => {
      tone(ctx, { freq: 987.8, start: 0, duration: 0.2, gain: 0.09, type: "triangle" });
      tone(ctx, { freq: 1975.5, start: 0, duration: 0.2, gain: 0.03 });
    }),
  },
  {
    id: "glass-tap",
    name: "Glass Tap",
    description: "Crisp, tactile taps with a hint of texture — like a jewelry case latch closing.",
    playRecognition: safe((ctx) => {
      tone(ctx, { freq: 1760, start: 0, duration: 0.09, gain: 0.12, attack: 0.004 });
      noiseTap(ctx, { start: 0, duration: 0.04, gain: 0.05, filterFreq: 5000 });
      tone(ctx, { freq: 2093, start: 0.1, duration: 0.12, gain: 0.11, attack: 0.004 });
      noiseTap(ctx, { start: 0.1, duration: 0.04, gain: 0.05, filterFreq: 6000 });
    }),
    playZoom: safe((ctx) => {
      tone(ctx, { freq: 1567.98, start: 0, duration: 0.08, gain: 0.09, attack: 0.003 });
      noiseTap(ctx, { start: 0, duration: 0.03, gain: 0.04, filterFreq: 5500 });
    }),
  },
  {
    id: "soft-marimba",
    name: "Soft Marimba",
    description: "Mellow, wooden, unhurried — a warmer, lower-register motif.",
    playRecognition: safe((ctx) => {
      tone(ctx, { freq: 392, start: 0, duration: 0.4, gain: 0.15, type: "triangle", attack: 0.05 });
      tone(ctx, { freq: 493.9, start: 0.14, duration: 0.5, gain: 0.14, type: "triangle", attack: 0.06 });
    }),
    playZoom: safe((ctx) => {
      tone(ctx, { freq: 440, start: 0, duration: 0.22, gain: 0.1, type: "triangle", attack: 0.04 });
    }),
  },
  {
    id: "shimmer",
    name: "Shimmer",
    description: "Detuned, chorused tones with a long tail — spacious and ethereal.",
    playRecognition: safe((ctx) => {
      tone(ctx, { freq: 1046.5, start: 0, duration: 0.5, gain: 0.1, detune: -6, attack: 0.05 });
      tone(ctx, { freq: 1046.5, start: 0, duration: 0.5, gain: 0.1, detune: 6, attack: 0.05 });
      tone(ctx, { freq: 1318.5, start: 0.16, duration: 0.6, gain: 0.09, detune: -6, attack: 0.06 });
      tone(ctx, { freq: 1318.5, start: 0.16, duration: 0.6, gain: 0.09, detune: 6, attack: 0.06 });
    }),
    playZoom: safe((ctx) => {
      tone(ctx, { freq: 1567.98, start: 0, duration: 0.3, gain: 0.07, detune: -5, attack: 0.03 });
      tone(ctx, { freq: 1567.98, start: 0, duration: 0.3, gain: 0.07, detune: 5, attack: 0.03 });
    }),
  },
];
