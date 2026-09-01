import StatusBadge from "./StatusBadge";
import { Icon } from "./icons";

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function GiaPanel({ record }) {
  if (!record) {
    return (
      <p className="text-sm text-[var(--ink-soft)]">
        No GIA report is on file for this stone yet.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] px-4 py-3.5">
        <div>
          <p className="text-[10.5px] font-medium uppercase tracking-[0.13em] text-[var(--ink-faint)]">
            GIA Report Number
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
            {record.reportNumber}
          </p>
        </div>
        <StatusBadge status={record.status} />
      </div>

      <div className="mt-2.5 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] px-4 py-3.5">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.13em] text-[var(--ink-faint)]">
          Report Date
        </p>
        <p className="mt-1 text-[15px] text-[var(--ink)]">{formatDate(record.reportDate)}</p>
      </div>

      <a
        href={record.reportUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brass)] px-5 py-3.5 text-sm font-medium text-[var(--brass-ink)] transition-transform active:scale-[0.98]"
      >
        View GIA Report
        <Icon name="arrowUpRight" className="h-4 w-4" />
      </a>

      <p className="mt-4 text-[12px] italic text-[var(--ink-faint)]">
        Prototype placeholder document. Replace with the stone&rsquo;s real GIA report URL.
      </p>
    </div>
  );
}
