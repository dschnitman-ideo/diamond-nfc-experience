"use client";

/* Phosphor icon set, wrapped behind the same <Icon name="..."/> API the
   rest of the app already uses, so no call site needs to change. */

import {
  CaretLeft,
  CaretRight,
  CaretDown,
  X,
  Export,
  Sparkle,
  ShieldCheck,
  Network,
  Diamond,
  DownloadSimple,
  ArrowUpRight,
  GearSix,
  Check,
  ArrowsClockwise,
  SealCheck,
} from "@phosphor-icons/react";

const ICONS = {
  chevronLeft: CaretLeft,
  chevronRight: CaretRight,
  chevronDown: CaretDown,
  close: X,
  share: Export,
  sparkle: Sparkle,
  gia: ShieldCheck,
  tracr: Network,
  gem: Diamond,
  download: DownloadSimple,
  arrowUpRight: ArrowUpRight,
  settings: GearSix,
  check: Check,
  refresh: ArrowsClockwise,
  trustMark: SealCheck,
};

export function Icon({ name, className = "", weight = "regular" }) {
  const Component = ICONS[name];
  if (!Component) return null;
  return <Component className={className} weight={weight} aria-hidden="true" />;
}
