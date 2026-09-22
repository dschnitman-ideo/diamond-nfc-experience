/**
 * Per-diamond real-photography zoom levels for DiamondStage and
 * CompareView. Each diamond that has its own photo set gets an entry
 * here; diamonds without one fall back to "001"'s set (see
 * `getStageImages`) rather than breaking.
 */
export const diamondStageImages = {
  "001": [
    {
      src: "/diamond-stage/001/level-1-default-cropped.png",
      alt: "Diamond, full view",
      hotspot: { left: 50, top: 30 },
    },
    {
      src: "/diamond-stage/001/level-2-close.png",
      alt: "Diamond, closer view of the girdle",
      hotspot: { left: 50, top: 75 },
    },
    {
      src: "/diamond-stage/001/level-3-inscription.png",
      alt: "Diamond, closest view of the laser inscription",
    },
  ],
  "002": [
    {
      src: "/diamond-stage/002/level-1-default-cropped.png",
      alt: "Diamond, full view",
      hotspot: { left: 50, top: 30 },
    },
    {
      src: "/diamond-stage/002/level-2-close.png",
      alt: "Diamond, closer view of the girdle",
      hotspot: { left: 51, top: 58 },
    },
    {
      src: "/diamond-stage/002/level-3-inscription.png",
      alt: "Diamond, closest view of the laser inscription",
    },
  ],
};

export function getStageImages(diamondId) {
  return diamondStageImages[diamondId] ?? diamondStageImages["001"];
}
