import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractUrl = new URL('../components/icon-button.contract.json', import.meta.url);
const contractPath = fileURLToPath(contractUrl);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.icon-button contract', () => {
  it('requires icon content and a native accessible name with exact Figma provenance', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.icon-button');
    expect(contract.version).toBe('1.0.0');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '110:1339',
    });

    expect(propFor(contract, 'icon')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
    expect(propFor(contract, 'aria-label')).toEqual(
      expect.objectContaining({ required: true, type: { native: true } }),
    );
    expect(contract.publicApi.forwardNativeAttributes).toBe(true);
  });

  it('keeps Figma interaction controls derived and maps accessibleLabel to aria-label', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: 'figma.accessibleLabel',
          kind: 'native',
          mapsTo: 'publicApi.aria-label',
        }),
        expect.objectContaining({ source: 'figma.state.hover', kind: 'derived', mapsTo: 'css:hover' }),
        expect.objectContaining({ source: 'figma.state.pressed', kind: 'derived', mapsTo: 'css:active' }),
        expect.objectContaining({ source: 'figma.focusVisible', kind: 'derived', mapsTo: 'css:focus-visible' }),
        expect.objectContaining({ source: 'figma.state.disabled', kind: 'native', mapsTo: 'native disabled' }),
      ]),
    );
  });

  it('does not expose loading or Figma representation controls as public capability', () => {
    const contract = readContract();
    if (!contract) return;

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    expect(publicNames).not.toContain('loading');
    expect(contract.states.map((state: any) => state.name)).not.toContain('loading');
    expect(contract.representations.map((mapping: any) => mapping.source)).not.toContain('figma.state.loading');
    expect(contract.forbidden).toEqual(
      expect.arrayContaining(['state', 'focusVisible', 'accessibleLabel', 'loading', 'success', 'size']),
    );
  });
});
