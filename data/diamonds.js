/**
 * Diamond product data.
 *
 * This is the primary, consumer-facing layer: the physical and
 * descriptive attributes of the stone itself. It is intentionally kept
 * separate from Tracr (provenance) and GIA (certification) data so any
 * of the three can later be swapped for a real API without touching
 * the others.
 *
 * Live-edited from a Google Sheet (see lib/sheetDiamonds.js) rather
 * than hardcoded here — the fallback set (data/fallbackDiamonds.js) is
 * only what's used when that sheet is unreachable. `getDiamonds`/
 * `getDiamond`/`getAdjacentDiamonds` are async for that reason; every
 * caller reads through them rather than importing an array directly.
 */

import { fetchSheetDiamonds } from "@/lib/sheetDiamonds";
import { FALLBACK_DIAMONDS } from "./fallbackDiamonds";

export async function getDiamonds() {
  const sheetDiamonds = await fetchSheetDiamonds();
  return sheetDiamonds ?? FALLBACK_DIAMONDS;
}

export async function getDiamond(id) {
  const all = await getDiamonds();
  return all.find((d) => d.id === id) ?? null;
}

export async function getAdjacentDiamonds(id) {
  const all = await getDiamonds();
  const index = all.findIndex((d) => d.id === id);
  if (index === -1) return { prev: null, next: null };
  const prev = all[(index - 1 + all.length) % all.length];
  const next = all[(index + 1) % all.length];
  return { prev, next };
}
