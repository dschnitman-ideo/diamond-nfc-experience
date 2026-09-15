"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";
import ChevronToggle from "./ChevronToggle";

/**
 * A rule above a small caps label above a big serif value — the one
 * repeating unit the reference frame's spec sheet is built from,
 * rather than boxed/carded fields.
 */
function Field({ label, value, size = "hero", className = "" }) {
  const valueClass =
    size === "hero"
      ? "text-[clamp(1.6rem,7.2vw,2.2rem)] leading-[1.0]"
      : "text-2xl leading-tight";
  return (
    <div className={`border-t border-[var(--hairline-strong)] pt-2.5 ${className}`}>
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">
        {label}
      </p>
      <p
        className={`mt-1.5 break-words font-[family-name:var(--font-display)] text-[var(--ink)] ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function DiamondPanel({
  diamond,
  inscriptionNumber,
  tracrId,
  reportUrl,
  onClose,
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      {/* One flat panel — khaki background, hairline rules dividing the
          fields, big serif values — matching the reference frame. The
          background is a full-width band (matches whatever width the
          sheet itself is, at any viewport); the content inside gets
          its own centered max-w-2xl column so it still lines up with
          the rest of the sheet's text. It carries the sheet's own
          drag handle and header (label + close) as its top edge, so
          nothing sits above it as a separate fixed, differently-
          colored bar — the whole thing scrolls away together. Rounded
          on top only, matching the outer sheet's own 28px corner
          radius exactly (one clean edge, not a curve-within-a-curve).
          The bottom stays square — the "inverted" corner where it
          hands off to the lighter section below is carved out of THAT
          section instead (see its negative-margin overlap), so khaki
          reads as a flat-bottomed band that the lighter card floats
          up and over, rather than khaki's own corners bulging inward. */}
      <div className="w-full rounded-t-[28px] bg-[#bfbfb1] pb-14 pt-2.5">
        <div className="mx-auto h-1 w-9 rounded-full bg-[var(--hairline-strong)]" />

        <div className="mx-auto mt-4 flex w-full max-w-2xl items-center justify-between gap-4 px-5 pb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            Diamond details
          </p>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="flex h-6 w-6 flex-none items-center justify-center text-[var(--ink)]"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto max-w-2xl px-5">
          <div className="grid grid-cols-2 gap-x-6">
            <div className="space-y-6">
              <Field label="Carat" value={`${diamond.carat.toFixed(2)} ct`} />
              <Field label="Colour" value={diamond.color} />
              {reportUrl ? (
                <a
                  href={reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--hairline-strong)] px-3.5 py-2 text-[10.5px] font-medium uppercase tracking-[0.1em] text-[var(--ink)] transition-colors hover:bg-[var(--surface-card)]"
                >
                  View grading report
                  <Icon name="arrowUpRight" className="h-3 w-3" />
                </a>
              ) : null}
            </div>

            <div className="space-y-6">
              <Field label="Shape" value={diamond.shape} />
              <Field label="Clarity" value={diamond.clarity} />
              <Field label="Cut" value={diamond.cut} />
              {tracrId || inscriptionNumber ? (
                <Field
                  size="compact"
                  label="Tracr ID"
                  value={
                    <span className="font-mono text-sm leading-snug break-all">
                      {tracrId ?? inscriptionNumber}
                    </span>
                  }
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Floats up and over khaki's flat bottom edge — the negative
          margin pulls this rounded-top card upward by its own corner
          radius, so khaki stays visible as flanking strips beside the
          curve instead of khaki's own corners bulging inward. */}
      <div className="-mt-7 w-full rounded-t-[28px] bg-[var(--surface)] pb-2 pt-9">
        <div className="mx-auto max-w-2xl px-5">
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex w-full items-start justify-between gap-4 text-left"
          >
            <p className="font-[family-name:var(--font-display)] text-xl leading-snug text-[var(--ink)]">
              Full specifications
            </p>
            <div className="-mt-0.5">
              <ChevronToggle expanded={expanded} />
            </div>
          </button>

          <AnimatePresence initial={false}>
            {expanded ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
                  <Field size="compact" label="Polish" value={diamond.polish} />
                  <Field size="compact" label="Symmetry" value={diamond.symmetry} />
                  <Field size="compact" label="Fluorescence" value={diamond.fluorescence} />
                  <Field size="compact" label="Measurements" value={diamond.measurements} />
                  <Field size="compact" label="Table / Depth" value={diamond.tableDepth} />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
