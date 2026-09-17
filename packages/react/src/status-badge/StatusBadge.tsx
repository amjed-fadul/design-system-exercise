export interface StatusBadgeProps {
  label: string;
}

function assertNonEmptyLabel(label: string) {
  if (typeof label !== 'string' || label.trim().length === 0) {
    throw new Error('StatusBadge requires a non-empty label.');
  }
}

export function StatusBadge({ label }: StatusBadgeProps) {
  assertNonEmptyLabel(label);

  return <span className="dse-status-badge">{label}</span>;
}
