"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DiamondArt, { INSCRIPTION_ANCHOR } from "./DiamondArt";
import { Icon } from "./icons";
import { playZoomChime, vibrate } from "@/lib/feedback";

const ANCHOR_PCT = {
  left: (INSCRIPTION_ANCHOR.x / 300) * 100,
  top: (INSCRIPTION_ANCHOR.y / 300) * 100,
};

const ZOOM_SCALE = 3.6;
const AUTO_ZOOM_DELAY_MS = 1100;

/**
 * The full-screen stone itself. Owns rotation, and the zoom-into-the-
 * girdle interaction that's the centerpiece of the experience: on
 * mount it auto-zooms into the trust mark + inscription once, and a
 * hotspot at that same point lets the viewer replay it any time.
 * Deliberately self-contained — DiamondExperience doesn't need to know
 * about zoom state, only that this fills the screen behind it.
 */
export default function DiamondStage({ shape, tint, inscriptionNumber, autoZoom = true }) {
  const [dragTilt, setDragTilt] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const moved = useRef(false);
  const pressActive = useRef(false);
  const autoTimer = useRef(null);

  const tilt = Math.max(-70, Math.min(70, dragTilt));
  const TAP_THRESHOLD_PX = 6;

  // Zoom in gets a bright chime + firmer tick (this is the reveal moment);
  // zoom out only gets a light tick, so repeated tapping to show off the
  // toggle doesn't turn into a barrage of sound.
  function zoomIn() {
    setZoomed(true);
    playZoomChime();
    vibrate(18);
  }
  function zoomOut() {
    setZoomed(false);
    vibrate(8);
  }

  useEffect(() => {
    if (!autoZoom) return undefined;
    autoTimer.current = setTimeout(zoomIn, AUTO_ZOOM_DELAY_MS);
    return () => clearTimeout(autoTimer.current);
  }, [autoZoom]);

  // Rotation drag only makes sense at rest, but a tap (press-and-release
  // with no meaningful movement) should toggle zoom either way, so
  // pointerdown/move/up all run in both states — only the tilt math is
  // skipped while zoomed. `pressActive`/`moved` are refs rather than state
  // so onPointerUp reads them correctly even before a re-render flushes.
  function onPointerDown(e) {
    e.preventDefault();
    pressActive.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    moved.current = false;
    if (!zoomed) setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!pressActive.current) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (Math.abs(dx) > TAP_THRESHOLD_PX || Math.abs(dy) > TAP_THRESHOLD_PX) moved.current = true;
    if (!zoomed) setDragTilt(dx * 0.35);
  }
  function onPointerUp() {
    if (pressActive.current && !moved.current) {
      if (zoomed) zoomOut();
      else zoomIn();
    }
    pressActive.current = false;
    setDragging(false);
    setDragTilt(0);
  }
  function cancelDrag() {
    pressActive.current = false;
    setDragging(false);
    setDragTilt(0);
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="relative aspect-square w-[min(92vw,62vh)] touch-pan-y select-none"
          style={{ cursor: zoomed ? "default" : dragging ? "grabbing" : "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={cancelDrag}
          onPointerLeave={dragging ? cancelDrag : undefined}
          onDragStart={(e) => e.preventDefault()}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: zoomed ? ZOOM_SCALE : 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${ANCHOR_PCT.left}% ${ANCHOR_PCT.top}%` }}
          >
            <DiamondArt shape={shape} tint={tint} tilt={tilt} instant={dragging} className="h-full w-full" />
          </motion.div>

          {!zoomed ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              aria-label="Inspect trust mark and inscription"
              className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${ANCHOR_PCT.left}%`, top: `${ANCHOR_PCT.top}%` }}
            >
              <span className="absolute h-full w-full animate-ping rounded-full border border-[var(--brass)]/70" />
              <span className="relative h-3 w-3 rounded-full bg-[var(--brass)]" />
            </button>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {zoomed ? (
          <motion.div
            key="inscription-callout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-x-0 bottom-32 flex justify-center px-6"
          >
            <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-[var(--hairline-strong)] bg-[var(--surface-card)]/95 px-4 py-3.5 shadow-xl shadow-black/40 backdrop-blur">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[var(--brass-soft)] text-[var(--brass)]">
                <Icon name="trustMark" className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[var(--ink)]">Trust Mark Verified</p>
                <p className="truncate text-xs text-[var(--ink-soft)]">
                  Inscription · GIA {inscriptionNumber}
                </p>
              </div>
              <button
                onClick={zoomOut}
                aria-label="Zoom out"
                className="ml-1 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
