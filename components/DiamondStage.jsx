"use client";

import { useRef, useState } from "react";
import DiamondArt from "./DiamondArt";

const VIEWS = [
  { id: "face", label: "Face-up", tilt: 0 },
  { id: "profile", label: "Profile", tilt: -40 },
  { id: "table", label: "Angled", tilt: 22 },
];

export default function DiamondStage({ shape, tint }) {
  const [viewIndex, setViewIndex] = useState(0);
  const [dragTilt, setDragTilt] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);

  const baseTilt = VIEWS[viewIndex].tilt;
  const tilt = Math.max(-70, Math.min(70, baseTilt + dragTilt));

  function onPointerDown(e) {
    e.preventDefault();
    setDragging(true);
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragging) return;
    setDragTilt((e.clientX - startX.current) * 0.35);
  }
  function endDrag() {
    setDragging(false);
    setDragTilt(0);
  }

  return (
    <div className="select-none">
      <div
        className="relative aspect-[4/5] w-full touch-pan-y overflow-hidden rounded-[28px] border border-[var(--hairline)]"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 18%, var(--surface-raised) 0%, var(--surface) 72%)",
          cursor: dragging ? "grabbing" : "grab",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={dragging ? endDrag : undefined}
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-12">
          <DiamondArt
            shape={shape}
            tint={tint}
            tilt={tilt}
            instant={dragging}
            className="h-full w-full max-w-[300px]"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {VIEWS.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setViewIndex(i)}
            aria-label={`Show ${v.label} view`}
            aria-current={i === viewIndex}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === viewIndex ? 22 : 6,
              background: i === viewIndex ? "var(--brass)" : "var(--hairline-strong)",
            }}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
        Drag to rotate · {VIEWS[viewIndex].label}
      </p>
    </div>
  );
}
