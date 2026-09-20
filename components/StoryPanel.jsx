"use client";

import Image from "next/image";
import DiamondMark from "./DiamondMark";
import { getStageImages } from "@/data/diamondStageImages";

/**
 * "About this diamond" — the provenance story, sized to fit its panel
 * exactly once, with no scroll. Every type size is in vh-relative
 * clamps for that reason: this is a fixed one-screen board, not a
 * document, so the layout compresses with the viewport instead of
 * spilling below the fold.
 */

// The stone's own formation numbers aren't per-diamond in the data
// yet — these are the same figures DiamondStory quotes, condensed to
// two headline facts for the panel's fixed height.
const AGE = "1–3 Billion\nYears Old";
const DEPTH = "200 km\nUnderground";

const ROUGH_IMAGE = {
  src: "/story/rough-diamond.png",
  alt: "The rough diamond this stone was cut from",
};

function splitOrigin(origin) {
  if (!origin) return { mine: null, country: null };
  const parts = origin.split(",").map((p) => p.trim());
  return { mine: parts[0], country: parts[parts.length - 1] };
}

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
  const { country } = splitOrigin(tracrRecord?.origin);
  const polished = getStageImages(diamond.id)[0];

  return (
    <div className="flex h-full flex-col gap-[2.2vh] px-[clamp(20px,2.6vw,38px)] py-[clamp(18px,3vh,34px)] text-[#16150f]">
      <div className="flex flex-none items-start gap-[clamp(14px,1.6vw,26px)]">
        <div className="relative aspect-square w-[min(15vh,22cqw)] flex-none overflow-hidden bg-[#dfe2da]">
          <Image
            src={polished.src}
            alt={polished.alt}
            fill
            sizes="150px"
            className="object-cover"
          />
        </div>
        <p className="font-[family-name:var(--font-display)] text-[min(5.2vh,8.6cqw)] leading-[1.02] tracking-[-0.01em]">
          This diamond has a story.
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

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-x-[clamp(16px,2vw,32px)] gap-y-[2vh]">
        <div className="flex flex-col gap-[0.8vh]">
          <Rule />
          <Label>Age</Label>
          <p className="whitespace-pre-line font-[family-name:var(--font-display)] text-[min(4.4vh,6.6cqw)] leading-[1.08]">
            {AGE}
          </p>
        </div>

        <div className="row-span-2 flex min-h-0 flex-col gap-[0.8vh]">
          <Rule />
          <Label>Rough diamond it came from</Label>
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

        <div className="flex flex-col gap-[0.8vh] self-end">
          <Rule />
          <Label>Temp + depth</Label>
          <p className="whitespace-pre-line font-[family-name:var(--font-display)] text-[min(4.4vh,6.6cqw)] leading-[1.08]">
            {DEPTH}
          </p>
        </div>
      </div>
    </div>
  );
}
