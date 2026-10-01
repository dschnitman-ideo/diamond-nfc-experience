"use client";

import { useLayoutEffect, useRef } from "react";
import BrilliantPlot from "./BrilliantPlot";
import ClarityIcon from "./ClarityIcon";
import DiamondMark from "./DiamondMark";

/**
 * The 4Cs board — the spec sheet reduced to the six values worth
 * reading at arm's length, set large. Like StoryPanel this is a fixed
 * one-screen board: a 2×3 grid that fills the panel's height with no
 * scroll, type in vh clamps so it compresses rather than overflows.
 */

// GIA's own shorthand — the grades print in full on the report, but at
// this size the abbreviations are what the design calls for.
const CUT_ABBR = {
  Excellent: "EX",
  "Very Good": "VG",
  Good: "G",
  Fair: "F",
  Poor: "P",
};

function shortShape(shape) {
  return shape?.replace(/\s*(Brilliant|Cut)$/i, "") ?? "—";
}

function Cell({ label, children, className = "" }) {
  return (
    <div className={`flex min-h-0 flex-col gap-[0.7vh] ${className}`}>
      {/* flex-none: on iPad's squarer viewport the colour letter can
          outgrow its row, and the shrink would squash this 1px rule to 0. */}
      <div className="h-px w-full flex-none bg-[#000000]/55" />
      <p className="flex-none text-label font-semibold uppercase tracking-caps text-[#000000]">
        {label}
      </p>
      {children}
    </div>
  );
}

// Eggshell, from the brand palette — a step lighter than this panel's
// own Chalk surface, so the pill reads as its own shape. (Was Chalk
// itself, back when this panel sat on Ash Grey — the light-to-dark
// panel ramp moved this panel onto Chalk, so the pill was bumped
// lighter again to keep the same contrast.)
const PILL_BG = "#f1f2ed";

function CharacteristicPill({ name }) {
  return (
    <span
      className="inline-flex items-center gap-[0.35em] rounded-full px-[0.85vw] pb-[0.45vh] pt-[0.35vh] text-[clamp(9px,1.05vh,11px)] font-medium leading-none text-[#000000]"
      style={{ backgroundColor: PILL_BG }}
    >
      {/* GIA's own plotting symbol for the characteristic, in its
          red (internal) / green (external) convention. */}
      <ClarityIcon name={name} className="h-[1.3em] w-[1.3em] flex-none" />
      {name}
    </span>
  );
}

// Ceiling for every value: short ones ("D", "EX") stop at the row's
// height rather than growing to fill their column's width.
const MAX_VH = 19;

// The colour grade is a single letter, so it would otherwise read as
// the smallest value on the board — let it set much larger, like the
// reference's "D".
const COLOUR_MAX_VH = 26;

// Clarity and Cut are short codes ("IF", "EX") that would otherwise
// balloon to MAX_VH; cap them near the size a long grade like "VVS2"
// already sets at, so the pair reads the same from stone to stone.
const GRADE_MAX_VH = 12;

