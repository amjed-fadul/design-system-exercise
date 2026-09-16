import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = fileURLToPath(
  new URL('../../../contracts/components/button.contract.json', import.meta.url),
);

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function enumFor(contract: any, name: string): string[] {
  return contract.publicApi.props.find((prop: any) => prop.name === name)?.type?.enum ?? [];
}

async function loadButtonModule() {
  const module = await import('./Button').catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Button contract parity', () => {
  it('keeps runtime enum arrays exactly aligned with dse.button', async () => {
    const module = await loadButtonModule();
    if (!module) return;

    const contract = readContract();
    expect([...module.buttonEmphases]).toEqual(enumFor(contract, 'emphasis'));
    expect([...module.buttonTones]).toEqual(enumFor(contract, 'tone'));
    expect([...module.buttonIconPositions]).toEqual(enumFor(contract, 'iconPosition'));
  });
});
