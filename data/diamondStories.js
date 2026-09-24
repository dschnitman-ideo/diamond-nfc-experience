/**
 * MOCK / PROTOTYPE STORY DATA.
 *
 * The per-stone narrative behind StoryPanel and DiamondStory: how and
 * where each diamond formed, and who brought it out of the ground.
 * Formation figures are representative of each mine's geology, not
 * measurements of these specific (fictional) stones. Mine, rough
 * weight and cutting details come from `tracr.js` instead, so a real
 * Tracr integration can replace those without touching this file.
 */

export const diamondStories = {
  "001": {
    formation: { ageBillions: "2.9", depthKm: "180", tempC: "1,250", pressureAtm: "55,000" },
    source: [
      "This diamond was mined by Debswana, a partnership between the Government of Botswana and De Beers, and sold through De Beers’ sightholder sales — the rough diamond distribution arm historically known as the Diamond Trading Company (DTC).",
      "Orapa, in the Kalahari of central Botswana, is one of the largest diamond mines in the world by area.",
    ],
  },
  "002": {
    formation: { ageBillions: "3.3", depthKm: "200", tempC: "1,300", pressureAtm: "60,000" },
    source: [
      "This diamond comes from Diavik, in the Lac de Gras region of Canada’s Northwest Territories, roughly 220 km south of the Arctic Circle.",
      "The mine sits on islands in a sub-Arctic lake, reached by winter ice road. Canadian diamonds can be traced from mine to market under the Canadian Diamond Code of Conduct.",
    ],
  },
  "003": {
    formation: { ageBillions: "1.6", depthKm: "150", tempC: "1,150", pressureAtm: "45,000" },
    source: [
      "This diamond comes from Argyle, in the remote Kimberley region of Western Australia.",
      "Argyle is one of the few major diamond sources carried to the surface in lamproite rather than kimberlite, and is best known for the rare pink diamonds found alongside stones like this one.",
    ],
  },
  "004": {
    formation: { ageBillions: "3.5", depthKm: "210", tempC: "1,350", pressureAtm: "65,000" },
    source: [
      "This diamond comes from Ekati, Canada’s first diamond mine, opened in 1998 in the Lac de Gras region of the Northwest Territories.",
      "Its diamonds formed beneath the Slave Craton, some of the oldest continental crust on Earth.",
    ],
  },
};

// Every stone in the mock set is sourced to these same standards, so
// this closes out each diamond's own sourcing copy rather than being
// repeated in every entry.
export const SHARED_SOURCING = [
  "It was sourced in alignment with the Organisation for Economic Co-operation and Development’s (OECD) Due Diligence Guidance.",
  "It is fully compliant with the Kimberley Process (KP), established in 2003 to eradicate the trade in conflict diamonds and supported by governments, diamond industry participants, customs authorities and civil society groups.",
];

export function getDiamondStory(id) {
  return diamondStories[id] ?? diamondStories["001"];
}

/** Splits a Tracr origin like "Orapa Mine, Botswana" into its parts. */
export function splitOrigin(origin) {
  if (!origin) return { mine: null, country: null };
  const parts = origin.split(",").map((p) => p.trim());
  return { mine: parts[0], country: parts[parts.length - 1] };
}

/** The custody-chain step for a given stage ("Cut & Polished", …), if any. */
export function getCustodyStep(tracrRecord, stage) {
  return tracrRecord?.custodyChain?.find((step) => step.stage === stage) ?? null;
}

/** "2024-01-22" → "January 2024". */
export function formatMonthYear(isoDate) {
  if (!isoDate) return null;
  const [year, month] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
