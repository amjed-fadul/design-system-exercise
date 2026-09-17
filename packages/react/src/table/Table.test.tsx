import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(cleanup);

const tableModulePath = './Table';

async function loadTableModule() {
  const module = await import(/* @vite-ignore */ tableModulePath).catch(() => null);
  expect(module, 'Table runtime module must exist').not.toBeNull();
  return module;
}

const baseRows = [
  {
    id: 'sara',
    primary: <span>Sara Ahmed</span>,
    secondary: <span>Admin</span>,
    status: <span>Active</span>,
    action: <button type="button" aria-label="View Sara Ahmed details">View</button>,
  },
  {
    id: 'omar',
    primary: <span>Omar Ali</span>,
    secondary: <span>Member</span>,
    status: <span>Invited</span>,
    action: <button type="button" aria-label="View Omar Ali details">View</button>,
  },
] as const;

describe('Table public runtime', () => {
  it('renders a real four-column native table with fixed semantic order', async () => {
    const module = await loadTableModule();
    if (!module) return;

    const { Table } = module;
    const { container } = render(<Table rows={baseRows} />);

    const table = screen.getByRole('table');
    expect(table.tagName).toBe('TABLE');
    expect(table).not.toHaveAttribute('role', 'grid');
    expect(table.querySelector('thead')).not.toBeNull();
    expect(table.querySelector('tbody')).not.toBeNull();

    const headers = within(table).getAllByRole('columnheader');
    expect(headers).toHaveLength(4);
    expect(headers.map((header) => header.textContent)).toEqual([
      'Person',
      'Role',
      'Status',
      'Details',
    ]);
    for (const header of headers) {
      expect(header).toHaveAttribute('scope', 'col');
    }

    const bodyRows = container.querySelectorAll('tbody > tr');
    expect(bodyRows).toHaveLength(2);
    for (const row of bodyRows) {
      expect(row.querySelectorAll(':scope > td')).toHaveLength(4);
    }
    expect(within(table).getByRole('button', { name: 'View Sara Ahmed details' })).toBeInTheDocument();
  });

  it('supports localized header labels and an optional supplied footer without calculating counts', async () => {
    const module = await loadTableModule();
    if (!module) return;

    const { Table } = module;
    const { container, rerender } = render(
      <Table
        rows={baseRows}
        primaryLabel="الشخص"
        secondaryLabel="الدور"
        statusLabel="الحالة"
        actionLabel="التفاصيل"
      />,
    );

    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'الشخص',
      'الدور',
      'الحالة',
      'التفاصيل',
    ]);
    expect(container.querySelector('tfoot')).toBeNull();

    rerender(
      <Table
        rows={baseRows}
        primaryLabel="الشخص"
        secondaryLabel="الدور"
        statusLabel="الحالة"
        actionLabel="التفاصيل"
        footerText="شخصان ظاهران"
      />,
    );

    const footer = container.querySelector('tfoot');
    expect(footer).not.toBeNull();
    expect(footer?.querySelector('td')).toHaveAttribute('colspan', '4');
    expect(footer).toHaveTextContent('شخصان ظاهران');
  });

  it('presents selected record context without adding bulk-selection or row-activation semantics', async () => {
    const module = await loadTableModule();
    if (!module) return;

    const { Table } = module;
    const { container } = render(
      <Table
        rows={[
          { ...baseRows[0], selected: true },
          baseRows[1],
        ]}
      />,
    );

    const [selectedRow, defaultRow] = Array.from(container.querySelectorAll('tbody > tr'));
    expect(selectedRow).toHaveAttribute('data-selected', 'true');
    expect(defaultRow).not.toHaveAttribute('data-selected');
    expect(selectedRow).not.toHaveAttribute('aria-selected');
    expect(selectedRow).not.toHaveAttribute('tabindex');
    expect(selectedRow).not.toHaveAttribute('role');
    expect(container.querySelector('input[type="checkbox"]')).toBeNull();
    expect(container.querySelector('[role="grid"]')).toBeNull();
  });

  it('keeps an explicit fourth cell even when a row has no action content', async () => {
    const module = await loadTableModule();
    if (!module) return;

    const { Table } = module;
    const { container } = render(
      <Table
        rows={[
          {
            id: 'pending',
            primary: <span>Pending invite</span>,
            secondary: <span>Member</span>,
            status: <span>Invited</span>,
          },
        ]}
      />,
    );

    const cells = container.querySelectorAll('tbody > tr > td');
    expect(cells).toHaveLength(4);
    expect(cells[3]).toBeEmptyDOMElement();
  });

  it('validates row cardinality, stable unique ids, and non-empty header labels', async () => {
    const module = await loadTableModule();
    if (!module) return;

    const { Table } = module;

    expect(() => render(<Table rows={[]} />)).toThrow(/1|one|row/i);

    const tooMany = Array.from({ length: 101 }, (_, index) => ({
      ...baseRows[0],
      id: `person-${index}`,
    }));
    expect(() => render(<Table rows={tooMany} />)).toThrow(/100|row/i);

    expect(() =>
      render(
        <Table
          rows={[
            {
              ...baseRows[0],
              id: '   ',
            },
          ]}
        />,
      ),
    ).toThrow(/id/i);

    expect(() =>
      render(
        <Table
          rows={[
            { ...baseRows[0], id: 'same' },
            { ...baseRows[1], id: 'same' },
          ]}
        />,
      ),
    ).toThrow(/unique|duplicate|id/i);

    for (const props of [
      { primaryLabel: '   ' },
      { secondaryLabel: '   ' },
      { statusLabel: '   ' },
      { actionLabel: '   ' },
    ]) {
      expect(() => render(<Table rows={baseRows} {...props} />)).toThrow(/label/i);
    }
  });

  it('inherits writing direction and fails closed for unsupported untyped feature props', async () => {
    const module = await loadTableModule();
    if (!module) return;

    const { Table } = module;
    const { container } = render(
      <div dir="rtl">
        <Table
          {...({
            children: 'forbidden',
            header: 'forbidden-header',
            sortBy: 'primary',
            page: 2,
            pageSize: 50,
            selectedRows: ['sara'],
            search: true,
            query: 'sara',
            grid: true,
            state: 'selected',
            order: 'reverse',
            theme: 'dark',
            className: 'leaked-class',
            style: { color: 'red' },
          } as any)}
          rows={baseRows}
        />
      </div>,
    );

    const table = screen.getByRole('table');
    const shell = container.querySelector('.dse-table-shell');

    expect(table).not.toHaveAttribute('dir');
    expect(table).not.toHaveAttribute('sortBy');
    expect(table).not.toHaveAttribute('page');
    expect(table).not.toHaveAttribute('theme');
    expect(shell).not.toHaveClass('leaked-class');
    expect(shell).not.toHaveStyle({ color: 'red' });
    expect(container).not.toHaveTextContent('forbidden-header');
    expect(container).not.toHaveTextContent('forbidden');

    const packageModule = await import('../index');
    expect(packageModule.Table).toBeTruthy();
    expect((packageModule as Record<string, unknown>).TableHeader).toBeUndefined();
    expect((packageModule as Record<string, unknown>).TableRow).toBeUndefined();
  });
});
