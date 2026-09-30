"use client";

import { motion } from "framer-motion";
import DiamondMark from "./DiamondMark";
import { CARD_OVERLAP, SIDE_PANEL_WIDTH } from "./SidePanelStack";

/**
 * The wide-viewport companion to the stone view — the rightmost board
 * in SidePanelStack, open by default (not behind a rail tap, unlike the
 * two slide-out panels beside it) so the inscription explainer sits
 * alongside the photo without being asked for. Ash Grey, from the brand
 * palette — the darkest of the three, since the stack reads
 * light-to-dark stepping toward the black stage — for a deliberately
 * different kind of content: one plain-language explainer, not the
 * full spec sheet.
 *
 * Rounded on the left like every other card in the stack, and pulled
 * left by the same CARD_OVERLAP to sit on top of the specs rail's
 * right edge — that overlap is what the rounded notch reveals instead
 * of the black stage behind the whole stack.
 *
 * Stays open at its full width regardless of whether the About/4Cs
 * board next to it is open — that board overlays over the stage rather
 * than competing with this panel for width, so there's no longer a
 * reason for this one to give ground.
 *
 * `onClose` is a separate, full close of the whole side stack (an X in
 * this panel's own top-right corner) — the reverse of the stage's
 * "More about this diamond" button.
 */
export default function InscriptionPanel({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0, width: SIDE_PANEL_WIDTH }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginLeft: -CARD_OVERLAP, borderRadius: "28px 0 0 28px" }}
      className="pointer-events-auto relative flex h-full flex-none flex-col overflow-hidden bg-[#bfbfb2] shadow-[-18px_0_40px_rgba(0,0,0,0.3)]"
    >
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close diamond details"
          className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/10 hover:text-black"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
            <path
              d="M1 1l14 14M15 1L1 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}

      <div style={{ width: SIDE_PANEL_WIDTH }} className="flex h-full flex-none flex-col px-9 py-10">
        <p className="text-label font-semibold uppercase tracking-caps text-black">
          About this inscription &amp; symbol
        </p>
        <p className="mt-4 font-[family-name:var(--font-display)] text-2xl leading-snug text-black">
          Each diamond is inscribed with a unique symbol and serial number
          that proves its authenticity and uniqueness.
        </p>

        <div className="flex-1" />

        <DiamondMark className="h-14 w-14 text-black" />
        <p className="mt-4 text-body text-black">
          This symbol means a diamond has been authenticated as natural,
          formed in the earth&rsquo;s mantle, is a one-of-one, ancient, and
          holds value.
        </p>
      </div>
    </motion.div>
  );
}
