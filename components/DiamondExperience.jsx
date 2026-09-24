"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import RecognitionOverlay from "./RecognitionOverlay";
import LightSweep from "./LightSweep";
import DiamondStage from "./DiamondStage";
import DetailsSheet, { WIDE_LAYOUT_QUERY, SIDE_PANEL_WIDTH, FORCE_BOTTOM_SHEET } from "./DetailsSheet";
import SidePanelStack, {
  RAIL_WIDTH,
  STACK_RAIL_TOTAL,
  OPEN_PANEL_BUFFER,
  getOpenBoardWidth,
} from "./SidePanelStack";
import ShareButton from "./ShareButton";
import CompareView from "./CompareView";
import PrototypeControls from "./PrototypeControls";
import { Icon } from "./icons";
import { diamonds as allDiamonds } from "@/data/diamonds";
import { playRecognitionChime, vibrate } from "@/lib/feedback";
import { useMediaQuery, useViewportWidth } from "@/lib/useMediaQuery";

const RECOGNITION_MS = 800;

// However much the side stack claims, the stone itself never shrinks
// below this — otherwise, on a moderate "wide" viewport (a laptop
// window rather than a huge desktop display), an open board's width
// can reserve nearly the whole screen and leave the stone a sliver so
// thin it reads as stray black bars rather than a photo.
const MIN_STAGE_WIDTH = 280;

function fireRecognized(setRecognized) {
  setRecognized(true);
  playRecognitionChime();
  vibrate([12, 40, 16]);
}

