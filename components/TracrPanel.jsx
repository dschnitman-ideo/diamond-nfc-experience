import StatusBadge from "./StatusBadge";
import { Icon } from "./icons";

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TracrPanel({ record, giaRecord }) {
  if (!record) {
    return (
      <p className="text-sm text-[var(--ink-soft)]">
        No Tracr record is available for this stone yet.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] px-4 py-3.5">
        <div>
          <p className="text-[10.5px] font-medium uppercase tracking-[0.13em] text-[var(--ink-faint)]">
            Tracr ID
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
            {record.tracrId}
          </p>
          <p className="mt-1 text-xs text-[var(--ink-faint)]">
            Registered from source on the Tracr blockchain.
          </p>
        </div>
        <StatusBadge status={record.status} />
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] px-4 py-3.5">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.13em] text-[var(--ink-faint)]">
            Origin
          </p>
          <p className="mt-1 text-[15px] text-[var(--ink)]">{record.origin}</p>
        </div>
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] px-4 py-3.5">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.13em] text-[var(--ink-faint)]">
            Rough Weight
          </p>
          <p className="mt-1 text-[15px] text-[var(--ink)]">{record.roughCarat}</p>
        </div>
      </div>

      {giaRecord ? (
        <div className="mt-2.5 flex items-center justify-between gap-4 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.13em] text-[var(--ink-faint)]">
              GIA Inscription No.
            </p>
            <p className="mt-1 truncate text-[15px] text-[var(--ink)]">
              GIA {giaRecord.reportNumber}
            </p>
          </div>
          <a
            href={giaRecord.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-none items-center gap-1.5 text-sm font-medium text-[var(--brass)] transition-colors hover:text-[var(--ink)]"
          >
            GIA report
            <Icon name="arrowUpRight" className="h-4 w-4" />
          </a>
        </div>
      ) : null}

      <p className="mb-3 mt-6 text-[10.5px] font-medium uppercase tracking-[0.13em] text-[var(--ink-faint)]">
        Chain of custody
      </p>
      <ol>
        {record.custodyChain.map((step, i) => {
          const isLast = i === record.custodyChain.length - 1;
          return (
            <li key={i} className="relative flex gap-3.5 pb-5 last:pb-0">
              {!isLast ? (
                <span className="absolute left-[5px] top-3 h-full w-px bg-[var(--hairline-strong)]" />
              ) : null}
              <span className="relative mt-1.5 h-[11px] w-[11px] flex-none rounded-full border-2 border-[var(--brass)] bg-[var(--surface)]" />
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-[var(--ink)]">{step.stage}</p>
                <p className="text-[13px] text-[var(--ink-soft)]">{step.location}</p>
                <p className="text-[12px] text-[var(--ink-faint)]">{formatDate(step.date)}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-[13px] leading-relaxed text-[var(--ink-soft)]">
        Sourced in alignment with the Kimberley Process and the OECD Due
        Diligence Guidance, verified as conflict-free from origin.
      </p>

      <p className="mt-4 text-[12px] italic text-[var(--ink-faint)]">
        Prototype data: representative Tracr information for demonstration only.
      </p>
    </div>
  );
}
