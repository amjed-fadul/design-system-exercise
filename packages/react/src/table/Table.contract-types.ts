import type { ReactNode } from 'react';
import type { TableProps, TableRowData } from './Table';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

type ExpectedTableRowData = {
  id: string;
  primary: ReactNode;
  secondary: ReactNode;
  status: ReactNode;
  action?: ReactNode;
  selected?: boolean;
};

type ExpectedTableProps = {
  rows: readonly TableRowData[];
  primaryLabel?: string;
  secondaryLabel?: string;
  statusLabel?: string;
  actionLabel?: string;
  footerText?: string;
};

type _TableRowDataApi = Expect<Equal<TableRowData, ExpectedTableRowData>>;
type _TablePublicApi = Expect<Equal<TableProps, ExpectedTableProps>>;

// @ts-expect-error generic children are not part of the governed Table API.
const forbiddenChildren: TableProps = { rows: [], children: 'extra' };
// @ts-expect-error Header is private fixed anatomy, not a public slot.
const forbiddenHeader: TableProps = { rows: [], header: null };
// @ts-expect-error sorting is intentionally unsupported in C17.
const forbiddenSort: TableProps = { rows: [], sortBy: 'primary' };
// @ts-expect-error pagination is intentionally unsupported in C17.
const forbiddenPage: TableProps = { rows: [], page: 1 };
// @ts-expect-error bulk selection is intentionally unsupported in C17.
const forbiddenSelectedRows: TableProps = { rows: [], selectedRows: ['1'] };
// @ts-expect-error search remains outside Table.
const forbiddenQuery: TableProps = { rows: [], query: 'sara' };
// @ts-expect-error state is private/derived presentation, not a public Table prop.
const forbiddenState: TableProps = { rows: [], state: 'selected' };
// @ts-expect-error theme is inherited through semantic tokens.
const forbiddenTheme: TableProps = { rows: [], theme: 'dark' };
// @ts-expect-error generic class styling is deliberately not forwarded.
const forbiddenClassName: TableProps = { rows: [], className: 'custom' };

void forbiddenChildren;
void forbiddenHeader;
void forbiddenSort;
void forbiddenPage;
void forbiddenSelectedRows;
void forbiddenQuery;
void forbiddenState;
void forbiddenTheme;
void forbiddenClassName;