export default function DiamondExperience({
  diamond,
  tracrRecord,
  giaRecord,
  prev,
  next,
  stageLayout = "centered",
}) {
  const router = useRouter();
  const wideViewport = useMediaQuery(WIDE_LAYOUT_QUERY);
  const isWide = FORCE_BOTTOM_SHEET ? false : wideViewport;
  const viewportWidth = useViewportWidth();
  const [recognized, setRecognized] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [stackPanelOpen, setStackPanelOpen] = useState(false);
  // The side stack (About/4Cs rails plus the inscription panel) stays
  // fully hidden on wide viewports until the viewer explicitly asks for
  // more — DiamondStage's "More about this diamond" button — rather than
  // appearing on its own the moment the stone is authenticated.
  const [detailsRevealed, setDetailsRevealed] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  // Always default to 001/002 — the two stones with their own real
  // photography — rather than whichever diamond happens to be open,
  // since any other pairing falls back to duplicate placeholder shots.
  const [compareLeftId, setCompareLeftId] = useState("001");
  const [compareRightId, setCompareRightId] = useState("002");
  const [stageKey, setStageKey] = useState(0);
  const [sweep, setSweep] = useState(false);
  const timeoutRef = useRef(null);

  // The parent page renders this component with key={diamond.id}, so a new
  // diamond identity fully remounts it — state starts fresh automatically,
  // standing in for a brand new NFC tap. This effect just kicks off the
  // one-time recognition timer for that mount.
  useEffect(() => {
    timeoutRef.current = setTimeout(() => fireRecognized(setRecognized), RECOGNITION_MS);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  function replayRecognition() {
    setRecognized(false);
    setSheetOpen(false);
    setStackPanelOpen(false); // SidePanelStack unmounts below without a chance to report itself closed
    setDetailsRevealed(false);
    setSweep(false); // so the light glimmer is ready to fire again on the next first tap
    setStageKey((k) => k + 1); // remounts DiamondStage, clearing its focus/zoom/tilt state too
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fireRecognized(setRecognized), RECOGNITION_MS);
  }

  function resetExperience() {
    replayRecognition();
  }

  function openDetails() {
    setSheetOpen(true);
  }

  // DiamondStage's "More about this diamond" button. On a wide viewport
  // this reveals the side stack (it renders closed — a rail, not an open
  // board — same as the old always-on version did); on a narrow one there
  // is no side stack, so open the bottom sheet instead, same as the
  // existing "Diamond Details" CTA. Checks the real wideViewport, not
  // isWide/FORCE_BOTTOM_SHEET — that flag only forces DetailsSheet's own
  // bottom-sheet presentation for testing, it doesn't mean there's no
  // room for the side stack.
  function handleOpenDetails() {
    if (wideViewport) {
      setDetailsRevealed(true);
    } else {
      setSheetOpen(true);
    }
  }

  function navigateTo(id) {
    setSheetOpen(false);
    router.push(`/diamond/${id}`);
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[var(--surface)]">
      <AnimatePresence>
        {!recognized ? <RecognitionOverlay diamondName={diamond.name} /> : null}
      </AnimatePresence>

      {/* Fires from DiamondStage's onFocus — the viewer's first tap on the
          still-blurry stone — rather than automatically on recognition. */}
      {sweep ? <LightSweep key={stageKey} /> : null}

      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: recognized ? 1 : 0,
          // On wide viewports the stage stops short of the whole
          // right-hand stack — the olive inscription panel plus the two
          // closed rails beside it — so nothing in the photo sits
          // permanently hidden behind them. When a rail opens its board,
          // the stack grows further left over the stage without the
          // stage itself pulling back to match, so the stone's visible
          // edge lands flush against the open panel with no breathing
          // room — pull back further here by that board's width plus a
          // fixed buffer to fix that. Capped by MIN_STAGE_WIDTH so that
          // reservation never eats so much of a moderate-width window
          // that the stone is squeezed to an unreadable sliver.
          //
          // The inscription panel collapses to a bare rail (see
          // InscriptionPanel's `collapsed` prop) whenever a board opens,
          // so an open board's own width isn't the only change to the
          // stack's total footprint — the inscription panel also gives
          // back (SIDE_PANEL_WIDTH − RAIL_WIDTH) of what the baseline
          // term above reserved for it. Without subtracting that back
          // out, the stage would stay pulled in by space the stack no
          // longer actually occupies, leaving a gap between the photo
          // and the (now narrower) stack.
          right: Math.min(
            (wideViewport && detailsRevealed ? SIDE_PANEL_WIDTH + STACK_RAIL_TOTAL : 0) +
              (wideViewport && detailsRevealed && stackPanelOpen
                ? getOpenBoardWidth(viewportWidth) +
                  OPEN_PANEL_BUFFER -
                  (SIDE_PANEL_WIDTH - RAIL_WIDTH)
                : 0) +
              (sheetOpen && isWide ? SIDE_PANEL_WIDTH : 0),
            viewportWidth > 0 ? Math.max(0, viewportWidth - MIN_STAGE_WIDTH) : Infinity
          ),
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <DiamondStage
          key={stageKey}
          diamondId={diamond.id}
          inscriptionNumber={giaRecord?.reportNumber}
          onFocus={() => setSweep(true)}
          onOpenDetails={handleOpenDetails}
          detailsOpen={wideViewport ? detailsRevealed : sheetOpen}
          // The corner accents and rotated "Authenticated" edge labels are
          // sized for a near-full-width stage. An open side board narrows
          // the visible stage well past that, so those edge labels close
          // in on the centered headline instead of framing it — drop the
          // ornamental edge chrome and keep just the centered confirmation
          // and bottom Trust Mark pill, which already re-center cleanly at
          // any width.
          compact={wideViewport && stackPanelOpen}
          layout={stageLayout}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/55 via-black/15 to-transparent px-4 pb-12 pt-5 sm:px-6">
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="flex flex-1 justify-start">
              <button
                onClick={() => router.back()}
                aria-label="Back"
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 bg-black/30 text-[var(--ink)] backdrop-blur transition-colors hover:border-white/30"
              >
                <Icon name="chevronLeft" className="h-[18px] w-[18px]" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-end gap-2">
              <button
                onClick={() => setCompareOpen(true)}
                aria-label="Compare diamonds"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink)] transition-colors hover:border-[var(--hairline-strong)]"
              >
                <Icon name="compare" className="h-[18px] w-[18px]" />
              </button>
              <ShareButton title={diamond.name} />
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 via-black/15 to-transparent px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-12 sm:px-6"
          hidden={wideViewport}
        >
          <button
            onClick={() => setSheetOpen(true)}
            className="pointer-events-auto mx-auto flex items-center gap-2 rounded-full border border-white/15 bg-[var(--surface-card)]/90 px-5 py-3 text-sm font-medium text-[var(--ink)] backdrop-blur transition-colors hover:border-white/30"
          >
            Diamond Details
            <Icon name="plus" className="h-4 w-4 text-[var(--ink-soft)]" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {recognized && wideViewport && detailsRevealed ? (
          <SidePanelStack
            key="side-panels"
            diamond={diamond}
            tracrRecord={tracrRecord}
            onOpenChange={setStackPanelOpen}
            onClose={() => setDetailsRevealed(false)}
          />
        ) : null}
      </AnimatePresence>

      <DetailsSheet
        open={sheetOpen}
        diamond={diamond}
        tracrRecord={tracrRecord}
        giaRecord={giaRecord}
        onClose={() => setSheetOpen(false)}
        prev={prev}
        next={next}
        onNavigate={navigateTo}
      />

      <CompareView
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        diamonds={allDiamonds}
        leftId={compareLeftId}
        rightId={compareRightId}
        onChangeLeft={setCompareLeftId}
        onChangeRight={setCompareRightId}
      />

      <PrototypeControls
        currentId={diamond.id}
        onOpenDetails={openDetails}
        onReplay={replayRecognition}
        onReset={resetExperience}
      />
    </div>
  );
}
