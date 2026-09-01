"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";

export default function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled — no-op */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        aria-label="Share this diamond"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink)] transition-colors hover:border-[var(--hairline-strong)]"
      >
        <Icon name="share" className="h-[18px] w-[18px]" />
      </button>
      <AnimatePresence>
        {copied ? (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute right-0 top-12 whitespace-nowrap rounded-full border border-[var(--hairline)] bg-[var(--surface-raised)] px-3 py-1.5 text-xs text-[var(--ink)]"
          >
            Link copied
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
