"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { diamonds } from "@/data/diamonds";
import { Icon } from "./icons";

/**
 * Dev-only controls for driving this prototype. Deliberately styled as
 * an unmistakable "backstage" console (monospace, high-contrast Electric Lavender
 * on black) and kept as a small closed footprint so it doesn't sit on
 * top of the consumer-facing product content underneath it.
 */
export default function PrototypeControls({ currentId, onOpenDetails, onReplay, onReset }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col-reverse items-end gap-2 font-mono text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close prototype controls" : "Open prototype controls"}
        aria-expanded={open}
        className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-dashed border-[#ccb6e4]/50 bg-black text-[#ccb6e4] shadow-lg shadow-black/50"
      >
        <Icon name={open ? "close" : "settings"} className="h-4 w-4" />
      </button>

      {open ? (
        <div className="w-64 rounded-xl border border-dashed border-[#ccb6e4]/40 bg-black p-3 text-[#ccb6e4] shadow-lg shadow-black/50">
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-[#ccb6e4]/70">
            Sample diamonds
          </p>
          <div className="flex flex-wrap gap-1.5">
            {diamonds.map((d) => (
              <button
                key={d.id}
                onClick={() => router.push(`/diamond/${d.id}`)}
                className={`rounded-md border px-2 py-1 transition-colors ${
                  d.id === currentId
                    ? "border-[#ccb6e4] bg-[#ccb6e4]/10 text-[#ccb6e4]"
                    : "border-[#ccb6e4]/30 hover:border-[#ccb6e4]/60"
                }`}
              >
                {d.id}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-1.5">
            <button
              onClick={onOpenDetails}
              className="rounded-md border border-[#ccb6e4]/30 px-2 py-1.5 text-left hover:border-[#ccb6e4]/60"
            >
              Open details
            </button>
            <button
              onClick={onReplay}
              className="rounded-md border border-[#ccb6e4]/30 px-2 py-1.5 text-left hover:border-[#ccb6e4]/60"
            >
              Replay recognition
            </button>
            <button
              onClick={onReset}
              className="rounded-md border border-[#ccb6e4]/30 px-2 py-1.5 text-left hover:border-[#ccb6e4]/60"
            >
              Reset experience
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
