"use client";

import { AnimatePresence, motion } from "framer-motion";
import SegmentedTabs from "./SegmentedTabs";
import DiamondPanel from "./DiamondPanel";
import TracrPanel from "./TracrPanel";
import GiaPanel from "./GiaPanel";
import { Icon } from "./icons";

/**
 * The metadata + tabs (Diamond / Tracr / GIA), pulled out of the
 * full-screen stone view into a separate sheet the viewer opens
 * deliberately — "Diamond Details" — rather than something they scroll
 * past on the way to the stone.
 */
export default function DetailsSheet({
  open,
  diamond,
  tracrRecord,
  giaRecord,
  activeTab,
  onTabChange,
  onClose,
  prev,
  next,
  onNavigate,
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="scrim"
            aria-label="Close diamond details"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/60"
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={`${diamond.name} details`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-[28px] border-t border-[var(--hairline-strong)] bg-[var(--surface)] pt-2.5 shadow-2xl shadow-black/50"
          >
            <div className="mx-auto h-1 w-9 flex-none rounded-full bg-[var(--hairline-strong)]" />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden">
              <div className="flex items-start justify-between gap-4 px-5 pt-4">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                    Diamond {diamond.id}
                  </p>
                  <h2 className="mt-1 truncate font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                    {diamond.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-[var(--ink-soft)]">
                    {diamond.shape} · {diamond.carat.toFixed(2)} ct
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close details"
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink)] transition-colors hover:border-[var(--hairline-strong)]"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 px-5">
                <SegmentedTabs active={activeTab} onChange={onTabChange} />
              </div>

              <div className="mt-5 flex-1 overflow-y-auto px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
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

                <div className="mt-8 flex items-center justify-between border-t border-[var(--hairline)] pt-5">
                  <button
                    onClick={() => onNavigate(prev.id)}
                    className="flex items-center gap-1.5 text-sm text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
                  >
                    <Icon name="chevronLeft" className="h-4 w-4" />
                    {prev.name}
                  </button>
                  <button
                    onClick={() => onNavigate(next.id)}
                    className="flex items-center gap-1.5 text-sm text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
                  >
                    {next.name}
                    <Icon name="chevronRight" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
