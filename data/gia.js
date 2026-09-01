/**
 * GIA report metadata + document URLs.
 *
 * `reportUrl` points at a placeholder PDF for this prototype
 * (`/public/gia/sample-report.pdf`). Replace with the real GIA report
 * URL per stone when this goes live — everything else on the GIA tab
 * is just enough metadata to identify and trust the report, not a
 * recreation of the report itself.
 */

export const giaRecords = {
  "001": {
    reportNumber: "2245789631",
    status: "Verified",
    reportDate: "2024-03-02",
    reportUrl: "/gia/sample-report.pdf",
  },
  "002": {
    reportNumber: "6209187423",
    status: "Verified",
    reportDate: "2024-01-15",
    reportUrl: "/gia/sample-report.pdf",
  },
  "003": {
    reportNumber: "1173390582",
    status: "Verified",
    reportDate: "2023-10-05",
    reportUrl: "/gia/sample-report.pdf",
  },
  "004": {
    reportNumber: "5540298871",
    status: "In progress",
    reportDate: "2024-08-02",
    reportUrl: "/gia/sample-report.pdf",
  },
};

export function getGiaRecord(id) {
  return giaRecords[id] ?? null;
}
