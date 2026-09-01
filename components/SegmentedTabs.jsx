"use client";

import { motion } from "framer-motion";
import { Icon } from "./icons";

const TABS = [
  { id: "diamond", label: "Diamond", icon: "gem" },
  { id: "tracr", label: "Tracr", icon: "tracr" },
  { id: "gia", label: "GIA", icon: "gia" },
];

export default function SegmentedTabs({ active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Diamond information sections"
      className="flex gap-1 rounded-full border border-[var(--hairline)] bg-[var(--surface-raised)] p-1"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className="relative flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors"
            style={{ color: isActive ? "var(--brass-ink)" : "var(--ink-soft)" }}
          >
            {isActive ? (
              <motion.span
                layoutId="tab-pill"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                className="absolute inset-0 rounded-full bg-[var(--brass)]"
              />
            ) : null}
            <span className="relative flex items-center justify-center gap-1.5">
              <Icon name={tab.icon} className="h-4 w-4" />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
