"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import RecognitionOverlay from "./RecognitionOverlay";
import LightSweep from "./LightSweep";
import DiamondStage from "./DiamondStage";
import SidePanelStack, { SIDE_PANEL_WIDTH, STACK_RAIL_TOTAL } from "./SidePanelStack";
import PrototypeControls from "./PrototypeControls";
import { Icon } from "./icons";
import { playRecognitionChime, vibrate } from "@/lib/feedback";
import { useViewportWidth } from "@/lib/useMediaQuery";

const RECOGNITION_MS = 800;

// However much the side stack claims, the stone itself never shrinks
// below this — otherwise, on a moderate "wide" viewport (a laptop
// window rather than a huge desktop display), an open board's width
// can reserve nearly the whole screen and leave the stone a sliver so
// thin it reads as stray black bars rather than a photo.
const MIN_STAGE_WIDTH = 280;

function fireRecognized(setRecognized) {
  setRecognized(true);
  playRecognitionChime();
  vibrate([12, 40, 16]);
}

export default function DiamondExperience({
  diamond,
  tracrRecord,
  giaRecord,
  stageLayout = "centered",
}) {
  const router = useRouter();
  const viewportWidth = useViewportWidth();
  const [recognized, setRecognized] = useState(false);
  // The side stack (About/4Cs rails plus the inscription panel) stays
  // fully hidden until the viewer explicitly asks for more — DiamondStage's
  // "More about this diamond" button — rather than appearing on its own
  // the moment the stone is authenticated. It's the one details surface
  // the app has (targeting iPad/browser widths) — no separate mobile
  // bottom-sheet fallback.
  const [detailsRevealed, setDetailsRevealed] = useState(false);
  const [stageKey, setStageKey] = useState(0);
  const [sweep, setSweep] = useState(false);
  const timeoutRef = useRef(null);

  // The parent page renders this component with key={diamond.id}, so a new
  // diamond identity fully remounts it — state starts fresh automatically,
  // standing in for a brand new NFC tap. This effect just kicks off the
  // one-time recognition timer for that mount.
  useEffect(() => {
    timeoutRef.current = setTimeout(() => fireRecognized(setRecognized), RECOGNITION_MS);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  function replayRecognition() {
    setRecognized(false);
    setDetailsRevealed(false);
    setSweep(false); // so the light glimmer is ready to fire again on the next first tap
    setStageKey((k) => k + 1); // remounts DiamondStage, clearing its focus/zoom/tilt state too
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fireRecognized(setRecognized), RECOGNITION_MS);
  }

  function resetExperience() {
    replayRecognition();
  }

  // DiamondStage's "More about this diamond" button — reveals the side
  // stack (it renders closed, a rail rather than an open board).
  function handleOpenDetails() {
    setDetailsRevealed(true);
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[var(--surface)]">
      <AnimatePresence>
        {!recognized ? <RecognitionOverlay diamondName={diamond.name} /> : null}
      </AnimatePresence>

      {/* Fires from DiamondStage's onFocus — the viewer's first tap on the
          still-blurry stone — rather than automatically on recognition. */}
      {sweep ? <LightSweep key={stageKey} /> : null}

      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: recognized ? 1 : 0,
          // The stage stops short of the right-hand stack's baseline
          // footprint — the olive inscription panel plus the two closed
          // rails beside it — so nothing in the photo sits permanently
          // hidden behind them. It does NOT pull back further when a
          // rail opens its board: that board overlays on top of the
          // stage instead (SidePanelStack renders above it, z-30),
          // covering whatever headline/text sits underneath rather than
          // shrinking the stage to dodge it. Capped by MIN_STAGE_WIDTH so
          // the baseline reservation never eats so much of a moderate-
          // width window that the stone is squeezed to an unreadable
          // sliver.
          right: Math.min(
            detailsRevealed ? SIDE_PANEL_WIDTH + STACK_RAIL_TOTAL : 0,
            viewportWidth > 0 ? Math.max(0, viewportWidth - MIN_STAGE_WIDTH) : Infinity
          ),
        }}
        // Closing the whole stack (its X) slides it off to the right in
        // 0.42s (SidePanelStack's exit); widening back on that same timing
        // keeps the photo's edge following the stack out, rather than
        // leaving a dark strip where it had been.
        transition={{ duration: detailsRevealed ? 0.6 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <DiamondStage
          key={stageKey}
          diamondId={diamond.id}
          inscriptionNumber={giaRecord?.reportNumber}
          onFocus={() => setSweep(true)}
          onOpenDetails={handleOpenDetails}
          detailsOpen={detailsRevealed}
          layout={stageLayout}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/55 via-black/15 to-transparent px-4 pb-12 pt-5 sm:px-6">
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="flex flex-1 justify-start">
              <button
                onClick={() => router.back()}
                aria-label="Back"
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 bg-black/30 text-[var(--ink)] backdrop-blur transition-colors hover:border-white/30"
              >
                <Icon name="chevronLeft" className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {recognized && detailsRevealed ? (
          <SidePanelStack
            key="side-panels"
            diamond={diamond}
            tracrRecord={tracrRecord}
            onClose={() => setDetailsRevealed(false)}
          />
        ) : null}
      </AnimatePresence>

      <PrototypeControls
        currentId={diamond.id}
        onOpenDetails={handleOpenDetails}
        onReplay={replayRecognition}
        onReset={resetExperience}
      />
    </div>
  );
}
