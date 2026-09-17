import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(process.cwd(), '../contracts/components/sidebar.contract.json');
const sidebarModulePath = './Sidebar';

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string): any {
  return contract.publicApi.props.find((prop: any) => prop.name === name);
}

async function loadSidebarModule() {
  const module = await import(/* @vite-ignore */ sidebarModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Sidebar contract parity', () => {
  it('keeps governed runtime defaults exactly aligned with dse.sidebar', async () => {
    const module = await loadSidebarModule();
    if (!module) return;

    const contract = readContract();
    expect(module.sidebarDefaults).toEqual({
      mode: propFor(contract, 'mode').default,
      label: propFor(contract, 'label').default,
    });
  });
});
