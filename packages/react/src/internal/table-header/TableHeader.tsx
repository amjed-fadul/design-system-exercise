interface TableHeaderProps {
  primaryLabel: string;
  secondaryLabel: string;
  statusLabel: string;
  actionLabel: string;
}

export function TableHeader({
  primaryLabel,
  secondaryLabel,
  statusLabel,
  actionLabel,
}: TableHeaderProps) {
  return (
    <thead className="dse-table__head">
      <tr className="dse-table__header-row">
        <th className="dse-table__header-cell dse-table__cell-primary" scope="col">
          {primaryLabel}
        </th>
        <th className="dse-table__header-cell dse-table__cell-secondary" scope="col">
          {secondaryLabel}
        </th>
        <th className="dse-table__header-cell dse-table__cell-status" scope="col">
          {statusLabel}
        </th>
        <th
          className="dse-table__header-cell dse-table__header-cell-action dse-table__cell-action"
          scope="col"
        >
          {actionLabel}
        </th>
      </tr>
    </thead>
  );
}
