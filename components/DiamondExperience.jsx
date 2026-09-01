"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import RecognitionOverlay from "./RecognitionOverlay";
import SegmentedTabs from "./SegmentedTabs";
import DiamondStage from "./DiamondStage";
import DiamondPanel from "./DiamondPanel";
import TracrPanel from "./TracrPanel";
import GiaPanel from "./GiaPanel";
import ShareButton from "./ShareButton";
import PrototypeControls from "./PrototypeControls";
import { Icon } from "./icons";
import { getColorTint } from "@/data/diamonds";

const RECOGNITION_MS = 800;

export default function DiamondExperience({ diamond, tracrRecord, giaRecord, prev, next }) {
  const router = useRouter();
  const [recognized, setRecognized] = useState(false);
  const [activeTab, setActiveTab] = useState("diamond");
  const timeoutRef = useRef(null);

  // The parent page renders this component with key={diamond.id}, so a new
  // diamond identity fully remounts it — `recognized`/`activeTab` start
  // fresh automatically, standing in for a brand new NFC tap. This effect
  // just kicks off the one-time recognition timer for that mount.
  useEffect(() => {
    timeoutRef.current = setTimeout(() => setRecognized(true), RECOGNITION_MS);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  function replayRecognition() {
    setRecognized(false);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setRecognized(true), RECOGNITION_MS);
  }

  function resetExperience() {
    setActiveTab("diamond");
    replayRecognition();
  }

  const tint = getColorTint(diamond.color);

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-28 pt-5 sm:max-w-lg sm:px-6">
      <AnimatePresence>
        {!recognized ? <RecognitionOverlay diamondName={diamond.name} /> : null}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: recognized ? 1 : 0, y: recognized ? 0 : 10 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink)] transition-colors hover:border-[var(--hairline-strong)]"
          >
            <Icon name="chevronLeft" className="h-[18px] w-[18px]" />
          </button>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            Diamond {diamond.id}
          </p>
          <ShareButton title={diamond.name} />
        </header>

        <h1 className="mt-5 font-[family-name:var(--font-display)] text-[32px] leading-[1.05] text-[var(--ink)]">
          {diamond.name}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--ink-soft)]">
          {diamond.shape} · {diamond.carat.toFixed(2)} ct
        </p>

        <div className="mt-6">
          <DiamondStage shape={diamond.shape} tint={tint} />
        </div>

        <div className="mt-6">
          <SegmentedTabs active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === "diamond" ? <DiamondPanel diamond={diamond} /> : null}
              {activeTab === "tracr" ? <TracrPanel record={tracrRecord} /> : null}
              {activeTab === "gia" ? <GiaPanel record={giaRecord} /> : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[var(--hairline)] pt-5">
          <button
            onClick={() => router.push(`/diamond/${prev.id}`)}
            className="flex items-center gap-1.5 text-sm text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
            {prev.name}
          </button>
          <button
            onClick={() => router.push(`/diamond/${next.id}`)}
            className="flex items-center gap-1.5 text-sm text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
          >
            {next.name}
            <Icon name="chevronRight" className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <PrototypeControls
        currentId={diamond.id}
        onJumpTab={setActiveTab}
        onReplay={replayRecognition}
        onReset={resetExperience}
      />
    </div>
  );
}
