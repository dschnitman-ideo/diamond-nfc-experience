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

// The typewriter headline types word by word, not the whole two-line
// block at once, each word's own duration set by its length at a fixed
// characters-per-second pace — a real typewriter runs at one constant
// speed, so a short word finishing just as fast as a long one would've
// read as typed by a machine that ignores what it's actually typing.
// STAGGER (baked into HEADLINE_TIMINGS below) equals each word's own
// duration exactly, not less, so one word's caret has fully faded
// before the next one's fades in — overlapping them left both carets
// visible at once for a stretch, reading as a stutter rather than one
// continuous pass. The initial delay is long enough to clear the
// recognition overlay's own fade (RECOGNITION_MS=800 in
// DiamondExperience, plus its ~0.4s exit) — these motion values start
// their own clock at this component's mount, not at whatever point the
// stage actually becomes visible, so a short delay here reads as
// "already mid-word" the moment the black screen clears rather than as
// the start of the type-in. "linear", not the app's usual eased curve:
// a typewriter's carriage moves at one constant speed, not an
// eased-out glide.
const HEADLINE_WORD_DELAY = 1.3;
const HEADLINE_SECONDS_PER_CHAR = 0.1;
const HEADLINE_WORDS = ["Authenticated", "natural", "diamond"];
const HEADLINE_TIMINGS = (() => {
  let cursor = HEADLINE_WORD_DELAY;
  return HEADLINE_WORDS.map((text) => {
    const duration = text.length * HEADLINE_SECONDS_PER_CHAR;
    const timing = { text, delay: cursor, duration };
    cursor += duration;
    return timing;
  });
})();
const HEADLINE_END = (() => {
  const last = HEADLINE_TIMINGS[HEADLINE_TIMINGS.length - 1];
  return last.delay + last.duration;
})();

// Builds the last word's caret opacity as one continuous timeline: fade
// in, arrive and hold, then a few hard on/off snaps (not a smooth
// fade/pulse — real cursors toggle instantly) before finally going dark.
// It's the SAME caret element that moved with the word, extended rather
// than replaced by a separate element after the fact, so it reads as
// one effect finishing rather than a new thing appearing once typing
// is "done".
function buildFinalCaretBlink(duration) {
  const SNAP = 0.02; // near-instant on/off transition
  const HOLD = 0.22; // how long each on/off phase stays put
  const points = [
    [0, 0],
    [duration * 0.12, 1],
    [duration, 1], // arrived at the last letter, still solid
  ];
  let t = duration;
  let visible = true;
  for (let i = 0; i < 3; i++) {
    // An odd toggle count so this always ends OFF — otherwise the
    // caret's final keyframe value just holds forever (framer motion
    // keeps whatever the animation last set), leaving a permanently
    // solid cursor sitting there instead of it actually going away.
    t += HOLD;
    points.push([t, visible ? 1 : 0]);
    t += SNAP;
    visible = !visible;
    points.push([t, visible ? 1 : 0]);
  }
  const total = t;
  return {
    duration: total,
    times: points.map(([time]) => time / total),
    values: points.map(([, v]) => v),
  };
}

/** One word of the typewriter headline — its own clip-path reveal and
    trailing caret, so a multi-word headline types word by word instead
    of the whole block sweeping open in one pass. The caret tracks the
    reveal edge on the same duration/ease so the two never drift apart
    or visibly hitch mid-word. `finalCaret` extends that same caret into
    a few idle blinks once it arrives, instead of fading out right away
    — see buildFinalCaretBlink. */
function TypedWord({ text, delay, duration, finalCaret = false }) {
  const blink = finalCaret ? buildFinalCaretBlink(duration) : null;
  return (
    <motion.span
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 -2% 0 0)" }}
      transition={{ delay, duration, ease: "linear" }}
      className="relative inline-block whitespace-nowrap"
    >
      {text}
      <motion.span
        aria-hidden="true"
        initial={{ left: "0%", opacity: 0 }}
        // Matches the clip-path's own "-2%" overshoot (not "0%"/"100%")
        // — the reveal travels a hair past the word's true edge so its
        // last letter isn't clipped at the antialiased boundary. With
        // the caret targeting a plain 100%, it covered less distance
        // than the reveal in the same duration and fell visibly behind
        // it letter by letter.
        animate={{ left: "102%", opacity: blink ? blink.values : [0, 1, 1, 0] }}
        // Per-property sub-transitions (left/opacity below) don't
        // inherit a bare top-level `delay` — each one needs its own, or
        // it starts at mount instead of waiting. Without this, the
        // caret raced to "100%" immediately and just sat there fully
        // formed by the time the word's own (correctly-delayed)
        // clip-path reveal actually started, instead of moving with it.
        transition={{
          left: { delay, duration, ease: "linear" },
          opacity: blink
            ? { delay, duration: blink.duration, times: blink.times, ease: "linear" }
            : { delay, duration, times: [0, 0.12, 0.8, 1], ease: "easeInOut" },
        }}
        className="absolute inset-y-0 w-[3px] -translate-x-full bg-white"
      />
    </motion.span>
  );
}

