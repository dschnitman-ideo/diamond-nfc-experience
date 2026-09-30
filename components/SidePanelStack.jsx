"use client";

import { useState } from "react";
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
 * This is the one "diamond details" surface the app has — the story
 * and the 4Cs split into two boards that each fit their panel exactly,
 * rather than one long scroll. Only one opens at a time. The stage
 * behind the stack doesn't resize to make room for an open board — the
 * board just overlays on top of it, covering whatever's underneath —
 * so the inscription panel to its right stays fully open too instead of
 * collapsing to give the open board more width. The experience targets
 * iPad/browser widths, not phones, so there's deliberately no separate
 * narrower fallback presentation.
 */

export const RAIL_WIDTH = 104;
// The permanently-docked inscription panel's own width (InscriptionPanel.jsx).
export const SIDE_PANEL_WIDTH = 440;
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

// Eggshell, Chalk, Ash Grey — light to dark, left to right. 4Cs now
// sits on Chalk (not its own Ash Grey), so its pills — previously
// Chalk-on-Ash-Grey — were bumped to Eggshell in SpecsPanel to stay
// visible against the panel now matching their old color.
const PANELS = [
  { id: "story", label: "About", surface: "#f1f2ed" },
  { id: "specs", label: "4Cs", surface: "#dfdfd7" },
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
        className="flex h-full flex-none items-center justify-start px-4 text-left"
      >
        <span className="whitespace-pre-line text-[11px] font-semibold uppercase leading-[1.2] tracking-[0.08em] text-[#000000]">
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

export default function SidePanelStack({ diamond, tracrRecord, onClose }) {
  const [openPanel, setOpenPanel] = useState(null);

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
    // Closing slides the whole stack off to the right as one solid piece
    // (no fade — a fading stack ghosts over the photo), on the same
    // duration and easing as the stage widening back underneath it
    // (DiamondExperience), so the photo's edge follows the stack out.
    <motion.div
      exit={{ x: "100%", transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } }}
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

      {/* Stays fully open even while an About/4Cs board is open — that
          board now overlays over the stage instead of squeezing it, so
          there's no longer a width crunch forcing this panel to give up
          its own space back to whichever board is out. */}
      <InscriptionPanel onClose={onClose} />
    </motion.div>
  );
}
