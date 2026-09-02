"use client";

import { motion } from "framer-motion";

/**
 * A single diagonal streak of light that swoops across the full screen
 * once — a premium "reveal" flourish, timed to the moment the stone
 * appears. `screen` blend mode over the near-black background makes it
 * read as light hitting the scene rather than a flat gradient sliding
 * over it.
 */
export default function LightSweep() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <motion.div
        initial={{ x: "-60vw" }}
        animate={{ x: "160vw" }}
        transition={{ duration: 2.1, ease: [0.65, 0, 0.35, 1] }}
        className="absolute -inset-y-1/4 left-0 w-[42vw]"
        style={{
          background:
            "linear-gradient(102deg, transparent 0%, rgba(255,255,255,0.05) 32%, rgba(255,255,255,0.6) 48%, rgba(201,163,93,0.5) 57%, transparent 85%)",
          filter: "blur(3px)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
