"use client";

import BrilliantPlot from "./BrilliantPlot";
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
      <div className="h-px w-full bg-[#16150f]/55" />
      <p className="text-[clamp(9px,1.05vh,11px)] font-semibold uppercase tracking-[0.1em] text-[#16150f]">
        {label}
      </p>
      {children}
    </div>
  );
}

function Value({ children }) {
  return (
    <p className="font-[family-name:var(--font-display)] text-[min(10vh,14cqw)] leading-[0.95] tracking-[-0.02em] text-[#16150f]">
      {children}
    </p>
  );
}

export default function SpecsPanel({ diamond }) {
  return (
    <div className="flex h-full flex-col gap-[2vh] px-[clamp(20px,2.6vw,38px)] py-[clamp(18px,3vh,34px)] text-[#16150f]">
      <div className="flex flex-none items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-px w-full bg-[#16150f]/55" />
          <p className="mt-[0.7vh] text-[clamp(9px,1.05vh,11px)] font-semibold uppercase tracking-[0.1em]">
            About this diamond
          </p>
        </div>
        <DiamondMark className="h-[clamp(20px,2.6vh,30px)] w-[clamp(20px,2.6vh,30px)] flex-none text-[#16150f]" />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-3 gap-x-[clamp(16px,2.4vw,40px)] gap-y-[2vh]">
        <Cell label="Carat">
          <Value>{diamond.carat.toFixed(2)}</Value>
        </Cell>
        <Cell label="Shape">
          <Value>{shortShape(diamond.shape)}</Value>
        </Cell>
        <Cell label="Colour">
          <Value>{diamond.color}</Value>
        </Cell>
        <Cell label="Clarity">
          <Value>{diamond.clarity}</Value>
        </Cell>
        <Cell label="Inclusions">
          <BrilliantPlot className="mt-[0.6vh] h-full max-h-[22vh] w-auto self-start text-[#16150f]" />
        </Cell>
        <Cell label="Cut">
          <Value>{CUT_ABBR[diamond.cut] ?? diamond.cut}</Value>
        </Cell>
      </div>
    </div>
  );
}
