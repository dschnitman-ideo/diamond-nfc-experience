"use client";

/**
 * Synthesized sound + haptic feedback for the recognition and zoom
 * moments. Tones are generated with the Web Audio API rather than
 * shipped as audio files — no assets to source or license, and it
 * keeps the bundle tiny. Every entry point is wrapped so a browser
 * without Web Audio/Vibration support (or one that blocks autoplay)
 * just silently no-ops instead of breaking the interaction.
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

function tone(ctx, { freq, start, duration, gain = 0.16, type = "sine" }) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + start;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Soft two-note ascending chime — the stone has been recognized. */
export function playRecognitionChime() {
  try {
    const ctx = getContext();
    if (!ctx) return;
    tone(ctx, { freq: 1046.5, start: 0, duration: 0.22, gain: 0.14 }); // C6
    tone(ctx, { freq: 1318.5, start: 0.09, duration: 0.3, gain: 0.13 }); // E6
  } catch {
    /* Web Audio unavailable or blocked — no-op */
  }
}

/** Quick bright tick — the trust mark has snapped into focus. */
export function playZoomChime() {
  try {
    const ctx = getContext();
    if (!ctx) return;
    tone(ctx, { freq: 1760, start: 0, duration: 0.09, gain: 0.11, type: "triangle" });
    tone(ctx, { freq: 2217, start: 0.055, duration: 0.16, gain: 0.09, type: "triangle" });
  } catch {
    /* Web Audio unavailable or blocked — no-op */
  }
}

export function vibrate(pattern) {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    /* Vibration API unavailable — no-op */
  }
}