// Full-height chamfered brackets that hug the left/right edges of the
// authenticated screen — a hallmark/seal frame, like a jeweler's loupe
// gauge. Traced from the reference design (Frame 6/7). `preserveAspectRatio="none"`
// lets each stretch to whatever height the stage actually is rather than
// the SVG's own tall native proportions, and `vectorEffect="non-scaling-stroke"`
// keeps the line weight even despite that non-uniform stretch.
const EDGE_BRACKET_PATHS = {
  left: "M173.23 175.149L173.686 174.854L340.995 66.1123L288.192 1.33105L1 190.507V1329.22L288.192 1518.39L340.995 1453.61L173.686 1344.87L173.23 1344.58V175.149Z",
  right:
    "M169.243 1344.58L168.788 1344.87L1.47853 1453.61L54.2813 1518.4L341.474 1329.22L341.474 190.508L54.2815 1.33167L1.47877 66.1129L168.788 174.853L169.243 175.149L169.243 1344.58Z",
};

function EdgeBracket({ side, className = "" }) {
  return (
    <svg
      viewBox="0 0 343 1520"
      preserveAspectRatio="none"
      fill="none"
      className={`${className} drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]`}
      aria-hidden="true"
    >
      <path
        d={EDGE_BRACKET_PATHS[side]}
        stroke="white"
        strokeOpacity="1"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />
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
    <p
      className={`relative whitespace-nowrap font-[family-name:var(--font-display)] uppercase leading-[1.15] tracking-[0.12em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] ${className}`}
    >
      <TypedWord {...HEADLINE_TIMINGS[0]} />
      <br />
      <TypedWord {...HEADLINE_TIMINGS[1]} />{" "}
      <TypedWord {...HEADLINE_TIMINGS[2]} finalCaret />
    </p>
  );

  const idReveal = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: HEADLINE_END + 0.1, duration: 0.4, ease: EASE },
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
        delay: buttonEntered ? 0 : HEADLINE_END + 0.6,
        duration: 0.35,
        ease: EASE,
      }}
      onAnimationComplete={() => {
        if (!detailsOpen) setButtonEntered(true);
      }}
      aria-hidden={detailsOpen}
      tabIndex={detailsOpen ? -1 : 0}
      style={{ pointerEvents: detailsOpen ? "none" : "auto" }}
      className={`max-w-[85cqw] cursor-pointer rounded-full bg-white px-9 py-3 text-[18px] font-medium tracking-[-0.01em] text-[#16150f] ${className}`}
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
            {/* A dedicated dark backdrop behind the brackets/labels,
                independent of either layout's own vignette (the radial
                one only darkens toward the center layout's own edges;
                editorial's bottom-up scrim doesn't reach the top at
                all) — white-on-white against a bright facet was
                unreadable without it. */}
            <div className="absolute inset-y-0 left-0 h-full w-28 bg-gradient-to-r from-black/70 to-transparent sm:w-40" />
            <div className="absolute inset-y-0 right-0 h-full w-28 bg-gradient-to-l from-black/70 to-transparent sm:w-40" />

            {/* Brackets and side labels frame the stone the same way
                regardless of which stage layout is active below — they're
                the stage's own edge decoration, not part of either
                layout's own confirmation content. Stay put even with a
                side panel open: the right ones just end up partly behind
                it, which reads fine since the panel already sits above
                them (z-30 to this frame's z-20). */}
            <EdgeBracket side="left" className="absolute inset-y-0 left-0 h-full w-28 sm:w-40" />
            <EdgeBracket side="right" className="absolute inset-y-0 right-0 h-full w-28 sm:w-40" />

            {/* Flex-centered in the margin BEFORE the bracket's ribbon
                line — half its w-28/sm:w-40 footprint (w-14/sm:w-20),
                anchored at the true edge — rather than the full width,
                which centers the text ON that line (it sits at very
                nearly 50% of the box) instead of clear of it. */}
            <div className="absolute inset-y-0 left-0 flex h-full w-14 items-center justify-center sm:w-20">
              <p className="rotate-180 whitespace-nowrap [writing-mode:vertical-rl] text-label uppercase tracking-[0.3em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                Authenticated
              </p>
            </div>
            <div className="absolute inset-y-0 right-0 flex h-full w-14 items-center justify-center sm:w-20">
              <p className="whitespace-nowrap [writing-mode:vertical-rl] text-label uppercase tracking-[0.3em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                Authenticated
              </p>
            </div>

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
                  <DiamondMark className="h-16 w-16 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]" />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3, ease: EASE }}
                    className="mt-7 text-center text-base font-medium uppercase tracking-[0.06em] text-white/85 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]"
                  >
                    Confirmed
                  </motion.p>

                  {renderHeadline("mt-3 text-center text-[clamp(20px,6.6cqw,41px)]")}

                  <motion.div
                    {...idReveal}
                    className="mt-6 flex flex-col items-center gap-1.5 text-center"
                  >
                    <p className="text-base font-medium uppercase tracking-[0.06em] text-white/85 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]">
                      Unique identification
                    </p>
                    <p className="truncate text-[clamp(20px,5.6cqw,30px)] tracking-[0.02em] text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]">
                      GIA {inscriptionNumber}
                    </p>
                  </motion.div>

                  {renderDetailsButton("mt-6 w-[480px]")}
                </motion.div>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

    </div>
  );
}
