import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractUrl = new URL('../components/link.contract.json', import.meta.url);
const contractPath = fileURLToPath(contractUrl);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.link contract', () => {
  it('requires visible content and preserves native anchor attributes with exact Figma provenance', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.link');
    expect(contract.version).toBe('1.0.0');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '114:13',
    });
    expect(propFor(contract, 'children')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
    expect(contract.publicApi.forwardNativeAttributes).toBe(true);
  });

  it('maps the live Figma state axis to browser-derived link states', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'figma.label', kind: 'public', mapsTo: 'publicApi.children' }),
        expect.objectContaining({ source: 'figma.state.hover', kind: 'derived', mapsTo: 'css:hover' }),
        expect.objectContaining({ source: 'figma.state.focus', kind: 'derived', mapsTo: 'css:focus-visible' }),
        expect.objectContaining({ source: 'figma.state.pressed', kind: 'derived', mapsTo: 'css:active' }),
      ]),
    );
  });

  it('does not invent unsupported disabled, visited, icon, size, loading, or visual-state APIs', () => {
    const contract = readContract();
    if (!contract) return;

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const unsupported of ['state', 'disabled', 'visited', 'icon', 'size', 'loading']) {
      expect(publicNames).not.toContain(unsupported);
    }
    expect(contract.forbidden).toEqual(
      expect.arrayContaining(['state', 'disabled', 'visited', 'icon', 'size', 'loading']),
    );
    expect(contract.states.map((state: any) => state.name)).toEqual(
      expect.arrayContaining(['hover', 'focus-visible', 'pressed']),
    );
  });

  it('requires native link semantics for navigational use', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.semantics.element).toBe('a');
    expect(contract.semantics.keyboardActivation).toMatch(/native/i);
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/href/i),
        expect.stringMatching(/native anchor attributes/i),
      ]),
    );
  });
});
