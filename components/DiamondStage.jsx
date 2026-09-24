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
  layout = "centered",
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

  // Pieces shared by both stage layouts ("centered" and "editorial"), so
  // the typewriter headline and the staggered button entrance behave the
  // same in each — only their placement differs.
  /* clip-path never changes an element's layout box — only what's
      painted inside it — so animating it on the real text (instead
      of overlaying a second copy on top of an invisible sizing
      copy) keeps the box the browser already centered exactly
      where it was, with nothing that can drift out of sync with
      it. The two-copy version broke on narrow screens because the
      invisible copy could wrap while the nowrap'd visible copy
      couldn't, so the reveal box and the text it was revealing
      disagreed on how wide a line was. */
  const renderHeadline = (className = "") => (
    <motion.p
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 -2% 0 0)" }}
      transition={{ delay: 0.55, duration: 1.4, ease: "linear" }}
      className={`relative whitespace-nowrap font-[family-name:var(--font-display)] uppercase leading-[1.15] tracking-[0.12em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] ${className}`}
    >
      Authenticated
      <br />
      natural diamond
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
  );

  const idReveal = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 1.9, duration: 0.4, ease: EASE },
  };

  /* Always mounted — toggling it in and out of the tree via
      AnimatePresence (a nested one, re-entering with the same
      key across repeated show/hide cycles) left it stuck at
      its exit values on some later re-entries instead of
      animating back in, a framer-motion quirk with this exact
      pattern. Animating its own opacity/y instead, the same
      way InscriptionPanel's collapse/expand already does
      reliably, sidesteps it entirely. */
  const renderDetailsButton = (className = "") => (
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
      // Hover scale lives here, not in a Tailwind hover:/transition-
      // transform class: a CSS transition on transform re-smooths
      // every frame framer-motion writes, so the entrance slide
      // lagged ~0.5s behind the fade and the button landed late.
      whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
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
      className={`max-w-[85cqw] cursor-pointer rounded-full bg-white px-8 py-2.5 text-[17px] font-medium tracking-[-0.01em] text-[#16150f] ${className}`}
    >
      More about this diamond
    </motion.button>
  );

  return (
    // A size container, so the lockup text scales with this stage's own
    // width — which narrows when a side panel opens — rather than the window.
    <div className="relative h-full w-full [container-type:size]">
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
            {layout === "editorial" ? (
              <>
                {/* Editorial layout: a left-aligned block anchored bottom-left,
                    bracketed by hairline rules, with the ID set inline. A
                    bottom-up scrim (instead of the centered layout's radial
                    glow and edge vignette) keeps it legible over bright
                    facets while leaving the upper photo clear. */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.4) 38%, rgba(0,0,0,0) 68%)",
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
                  className="absolute inset-x-0 bottom-0 px-6 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-12 sm:pb-24"
                >
                  <div className="w-full max-w-[36rem]">
                    <div className="h-px w-full bg-white/55" />
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3, ease: EASE }}
                      className="mt-5 text-xs font-medium uppercase tracking-[0.06em] text-white/85"
                    >
                      Confirmed
                    </motion.p>

                    {renderHeadline("mt-3 text-left text-[clamp(20px,6.4cqw,38px)]")}

                    <div className="mt-7 h-px w-full bg-white/55" />

                    <motion.div
                      {...idReveal}
                      className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1"
                    >
                      <p className="text-xs font-medium uppercase tracking-[0.06em] text-white/85">
                        Unique identification
                      </p>
                      <p className="text-xl tracking-[0.02em] text-white">
                        GIA {inscriptionNumber}
                      </p>
                    </motion.div>

                    {renderDetailsButton("mt-6 whitespace-nowrap")}
                  </div>
                </motion.div>
              </>
            ) : (
              <>
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

                    <p className="absolute left-4 top-1/2 -translate-y-1/2 rotate-180 whitespace-nowrap [writing-mode:vertical-rl] text-label uppercase tracking-[0.3em] text-white/80 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)] sm:left-6">
                      Authenticated
                    </p>
                    <p className="absolute right-4 top-1/2 -translate-y-1/2 whitespace-nowrap [writing-mode:vertical-rl] text-label uppercase tracking-[0.3em] text-white/80 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)] sm:right-6">
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
                  className="absolute left-1/2 top-[68%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                >
                  {/* Darkens whatever part of the photo sits behind the mark
                      and text — without it, both wash out against a bright
                      facet the same way white-on-white would. */}
                  <div
                    className="absolute left-1/2 top-1/2 -z-10 h-[170%] w-[min(52rem,150vw)] -translate-x-1/2 -translate-y-1/2"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0) 100%)",
                    }}
                  />
                  <DiamondMark className="h-14 w-14 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]" />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3, ease: EASE }}
                    className="mt-7 text-center text-sm font-medium uppercase tracking-[0.06em] text-white/85 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]"
                  >
                    Confirmed
                  </motion.p>

                  {renderHeadline("mt-3 text-center text-[clamp(18px,6cqw,37px)]")}

                  <motion.div
                    {...idReveal}
                    className="mt-5 flex flex-col items-center gap-1 text-center"
                  >
                    <p className="text-sm font-medium uppercase tracking-[0.06em] text-white/85 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]">
                      Unique identification
                    </p>
                    <p className="truncate text-[clamp(18px,5cqw,27px)] tracking-[0.02em] text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]">
                      GIA {inscriptionNumber}
                    </p>
                  </motion.div>

                  {renderDetailsButton("mt-5 w-[440px]")}
                </motion.div>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

    </div>
  );
}
