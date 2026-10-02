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
    <p className="text-label font-semibold uppercase tracking-caps text-[#000000]">
      {children}
    </p>
  );
}

function Rule() {
  return <div className="h-px w-full bg-[#000000]/55" />;
}

export default function StoryPanel({ diamond, tracrRecord }) {
  const { country } = splitOrigin(tracrRecord?.origin);
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
    <div className="relative flex h-full flex-col gap-[2.2vh] pl-[clamp(20px,2.6vw,38px)] pr-[calc(clamp(20px,2.6vw,38px)+28px)] py-[clamp(18px,3vh,34px)] text-[#000000]">
      {/* Matches the 4Cs panel's own header treatment exactly: rule and
          label share one flex-none wrapper, so the parent's own
          gap-[2.2vh] doesn't ALSO fall between them on top of the
          mt-[0.7vh] below — that stacking is what made this rule and
          title sit further apart than 4Cs's rule and "4Cs" do. */}
      <div className="flex-none">
        <Rule />
        <p className="mt-[0.7vh] text-label font-semibold uppercase tracking-caps">
          This diamond has a story
        </p>
      </div>

      {/* Matches the 4Cs panel's own mark placement — bottom corner
          rather than sitting inline with the header. */}
      <DiamondMark className="absolute bottom-[clamp(18px,3vh,34px)] right-[calc(clamp(20px,2.6vw,38px)+28px)] h-[clamp(30px,4vh,46px)] w-[clamp(30px,4vh,46px)] text-[#000000]" />

      <div className="flex flex-none flex-col gap-[0.8vh]">
        <Rule />
        <Label>Country of origin</Label>
        <p className="font-[family-name:var(--font-display)] text-[min(11vh,17cqw)] leading-[0.92] tracking-[-0.02em]">
          {country ?? "—"}
        </p>
      </div>

      {/* The two photos moved down into this grid's own (previously
          empty) second column instead of crowding the title up top —
          sitting next to the header felt cramped and out of place.
          This also gives them the panel's full remaining height to
          work with instead of a small fixed thumbnail size. */}
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-x-[clamp(16px,2vw,32px)]">
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
        </div>

        <div className="flex flex-col gap-[0.8vh]">
          <Rule />
          {/* aspect-square, not stretched to fill the column's full
              remaining height — that made both photos an oddly tall
              sliver rather than a clean square crop like the reference. */}
          {/* Single-word labels, not "Polished diamond"/"Rough diamond"
              — different lengths wrapped one but not the other at this
              column width, so the images below started at different
              heights instead of lining up. */}
          <div className="flex gap-[clamp(4px,0.5vw,8px)]">
            <div className="flex min-w-0 flex-1 flex-col gap-[0.6vh]">
              <Label>Polished</Label>
              <div className="relative aspect-square w-full overflow-hidden bg-[#dfdfd7]">
                <Image
                  src={thumbnail.src}
                  alt={thumbnail.alt}
                  fill
                  sizes="(min-width: 1024px) 10vw, 22vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-[0.6vh]">
              <Label>Rough</Label>
              <div className="relative aspect-square w-full overflow-hidden bg-[#343434]">
                <Image
                  src={ROUGH_IMAGE.src}
                  alt={ROUGH_IMAGE.alt}
                  fill
                  sizes="(min-width: 1024px) 10vw, 22vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
