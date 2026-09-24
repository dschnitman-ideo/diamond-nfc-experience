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
      <p className="text-label font-semibold uppercase tracking-caps text-[#16150f]">
        {label}
      </p>
      {children}
    </div>
  );
}

function Value({ children }) {
  const length = typeof children === "string" ? children.length : 0;
  // Sized against the whole board's width (14cqw), not the grid column
  // it actually sits in — fine for short values ("1.52", "VS1", "EX")
  // but a longer, unbreakable word ("Round", "Emerald", "Cushion")
  // renders wider than its half of the row and bleeds into whatever
  // sits beside the panel. Cap the ceiling as length grows so long
  // shape names still fit their own column.
  const maxCqw = length <= 4 ? 14 : length <= 6 ? 11 : 9;
  return (
    <p
      style={{ fontSize: `min(10vh, ${maxCqw}cqw)` }}
      className="font-[family-name:var(--font-display)] leading-[0.95] tracking-[-0.02em] text-[#16150f]"
    >
      {children}
    </p>
  );
}

export default function SpecsPanel({ diamond }) {
  return (
    // See StoryPanel's identical comment: the extra 28px on the right
    // compensates for the inscription panel's overlap eating into this
    // board's own padding when it's open.
    <div className="flex h-full flex-col gap-[2vh] pl-[clamp(20px,2.6vw,38px)] pr-[calc(clamp(20px,2.6vw,38px)+28px)] py-[clamp(18px,3vh,34px)] text-[#16150f]">
      <div className="flex flex-none items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-px w-full bg-[#16150f]/55" />
          <p className="mt-[0.7vh] text-label font-semibold uppercase tracking-caps">
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
