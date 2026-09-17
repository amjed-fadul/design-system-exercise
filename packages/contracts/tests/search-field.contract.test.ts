import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const searchFieldContractPath = fileURLToPath(
  new URL('../components/search-field.contract.json', import.meta.url),
);

function readContract() {
  expect(existsSync(searchFieldContractPath)).toBe(true);
  if (!existsSync(searchFieldContractPath)) return null;
  return JSON.parse(readFileSync(searchFieldContractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.search-field contract', () => {
  it('defines the public search boundary and exact Figma provenance', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.search-field');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '112:1710',
    });
    expect(contract.sources.implementationPackage).toBe('@design-system-exercise/react');
    expect(propFor(contract, 'aria-label')).toEqual(
      expect.objectContaining({ required: true, type: { native: true } }),
    );
    expect(propFor(contract, 'clearButtonLabel')).toEqual(
      expect.objectContaining({ required: true }),
    );
    expect(propFor(contract, 'onClear')?.type).toEqual({ callback: true });
    expect(contract.publicApi.forwardNativeAttributes).toBe(true);
  });

  it('keeps Figma content and visual state axes derived from runtime behavior', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'figma.value', kind: 'native' }),
        expect.objectContaining({ source: 'figma.placeholder', kind: 'native' }),
        expect.objectContaining({ source: 'figma.state.hover', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.focus', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.disabled', kind: 'native' }),
        expect.objectContaining({ source: 'figma.content', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.clear-action', kind: 'derived' }),
      ]),
    );
  });

  it('reuses the compact private shell and governed Icon Button without exposing either implementation axis', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.composition['input-control']?.allowedChildren).toContain('dse._input-control');
    expect(contract.composition['clear-action']?.allowedChildren).toContain('dse.icon-button');
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/40/i),
        expect.stringMatching(/clear.*focus/i),
        expect.stringMatching(/type=.search.|search input/i),
      ]),
    );
  });

  it('forbids validation, result, and Figma-only APIs at the component boundary', () => {
    const contract = readContract();
    if (!contract) return;

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const forbidden of [
      'state',
      'content',
      'size',
      'children',
      'type',
      'invalid',
      'aria-invalid',
      'loading',
      'results',
      'suggestions',
      'debounce',
    ]) {
      expect(publicNames).not.toContain(forbidden);
      expect(contract.forbidden).toContain(forbidden);
    }
  });

  it('declares native query change plus component-owned clear behavior', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'change', trigger: 'native input change' }),
        expect.objectContaining({ name: 'clear', trigger: 'clear button activation' }),
      ]),
    );
    expect(contract.semantics.accessibleName).toMatch(/aria-label/i);
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/controlled.*uncontrolled/i),
        expect.stringMatching(/clear.*button.*name/i),
        expect.stringMatching(/disabled.*clear/i),
        expect.stringMatching(/RTL|logical/i),
      ]),
    );
  });
});
