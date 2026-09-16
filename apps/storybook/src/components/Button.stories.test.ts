import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(
  process.cwd(),
  '../../packages/contracts/components/button.contract.json',
);
const storyModulePath = './Button.stories';

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function enumFor(contract: any, name: string): string[] {
  return contract.publicApi.props.find((prop: any) => prop.name === name)?.type?.enum ?? [];
}

async function loadStories() {
  const module = await import(/* @vite-ignore */ storyModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Button Storybook contract', () => {
  it('uses exactly the contract-backed public enum controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const contract = readContract();
    const meta = module.buttonMeta;

    expect(meta.argTypes?.emphasis?.options).toEqual(enumFor(contract, 'emphasis'));
    expect(meta.argTypes?.tone?.options).toEqual(enumFor(contract, 'tone'));
    expect(meta.argTypes?.iconPosition?.options).toEqual(enumFor(contract, 'iconPosition'));
  });

  it('does not expose Figma-only or unsupported Button controls', async () => {
    const module = await loadStories();
    if (!module) return;

    const argTypes = module.buttonMeta.argTypes ?? {};
    for (const forbidden of ['state', 'focusVisible', 'showIcon', 'size', 'danger', 'success']) {
      expect(argTypes).not.toHaveProperty(forbidden);
    }
  });
});
