"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import DiamondMark from "./DiamondMark";
import { getStageImages } from "@/data/diamondStageImages";
import { playZoomChime, vibrate } from "@/lib/feedback";

const EASE = [0.22, 1, 0.36, 1];

// Flip to false to restore the normal tap-to-zoom start. True skips
// straight to the closest (inscription) level so the authenticated
// screen is what's live on load, without tapping through first.
const START_AT_FINAL_LEVEL = true;

/** A single chamfered corner accent — decorative, echoes a hallmark/seal frame. */
function CornerAccent({ className = "" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={`${className} drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}
      aria-hidden="true"
    >
      <path d="M64 0H20L0 20V64" stroke="white" strokeOpacity="0.6" strokeWidth="2" />
    </svg>
  );
}

/**
 * The full-screen stone itself. Starts on the zoomed-out product shot;
 * each tap steps into the next, closer photo, crossfading rather than
 * cutting. The first tap also fires onFocus, once, so the parent's
 * full-screen light sweep still plays on the viewer's first touch —
 * a tap from the final, closest level starts the sequence over. Which
 * three photos it steps through is per-diamond (see
 * data/diamondStageImages) so each stone can have its own set. Once
 * the viewer reaches the closest (inscription) level, the frame gets
 * the full "authenticated" treatment — corner accents, edge labels,
 * a confirmation headline — rather than just a small callout pill.
 */
export default function DiamondStage({
  diamondId,
  inscriptionNumber,
  onFocus,
  onOpenDetails,
  detailsOpen = false,
  compact = false,
}) {
  const stages = getStageImages(diamondId);
  const maxLevel = stages.length - 1;
  // The button's first entrance is deliberately staggered behind the
  // typewriter (see its transition below). Once it's played that once,
  // later show/hide toggles — closing the panel with its own X, say —
  // should feel like an immediate response to that action, not repeat
  // the multi-second delay. State, not a ref: its value feeds straight
  // into JSX below, and reading a ref during render isn't safe.
  const [buttonEntered, setButtonEntered] = useState(false);
  const [level, setLevel] = useState(START_AT_FINAL_LEVEL ? maxLevel : 0);
  const hasFocused = useRef(START_AT_FINAL_LEVEL);

  function handleTap() {
    if (!hasFocused.current) {
      hasFocused.current = true;
      onFocus?.();
    }
    if (level >= maxLevel) {
      setLevel(0);
      vibrate(8);
    } else {
      setLevel((l) => l + 1);
      playZoomChime();
      vibrate(18);
    }
  }

  const stage = stages[level];
  const atFinalLevel = level === maxLevel;

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 overflow-hidden">
        <button
          type="button"
          onClick={handleTap}
          aria-label={atFinalLevel ? "Start over from the full view" : "Zoom in on the diamond"}
          className="relative block h-full w-full cursor-pointer touch-manipulation select-none"
        >
          {/* "sync" (the default — no `mode` prop), not "wait": the
              outgoing and incoming photos need to cross-fade over each
              other so the stone stays visible the whole time. "wait"
              fully fades the old photo out before the new one fades
              in, leaving a dim gap right when LightSweep plays over
              the first tap — reading as "sweep, then the diamond
              appears" instead of the sweep gliding over a stone
              that's visible throughout. */}
          <AnimatePresence>
            <motion.div
              key={level}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Image
                src={stage.src}
                alt={stage.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={level === 0}
              />
            </motion.div>
          </AnimatePresence>

          {!atFinalLevel ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute z-10 flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${stage.hotspot.left}%`, top: `${stage.hotspot.top}%` }}
            >
              <span className="absolute h-full w-full animate-ping rounded-full border border-[var(--brass)]/70" />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[var(--brass)]/80 bg-black/45 shadow-[0_0_12px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                <DiamondMark className="h-5 w-5 text-[var(--brass)]" />
              </span>
            </span>
          ) : null}
        </button>
      </div>

      {/* The "authenticated" hallmark treatment — corner accents, edge
          labels, confirmation headline — replaces the plain callout
          pill once the viewer has zoomed all the way to the
          inscription. */}
      <AnimatePresence>
        {atFinalLevel ? (
          <motion.div
            key="authenticated-frame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="pointer-events-none absolute inset-0 z-20"
          >
            {/* Vignette so the corner accents and edge labels stay legible
                no matter how light the photo behind them is — darkens the
                frame's edges while leaving the stone itself, center-frame,
                unobscured. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0) 22%, rgba(0,0,0,0.78) 100%)",
              }}
            />

            {!compact ? (
              <>
                <CornerAccent className="absolute left-4 top-20 h-12 w-12 sm:left-6" />
                <CornerAccent className="absolute right-4 top-20 h-12 w-12 -scale-x-100 sm:right-6" />
                <CornerAccent className="absolute bottom-24 left-4 h-12 w-12 -scale-y-100 sm:left-6" />
                <CornerAccent className="absolute bottom-24 right-4 h-12 w-12 -scale-x-100 -scale-y-100 sm:right-6" />

                <p className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/80 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)] sm:left-6">
                  Authenticated
                </p>
                <p className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/80 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)] sm:right-6">
                  Authenticated
                </p>
              </>
            ) : null}

            {/* Centered on this stage's own box, which is exactly the
                visible grey/photo area — DiamondExperience narrows that
                box's width (its animated `right`) as a side panel opens,
                so centering here tracks the panel opening/closing smoothly
                over that same transition instead of snapping. Pinning this
                to a fixed viewport position instead (tried and reverted)
                either ran the headline under the open panel or off the
                left edge, because "a fixed spot" and "centered in the
                currently-visible area" aren't the same point once that
                area's width changes. */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            >
              {/* Darkens whatever part of the photo sits behind the mark
                  and text — without it, both wash out against a bright
                  facet the same way white-on-white would. */}
              <div
                className="absolute left-1/2 top-1/2 -z-10 h-56 w-[min(30rem,80vw)] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.32) 45%, rgba(0,0,0,0) 75%)",
                }}
              />
              <DiamondMark className="h-11 w-11 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]" />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3, ease: EASE }}
                className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/85 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]"
              >
                Confirmed
              </motion.p>

              {/* clip-path never changes an element's layout box — only what's
                  painted inside it — so animating it on the real text (instead
                  of overlaying a second copy on top of an invisible sizing
                  copy) keeps the box the browser already centered exactly
                  where it was, with nothing that can drift out of sync with
                  it. The two-copy version broke on narrow screens because the
                  invisible copy could wrap while the nowrap'd visible copy
                  couldn't, so the reveal box and the text it was revealing
                  disagreed on how wide a line was. */}
              <motion.p
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 -2% 0 0)" }}
                transition={{ delay: 0.55, duration: 1.4, ease: "linear" }}
                className="relative max-w-[85vw] text-center font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.35em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]"
              >
                Authenticated natural diamond
                <motion.span
                  aria-hidden="true"
                  initial={{ left: "0%", opacity: 0 }}
                  animate={{ left: ["0%", "100%", "100%"], opacity: [1, 1, 1, 0] }}
                  transition={{
                    delay: 0.55,
                    duration: 1.87,
                    times: [0, 0.75, 0.75, 1],
                    ease: "linear",
                  }}
                  className="absolute inset-y-0 w-[3px] -translate-x-full bg-white"
                />
              </motion.p>

              {/* Always mounted — toggling it in and out of the tree via
                  AnimatePresence (a nested one, re-entering with the same
                  key across repeated show/hide cycles) left it stuck at
                  its exit values on some later re-entries instead of
                  animating back in, a framer-motion quirk with this exact
                  pattern. Animating its own opacity/y instead, the same
                  way InscriptionPanel's collapse/expand already does
                  reliably, sidesteps it entirely. */}
              <motion.button
                type="button"
                onClick={(event) => {
                  // The stage's own tap-to-zoom handler is bound to the
                  // whole photo underneath this button — stop the tap
                  // from reaching it, or clicking the button also cycles
                  // the zoom level.
                  event.stopPropagation();
                  onOpenDetails?.();
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: detailsOpen ? 0 : 1, y: detailsOpen ? 6 : 0 }}
                transition={{
                  delay: buttonEntered ? 0 : 2.4,
                  duration: 0.35,
                  ease: EASE,
                }}
                onAnimationComplete={() => {
                  if (!detailsOpen) setButtonEntered(true);
                }}
                aria-hidden={detailsOpen}
                tabIndex={detailsOpen ? -1 : 0}
                style={{ pointerEvents: detailsOpen ? "none" : "auto" }}
                className="mt-2 rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#16150f] shadow-lg shadow-black/30 transition-transform hover:scale-[1.03]"
              >
                More about this diamond
              </motion.button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {atFinalLevel ? (
          <motion.div
            key="inscription-callout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.25, duration: 0.4, ease: EASE }}
            className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex flex-col items-center gap-1.5 px-6 text-center landscape:bottom-32"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]">
              Unique identification
            </p>
            <p className="truncate text-2xl font-semibold tracking-[0.04em] text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]">
              GIA {inscriptionNumber}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
