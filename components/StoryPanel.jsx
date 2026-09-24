"use client";

import Image from "next/image";
import DiamondMark from "./DiamondMark";
import { getThumbnail } from "@/data/diamondStageImages";
import { getDiamondStory, splitOrigin } from "@/data/diamondStories";

/**
 * "About this diamond" — the provenance story, sized to fit its panel
 * exactly once, with no scroll. Every type size is in vh-relative
 * clamps for that reason: this is a fixed one-screen board, not a
 * document, so the layout compresses with the viewport instead of
 * spilling below the fold.
 */

const ROUGH_IMAGE = {
  src: "/story/rough-diamond.png",
  alt: "The rough diamond this stone was cut from",
};

function Label({ children }) {
  return (
    <p className="text-[clamp(9px,1.05vh,11px)] font-semibold uppercase tracking-[0.1em] text-[#16150f]">
      {children}
    </p>
  );
}

function Rule() {
  return <div className="h-px w-full bg-[#16150f]/55" />;
}

export default function StoryPanel({ diamond, tracrRecord }) {
  const { mine, country } = splitOrigin(tracrRecord?.origin);
  // The "Mine" label already says it — "Orapa", not "Orapa Mine".
  const mineName = mine?.replace(/\s+Mine$/i, "");
  const thumbnail = getThumbnail(diamond.id);
  // Same per-stone figures DiamondStory quotes in full, condensed to
  // two headline facts for the panel's fixed height.
  const { formation } = getDiamondStory(diamond.id);
  const age = `${formation.ageBillions} Billion\nYears Old`;
  const depth = `${formation.depthKm} km\nUnderground`;

  return (
    // Right padding gets an extra 28px (SidePanelStack's CARD_OVERLAP) on
    // top of the usual clamp — the closed "specs" rail sits to this
    // board's right and, per the fanned-deck overlap, pulls left by that
    // same 28px and paints over it, so a plain symmetric px- here leaves
    // almost no visible gap and content reads as flush against that rail.
    <div className="flex h-full flex-col gap-[2.2vh] pl-[clamp(20px,2.6vw,38px)] pr-[calc(clamp(20px,2.6vw,38px)+28px)] py-[clamp(18px,3vh,34px)] text-[#16150f]">
      <div className="flex flex-none items-start gap-[clamp(14px,1.6vw,26px)]">
        <div className="relative aspect-square w-[min(15vh,22cqw)] flex-none overflow-hidden bg-[#dfe2da]">
          <Image
            src={thumbnail.src}
            alt={thumbnail.alt}
            fill
            sizes="150px"
            className="object-cover"
          />
        </div>
        <p className="font-[family-name:var(--font-display)] text-[min(5.2vh,8.6cqw)] leading-[1.02] tracking-[-0.01em]">
          {diamond.name} has a story.
        </p>
        <DiamondMark className="ml-auto h-[clamp(20px,2.6vh,30px)] w-[clamp(20px,2.6vh,30px)] flex-none text-[#16150f]" />
      </div>

      <div className="flex flex-none flex-col gap-[0.8vh]">
        <Rule />
        <Label>Country of origin</Label>
        <p className="font-[family-name:var(--font-display)] text-[min(11vh,17cqw)] leading-[0.92] tracking-[-0.02em]">
          {country ?? "—"}
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-x-[clamp(16px,2vw,32px)]">
        {/* Age and Temp+depth share a single flex column now, grouped
            together near the top with a modest gap between them —
            rather than each sitting in its own grid row stretched to
            share the row-span-2 rough-diamond column's full height,
            which pushed Temp+depth far down with a large dead gap
            above it. */}
        <div className="flex flex-col gap-[3vh]">
          <div className="flex flex-col gap-[0.8vh]">
            <Rule />
            <Label>Age</Label>
            <p className="whitespace-pre-line font-[family-name:var(--font-display)] text-[min(4.4vh,6.6cqw)] leading-[1.08]">
              {age}
            </p>
          </div>

          <div className="flex flex-col gap-[0.8vh]">
            <Rule />
            <Label>Temp + depth</Label>
            <p className="whitespace-pre-line font-[family-name:var(--font-display)] text-[min(4.4vh,6.6cqw)] leading-[1.08]">
              {depth}
            </p>
          </div>

          {mineName ? (
            <div className="flex flex-col gap-[0.8vh]">
              <Rule />
              <Label>Mine</Label>
              <p className="font-[family-name:var(--font-display)] text-[min(4.4vh,6.6cqw)] leading-[1.08]">
                {mineName}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-col gap-[0.8vh]">
          <Rule />
          <Label>
            Rough diamond it came from
            {tracrRecord?.roughCarat ? ` · ${tracrRecord.roughCarat}` : ""}
          </Label>
          <div className="relative min-h-0 flex-1 overflow-hidden bg-[#1d2027]">
            <Image
              src={ROUGH_IMAGE.src}
              alt={ROUGH_IMAGE.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
