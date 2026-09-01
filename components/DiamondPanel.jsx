"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";

function SpecItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] px-4 py-3.5">
      <p className="text-[10.5px] font-medium uppercase tracking-[0.13em] text-[var(--ink-faint)]">
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-lg leading-tight text-[var(--ink)]">
        {value}
      </p>
    </div>
  );
}

export default function DiamondPanel({ diamond }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
        {diamond.description}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <SpecItem label="Shape" value={diamond.shape} />
        <SpecItem label="Carat" value={`${diamond.carat.toFixed(2)} ct`} />
        <SpecItem label="Cut" value={diamond.cut} />
        <SpecItem label="Color" value={diamond.color} />
        <SpecItem label="Clarity" value={diamond.clarity} />
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mt-4 flex w-full items-center justify-between rounded-2xl border border-[var(--hairline)] px-4 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--hairline-strong)]"
      >
        Full specifications
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <Icon name="chevronDown" className="h-4 w-4 text-[var(--ink-soft)]" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <SpecItem label="Polish" value={diamond.polish} />
              <SpecItem label="Symmetry" value={diamond.symmetry} />
              <SpecItem label="Fluorescence" value={diamond.fluorescence} />
              <SpecItem label="Measurements" value={diamond.measurements} />
              <SpecItem label="Table / Depth" value={diamond.tableDepth} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
