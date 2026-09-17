import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(process.cwd(), '../contracts/components/page-heading.contract.json');
const pageHeadingModulePath = './PageHeading';

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string): any {
  return contract.publicApi.props.find((prop: any) => prop.name === name);
}

async function loadPageHeadingModule() {
  const module = await import(/* @vite-ignore */ pageHeadingModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Page Heading contract parity', () => {
  it('keeps governed runtime defaults exactly aligned with dse.page-heading', async () => {
    const module = await loadPageHeadingModule();
    if (!module) return;

    const contract = readContract();
    expect(module.pageHeadingDefaults).toEqual({
      showDescription: propFor(contract, 'showDescription').default,
    });
  });
});
