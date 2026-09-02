"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DiamondArt, { INSCRIPTION_ANCHOR } from "./DiamondArt";
import { Icon } from "./icons";

const VIEWS = [
  { id: "face", label: "Face-up", tilt: 0 },
  { id: "profile", label: "Profile", tilt: -40 },
  { id: "table", label: "Angled", tilt: 22 },
];

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
  const [viewIndex, setViewIndex] = useState(0);
  const [dragTilt, setDragTilt] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const startX = useRef(0);
  const autoTimer = useRef(null);

  const baseTilt = VIEWS[viewIndex].tilt;
  const tilt = Math.max(-70, Math.min(70, baseTilt + dragTilt));

  useEffect(() => {
    if (!autoZoom) return undefined;
    autoTimer.current = setTimeout(() => setZoomed(true), AUTO_ZOOM_DELAY_MS);
    return () => clearTimeout(autoTimer.current);
  }, [autoZoom]);

  function onPointerDown(e) {
    if (zoomed) return;
    e.preventDefault();
    setDragging(true);
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragging || zoomed) return;
    setDragTilt((e.clientX - startX.current) * 0.35);
  }
  function endDrag() {
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
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={dragging ? endDrag : undefined}
          onDragStart={(e) => e.preventDefault()}
          onClick={() => zoomed && setZoomed(false)}
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
                setZoomed(true);
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

      {!zoomed ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-32 flex items-center justify-center gap-2">
          {VIEWS.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setViewIndex(i)}
              aria-label={`Show ${v.label} view`}
              aria-current={i === viewIndex}
              className="pointer-events-auto h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === viewIndex ? 22 : 6,
                background: i === viewIndex ? "var(--brass)" : "var(--hairline-strong)",
              }}
            />
          ))}
        </div>
      ) : null}

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
                onClick={() => setZoomed(false)}
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
