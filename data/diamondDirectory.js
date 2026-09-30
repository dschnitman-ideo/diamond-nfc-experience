import { getDiamonds } from "./diamonds";

/**
 * Standing in for the ~250-stone pilot batch described in the Signet/
 * GIA/Tracr rollout plan: GIA inscribes and photographs every stone
 * up front, but full product data (and this experience) only exists
 * for the rows present in the sheet (see lib/sheetDiamonds.js).
 * Everything else is a placeholder row — a report number with no
 * experience behind it yet — until that data arrives per the pilot's
 * operational flow.
 */
export const PILOT_BATCH_SIZE = 90;

function placeholderReportNumber(index) {
  // Deterministic and distinct per row — not a real GIA report number,
  // just enough to make an unbuilt row look like a pending stone
  // rather than an empty one.
  return String(4000000000 + index * 137);
}

export async function getDiamondDirectory() {
  const diamonds = await getDiamonds();
  return Array.from({ length: PILOT_BATCH_SIZE }, (_, i) => {
    const id = String(i + 1).padStart(3, "0");
    const built = diamonds.find((d) => d.id === id);
    if (built) return { ...built, available: true };
    return { id, available: false, reportNumber: placeholderReportNumber(i) };
  });
}
