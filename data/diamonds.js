/**
 * Diamond product data.
 *
 * This is the primary, consumer-facing layer: the physical and
 * descriptive attributes of the stone itself. It is intentionally kept
 * separate from Tracr (provenance) and GIA (certification) data so any
 * of the three can later be swapped for a real API without touching
 * the others.
 */

export const diamonds = [
  {
    id: "001",
    name: "The Meridian",
    shape: "Round Brilliant",
    carat: 1.52,
    cut: "Excellent",
    color: "F",
    clarity: "VS1",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    measurements: "7.35 × 7.38 × 4.52 mm",
    tableDepth: "Table 58% · Depth 61.8%",
    description:
      "A round brilliant of exceptional fire, cut to return maximum light with every movement. Its near-colorless grade and excellent proportions give it a bright, lively face-up appearance.",
  },
  {
    id: "002",
    name: "The Solstice",
    shape: "Oval",
    carat: 2.01,
    cut: "Very Good",
    color: "G",
    clarity: "VVS2",
    polish: "Excellent",
    symmetry: "Very Good",
    fluorescence: "Faint",
    measurements: "9.87 × 6.92 × 4.41 mm",
    tableDepth: "Table 61% · Depth 63.4%",
    description:
      "An elongated oval with a soft, elegant silhouette. Exceptionally clean under magnification, with a warm brilliance that flatters the hand.",
  },
  {
    id: "003",
    name: "The Aurelia",
    shape: "Emerald Cut",
    carat: 1.84,
    cut: "Excellent",
    color: "D",
    clarity: "IF",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    measurements: "8.12 × 5.96 × 3.98 mm",
    tableDepth: "Table 63% · Depth 66.9%",
    description:
      "A step-cut diamond of rare purity: completely colorless and internally flawless. Its long, open facets create a hall-of-mirrors effect rather than the scatter of a brilliant cut.",
  },
  {
    id: "004",
    name: "The Cascade",
    shape: "Cushion",
    carat: 1.35,
    cut: "Very Good",
    color: "H",
    clarity: "VS2",
    polish: "Very Good",
    symmetry: "Very Good",
    fluorescence: "None",
    measurements: "6.84 × 6.71 × 4.35 mm",
    tableDepth: "Table 60% · Depth 64.8%",
    description:
      "A cushion cut with rounded corners and a soft, pillowy brilliance. Its warmer color grade gives the stone a gentle, candlelit glow.",
  },
];

export function getDiamond(id) {
  return diamonds.find((d) => d.id === id) ?? null;
}

const COLOR_ORDER = "DEFGHIJKLMNOPQRSTUVWXYZ";

/** Colorless grades render bright/blue-white; K and warmer render with a faint tint. */
export function getColorTint(colorGrade) {
  return COLOR_ORDER.indexOf(colorGrade) <= 9 ? "colorless" : "warm";
}

export function getAdjacentDiamonds(id) {
  const index = diamonds.findIndex((d) => d.id === id);
  if (index === -1) return { prev: null, next: null };
  const prev = diamonds[(index - 1 + diamonds.length) % diamonds.length];
  const next = diamonds[(index + 1) % diamonds.length];
  return { prev, next };
}
