"use client";

import { motion } from "framer-motion";
import DiamondMark from "./DiamondMark";

const EASE = [0.22, 1, 0.36, 1];
// Matches LoadingSplash's own pulse — the two play back-to-back on
// load (splash, then recognition), so a mismatched rhythm here would be
// a visible speed change mid-sequence.
const PULSE_DURATION = 2.1;

export default function RecognitionOverlay({ diamondName }) {
  return (
    <motion.div
      key="recognition"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[var(--surface)]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative flex items-center justify-center"
      >
        <motion.div
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: PULSE_DURATION, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-24 w-24 rounded-full blur-2xl"
          style={{
            background: "radial-gradient(circle, var(--brass-soft) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: PULSE_DURATION, repeat: Infinity, ease: "easeInOut" }}
        >
          <DiamondMark className="relative h-14 text-[var(--ink)]" />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center"
      >
        <p className="text-sm text-[var(--ink-soft)]">
          Recognizing your diamond
        </p>
        {diamondName ? (
          <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            {diamondName}
          </p>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
