/**
 * MOCK / PROTOTYPE PROVENANCE DATA.
 *
 * This entire file is representative placeholder content standing in
 * for a real Tracr integration. None of these IDs, dates, or locations
 * refer to real shipments or real stones. Kept separate from
 * `diamonds.js` and `gia.js` so a real Tracr API can be swapped in here
 * without touching product or certification data.
 */

export const tracrRecords = {
  "001": {
    tracrId: "TRACR-MOCK-88213-NA",
    status: "Verified",
    origin: "Orapa Mine, Botswana",
    roughCarat: "3.86 ct",
    custodyChain: [
      { stage: "Mined", location: "Orapa Mine, Botswana", date: "2023-08-04" },
      { stage: "Sorted & Graded", location: "Gaborone, Botswana", date: "2023-09-12" },
      { stage: "Cut & Polished", location: "Surat, India", date: "2024-01-22" },
      { stage: "Certified", location: "GIA, New York", date: "2024-03-02" },
      { stage: "Delivered to Retailer", location: "New York, NY", date: "2024-03-28" },
    ],
  },
  "002": {
    tracrId: "TRACR-MOCK-51907-NA",
    status: "Verified",
    origin: "Diavik Mine, Canada",
    roughCarat: "4.92 ct",
    custodyChain: [
      { stage: "Mined", location: "Diavik Mine, Northwest Territories, Canada", date: "2023-05-19" },
      { stage: "Sorted & Graded", location: "Yellowknife, Canada", date: "2023-06-30" },
      { stage: "Cut & Polished", location: "Antwerp, Belgium", date: "2023-11-08" },
      { stage: "Certified", location: "GIA, New York", date: "2024-01-15" },
      { stage: "Delivered to Retailer", location: "New York, NY", date: "2024-02-04" },
    ],
  },
  "003": {
    tracrId: "TRACR-MOCK-30044-NA",
    status: "Verified",
    origin: "Argyle Mine, Australia",
    roughCarat: "4.10 ct",
    custodyChain: [
      { stage: "Mined", location: "Argyle Mine, Western Australia", date: "2022-12-11" },
      { stage: "Sorted & Graded", location: "Perth, Australia", date: "2023-02-02" },
      { stage: "Cut & Polished", location: "Surat, India", date: "2023-07-19" },
      { stage: "Certified", location: "GIA, New York", date: "2023-10-05" },
      { stage: "Delivered to Retailer", location: "New York, NY", date: "2023-10-30" },
    ],
  },
  "004": {
    tracrId: "TRACR-MOCK-67725-NA",
    status: "Pending verification",
    origin: "Ekati Mine, Canada",
    roughCarat: "2.98 ct",
    custodyChain: [
      { stage: "Mined", location: "Ekati Mine, Northwest Territories, Canada", date: "2024-02-14" },
      { stage: "Sorted & Graded", location: "Yellowknife, Canada", date: "2024-03-20" },
      { stage: "Cut & Polished", location: "Antwerp, Belgium", date: "2024-06-11" },
      { stage: "Certified", location: "GIA, New York", date: "2024-08-02" },
    ],
  },
};

export function getTracrRecord(id) {
  return tracrRecords[id] ?? null;
}
