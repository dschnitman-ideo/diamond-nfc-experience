"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import ShaderSweep from "@/components/ShaderSweep";
import { glowSweepPresets } from "@/components/glowSweepPresets";

export default function GlowLabPage() {
  const [activeId, setActiveId] = useState(null);
  const [playToken, setPlayToken] = useState(0);
  const [picked, setPicked] = useState(null);

  function play(id) {
    setActiveId(id);
    setPlayToken((t) => t + 1);
  }

  const activeEntry = glowSweepPresets.find((s) => s.id === activeId);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-2xl px-6 py-10 sm:px-8">
      <div className="flex items-center gap-4">
        <Link
          href="/diamond/001"
          aria-label="Back to the diamond experience"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[var(--hairline-strong)] text-[var(--ink)] transition-colors hover:border-[var(--brass)]"
        >
          <Icon name="chevronLeft" className="h-[18px] w-[18px]" />
        </Link>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            Glow lab
          </p>
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            Five sweep treatments
          </p>
        </div>
      </div>

      <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--ink-soft)]">
        Round two — one real WebGL shader (continuous falloff, chromatic
        edge, animated grain) instead of CSS gradients, with five tuning
        presets. Play them against the real photo below, mark a favorite,
        and it becomes the app's actual sweep.
      </p>

      {/* Preview stage — same near-black surface + real product photo the
          sweep actually plays over in the app, so blend mode / contrast
          reads accurately rather than against a flat placeholder. */}
      <div className="relative mt-8 aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[var(--hairline-strong)] bg-black sm:aspect-video">
        <Image
          src="/diamond-stage/001/level-1-default-cropped.png"
          alt=""
          fill
          sizes="672px"
          className="object-cover opacity-90"
        />
        {activeEntry ? (
          <ShaderSweep key={`${activeId}-${playToken}`} preset={activeEntry.preset} />
        ) : null}
        {!activeId ? (
          <p className="absolute inset-0 flex items-center justify-center text-center text-xs uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Press play on a sweep below
          </p>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {glowSweepPresets.map((sweep) => (
          <div
            key={sweep.id}
            className={`rounded-2xl border px-6 py-6 transition-colors ${
              picked === sweep.id
                ? "border-[var(--brass)] bg-[var(--brass-soft)]"
                : "border-[var(--hairline)] bg-[var(--surface-card)]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                  {sweep.name}
                </p>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[var(--ink-soft)]">
                  {sweep.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPicked((current) => (current === sweep.id ? null : sweep.id))}
                aria-pressed={picked === sweep.id}
                className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border transition-colors ${
                  picked === sweep.id
                    ? "border-[var(--brass)] bg-[var(--brass)] text-[var(--brass-ink)]"
                    : "border-[var(--hairline-strong)] text-[var(--ink-faint)] hover:border-[var(--brass)] hover:text-[var(--brass)]"
                }`}
              >
                <Icon name="check" className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => play(sweep.id)}
                className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--surface)] transition-opacity hover:opacity-90"
              >
                Play
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-[var(--hairline)] pt-6 text-sm text-[var(--ink-soft)]">
        {picked ? (
          <p>
            Current pick:{" "}
            <span className="text-[var(--brass)]">
              {glowSweepPresets.find((s) => s.id === picked)?.name}
            </span>{" "}
            — tell Claude and it&rsquo;ll wire this into LightSweep.jsx.
          </p>
        ) : (
          <p>Nothing marked yet — tap the circle on a card to mark it as your favorite.</p>
        )}
      </div>
    </div>
  );
}
