"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InscriptionPanel from "./InscriptionPanel";
import StoryPanel from "./StoryPanel";
import SpecsPanel from "./SpecsPanel";
import { playPanelOpenSound, playPanelCloseSound, vibrate } from "@/lib/feedback";

/**
 * The wide-viewport right-hand stack: two slide-out panels tucked to
 * the left of the permanently docked olive inscription panel. Closed,
 * each is a labelled rail — a spine of the panel underneath the photo's
 * right edge; tapped, it slides its board out over the stage.
 *
 * This replaces the "Diamond Details" bottom sheet on wide viewports:
 * the same content (the story, the 4Cs) split into two boards that each
 * fit their panel exactly, rather than one long scroll. Only one opens
 * at a time — two open boards plus the inscription panel would not fit
 * side by side at iPad-landscape width, and an accordion keeps the
 * stone at least partly visible whichever board is out.
 */

export const RAIL_WIDTH = 104;
export const CARD_RADIUS = 28;
// Every card rounds its own left corners — a fanned deck, not a single
// rounded rectangle sliced into thirds. Each card (after the first)
// pulls left by CARD_RADIUS to overlap its neighbor by exactly that
// much and paints on top of it (later siblings paint over earlier
// ones), so the rounded notch at its top/bottom-left reveals the
// previous card's own surface underneath — never the black stage
// behind the whole stack, which is what a flush, non-overlapping
// edge exposed instead.
export const CARD_OVERLAP = CARD_RADIUS;

// Two overlaps inside the stack (story↔specs, specs↔inscription) each
// claw back CARD_OVERLAP of visual width, so the space the stack
// actually occupies is a bit less than the sum of its parts.
export const STACK_RAIL_TOTAL = RAIL_WIDTH * 2 - CARD_OVERLAP * 2;

// Sized against what's left after the rails and the olive panel, not
// against the viewport alone, so an open board never runs off the left
// edge on a 1024–1200px landscape iPad — a sliver of the stone always
// stays visible beside it.
const BOARD_WIDTH_MIN = 320;
const BOARD_WIDTH_MAX = 680;
const BOARD_WIDTH = `clamp(${BOARD_WIDTH_MIN}px, min(46vw, 100vw - 740px), ${BOARD_WIDTH_MAX}px)`;

// The stage doesn't resize when a board opens — it just gets covered
// more — so DiamondExperience uses this to also pull its own visible
// edge back by the board's width (see getOpenBoardWidth), so the
// stone's visible edge lines up with where the board actually starts
// instead of getting cropped by it. Zero here (rather than a further
// fixed gap) so that edge sits flush against the board's own left-edge
// shadow — the shadow itself reads as the breathing room, instead of a
// second, separate strip of exposed black behind it.
export const OPEN_PANEL_BUFFER = 0;

// Mirrors the BOARD_WIDTH clamp above numerically, so DiamondExperience
// can reserve the right amount of extra stage width for whichever
// board is currently open without measuring the DOM.
export function getOpenBoardWidth(viewportWidth) {
  const preferred = Math.min(0.46 * viewportWidth, viewportWidth - 740);
  return Math.min(BOARD_WIDTH_MAX, Math.max(BOARD_WIDTH_MIN, preferred));
}

const PANELS = [
  { id: "story", label: "About", surface: "#eff2eb" },
  { id: "specs", label: "4Cs", surface: "#c3c6b6" },
];

function CollapsiblePanel({ panel, open, onToggle, children, overlap = false }) {
  return (
    <motion.section
      initial={false}
      animate={{ width: open ? `calc(${RAIL_WIDTH}px + ${BOARD_WIDTH})` : RAIL_WIDTH }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundColor: panel.surface,
        borderRadius: `${CARD_RADIUS}px 0 0 ${CARD_RADIUS}px`,
        marginLeft: overlap ? -CARD_OVERLAP : 0,
      }}
      className="pointer-events-auto relative flex h-full flex-none overflow-hidden shadow-[-18px_0_44px_rgba(0,0,0,0.3)]"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{ width: RAIL_WIDTH }}
        className="flex h-full flex-none items-center justify-start px-6 text-left"
      >
        <span className="whitespace-pre-line text-[11px] font-semibold uppercase leading-[1.3] tracking-[0.08em] text-[#16150f]">
          {panel.label}
        </span>
      </button>

      {/* Fixed-width so the board's own layout never reflows while the
          panel animates open — only the clipping window changes. A size
          container, so the board's type scales to the card's own width
          (cqw) as well as the viewport height — neither dimension alone
          can keep a one-screen board from clipping. */}
      <div
        style={{ width: BOARD_WIDTH, containerType: "inline-size" }}
        className="h-full flex-none overflow-hidden"
      >
        <motion.div
          initial={false}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: open ? 0.34 : 0.16, delay: open ? 0.14 : 0 }}
          className="h-full"
          aria-hidden={!open}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function SidePanelStack({ diamond, tracrRecord, onOpenChange }) {
  const [openPanel, setOpenPanel] = useState(null);

  // Reports up as its own effect, not inline in toggle()'s setState
  // updater — that updater can re-run during React's own bookkeeping,
  // and calling a different component's setState from inside it trips
  // "Cannot update a component while rendering a different component".
  useEffect(() => {
    onOpenChange?.(openPanel !== null);
  }, [openPanel, onOpenChange]);

  function toggle(id) {
    // Reads openPanel directly (not via setOpenPanel's updater form) so
    // the sound/vibrate side effects only ever run once per click —
    // React 18 Strict Mode double-invokes a functional updater to
    // surface exactly this kind of impurity.
    const opening = openPanel !== id;
    if (opening) playPanelOpenSound();
    else playPanelCloseSound();
    vibrate(10);
    setOpenPanel(opening ? id : null);
  }

  return (
    <div
      className="pointer-events-none fixed inset-y-0 right-0 z-30 flex items-stretch justify-end"
    >
      <CollapsiblePanel
        panel={PANELS[0]}
        open={openPanel === "story"}
        onToggle={() => toggle("story")}
      >
        <StoryPanel diamond={diamond} tracrRecord={tracrRecord} />
      </CollapsiblePanel>

      <CollapsiblePanel
        panel={PANELS[1]}
        open={openPanel === "specs"}
        onToggle={() => toggle("specs")}
        overlap
      >
        <SpecsPanel diamond={diamond} />
      </CollapsiblePanel>

      <InscriptionPanel />
    </div>
  );
}
