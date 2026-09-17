import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(process.cwd(), '../contracts/components/top-navbar.contract.json');
const topNavbarModulePath = './TopNavbar';

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string): any {
  return contract.publicApi.props.find((prop: any) => prop.name === name);
}

async function loadTopNavbarModule() {
  const module = await import(/* @vite-ignore */ topNavbarModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Top Navbar contract parity', () => {
  it('keeps governed runtime defaults exactly aligned with dse.top-navbar', async () => {
    const module = await loadTopNavbarModule();
    if (!module) return;

    const contract = readContract();
    expect(module.topNavbarDefaults).toEqual({
      contextLabel: propFor(contract, 'contextLabel').default,
      showContext: propFor(contract, 'showContext').default,
    });
  });
});
