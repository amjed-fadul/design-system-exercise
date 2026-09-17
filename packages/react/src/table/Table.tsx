import type { ReactNode } from 'react';
import { TableHeader } from '../internal/table-header/TableHeader.js';
import { TableRow } from '../internal/table-row/TableRow.js';

export interface TableRowData {
  id: string;
  primary: ReactNode;
  secondary: ReactNode;
  status: ReactNode;
  action?: ReactNode;
  selected?: boolean;
}

export interface TableProps {
  rows: readonly TableRowData[];
  primaryLabel?: string;
  secondaryLabel?: string;
  statusLabel?: string;
  actionLabel?: string;
  footerText?: string;
}

export const tableDefaults = {
  primaryLabel: 'Person',
  secondaryLabel: 'Role',
  statusLabel: 'Status',
  actionLabel: 'Details',
} as const;

function assertNonEmptyString(value: unknown, name: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Table requires a non-empty ${name}.`);
  }
}

function assertRows(value: unknown): asserts value is readonly TableRowData[] {
  if (!Array.isArray(value) || value.length < 1) {
    throw new Error('Table requires at least 1 row. Use Empty State when there are no rows.');
  }
  if (value.length > 100) {
    throw new Error('Table supports at most 100 rows in C17.');
  }

  const ids = new Set<string>();
  for (const row of value) {
    if (!row || typeof row !== 'object') {
      throw new Error('Table rows must be structured row objects.');
    }

    const candidate = row as Partial<TableRowData>;
    assertNonEmptyString(candidate.id, 'row id');
    if (ids.has(candidate.id)) {
      throw new Error(`Table row ids must be unique; duplicate id: ${candidate.id}`);
    }
    ids.add(candidate.id);

    for (const requiredRegion of ['primary', 'secondary', 'status'] as const) {
      if (!(requiredRegion in row)) {
        throw new Error(`Table row ${candidate.id} is missing required ${requiredRegion} content.`);
      }
    }

    if (candidate.selected !== undefined && typeof candidate.selected !== 'boolean') {
      throw new Error(`Table row ${candidate.id} selected must be a boolean when supplied.`);
    }
  }
}

export function Table({
  rows,
  primaryLabel = tableDefaults.primaryLabel,
  secondaryLabel = tableDefaults.secondaryLabel,
  statusLabel = tableDefaults.statusLabel,
  actionLabel = tableDefaults.actionLabel,
  footerText,
}: TableProps) {
  assertRows(rows);
  assertNonEmptyString(primaryLabel, 'primary label');
  assertNonEmptyString(secondaryLabel, 'secondary label');
  assertNonEmptyString(statusLabel, 'status label');
  assertNonEmptyString(actionLabel, 'action label');

  if (footerText !== undefined && typeof footerText !== 'string') {
    throw new Error('Table footerText must be a string when supplied.');
  }
  const showFooter = typeof footerText === 'string' && footerText.trim().length > 0;

  return (
    <div className="dse-table-shell">
      <table className="dse-table">
        <colgroup>
          <col className="dse-table__col-primary" />
          <col className="dse-table__col-secondary" />
          <col className="dse-table__col-status" />
          <col className="dse-table__col-action" />
        </colgroup>

        <TableHeader
          primaryLabel={primaryLabel}
          secondaryLabel={secondaryLabel}
          statusLabel={statusLabel}
          actionLabel={actionLabel}
        />

        <tbody className="dse-table__body">
          {rows.map((row) => (
            <TableRow
              key={row.id}
              primary={row.primary}
              secondary={row.secondary}
              status={row.status}
              action={row.action}
              selected={row.selected}
            />
          ))}
        </tbody>

        {showFooter ? (
          <tfoot className="dse-table__footer">
            <tr>
              <td className="dse-table__footer-cell" colSpan={4}>
                {footerText}
              </td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}
