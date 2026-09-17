import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(process.cwd(), '../contracts/components/empty-state.contract.json');
const emptyStateModulePath = './EmptyState';

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string): any {
  return contract.publicApi.props.find((prop: any) => prop.name === name);
}

async function loadEmptyStateModule() {
  const module = await import(/* @vite-ignore */ emptyStateModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('EmptyState contract parity', () => {
  it('keeps governed runtime defaults exactly aligned with dse.empty-state', async () => {
    const module = await loadEmptyStateModule();
    if (!module) return;

    const contract = readContract();
    expect(module.emptyStateDefaults).toEqual({
      title: propFor(contract, 'title').default,
      body: propFor(contract, 'body').default,
      showBody: propFor(contract, 'showBody').default,
      showIcon: propFor(contract, 'showIcon').default,
    });
  });
});
