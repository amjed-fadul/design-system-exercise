import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(process.cwd(), '../contracts/components/dialog.contract.json');
const dialogModulePath = './Dialog';

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string): any {
  return contract.publicApi.props.find((prop: any) => prop.name === name);
}

async function loadDialogModule() {
  const module = await import(/* @vite-ignore */ dialogModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Dialog contract parity', () => {
  it('keeps governed runtime defaults exactly aligned with dse.dialog', async () => {
    const module = await loadDialogModule();
    if (!module) return;

    const contract = readContract();
    expect(module.dialogDefaults).toEqual({
      showClose: propFor(contract, 'showClose').default,
      closeLabel: propFor(contract, 'closeLabel').default,
    });
  });
});
