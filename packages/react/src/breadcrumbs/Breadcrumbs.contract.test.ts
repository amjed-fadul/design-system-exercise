import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(process.cwd(), '../contracts/components/breadcrumbs.contract.json');
const breadcrumbsModulePath = './Breadcrumbs';

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string): any {
  return contract.publicApi.props.find((prop: any) => prop.name === name);
}

async function loadBreadcrumbsModule() {
  const module = await import(/* @vite-ignore */ breadcrumbsModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Breadcrumbs contract parity', () => {
  it('keeps governed runtime defaults exactly aligned with dse.breadcrumbs', async () => {
    const module = await loadBreadcrumbsModule();
    if (!module) return;

    const contract = readContract();
    expect(module.breadcrumbsDefaults).toEqual({
      ariaLabel: propFor(contract, 'ariaLabel').default,
    });
  });
});
