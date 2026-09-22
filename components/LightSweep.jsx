"use client";

import { useEffect, useState } from "react";
import ShaderSweep from "./ShaderSweep";
import { glowSweepPresets } from "./glowSweepPresets";

const GLASS_PRISM_PRESET = glowSweepPresets.find((p) => p.id === "glass-prism").preset;

/**
 * A single streak of light that swoops across the full screen once — a
 * premium "reveal" flourish, timed to the moment the stone appears.
 * Picked on /glow-lab out of five WebGL shader presets (see
 * ShaderSweep.jsx + glowSweepPresets.js) — "Glass Prism": a narrow,
 * bright core with a full rainbow chromatic fringe, like light
 * splitting through a facet.
 *
 * Unmounts itself once the sweep has finished, rather than leaving its
 * WebGL canvas sitting over the whole screen forever after its render
 * loop stops — a stale canvas layer like that was interfering with
 * DiamondStage's own crossfades, leaving the next photo(s) it tapped
 * through to blank out.
 */
export default function LightSweep() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), (GLASS_PRISM_PRESET.duration + 0.3) * 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <ShaderSweep preset={GLASS_PRISM_PRESET} />
    </div>
  );
}
