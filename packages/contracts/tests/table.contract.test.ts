import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const tableContractPath = fileURLToPath(
  new URL('../components/table.contract.json', import.meta.url),
);
const headerContractPath = fileURLToPath(
  new URL('../components/_table-header.contract.json', import.meta.url),
);
const rowContractPath = fileURLToPath(
  new URL('../components/_table-row.contract.json', import.meta.url),
);

function readContract(path: string) {
  expect(existsSync(path)).toBe(true);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.table contract', () => {
  it('locks the public Table source and fixed four-column API', () => {
    const contract = readContract(tableContractPath);
    if (!contract) return;

    expect(contract.id).toBe('dse.table');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '152:3730',
    });
    expect(contract.sources.implementationPackage).toBe('@design-system-exercise/react');

    expect(propFor(contract, 'rows')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
    expect(propFor(contract, 'primaryLabel')).toEqual(
      expect.objectContaining({ required: false, default: 'Person' }),
    );
    expect(propFor(contract, 'secondaryLabel')).toEqual(
      expect.objectContaining({ required: false, default: 'Role' }),
    );
    expect(propFor(contract, 'statusLabel')).toEqual(
      expect.objectContaining({ required: false, default: 'Status' }),
    );
    expect(propFor(contract, 'actionLabel')).toEqual(
      expect.objectContaining({ required: false, default: 'Details' }),
    );
    expect(propFor(contract, 'footerText')).toEqual(
      expect.objectContaining({ required: false }),
    );

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const forbidden of [
      'children',
      'header',
      'sort',
      'sortBy',
      'pagination',
      'page',
      'pageSize',
      'bulkSelection',
      'selectedRows',
      'search',
      'query',
      'grid',
    ]) {
      expect(publicNames).not.toContain(forbidden);
    }
  });

  it('requires native table semantics and keeps selection contextual rather than bulk-selection behavior', () => {
    const contract = readContract(tableContractPath);
    if (!contract) return;

    expect(contract.semantics.element).toMatch(/native table/i);
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/one.*100 rows|1.*100 rows/i),
        expect.stringMatching(/four.*column|four.*region/i),
        expect.stringMatching(/selected.*detail|detail.*selected/i),
        expect.stringMatching(/not.*bulk|bulk.*not/i),
        expect.stringMatching(/hover.*css|css.*hover/i),
      ]),
    );
    expect(contract.forbidden).toEqual(
      expect.arrayContaining([
        'sorting',
        'pagination',
        'bulk selection',
        'search',
        'data grid semantics',
      ]),
    );
  });
});

describe('dse._table-header contract', () => {
  it('stays internal and owns exactly four semantic column headers', () => {
    const contract = readContract(headerContractPath);
    if (!contract) return;

    expect(contract.id).toBe('dse._table-header');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('internal');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '152:3685',
    });
    expect(contract.sources.implementationPackage).toBeUndefined();

    expect(propFor(contract, 'primaryLabel')).toBeTruthy();
    expect(propFor(contract, 'secondaryLabel')).toBeTruthy();
    expect(propFor(contract, 'statusLabel')).toBeTruthy();
    expect(propFor(contract, 'actionLabel')).toBeTruthy();
    expect(contract.semantics.element).toMatch(/thead|column header/i);
    expect(contract.forbidden).toEqual(
      expect.arrayContaining(['sorting', 'select all', 'public package export']),
    );
  });
});

describe('dse._table-row contract', () => {
  it('stays internal and maps default/hover/selected presentation without exposing a state enum', () => {
    const contract = readContract(rowContractPath);
    if (!contract) return;

    expect(contract.id).toBe('dse._table-row');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('internal');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '152:3729',
    });
    expect(contract.sources.implementationPackage).toBeUndefined();

    for (const name of ['primary', 'secondary', 'status', 'action', 'selected']) {
      expect(propFor(contract, name)).toBeTruthy();
    }
    expect(propFor(contract, 'state')).toBeUndefined();
    expect(contract.states).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'hover', ownership: 'derived' }),
        expect.objectContaining({ name: 'selected', ownership: 'public' }),
      ]),
    );
    expect(contract.forbidden).toEqual(
      expect.arrayContaining([
        'state',
        'bulk selection',
        'row activation',
        'public package export',
      ]),
    );
  });
});
