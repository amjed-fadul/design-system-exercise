import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractUrl = new URL('../components/button.contract.json', import.meta.url);
const contractPath = fileURLToPath(contractUrl);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function enumFor(contract: any, name: string): string[] | undefined {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name)?.type?.enum;
}

describe('dse.button contract', () => {
  it('defines the planned public API and Figma provenance', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.button');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(enumFor(contract, 'emphasis')).toEqual(['primary', 'secondary', 'text']);
    expect(enumFor(contract, 'tone')).toEqual(['default', 'critical']);
    expect(enumFor(contract, 'iconPosition')).toEqual(['leading', 'trailing']);
    expect(contract.forbidden).toEqual(
      expect.arrayContaining(['state', 'focusVisible', 'showIcon', 'size', 'danger', 'success']),
    );
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '93:1230',
    });
  });

  it('maps Figma representation controls without promoting them to public props', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'figma.state.hover', kind: 'derived', mapsTo: 'css:hover' }),
        expect.objectContaining({ source: 'figma.state.pressed', kind: 'derived', mapsTo: 'css:active' }),
        expect.objectContaining({ source: 'figma.focusVisible', kind: 'derived', mapsTo: 'css:focus-visible' }),
        expect.objectContaining({ source: 'figma.showIcon', kind: 'figma-only', mapsTo: 'publicApi.icon presence' }),
        expect.objectContaining({ source: 'figma.state.disabled', kind: 'native', mapsTo: 'native disabled' }),
        expect.objectContaining({ source: 'figma.state.loading', kind: 'public', mapsTo: 'publicApi.loading' }),
      ]),
    );
  });
});
