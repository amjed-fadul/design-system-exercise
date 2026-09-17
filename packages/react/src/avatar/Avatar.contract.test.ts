import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(process.cwd(), '../contracts/components/avatar.contract.json');
const avatarModulePath = './Avatar';

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string): any {
  return contract.publicApi.props.find((prop: any) => prop.name === name);
}

async function loadAvatarModule() {
  const module = await import(/* @vite-ignore */ avatarModulePath).catch(() => null);
  expect(module).not.toBeNull();
  return module;
}

describe('Avatar contract parity', () => {
  it('keeps the runtime size enum exactly aligned with dse.avatar', async () => {
    const module = await loadAvatarModule();
    if (!module) return;

    const contract = readContract();
    expect([...module.avatarSizes]).toEqual(propFor(contract, 'size').type.enum);
  });

  it('keeps the runtime default size and fallback glyph governed and explicit', async () => {
    const module = await loadAvatarModule();
    if (!module) return;

    const contract = readContract();
    expect(module.avatarDefaults).toEqual({
      size: propFor(contract, 'size').default,
      fallback: '@',
    });
  });
});
