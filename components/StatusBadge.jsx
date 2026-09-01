const STYLES = {
  verified: { bg: "var(--status-good-soft)", fg: "var(--status-good)" },
  pending: { bg: "var(--status-pending-soft)", fg: "var(--status-pending)" },
};

function styleFor(status) {
  const s = status.toLowerCase();
  if (s.includes("pending") || s.includes("progress")) return STYLES.pending;
  return STYLES.verified;
}

export default function StatusBadge({ status }) {
  const { bg, fg } = styleFor(status);
  return (
    <span
      className="inline-flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium"
      style={{ background: bg, color: fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: fg }} />
      {status}
    </span>
  );
}
