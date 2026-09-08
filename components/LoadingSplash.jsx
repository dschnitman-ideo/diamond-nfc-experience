"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DiamondMark from "./DiamondMark";

const SPLASH_MS = 1100;

/**
 * The very first thing a viewer sees on entering the diamond
 * experience — a brief branded flash of the diamond mark before any
 * product content mounts. Lives in the /diamond layout, so it appears
 * once per full page load rather than on every client-side diamond
 * switch (that moment is RecognitionOverlay's job).
 */
export default function LoadingSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), SPLASH_MS);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="loading-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--surface)]"
        >
          <motion.div
            initial={{ scale: 0.82, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            <motion.div
              animate={{ opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-28 w-28 rounded-full blur-2xl"
              style={{
                background: "radial-gradient(circle, var(--brass-soft) 0%, transparent 70%)",
              }}
            />
            <motion.div
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <DiamondMark className="relative h-16 text-[var(--ink)]" />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
