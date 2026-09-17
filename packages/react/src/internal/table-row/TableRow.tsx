import type { ReactNode } from 'react';

interface TableRowProps {
  primary: ReactNode;
  secondary: ReactNode;
  status: ReactNode;
  action?: ReactNode;
  selected?: boolean;
}

export function TableRow({
  primary,
  secondary,
  status,
  action,
  selected = false,
}: TableRowProps) {
  return (
    <tr className="dse-table__row" data-selected={selected ? 'true' : undefined}>
      <td className="dse-table__body-cell dse-table__cell-primary">{primary}</td>
      <td className="dse-table__body-cell dse-table__cell-secondary">{secondary}</td>
      <td className="dse-table__body-cell dse-table__cell-status">{status}</td>
      <td className="dse-table__body-cell dse-table__cell-action">{action}</td>
    </tr>
  );
}
