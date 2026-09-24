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

/**
 * Square close-up crops for StoryPanel's header thumbnail, one per
 * diamond. 001 and 002 are cropped from their own close-ups; 003 and
 * 004 have no photography yet, so theirs borrow 001's inscription shot
 * and a mirrored 002 close-up, with the laser inscription blurred out
 * so neither shows another stone's GIA number — swap in real crops
 * once those stones are photographed.
 */
const THUMBNAILS = {
  "001": "/diamond-stage/001/thumbnail-wide.jpg",
  "002": "/diamond-stage/002/thumbnail-wide.jpg",
  "003": "/diamond-stage/003/thumbnail-wide.jpg",
  "004": "/diamond-stage/004/thumbnail-wide.jpg",
};

export function getThumbnail(diamondId) {
  return {
    src: THUMBNAILS[diamondId] ?? THUMBNAILS["001"],
    alt: "Close-up of the diamond's facets",
  };
}
