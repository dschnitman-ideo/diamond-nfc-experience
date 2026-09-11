"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";
import { playZoomChime, vibrate } from "@/lib/feedback";

const EASE = [0.22, 1, 0.36, 1];

/**
 * The three real-photography zoom levels, standing in for the SVG
 * illustration this stage used to render. Each tap steps forward one
 * level; from the closest level a tap starts the sequence over.
 */
const STAGES = [
  {
    src: "/diamond-stage/level-1-default.png",
    alt: "Diamond, full view",
    // The girdle sits high in this wide shot, right where the crown
    // facets meet the pavilion.
    hotspot: { left: 50, top: 38 },
  },
  {
    src: "/diamond-stage/level-2-close.png",
    alt: "Diamond, closer view of the girdle",
    // Cropped tighter on the girdle band, which now sits mid-frame.
    hotspot: { left: 50, top: 56 },
  },
  { src: "/diamond-stage/level-3-inscription.png", alt: "Diamond, closest view of the laser inscription" },
];
const MAX_LEVEL = STAGES.length - 1;

/**
 * The full-screen stone itself. Starts on the zoomed-out product shot;
 * each tap steps into the next, closer photo, crossfading rather than
 * cutting. The first tap also fires onFocus, once, so the parent's
 * full-screen light sweep still plays on the viewer's first touch —
 * a tap from the final, closest level starts the sequence over.
 */
export default function DiamondStage({ inscriptionNumber, onFocus }) {
  const [level, setLevel] = useState(0);
  const hasFocused = useRef(false);

  function handleTap() {
    if (!hasFocused.current) {
      hasFocused.current = true;
      onFocus?.();
    }
    if (level >= MAX_LEVEL) {
      setLevel(0);
      vibrate(8);
    } else {
      setLevel((l) => l + 1);
      playZoomChime();
      vibrate(18);
    }
  }

  const stage = STAGES[level];
  const atFinalLevel = level === MAX_LEVEL;

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="relative flex w-[min(110vw,74vh)] flex-col items-center gap-4">
          <AnimatePresence>
            {atFinalLevel ? (
              <motion.p
                key="inscription-found"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="font-[family-name:var(--font-family-ui)] text-sm font-medium uppercase tracking-[0.14em] text-[var(--ink)]"
              >
                Inscription found
              </motion.p>
            ) : null}
          </AnimatePresence>

          <button
            type="button"
            onClick={handleTap}
            aria-label={atFinalLevel ? "Start over from the full view" : "Zoom in on the diamond"}
            className="relative aspect-square w-full cursor-pointer touch-manipulation select-none"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={level}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Image
                  src={stage.src}
                  alt={stage.alt}
                  fill
                  sizes="(min-width: 1024px) 440px, 92vw"
                  className="object-contain"
                  priority={level === 0}
                />
              </motion.div>
            </AnimatePresence>

            {!atFinalLevel ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: `${stage.hotspot.left}%`, top: `${stage.hotspot.top}%` }}
              >
                <span className="absolute h-full w-full animate-ping rounded-full border border-[var(--brass)]/70" />
                <span className="relative h-3 w-3 rounded-full bg-[var(--brass)]" />
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {atFinalLevel ? (
          <motion.div
            key="inscription-callout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.25, duration: 0.4, ease: EASE }}
            className="pointer-events-none absolute inset-x-0 bottom-32 z-20 flex justify-center px-6"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--hairline-strong)] bg-[var(--surface-card)]/95 px-4 py-3.5 shadow-xl shadow-black/40 backdrop-blur">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[var(--brass-soft)] text-[var(--brass)]">
                <Icon name="trustMark" className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[var(--ink)]">Trust Mark Verified</p>
                <p className="truncate text-xs text-[var(--ink-soft)]">
                  Inscription · GIA {inscriptionNumber}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
