"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { soundPairings } from "@/lib/soundPairings";
import { vibrate } from "@/lib/feedback";

// Mirrors the real gap between "recognized" firing and the viewer's
// first tap in DiamondExperience/DiamondStage, so "Play sequence"
// previews the two chimes at roughly the spacing they'd actually have.
const SEQUENCE_GAP_MS = 700;

function PairingCard({ pairing, picked, onPick }) {
  return (
    <div
      className={`rounded-2xl border px-6 py-6 transition-colors ${
        picked
          ? "border-[var(--brass)] bg-[var(--brass-soft)]"
          : "border-[var(--hairline)] bg-[var(--surface-card)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            {pairing.name}
          </p>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[var(--ink-soft)]">
            {pairing.description}
          </p>
        </div>
        <button
          type="button"
          onClick={onPick}
          aria-pressed={picked}
          className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border transition-colors ${
            picked
              ? "border-[var(--brass)] bg-[var(--brass)] text-[var(--brass-ink)]"
              : "border-[var(--hairline-strong)] text-[var(--ink-faint)] hover:border-[var(--brass)] hover:text-[var(--brass)]"
          }`}
        >
          <Icon name="check" className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => {
            pairing.playRecognition();
            vibrate([12, 40, 16]);
          }}
          className="rounded-full border border-[var(--hairline-strong)] px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--ink)] transition-colors hover:border-[var(--brass)]"
        >
          Recognition
        </button>
        <button
          type="button"
          onClick={() => {
            pairing.playZoom();
            vibrate(18);
          }}
          className="rounded-full border border-[var(--hairline-strong)] px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--ink)] transition-colors hover:border-[var(--brass)]"
        >
          Zoom
        </button>
        <button
          type="button"
          onClick={() => {
            pairing.playRecognition();
            vibrate([12, 40, 16]);
            setTimeout(() => {
              pairing.playZoom();
              vibrate(18);
            }, SEQUENCE_GAP_MS);
          }}
          className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--surface)] transition-opacity hover:opacity-90"
        >
          Play sequence
        </button>
      </div>
    </div>
  );
}

export default function SoundLabPage() {
  const [picked, setPicked] = useState(null);
  const pickedPairing = soundPairings.find((p) => p.id === picked);

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
            Sound lab
          </p>
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            Five premium pairings
          </p>
        </div>
      </div>

      <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--ink-soft)]">
        Each pairing has its own recognition chime (the stone's first tap)
        and zoom chime (each step deeper into the facets), tuned to share
        one voice. Play them side by side, mark the one that feels most
        premium, and it becomes the app's actual sound.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {soundPairings.map((pairing) => (
          <PairingCard
            key={pairing.id}
            pairing={pairing}
            picked={picked === pairing.id}
            onPick={() => setPicked((current) => (current === pairing.id ? null : pairing.id))}
          />
        ))}
      </div>

      <div className="mt-8 border-t border-[var(--hairline)] pt-6 text-sm text-[var(--ink-soft)]">
        {pickedPairing ? (
          <p>
            Current pick: <span className="text-[var(--brass)]">{pickedPairing.name}</span> — tell
            Claude and it'll wire this into the real experience.
          </p>
        ) : (
          <p>Nothing marked yet — tap the circle on a card to mark it as your favorite.</p>
        )}
      </div>
    </div>
  );
}
