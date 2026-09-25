"use client";

import { motion } from "framer-motion";
import DiamondMark from "./DiamondMark";
import { CARD_OVERLAP, RAIL_WIDTH, SIDE_PANEL_WIDTH } from "./SidePanelStack";

/**
 * The wide-viewport companion to the stone view — the rightmost board
 * in SidePanelStack, open by default (not behind a rail tap, unlike the
 * two slide-out panels beside it) so the inscription explainer sits
 * alongside the photo without being asked for. Olive, not the story
 * board's eggshell — a deliberately different surface for a
 * deliberately different kind of content: one plain-language explainer,
 * not the full spec sheet.
 *
 * Rounded on the left like every other card in the stack, and pulled
 * left by the same CARD_OVERLAP to sit on top of the specs rail's
 * right edge — that overlap is what the rounded notch reveals instead
 * of the black stage behind the whole stack.
 *
 * `collapsed` narrows it to a bare rail — driven by whether the About/4Cs
 * board next to it is open, not a toggle of its own — so an open board
 * doesn't have to fight this panel for width on top of the stone. Its
 * own content fades out under the narrower width rather than wrapping
 * or clipping; a small mark stands in for it collapsed, same as the
 * icon on the other two rails, and doubles as a button: tapping it while
 * collapsed calls `onExpand`, which closes whichever board is open so
 * this panel gets its width back.
 *
 * `onClose` is a separate, full close of the whole side stack (an X in
 * this panel's own top-right corner, shown only while it's expanded) —
 * the reverse of the stage's "More about this diamond" button.
 */
export default function InscriptionPanel({ collapsed = false, onExpand, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0, width: collapsed ? RAIL_WIDTH : SIDE_PANEL_WIDTH }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginLeft: -CARD_OVERLAP, borderRadius: "28px 0 0 28px" }}
      className="pointer-events-auto relative flex h-full flex-none flex-col overflow-hidden bg-[#838557] shadow-[-18px_0_40px_rgba(0,0,0,0.3)]"
    >
      {/* Always visible/clickable, collapsed or not — closing everything
          is exactly what someone with a board open (About/4Cs) is most
          likely to want. It used to fade out and disable itself whenever
          this panel collapsed for an open board, which made it silently
          do nothing at the one moment a viewer would actually reach for
          it. */}
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

      <motion.div
        animate={{ opacity: collapsed ? 0 : 1 }}
        transition={{ duration: collapsed ? 0.16 : 0.34, delay: collapsed ? 0 : 0.14 }}
        aria-hidden={collapsed}
        style={{ width: SIDE_PANEL_WIDTH }}
        className="flex h-full flex-none flex-col px-9 py-10"
      >
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
      </motion.div>

      <motion.button
        type="button"
        onClick={onExpand}
        aria-label="Show diamond details"
        animate={{ opacity: collapsed ? 1 : 0 }}
        transition={{ duration: collapsed ? 0.3 : 0.12, delay: collapsed ? 0.2 : 0 }}
        aria-hidden={!collapsed}
        tabIndex={collapsed ? 0 : -1}
        style={{ pointerEvents: collapsed ? "auto" : "none" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <DiamondMark className="h-7 w-7 text-black/70" />
      </motion.button>
    </motion.div>
  );
}
