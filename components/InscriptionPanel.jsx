"use client";

import { motion } from "framer-motion";
import DiamondMark from "./DiamondMark";
import { SIDE_PANEL_WIDTH } from "./DetailsSheet";
import { CARD_OVERLAP } from "./SidePanelStack";

/**
 * The wide-viewport companion to the stone view — the rightmost,
 * permanently open board in SidePanelStack (not opened by a button,
 * unlike the two slide-out panels beside it) so the inscription
 * explainer always sits alongside the photo. Olive, not the story
 * board's eggshell — a deliberately different surface for a
 * deliberately different kind of content: one plain-language
 * explainer, not the full spec sheet.
 *
 * Rounded on the left like every other card in the stack, and pulled
 * left by the same CARD_OVERLAP to sit on top of the specs rail's
 * right edge — that overlap is what the rounded notch reveals instead
 * of the black stage behind the whole stack.
 */
export default function InscriptionPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: SIDE_PANEL_WIDTH, marginLeft: -CARD_OVERLAP, borderRadius: "28px 0 0 28px" }}
      className="pointer-events-auto relative flex h-full flex-none flex-col bg-[#838557] px-9 py-10 shadow-[-18px_0_40px_rgba(0,0,0,0.3)]"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-black">
        About this inscription &amp; symbol
      </p>
      <p className="mt-4 font-[family-name:var(--font-display)] text-2xl leading-snug text-black">
        Each diamond is inscribed with a unique symbol and serial number that
        proves its authenticity and uniqueness.
      </p>

      <div className="flex-1" />

      <DiamondMark className="h-14 w-14 text-black" />
      <p className="mt-4 text-[15px] leading-relaxed text-black">
        This symbol means a diamond has been authenticated as natural, formed
        in the earth&rsquo;s mantle, is a one-of-one, ancient, and holds
        value.
      </p>
    </motion.div>
  );
}
