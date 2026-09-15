"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";
import ChevronToggle from "./ChevronToggle";
import ImageLightbox from "./ImageLightbox";
import { getStageImages } from "@/data/diamondStageImages";

// Verbatim from the reference frame (Frame 2.pdf).
const FORMATION_STATS = [
  { value: "1–3.5", label: "Billion years ago" },
  { value: "200", label: "Kilometres underground" },
  { value: "1,500", label: "Degrees celsius" },
  { value: "50,000", label: "Atmospheres of pressure" },
];

function splitOrigin(origin) {
  if (!origin) return { mine: null, country: null };
  const parts = origin.split(",").map((p) => p.trim());
  return { mine: parts[0], country: parts[parts.length - 1] };
}

// Real photography standing in for the reference frame's "pull image
// from Tracr Data" placeholders — the eye/nails and rust-toned rough
// stone pair the headline, the boulders illustrate the origin/mine
// story, and the rough stone itself illustrates "The rough."
const STORY_IMAGES = {
  eye: { src: "/story/eye-nails.png", alt: "A hand near an eye, nails painted sage green" },
  roughOnRust: { src: "/story/rough-on-rust-v2.png", alt: "A rough diamond on a rust-colored surface" },
  boulders: { src: "/story/boulders.png", alt: "Sunlit boulders in a desert landscape" },
  roughStone: { src: "/story/rough-diamond.png", alt: "A clear rough diamond on a dark surface" },
};

/**
 * Stand-in for real Tracr/GIA-sourced photography (a hand near an eye,
 * rough terrain, the rough stone itself) — swap for real assets once
 * sourced, same as the "pull image from Tracr Data" placeholders in
 * the reference frame. Not wired to the lightbox — there's no real
 * photo behind it yet to blow up.
 */
function PlaceholderArt({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-[#d3d5cc] ${className}`}
    >
      <Icon name="gem" className="h-6 w-6 text-[#9a9689]" />
    </div>
  );
}

/**
 * A real photo, inset and rounded like the rest of the sheet's
 * content — tapping it opens the same image enlarged (ImageLightbox),
 * which is where the "bigger, more dramatic" look belongs, not inline.
 */
function StoryPhoto({ image, aspect, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(image)}
      aria-label={`View larger: ${image.alt}`}
      className={`relative block w-full overflow-hidden rounded-2xl bg-[var(--surface-raised)] ${aspect}`}
    >
      <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 440px, 92vw" className="object-cover" />
    </button>
  );
}

/**
 * The provenance narrative — formation, origin, rough-to-polished
 * journey — from the reference frame (Frame 2.pdf), copy kept as close
 * to that source text as makes sense in-product. Open by default, same
 * disclosure control as DiamondPanel's "Full specifications" — the
 * viewer can still collapse it, but nothing here is hidden by default.
 */
export default function DiamondStory({ diamond, tracrRecord }) {
  const [expanded, setExpanded] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);
  const { mine, country } = splitOrigin(tracrRecord?.origin);
  const polishedImage = getStageImages(diamond.id)[1];

  return (
    <div>
      <div className="mx-auto max-w-2xl px-7">
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex w-full items-start justify-between gap-4 text-left"
        >
          <p className="font-[family-name:var(--font-display)] text-[2.3rem] leading-[1.02] text-[var(--ink)]">
            This diamond has a story, just like you.
          </p>
          <div className="mt-1">
            <ChevronToggle expanded={expanded} />
          </div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-auto max-w-2xl space-y-6 px-7">
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <StoryPhoto image={STORY_IMAGES.eye} aspect="aspect-square" onOpen={setLightboxImage} />
                <StoryPhoto
                  image={STORY_IMAGES.roughOnRust}
                  aspect="aspect-square"
                  onOpen={setLightboxImage}
                />
              </div>

              <div className="rounded-2xl bg-[#bfbfb1] p-5">
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  {FORMATION_STATS.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-[family-name:var(--font-display)] text-2xl leading-none text-[var(--ink)]">
                        {stat.value}
                      </p>
                      <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.1em] leading-snug text-[var(--ink-faint)]">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                  It is ancient
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink-soft)]">
                  A natural diamond is formed in the Earth over billions of
                  years. It is one of the oldest things you&rsquo;ll ever
                  hold. It formed 200km underground.
                </p>
              </div>

              {country ? (
                <div>
                  <div className="mb-5 h-px bg-[var(--hairline)]" />
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                    Country of origin
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-[3.5rem] leading-[0.92] text-[var(--ink)]">
                    {country}
                  </p>
                  {mine ? (
                    <>
                      <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                        Mined in
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-display)] text-[2.4rem] leading-none text-[var(--ink)]">
                        {mine}
                      </p>
                    </>
                  ) : null}
                </div>
              ) : null}

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                  Where it&rsquo;s from
                </p>
                <div className="mt-1.5 space-y-3 text-[13px] leading-relaxed text-[var(--ink-soft)]">
                  <p>
                    This diamond is a DTC diamond. A DTC diamond refers to a
                    diamond sourced, sorted, and sold through the Diamond
                    Trading Company (DTC), which is the historic rough
                    diamond distribution and sales arm of the De Beers Group.
                  </p>
                  <p>
                    Diamonds from DTC are discovered in Botswana, Canada,
                    Namibia and South Africa.
                  </p>
                  <p>
                    DTC diamonds are sourced in alignment with the
                    Organisation of Economic Cooperation and
                    Development&rsquo;s (OECD) Due Diligence Guidance.
                  </p>
                  <p>
                    It is fully compliant with the Kimberley Process (KP),
                    which was established in 2003 to eradicate the trade in
                    conflict diamonds and is supported by governments,
                    diamond industry participants, customs authorities and
                    civil society groups.
                  </p>
                </div>
                <div className="mt-3">
                  <StoryPhoto
                    image={STORY_IMAGES.boulders}
                    aspect="aspect-[1223/1190]"
                    onOpen={setLightboxImage}
                  />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                  The rough
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink-soft)]">
                  A rough diamond is how the diamond comes out of the earth
                  and then is cut and polished to reveal the diamond in
                  front of you. Ask your retailer for more details on
                  seeing the rough stone in kimberlite.
                </p>
                <div className="mt-3">
                  <StoryPhoto
                    image={STORY_IMAGES.roughStone}
                    aspect="aspect-[1125/881]"
                    onOpen={setLightboxImage}
                  />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                  The polished stone
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink-soft)]">
                  This diamond has been crafted with care and precision. It
                  is a true masterpiece of nature, created billions of years
                  ago, embodying the enduring strength, beauty and
                  craftsmanship that has captivated and inspired us for
                  centuries.
                </p>
                {polishedImage ? (
                  <div className="mt-3">
                    <StoryPhoto
                      image={polishedImage}
                      aspect="aspect-[4/3]"
                      onOpen={setLightboxImage}
                    />
                  </div>
                ) : null}
              </div>

              <div>
                <div className="mb-6 h-px bg-[var(--hairline)]" />
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                  Cutting &amp; polishing
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink-soft)]">
                  The stone is planned and sawn with high precision and
                  shaped towards its final form. During the cutting process
                  the diamond is continually checked and rechecked to ensure
                  that it is matching its plan.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <PlaceholderArt className="aspect-square" />
                  <PlaceholderArt className="aspect-square" />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
