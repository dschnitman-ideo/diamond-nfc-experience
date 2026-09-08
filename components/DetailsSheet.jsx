"use client";

import { AnimatePresence, motion } from "framer-motion";
import SegmentedTabs from "./SegmentedTabs";
import DiamondPanel from "./DiamondPanel";
import TracrPanel from "./TracrPanel";
import GiaPanel from "./GiaPanel";
import SaveShareButton from "./SaveShareButton";
import { Icon } from "./icons";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * Tablet-landscape and up — matches DiamondExperience's stage inset.
 * Requires landscape explicitly (not just width) so a portrait iPad,
 * which is narrower, doesn't get a side panel it doesn't have the
 * width to spare for.
 */
export const WIDE_LAYOUT_QUERY = "(min-width: 1024px) and (orientation: landscape)";
export const SIDE_PANEL_WIDTH = 440;

/**
 * The metadata + tabs (Diamond / Tracr / GIA), pulled out of the
 * full-screen stone view into a separate sheet the viewer opens
 * deliberately — "Diamond Details" — rather than something they scroll
 * past on the way to the stone. On a narrow (phone) viewport this is a
 * bottom sheet the viewer swipes down to dismiss; on a wide (iPad
 * landscape+) viewport there's room to dock it as a persistent side
 * panel instead, so the stone and its details sit side by side.
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
  const isWide = useMediaQuery(WIDE_LAYOUT_QUERY);

  return (
    <AnimatePresence>
      {open ? (
        <>
          {!isWide ? (
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
          ) : null}
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={`${diamond.name} details`}
            initial={isWide ? { x: "100%" } : { y: "100%" }}
            animate={isWide ? { x: 0 } : { y: 0 }}
            exit={isWide ? { x: "100%" } : { y: "100%" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            drag={isWide ? "x" : "y"}
            dragConstraints={isWide ? { left: 0, right: 0 } : { top: 0, bottom: 0 }}
            dragElastic={isWide ? { left: 0, right: 0.4 } : { top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (isWide) {
                if (info.offset.x > 120 || info.velocity.x > 600) onClose();
              } else if (info.offset.y > 120 || info.velocity.y > 600) {
                onClose();
              }
            }}
            style={isWide ? { width: SIDE_PANEL_WIDTH, maxWidth: "92vw" } : undefined}
            className={
              isWide
                ? "fixed inset-y-0 right-0 z-50 flex flex-col border-l border-[var(--hairline-strong)] bg-[var(--surface)] shadow-2xl shadow-black/50"
                : "fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-[28px] border-t border-[var(--hairline-strong)] bg-[var(--surface)] pt-2.5 shadow-2xl shadow-black/50"
            }
          >
            {!isWide ? (
              <div className="mx-auto h-1 w-9 flex-none rounded-full bg-[var(--hairline-strong)]" />
            ) : null}

            <div
              className={
                isWide
                  ? "flex w-full flex-1 flex-col overflow-hidden"
                  : "mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden"
              }
            >
              <div className={`flex items-start justify-between gap-4 px-5 ${isWide ? "pt-5" : "pt-4"}`}>
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
                    {activeTab === "tracr" ? (
                      <TracrPanel record={tracrRecord} giaRecord={giaRecord} />
                    ) : null}
                    {activeTab === "gia" ? <GiaPanel record={giaRecord} /> : null}
                  </motion.div>
                </AnimatePresence>

                <SaveShareButton diamond={diamond} giaRecord={giaRecord} tracrRecord={tracrRecord} />

                <div className="mt-6 flex items-center justify-between">
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
