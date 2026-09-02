"use client";

import { motion } from "framer-motion";

/**
 * A soft, slow glint that loops across the resting stone once nothing
 * has been touched for a few seconds — distinct from the full-screen
 * LightSweep reveal: smaller, quieter, confined to the stone itself,
 * and it repeats instead of playing once. Keeps the stage from going
 * visually dead during a pause in a demo.
 */
export default function IdleShimmer() {
  return (
    <motion.div
      initial={{ x: "-70%" }}
      animate={{ x: "170%" }}
      transition={{
        duration: 2.4,
        ease: [0.37, 0, 0.63, 1],
        repeat: Infinity,
        repeatDelay: 2.6,
      }}
      className="pointer-events-none absolute -inset-y-1/4 left-0 w-[36%]"
      style={{
        background:
          "linear-gradient(102deg, transparent 0%, rgba(255,255,255,0.04) 34%, rgba(255,255,255,0.32) 50%, rgba(201,163,93,0.28) 58%, transparent 84%)",
        filter: "blur(4px)",
        mixBlendMode: "screen",
      }}
    />
  );
}
