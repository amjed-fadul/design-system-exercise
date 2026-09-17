import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = fileURLToPath(
  new URL('../components/_navigation-item.contract.json', import.meta.url),
);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse._navigation-item contract', () => {
  it('is internal-only and points to the exact Figma source', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse._navigation-item');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('internal');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '143:2948',
    });
    expect(contract.sources.implementationPackage).toBeUndefined();
  });

  it('owns destination data plus parent-derived mode and current route state', () => {
    const contract = readContract();
    if (!contract) return;

    expect(propFor(contract, 'label')).toEqual(
      expect.objectContaining({ required: true, type: { native: true } }),
    );
    expect(propFor(contract, 'href')).toEqual(
      expect.objectContaining({ required: true, type: { native: true } }),
    );
    expect(propFor(contract, 'icon')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
    expect(propFor(contract, 'mode')).toEqual(
      expect.objectContaining({ required: true, type: { enum: ['expanded', 'compact'] } }),
    );
    expect(propFor(contract, 'current')).toEqual(
      expect.objectContaining({ required: true, type: { boolean: true } }),
    );
  });

  it('keeps Figma interaction state derived rather than exposing a state prop', () => {
    const contract = readContract();
    if (!contract) return;

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    expect(publicNames).not.toContain('state');
    expect(contract.forbidden).toEqual(
      expect.arrayContaining(['state', 'children', 'public package export']),
    );
    expect(contract.states).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'current', ownership: 'derived' }),
        expect.objectContaining({ name: 'hover', ownership: 'derived' }),
        expect.objectContaining({ name: 'focus-visible', ownership: 'derived' }),
        expect.objectContaining({ name: 'pressed', ownership: 'derived' }),
      ]),
    );
  });

  it('uses a native link, aria-current, visible focus, and retained compact naming', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.semantics.element).toMatch(/anchor|link/i);
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/aria-current/i),
        expect.stringMatching(/compact.*accessible|accessible.*compact|assistive/i),
        expect.stringMatching(/focus-visible|visible focus/i),
        expect.stringMatching(/native.*link|native.*anchor|anchor.*native/i),
      ]),
    );
  });

  it('locks the Figma geometry and semantic interaction tokens', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.tokenDependencies).toEqual(
      expect.arrayContaining([
        '--dse-color-semantic-fg-primary',
        '--dse-color-semantic-fg-secondary',
        '--dse-color-semantic-state-hover',
        '--dse-color-semantic-state-selected',
        '--dse-color-semantic-focus-default',
        '--dse-radius-shape-control',
        '--dse-border-role-focus',
        '--dse-icons-size-md',
        '--dse-typography-semantic-label-default-family',
        '--dse-typography-semantic-label-default-size',
        '--dse-typography-semantic-label-default-weight',
        '--dse-typography-semantic-label-default-line-height',
        '--dse-typography-semantic-label-default-letter-spacing',
      ]),
    );
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/184.*40|40.*184/i),
        expect.stringMatching(/44.*44/i),
        expect.stringMatching(/20.*20|20px/i),
      ]),
    );
  });
});
