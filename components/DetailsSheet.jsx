"use client";

import { AnimatePresence, motion } from "framer-motion";
import DiamondPanel from "./DiamondPanel";
import DiamondStory from "./DiamondStory";
import SaveShareButton from "./SaveShareButton";
import { Icon } from "./icons";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * Tablet-landscape and up — matches DiamondExperience's stage inset.
 * Requires landscape explicitly (not just width) so a portrait iPad,
 * which is narrower, doesn't get a side panel it doesn't have the
 * width to spare for.
 *
 * Currently forced off (see `isWide` below) — the sheet always opens
 * as a bottom sheet regardless of viewport. Flip `FORCE_BOTTOM_SHEET`
 * to re-enable the side-panel dock on wide/landscape viewports.
 */
export const WIDE_LAYOUT_QUERY = "(min-width: 1024px) and (orientation: landscape)";
export const SIDE_PANEL_WIDTH = 440;
export const FORCE_BOTTOM_SHEET = true;

/**
 * Local theme override for this sheet, sampled from the reference
 * frame (Frame 2.pdf) — warm eggshell page, near-black ink, soft
 * warm-gray rules. Set as CSS custom properties on the sheet's own
 * root so every descendant that already reads `var(--surface)` /
 * `var(--ink)` / etc. (DiamondPanel, DiamondStory, SaveShareButton,
 * the icons) picks it up automatically, without
 * touching the app-wide dark tokens in globals.css that the stage and
 * recognition overlay still rely on.
 */
const PANEL_THEME_VARS = {
  "--surface": "#eff2eb",
  "--surface-raised": "#e5e8de",
  "--surface-card": "#dcdfd3",
  "--ink": "#16150f",
  "--ink-soft": "#4d493e",
  "--ink-faint": "#8a8577",
  "--hairline": "rgba(22, 21, 15, 0.14)",
  "--hairline-strong": "rgba(22, 21, 15, 0.26)",
};

/**
 * The metadata, pulled out of the full-screen stone view into a
 * separate sheet the viewer opens deliberately — "Diamond Details" —
 * rather than something they scroll past on the way to the stone. One
 * continuous scroll (the diamond's specs, then its story, then the GIA
 * report) rather than tabs — nothing here is deep enough
 * to need its own destination. On a narrow (phone) viewport this is a
 * bottom sheet the viewer swipes down to dismiss; on a wide (iPad
 * landscape+) viewport there's room to dock it as a persistent side
 * panel instead, so the stone and its details sit side by side.
 */
export default function DetailsSheet({
  open,
  diamond,
  giaRecord,
  tracrRecord,
  onClose,
  prev,
  next,
  onNavigate,
}) {
  const wideViewport = useMediaQuery(WIDE_LAYOUT_QUERY);
  const isWide = FORCE_BOTTOM_SHEET ? false : wideViewport;

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
            style={{
              ...PANEL_THEME_VARS,
              ...(isWide
                ? { width: SIDE_PANEL_WIDTH, maxWidth: "92vw" }
                : { bottom: "calc(1rem + env(safe-area-inset-bottom))" }),
            }}
            className={
              isWide
                ? "fixed inset-y-0 right-0 z-50 flex flex-col border-l border-[var(--hairline-strong)] bg-[var(--surface)] shadow-2xl shadow-black/50"
                : "fixed inset-x-4 z-50 flex max-h-[82dvh] flex-col overflow-hidden rounded-[28px] border border-[var(--hairline-strong)] bg-[var(--surface)] shadow-2xl shadow-black/50"
            }
          >
            {/* This wrapper is deliberately full width, not capped —
                DiamondPanel/DiamondStory need to match whatever width
                the sheet itself actually is (which varies with
                viewport), so full-bleed panels stay full-bleed at any
                size instead of matching a separate, narrower text
                column. Regular text content gets its own local
                `mx-auto max-w-2xl px-5` wrapper below instead of one
                shared here. */}
            <div className="flex w-full flex-1 flex-col overflow-hidden">
              <div className="thin-scrollbar flex-1 overflow-y-auto pb-6">
                <DiamondPanel
                  diamond={diamond}
                  inscriptionNumber={giaRecord?.reportNumber}
                  tracrId={tracrRecord?.tracrId}
                  reportUrl={giaRecord?.reportUrl}
                  onClose={onClose}
                />

                <div className="mx-auto max-w-2xl px-5">
                  <div className="my-6 h-px bg-[var(--hairline)]" />
                </div>

                <DiamondStory diamond={diamond} tracrRecord={tracrRecord} />

                <div className="mx-auto max-w-2xl px-5">
                  {giaRecord?.reportUrl ? (
                    <a
                      href={giaRecord.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brass)] px-5 py-3.5 text-sm font-medium text-[var(--brass-ink)] transition-transform active:scale-[0.98]"
                    >
                      GIA Report
                      <Icon name="arrowUpRight" className="h-4 w-4" />
                    </a>
                  ) : null}

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
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
