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

function tone(ctx, { freq, start, duration, gain = 0.16, type = "sine", attack = 0.015 }) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + start;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Soft marimba — mellow, wooden two-note motif — the stone has been recognized. */
export function playRecognitionChime() {
  try {
    const ctx = getContext();
    if (!ctx) return;
    tone(ctx, { freq: 392, start: 0, duration: 0.4, gain: 0.15, type: "triangle", attack: 0.05 }); // G4
    tone(ctx, { freq: 493.9, start: 0.14, duration: 0.5, gain: 0.14, type: "triangle", attack: 0.06 }); // B4
  } catch {
    /* Web Audio unavailable or blocked — no-op */
  }
}

/** Soft marimba — a single mellow note — the trust mark has snapped into focus. */
export function playZoomChime() {
  try {
    const ctx = getContext();
    if (!ctx) return;
    tone(ctx, { freq: 440, start: 0, duration: 0.22, gain: 0.1, type: "triangle", attack: 0.04 }); // A4
  } catch {
    /* Web Audio unavailable or blocked — no-op */
  }
}

/** A single, quiet tap — the About/4Cs side panel has opened. */
export function playPanelOpenSound() {
  try {
    const ctx = getContext();
    if (!ctx) return;
    tone(ctx, { freq: 420, start: 0, duration: 0.08, gain: 0.05, type: "sine", attack: 0.008 });
  } catch {
    /* Web Audio unavailable or blocked — no-op */
  }
}

/** A single, quiet tap, a touch lower — the panel has closed. */
export function playPanelCloseSound() {
  try {
    const ctx = getContext();
    if (!ctx) return;
    tone(ctx, { freq: 340, start: 0, duration: 0.08, gain: 0.05, type: "sine", attack: 0.008 });
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
