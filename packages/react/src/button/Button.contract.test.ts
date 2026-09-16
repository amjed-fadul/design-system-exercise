import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Runtime enums and defaults must remain an exact projection of the validated contract.
const contractPath = resolve(process.cwd(), '../contracts/components/button.contract.json');
const buttonModulePath = './Button';

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string): any {
  return contract.publicApi.props.find((prop: any) => prop.name === name);
}

function enumFor(contract: any, name: string): string[] {
  return propFor(contract, name)?.type?.enum ?? [];
}

function defaultFor(contract: any, name: string): unknown {
  return propFor(contract, name)?.default;
}

async function loadButtonModule() {
  const module = await import(/* @vite-ignore */ buttonModulePath).catch(() => null);
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

  it('keeps governed runtime defaults exactly aligned with dse.button', async () => {
    const module = await loadButtonModule();
    if (!module) return;

    const contract = readContract();
    expect(module.buttonDefaults).toEqual({
      emphasis: defaultFor(contract, 'emphasis'),
      tone: defaultFor(contract, 'tone'),
      loading: defaultFor(contract, 'loading'),
      loadingLabel: defaultFor(contract, 'loadingLabel'),
      iconPosition: defaultFor(contract, 'iconPosition'),
    });
  });
});
