"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import InscriptionPanel from "./InscriptionPanel";
import StoryPanel from "./StoryPanel";
import SpecsPanel from "./SpecsPanel";

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
// The cards float clear of the screen edges instead of bleeding into
// them, so every corner that is actually exposed — the left pair on
// each card — reads as a corner rather than as a clipped edge.
export const STACK_INSET_Y = 14;
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
const BOARD_WIDTH = "clamp(320px, min(46vw, 100vw - 740px), 680px)";

const PANELS = [
  { id: "story", label: "About\nthis\ndiamond", surface: "#eff2eb" },
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

export default function SidePanelStack({ diamond, tracrRecord }) {
  const [openPanel, setOpenPanel] = useState(null);

  function toggle(id) {
    setOpenPanel((current) => (current === id ? null : id));
  }

  return (
    <div
      style={{ top: STACK_INSET_Y, bottom: STACK_INSET_Y }}
      className="pointer-events-none fixed right-0 z-30 flex items-stretch justify-end"
    >
      <CollapsiblePanel
        panel={PANELS[0]}
        open={openPanel === "story"}
        onToggle={() => toggle("story")}
        roundLeft
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
