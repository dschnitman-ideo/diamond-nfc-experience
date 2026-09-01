"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { diamonds } from "@/data/diamonds";
import { Icon } from "./icons";

const TABS = ["diamond", "tracr", "gia"];

/**
 * Dev-only controls for driving this prototype. Deliberately styled as
 * an unmistakable "backstage" console (monospace, high-contrast lime
 * on black) and kept as a small closed footprint so it doesn't sit on
 * top of the consumer-facing product content underneath it.
 */
export default function PrototypeControls({ currentId, onJumpTab, onReplay, onReset }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col-reverse items-end gap-2 font-mono text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close prototype controls" : "Open prototype controls"}
        aria-expanded={open}
        className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-dashed border-lime-400/50 bg-black text-lime-300 shadow-lg shadow-black/50"
      >
        <Icon name={open ? "close" : "settings"} className="h-4 w-4" />
      </button>

      {open ? (
        <div className="w-64 rounded-xl border border-dashed border-lime-400/40 bg-black p-3 text-lime-200 shadow-lg shadow-black/50">
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-lime-400/70">
            Sample diamonds
          </p>
          <div className="flex flex-wrap gap-1.5">
            {diamonds.map((d) => (
              <button
                key={d.id}
                onClick={() => router.push(`/diamond/${d.id}`)}
                className={`rounded-md border px-2 py-1 transition-colors ${
                  d.id === currentId
                    ? "border-lime-300 bg-lime-400/10 text-lime-100"
                    : "border-lime-400/30 hover:border-lime-400/60"
                }`}
              >
                {d.id}
              </button>
            ))}
          </div>

          <p className="mb-1.5 mt-3 text-[10px] uppercase tracking-wider text-lime-400/70">
            Jump to tab
          </p>
          <div className="flex gap-1.5">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => onJumpTab(t)}
                className="flex-1 rounded-md border border-lime-400/30 px-2 py-1 capitalize hover:border-lime-400/60"
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-1.5">
            <button
              onClick={onReplay}
              className="rounded-md border border-lime-400/30 px-2 py-1.5 text-left hover:border-lime-400/60"
            >
              Replay recognition
            </button>
            <button
              onClick={onReset}
              className="rounded-md border border-lime-400/30 px-2 py-1.5 text-left hover:border-lime-400/60"
            >
              Reset experience
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
