"use client";

import { motion } from "framer-motion";
import DiamondMark from "./DiamondMark";
import { SIDE_PANEL_WIDTH } from "./DetailsSheet";

/**
 * The wide-viewport companion to the stone view — docked permanently
 * on the right (not opened by a button, unlike the phone's bottom
 * sheet) so the inscription explainer sits alongside the photo rather
 * than covering it. Olive, not the details sheet's eggshell — a
 * deliberately different surface for a deliberately different kind of
 * content: one plain-language explainer, not the full spec sheet.
 */
export default function InscriptionPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: SIDE_PANEL_WIDTH }}
      className="fixed inset-y-0 right-0 z-30 flex flex-col rounded-l-[28px] bg-[#838557] px-9 py-10 shadow-2xl shadow-black/40"
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