// Like the reference board, values set as large as their cells allow:
// longer ones ("1.52", "Round", "Emerald") fill their column's width,
// short ones cap at MAX_VH. Both values in a row then share the
// smaller of their two sizes, so "2.01" and "Oval" read as a matched
// pair rather than two unrelated sizes side by side. Clarity and Cut
// (the two grades stacked in the right column) are matched the same way. Measured rather
// than guessed from character counts — the panel's padding is in px,
// so the column's share of the board shifts between phone, iPad and
// desktop, and glyph widths vary too much ("H" vs "I") to estimate.
function useRowMatchedValueSizes(gridRef, deps) {
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const fit = () => {
      const rows = new Map();
      for (const el of grid.querySelectorAll("[data-value-row]")) {
        const maxPx = (Number(el.dataset.maxVh) / 100) * window.innerHeight;
        el.style.fontSize = "100px";
        const range = document.createRange();
        range.selectNodeContents(el);
        const textWidth = range.getBoundingClientRect().width;
        const cellWidth = el.parentElement.clientWidth;
        const px = textWidth ? Math.min(maxPx, (100 * cellWidth) / textWidth) : maxPx;
        const row = el.dataset.valueRow;
        rows.set(row, [...(rows.get(row) ?? []), { el, px }]);
      }
      for (const values of rows.values()) {
        const shared = Math.min(...values.map((v) => v.px));
        for (const { el } of values) el.style.fontSize = `${shared.toFixed(1)}px`;
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(grid);
    window.addEventListener("resize", fit);
    // The display face may still be loading on first paint, and its
    // metrics differ from the fallback's.
    document.fonts?.ready.then(fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function Value({ row, maxVh = MAX_VH, children }) {
  return (
    <p
      data-value-row={row}
      data-max-vh={maxVh}
      style={{ fontSize: `min(${maxVh}vh, 10cqw)` }}
      className="mt-[0.4vh] self-start whitespace-nowrap font-[family-name:var(--font-display)] leading-[0.95] tracking-[-0.02em] text-[#000000]"
    >
      {children}
    </p>
  );
}

export default function SpecsPanel({ diamond }) {
  const gridRef = useRef(null);
  useRowMatchedValueSizes(gridRef, [diamond]);

  return (
    // See StoryPanel's identical comment: the extra 28px on the right
    // compensates for the inscription panel's overlap eating into this
    // board's own padding when it's open.
    <div className="relative flex h-full flex-col gap-[2vh] pl-[clamp(20px,2.6vw,38px)] pr-[calc(clamp(20px,2.6vw,38px)+28px)] py-[clamp(18px,3vh,34px)] text-[#000000]">
      <div className="flex-none">
        <div className="h-px w-full bg-[#000000]/55" />
        <p className="mt-[0.7vh] text-label font-semibold uppercase tracking-caps">4Cs</p>
      </div>

      {/* The mark moves to the bottom corner (echoing the reference
          hallmark layout) instead of sitting inline with the title —
          the title's own rule now runs the panel's full width instead
          of sharing the row with the icon. */}
      <DiamondMark className="absolute bottom-[clamp(18px,3vh,34px)] right-[calc(clamp(20px,2.6vw,38px)+28px)] h-[clamp(30px,4vh,46px)] w-[clamp(30px,4vh,46px)] text-[#000000]" />

      {/* Uneven columns: the right-hand values are words ("Round",
          "Emerald", "VVS2") and need the width far more than the
          left's short carat figure and single colour letter. */}
      <div ref={gridRef} className="grid min-h-0 flex-1 grid-cols-[minmax(0,44fr)_minmax(0,56fr)] grid-rows-3 gap-x-[clamp(16px,2.4vw,40px)] gap-y-[2vh]">
        <Cell label="Carat">
          <Value row="1">{diamond.carat.toFixed(2)}</Value>
        </Cell>
        <Cell label="Shape">
          <Value row="1">{shortShape(diamond.shape)}</Value>
        </Cell>
        <Cell label="Colour">
          <Value row="colour" maxVh={COLOUR_MAX_VH}>{diamond.color}</Value>
        </Cell>
        <Cell label="Clarity">
          <Value row="grades" maxVh={GRADE_MAX_VH}>{diamond.clarity}</Value>
        </Cell>
        <Cell label="Inclusions">
          <div className="flex min-h-0 flex-1 flex-col gap-[1vh]">
            <BrilliantPlot className="mt-[0.6vh] h-full max-h-[16vh] w-auto self-start text-[#000000]" />
            {diamond.clarityCharacteristics?.length ? (
              <div className="flex flex-wrap gap-[0.6vh_0.5vw]">
                {diamond.clarityCharacteristics.map((c) => (
                  <CharacteristicPill key={c} name={c} />
                ))}
              </div>
            ) : null}
          </div>
        </Cell>
        <Cell label="Cut">
          <Value row="grades" maxVh={GRADE_MAX_VH}>{CUT_ABBR[diamond.cut] ?? diamond.cut}</Value>
        </Cell>
      </div>
    </div>
  );
}
