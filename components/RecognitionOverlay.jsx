"use client";

import { motion } from "framer-motion";
import { Icon } from "./icons";

export default function RecognitionOverlay({ diamondName }) {
  return (
    <motion.div
      key="recognition"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[var(--surface)]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[var(--hairline-strong)]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-1px] rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, var(--brass) 12%, transparent 24%)",
            maskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
            WebkitMaskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
          }}
        />
        <Icon name="sparkle" className="h-6 w-6 text-[var(--brass)]" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center"
      >
        <p className="text-[13px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">
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
