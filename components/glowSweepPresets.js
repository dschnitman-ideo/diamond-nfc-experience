/**
 * Tuning presets fed into the one ShaderSweep component — see its
 * comment for why five "looks" are five presets rather than five
 * separate implementations. Colors are linear 0–1 RGB triples.
 */

const IVORY = [0.97, 0.94, 0.88];
const BRASS_EDGE = [0.79, 0.65, 0.37];
const BRASS_HALO = [0.75, 0.6, 0.35];
const WHITE = [1, 1, 1];

export const glowSweepPresets = [
  {
    id: "refined-streak",
    name: "Refined Streak",
    description: "A crisp diagonal core with a soft brass-tinted halo — the original idea, shader-smooth.",
    preset: {
      angleDeg: 12,
      coreWidth: 0.02,
      haloWidth: 0.09,
      coreGain: 1.1,
      haloGain: 0.35,
      coreColor: WHITE,
      edgeColor: BRASS_EDGE,
      haloColor: BRASS_HALO,
      grain: 0.02,
      chroma: 0.004,
      startAt: -0.35,
      endAt: 1.3,
      duration: 1.6,
    },
  },
  {
    id: "horizontal-wash-pro",
    name: "Horizontal Wash Pro",
    description: "The favorite from last round, redone as a true gradient — wide, warm, and dead smooth.",
    preset: {
      angleDeg: 0,
      coreWidth: 0.06,
      haloWidth: 0.22,
      coreGain: 0.55,
      haloGain: 0.5,
      coreColor: IVORY,
      edgeColor: BRASS_EDGE,
      haloColor: BRASS_HALO,
      grain: 0.015,
      chroma: 0.002,
      startAt: -0.4,
      endAt: 1.35,
      duration: 2.4,
    },
  },
  {
    id: "glass-prism",
    name: "Glass Prism",
    description: "Narrow and bright with a rainbow fringe — light splitting through a facet.",
    preset: {
      angleDeg: 8,
      coreWidth: 0.012,
      haloWidth: 0.06,
      coreGain: 1.3,
      haloGain: 0.25,
      coreColor: WHITE,
      edgeColor: [0.72, 0.85, 1.0],
      haloColor: [0.78, 0.72, 0.9],
      grain: 0.02,
      chroma: 0.007,
      startAt: -0.3,
      endAt: 1.3,
      duration: 1.4,
    },
  },
  {
    id: "soft-aurora",
    name: "Soft Aurora",
    description: "Wide, low-contrast, and unhurried — the halo does most of the work, cool at the edges.",
    preset: {
      angleDeg: -6,
      coreWidth: 0.05,
      haloWidth: 0.28,
      coreGain: 0.4,
      haloGain: 0.6,
      coreColor: [0.95, 0.9, 0.8],
      edgeColor: [0.6, 0.55, 0.75],
      haloColor: [0.65, 0.55, 0.5],
      grain: 0.025,
      chroma: 0.003,
      startAt: -0.45,
      endAt: 1.4,
      duration: 3.0,
    },
  },
  {
    id: "quick-glint",
    name: "Quick Glint",
    description: "Narrow, bright, and fast — a snap of light rather than a slow reveal.",
    preset: {
      angleDeg: 4,
      coreWidth: 0.015,
      haloWidth: 0.05,
      coreGain: 1.4,
      haloGain: 0.2,
      coreColor: WHITE,
      edgeColor: [0.85, 0.75, 0.5],
      haloColor: BRASS_HALO,
      grain: 0.01,
      chroma: 0.005,
      startAt: -0.25,
      endAt: 1.25,
      duration: 0.9,
    },
  },
];
