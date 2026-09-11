"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import { Icon } from "./icons";
import { getTracrRecord } from "@/data/tracr";
import { getGiaRecord } from "@/data/gia";
import { getStageImages } from "@/data/diamondStageImages";
import { playZoomChime, vibrate } from "@/lib/feedback";

const EASE = [0.22, 1, 0.36, 1];

function SpecItem({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--hairline)] bg-[var(--surface-card)] px-3 py-2.5">
      <p className="text-[9.5px] font-medium uppercase tracking-[0.13em] text-[var(--ink-faint)]">
        {label}
      </p>
      <p className="mt-0.5 truncate font-[family-name:var(--font-display)] text-[15px] leading-tight text-[var(--ink)]">
        {value}
      </p>
    </div>
  );
}

function TrustRow({ iconName, label, status, value, sub }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-[var(--hairline)] bg-[var(--surface-card)] px-3 py-2.5">
      <div className="flex min-w-0 items-start gap-2.5">
        <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[var(--brass-soft)] text-[var(--brass)]">
          <Icon name={iconName} className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0">
          <p className="text-[9.5px] font-medium uppercase tracking-[0.13em] text-[var(--ink-faint)]">
            {label}
          </p>
          <p className="mt-0.5 truncate text-[13px] font-medium text-[var(--ink)]">{value}</p>
          {sub ? <p className="truncate text-[11px] text-[var(--ink-faint)]">{sub}</p> : null}
        </div>
      </div>
      {status ? <StatusBadge status={status} /> : null}
    </div>
  );
}

/**
 * The stone card + zoom toggle. Crossfades between that diamond's own
 * default and closest-inscription photos (the same pair/set
 * DiamondStage uses) — keyed by diamond id from ComparePanel so
 * swapping in a different diamond still resets the zoom state.
 */
function ZoomableStone({ diamondId, giaRecord }) {
  const [zoomed, setZoomed] = useState(false);
  const stages = getStageImages(diamondId);

  function toggleZoom() {
    setZoomed((z) => {
      const next = !z;
      if (next) playZoomChime();
      vibrate(next ? 18 : 8);
      return next;
    });
  }

  const restStage = stages[0];
  const zoomStage = stages[stages.length - 1];
  const stone = zoomed ? zoomStage : restStage;

  return (
    <>
      <button
        type="button"
        onClick={toggleZoom}
        aria-label={zoomed ? "Zoom out of trust mark" : "Zoom into trust mark"}
        className="relative mt-3 aspect-square w-full flex-none cursor-pointer overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] p-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={zoomed ? "zoom" : "rest"}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Image src={stone.src} alt={stone.alt} fill sizes="280px" className="object-contain" />
          </motion.div>
        </AnimatePresence>

        {!zoomed ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${restStage.hotspot.left}%`, top: `${restStage.hotspot.top}%` }}
          >
            <span className="absolute h-full w-full animate-ping rounded-full border border-[var(--brass)]/70" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--brass)]" />
          </span>
        ) : null}
      </button>

      <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-[var(--ink-faint)]">
        {zoomed ? (
          <>
            <Icon name="trustMark" className="h-3.5 w-3.5 flex-none text-[var(--brass)]" />
            <span className="truncate">
              Trust Mark · Inscription GIA {giaRecord?.reportNumber ?? "—"}
            </span>
          </>
        ) : (
          "Tap the stone to zoom into the trust mark"
        )}
      </p>
    </>
  );
}

function ComparePanel({ diamondId, diamonds, onChange }) {
  const index = diamonds.findIndex((d) => d.id === diamondId);
  const diamond = diamonds[index] ?? diamonds[0];
  const tracrRecord = getTracrRecord(diamond.id);
  const giaRecord = getGiaRecord(diamond.id);

  function step(dir) {
    const nextIndex = (index + dir + diamonds.length) % diamonds.length;
    onChange(diamonds[nextIndex].id);
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col px-3 sm:px-5">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => step(-1)}
          aria-label="Previous diamond"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink-soft)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[var(--ink)]"
        >
          <Icon name="chevronLeft" className="h-4 w-4" />
        </button>
        <div className="min-w-0 text-center">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            Diamond {diamond.id}
          </p>
          <p className="truncate font-[family-name:var(--font-display)] text-base text-[var(--ink)]">
            {diamond.name}
          </p>
        </div>
        <button
          onClick={() => step(1)}
          aria-label="Next diamond"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink-soft)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[var(--ink)]"
        >
          <Icon name="chevronRight" className="h-4 w-4" />
        </button>
      </div>

      <ZoomableStone key={diamond.id} diamondId={diamond.id} giaRecord={giaRecord} />

      <div className="mt-3 grid grid-cols-2 gap-2">
        <SpecItem label="Shape" value={diamond.shape} />
        <SpecItem label="Carat" value={`${diamond.carat.toFixed(2)} ct`} />
        <SpecItem label="Cut" value={diamond.cut} />
        <SpecItem label="Color" value={diamond.color} />
        <SpecItem label="Clarity" value={diamond.clarity} />
        <SpecItem label="Fluorescence" value={diamond.fluorescence} />
      </div>

      <p className="mb-2 mt-4 text-[10px] font-medium uppercase tracking-[0.13em] text-[var(--ink-faint)]">
        Trust marks
      </p>
      <div className="flex flex-col gap-2 pb-4">
        <TrustRow
          iconName="gia"
          label="GIA"
          status={giaRecord?.status}
          value={giaRecord ? giaRecord.reportNumber : "Not on file"}
        />
        <TrustRow
          iconName="tracr"
          label="Tracr"
          status={tracrRecord?.status}
          value={tracrRecord ? tracrRecord.tracrId : "Not on file"}
          sub={tracrRecord?.origin}
        />
      </div>
    </div>
  );
}

/**
 * Side-by-side comparison of two diamonds — their stones and trust
 * marks (GIA / Tracr) laid out in a fixed two-column split so a
 * customer can hold two stones up against each other in one view,
 * rather than flipping back and forth between two detail sheets.
 */
export default function CompareView({ open, onClose, diamonds, leftId, rightId, onChangeLeft, onChangeRight }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="compare"
          role="dialog"
          aria-modal="true"
          aria-label="Compare diamonds"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] flex flex-col bg-[var(--surface)]"
        >
          <div className="flex flex-none items-center justify-between border-b border-[var(--hairline)] px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <Icon name="compare" className="h-[18px] w-[18px] text-[var(--brass)]" />
              <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                Compare Diamonds
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close comparison"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink)] transition-colors hover:border-[var(--hairline-strong)]"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 divide-x divide-[var(--hairline)] overflow-x-auto overflow-y-hidden">
            <div className="flex min-h-0 min-w-[280px] flex-1 flex-col overflow-y-auto py-4">
              <ComparePanel diamondId={leftId} diamonds={diamonds} onChange={onChangeLeft} />
            </div>
            <div className="flex min-h-0 min-w-[280px] flex-1 flex-col overflow-y-auto py-4">
              <ComparePanel diamondId={rightId} diamonds={diamonds} onChange={onChangeRight} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
