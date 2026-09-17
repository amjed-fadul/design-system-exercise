import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(process.cwd(), '../contracts/components/table.contract.json');
const tableModulePath = './Table';

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string): any {
  return contract.publicApi.props.find((prop: any) => prop.name === name);
}

async function loadTableModule() {
  const module = await import(/* @vite-ignore */ tableModulePath).catch(() => null);
  expect(module, 'Table runtime module must exist').not.toBeNull();
  return module;
}

describe('Table contract parity', () => {
  it('keeps governed header defaults exactly aligned with dse.table', async () => {
    const module = await loadTableModule();
    if (!module) return;

    const contract = readContract();
    expect(module.tableDefaults).toEqual({
      primaryLabel: propFor(contract, 'primaryLabel').default,
      secondaryLabel: propFor(contract, 'secondaryLabel').default,
      statusLabel: propFor(contract, 'statusLabel').default,
      actionLabel: propFor(contract, 'actionLabel').default,
    });
  });
});
