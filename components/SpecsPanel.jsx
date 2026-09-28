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

// A touch lighter than the panel's own khaki surface (#c3c6b6) — visible
// as its own shape against the panel rather than blending flat into it,
// without introducing a new, unrelated color to the sheet.
const PILL_BG = "#d8dbcf";

function CharacteristicPill({ children }) {
  return (
    <span
      className="rounded-full px-[0.85vw] pb-[0.45vh] pt-[0.35vh] text-[clamp(9px,1.05vh,11px)] font-medium leading-none text-[#16150f]"
      style={{ backgroundColor: PILL_BG }}
    >
      {children}
    </span>
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
    <div className="relative flex h-full flex-col gap-[2vh] pl-[clamp(20px,2.6vw,38px)] pr-[calc(clamp(20px,2.6vw,38px)+28px)] py-[clamp(18px,3vh,34px)] text-[#16150f]">
      <div className="flex-none">
        <div className="h-px w-full bg-[#16150f]/55" />
        <p className="mt-[0.7vh] text-label font-semibold uppercase tracking-caps">4Cs</p>
      </div>

      {/* The mark moves to the bottom corner (echoing the reference
          hallmark layout) instead of sitting inline with the title —
          the title's own rule now runs the panel's full width instead
          of sharing the row with the icon. */}
      <DiamondMark className="absolute bottom-[clamp(18px,3vh,34px)] right-[calc(clamp(20px,2.6vw,38px)+28px)] h-[clamp(30px,4vh,46px)] w-[clamp(30px,4vh,46px)] text-[#16150f]" />

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
          <div className="flex min-h-0 flex-1 flex-col gap-[1vh]">
            <BrilliantPlot className="mt-[0.6vh] h-full max-h-[16vh] w-auto self-start text-[#16150f]" />
            {diamond.clarityCharacteristics?.length ? (
              <div className="flex flex-wrap gap-[0.6vh_0.5vw]">
                {diamond.clarityCharacteristics.map((c) => (
                  <CharacteristicPill key={c}>{c}</CharacteristicPill>
                ))}
              </div>
            ) : null}
          </div>
        </Cell>
        <Cell label="Cut">
          <Value>{CUT_ABBR[diamond.cut] ?? diamond.cut}</Value>
        </Cell>
      </div>
    </div>
  );
}
