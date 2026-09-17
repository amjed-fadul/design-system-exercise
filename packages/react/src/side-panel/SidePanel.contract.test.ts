import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(process.cwd(), '../contracts/components/side-panel.contract.json');
const sidePanelModulePath = './SidePanel';

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string): any {
  return contract.publicApi.props.find((prop: any) => prop.name === name);
}

async function loadSidePanelModule() {
  const module = await import(/* @vite-ignore */ sidePanelModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('SidePanel contract parity', () => {
  it('keeps governed runtime defaults exactly aligned with dse.side-panel', async () => {
    const module = await loadSidePanelModule();
    if (!module) return;

    const contract = readContract();
    expect(module.sidePanelDefaults).toEqual({
      eyebrow: propFor(contract, 'eyebrow').default,
      showClose: propFor(contract, 'showClose').default,
      closeLabel: propFor(contract, 'closeLabel').default,
    });
  });
});
