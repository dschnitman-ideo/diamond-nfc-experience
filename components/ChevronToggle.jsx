"use client";

import { motion } from "framer-motion";
import { Icon } from "./icons";

/**
 * The one disclosure affordance shared by every collapsible section in
 * the details sheet (full specifications, the diamond's story) so they
 * read as the same kind of control regardless of the label next to
 * them.
 */
export default function ChevronToggle({ expanded }) {
  return (
    <motion.span
      animate={{ rotate: expanded ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[var(--hairline)]"
    >
      <Icon name="chevronDown" className="h-3.5 w-3.5 text-[var(--ink-soft)]" />
    </motion.span>
  );
}
