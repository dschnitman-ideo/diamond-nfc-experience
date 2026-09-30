/**
 * Live diamond product data from a Google Sheet, standing in for the
 * real Signet/GIA feed this prototype's README describes. Fetched as
 * the sheet's published CSV export — no API key or auth needed, since
 * the sheet's sharing is "Anyone with the link: Viewer" — and cached
 * for REVALIDATE_SECONDS via Next's fetch cache, so an edit in the
 * sheet reaches the site on the next request after that window rather
 * than needing a redeploy.
 *
 * Falls back to `FALLBACK_DIAMONDS` in data/diamonds.js whenever the
 * sheet is unreachable, empty, or its header row doesn't match — a
 * live demo shouldn't go blank because of a network hiccup or someone
 * clearing a cell by accident.
 */

import { cache } from "react";

const SHEET_ID = "1S6WIxX1uHs7BLjG0251UgNVIe-91v06iwznScuaXT1U"; // "Diamond Pilot Batch"
// No `gid` param — that pins to a specific tab's internal id, which
// isn't reliably 0 (this sheet's, created via CSV import rather than
// the usual "New Spreadsheet" flow, isn't, and requesting the wrong
// gid 400s instead of just reading the first tab). Omitting it exports
// whichever tab is first, which is all this sheet has anyway.
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

const REVALIDATE_SECONDS = 30;

// The header row the sheet must have (any column order) for a row to
// become a diamond. `clarityCharacteristics` is the one list-valued
// column — semicolon-separated within its single cell ("Feather;
// Crystal"), not comma-separated, since commas are already the CSV
// delimiter itself.
const REQUIRED_COLUMNS = ["id", "name", "shape", "carat"];

/** A small RFC4180-ish CSV parser — handles quoted fields, embedded
    commas, and escaped quotes ("") — which Google's own CSV export
    relies on for any cell (like `description`) containing a comma. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Google's CSV export ends in a trailing newline, which the loop
  // above turns into one final all-empty row — drop it and any other
  // fully-blank row (an empty spreadsheet row) rather than treating it
  // as a stone with no data.
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function rowsToObjects(rows) {
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const obj = {};
    header.forEach((h, i) => {
      obj[h] = (r[i] ?? "").trim();
    });
    return obj;
  });
}

function toDiamond(row) {
  const carat = Number(row.carat);
  return {
    // Google Sheets auto-detects a column of "001"/"002"/… as numbers
    // and silently drops the leading zeros unless every cell in it was
    // entered as forced text — normalizing here means an id typed as
    // "6" still slots into the right spot in the 90-stone pilot batch
    // (which expects zero-padded 3-digit ids) instead of just failing
    // to match anything.
    id: row.id ? String(row.id).trim().padStart(3, "0") : "",
    name: row.name,
    shape: row.shape,
    carat: Number.isFinite(carat) ? carat : 0,
    cut: row.cut || "",
    color: row.color || "",
    clarity: row.clarity || "",
    clarityCharacteristics: row.clarityCharacteristics
      ? row.clarityCharacteristics
          .split(";")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    polish: row.polish || "",
    symmetry: row.symmetry || "",
    fluorescence: row.fluorescence || "",
    measurements: row.measurements || "",
    tableDepth: row.tableDepth || "",
    description: row.description || "",
  };
}

/**
 * Returns the sheet's diamonds, or `null` if it couldn't be read (so
 * callers fall back to the local mock set rather than showing nothing).
 * Wrapped in React's `cache()` so the several places a single page
 * render calls this (getDiamond, getAdjacentDiamonds, getDiamonds
 * itself) share one fetch and one error log instead of repeating both
 * per call site.
 */
export const fetchSheetDiamonds = cache(async function fetchSheetDiamonds() {
  try {
    const res = await fetch(CSV_URL, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`Sheet responded ${res.status}`);

    const text = await res.text();
    const rows = rowsToObjects(parseCsv(text));
    if (rows.length === 0) throw new Error("Sheet has a header row but no data rows");

    const header = Object.keys(rows[0]);
    const missing = REQUIRED_COLUMNS.filter((c) => !header.includes(c));
    if (missing.length > 0) {
      throw new Error(`Sheet is missing required column(s): ${missing.join(", ")}`);
    }

    const diamonds = rows.map(toDiamond).filter((d) => d.id && d.name);
    if (diamonds.length === 0) throw new Error("No row had both an id and a name");
    return diamonds;
  } catch (err) {
    console.error("[sheetDiamonds] Falling back to local diamond data:", err.message);
    return null;
  }
});
