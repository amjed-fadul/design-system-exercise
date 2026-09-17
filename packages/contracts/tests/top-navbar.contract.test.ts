import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(process.cwd(), 'components/top-navbar.contract.json');

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

describe('dse.top-navbar contract', () => {
  it('publishes only Brand, context, visibility, and Account composition', () => {
    const contract = readContract();

    expect(contract.id).toBe('dse.top-navbar');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '228:18954',
    });

    expect(contract.publicApi.props.map((prop: any) => prop.name)).toEqual([
      'brand',
      'contextLabel',
      'showContext',
      'account',
    ]);
    expect(contract.publicApi.forwardNativeAttributes).toBe(false);
  });

  it('keeps Figma order and theme out of the public API and records shell/product ownership', () => {
    const contract = readContract();

    expect(contract.forbidden).toEqual(
      expect.arrayContaining([
        'children',
        'order',
        'theme',
        'navigation',
        'pageTitle',
        'actions',
        'accountMenu',
        'appearance',
        'onAppearanceChange',
      ]),
    );

    const representation = JSON.stringify(contract.representations);
    expect(representation).toMatch(/figma\.order/);
    expect(representation).toMatch(/figma-only|private/i);
    expect(representation).toMatch(/figma\.theme/);

    const requirements = contract.semantics.requirements.join(' ');
    expect(requirements).toMatch(/64 CSS pixels/i);
    expect(requirements).toMatch(/fixed.*left-to-right|left-to-right.*fixed/i);
    expect(requirements).toMatch(/Application Shell/i);
    expect(requirements).toMatch(/Product/i);
    expect(requirements).toMatch(/page/i);
  });
});
