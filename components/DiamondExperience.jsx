"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import RecognitionOverlay from "./RecognitionOverlay";
import LightSweep from "./LightSweep";
import DiamondStage from "./DiamondStage";
import DetailsSheet from "./DetailsSheet";
import ShareButton from "./ShareButton";
import PrototypeControls from "./PrototypeControls";
import { Icon } from "./icons";
import { getColorTint } from "@/data/diamonds";
import { playRecognitionChime, vibrate } from "@/lib/feedback";

const RECOGNITION_MS = 800;

function fireRecognized(setRecognized) {
  setRecognized(true);
  playRecognitionChime();
  vibrate([12, 40, 16]);
}

export default function DiamondExperience({ diamond, tracrRecord, giaRecord, prev, next }) {
  const router = useRouter();
  const [recognized, setRecognized] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("diamond");
  const [stageKey, setStageKey] = useState(0);
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
    setSheetOpen(false);
    setStageKey((k) => k + 1); // remounts DiamondStage, clearing its zoom/tilt state too
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fireRecognized(setRecognized), RECOGNITION_MS);
  }

  function resetExperience() {
    setActiveTab("diamond");
    replayRecognition();
  }

  function jumpTab(tab) {
    setActiveTab(tab);
    setSheetOpen(true);
  }

  function navigateTo(id) {
    setSheetOpen(false);
    router.push(`/diamond/${id}`);
  }

  const tint = getColorTint(diamond.color);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[var(--surface)]">
      <AnimatePresence>
        {!recognized ? <RecognitionOverlay diamondName={diamond.name} /> : null}
      </AnimatePresence>

      {/* Mounts fresh (and plays its one-shot animation) each time
          recognition completes — the initial reveal, and each replay,
          since stageKey changes and recognized cycles false→true. */}
      {recognized ? <LightSweep key={stageKey} /> : null}

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: recognized ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <DiamondStage
          key={stageKey}
          shape={diamond.shape}
          tint={tint}
          inscriptionNumber={giaRecord?.reportNumber}
          autoZoom={recognized}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 via-black/15 to-transparent px-4 pb-12 pt-5 sm:px-6">
          <div className="pointer-events-auto flex items-center justify-between gap-3">
            <button
              onClick={() => router.back()}
              aria-label="Back"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 bg-black/30 text-[var(--ink)] backdrop-blur transition-colors hover:border-white/30"
            >
              <Icon name="chevronLeft" className="h-[18px] w-[18px]" />
            </button>
            <div className="min-w-0 text-center">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                Diamond {diamond.id}
              </p>
              <p className="mt-0.5 truncate font-[family-name:var(--font-display)] text-base text-[var(--ink)]">
                {diamond.name}
              </p>
            </div>
            <div className="flex-none">
              <ShareButton title={diamond.name} />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-12 sm:px-6">
          <button
            onClick={() => setSheetOpen(true)}
            className="pointer-events-auto mx-auto flex items-center gap-2 rounded-full border border-white/15 bg-[var(--surface-card)]/90 px-5 py-3 text-sm font-medium text-[var(--ink)] backdrop-blur transition-colors hover:border-white/30"
          >
            Diamond Details
            <Icon name="chevronDown" className="h-4 w-4 rotate-180 text-[var(--ink-soft)]" />
          </button>
        </div>
      </motion.div>

      <DetailsSheet
        open={sheetOpen}
        diamond={diamond}
        tracrRecord={tracrRecord}
        giaRecord={giaRecord}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={() => setSheetOpen(false)}
        prev={prev}
        next={next}
        onNavigate={navigateTo}
      />

      <PrototypeControls
        currentId={diamond.id}
        onJumpTab={jumpTab}
        onReplay={replayRecognition}
        onReset={resetExperience}
      />
    </div>
  );
}
