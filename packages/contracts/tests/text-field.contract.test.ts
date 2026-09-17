import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const internalContractPath = fileURLToPath(
  new URL('../components/_input-control.contract.json', import.meta.url),
);
const textFieldContractPath = fileURLToPath(
  new URL('../components/text-field.contract.json', import.meta.url),
);

function readContract(path: string) {
  expect(existsSync(path)).toBe(true);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

function enumFor(contract: any, name: string): string[] | undefined {
  return propFor(contract, name)?.type?.enum;
}

describe('dse._input-control contract', () => {
  it('is an internal-only contract with exact Figma source and size axis', () => {
    const contract = readContract(internalContractPath);
    if (!contract) return;

    expect(contract.id).toBe('dse._input-control');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('internal');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '111:22',
    });
    expect(contract.sources).not.toHaveProperty('implementationPackage');
    expect(enumFor(contract, 'size')).toEqual(['compact', 'default']);
    expect(propFor(contract, 'size')).toEqual(
      expect.objectContaining({ default: 'compact' }),
    );
  });

  it('keeps the Figma visual state axis derived instead of exposing a state prop', () => {
    const contract = readContract(internalContractPath);
    if (!contract) return;

    expect(propFor(contract, 'state')).toBeUndefined();
    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'figma.state.hover', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.focus', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.disabled', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.invalid', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.invalid-focus', kind: 'derived' }),
      ]),
    );
    expect(contract.forbidden).toEqual(expect.arrayContaining(['state']));
  });

  it('records both governed heights without adding raw geometry to consumers', () => {
    const contract = readContract(internalContractPath);
    if (!contract) return;

    expect(contract.tokenDependencies).toEqual(
      expect.arrayContaining([
        '--dse-spacing-primitive-space-700',
        '--dse-spacing-primitive-space-100',
        '--dse-radius-shape-control',
        '--dse-border-role-base',
        '--dse-border-role-focus',
      ]),
    );
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/compact.*40/i),
        expect.stringMatching(/default.*44/i),
      ]),
    );
  });
});

describe('dse.text-field contract', () => {
  it('defines the public semantic API and exact Figma provenance', () => {
    const contract = readContract(textFieldContractPath);
    if (!contract) return;

    expect(contract.id).toBe('dse.text-field');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '112:263',
    });
    expect(contract.sources.implementationPackage).toBe('@design-system-exercise/react');
    expect(propFor(contract, 'label')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
    expect(propFor(contract, 'supportingText')?.type).toEqual({ content: true });
    expect(propFor(contract, 'invalid')).toEqual(
      expect.objectContaining({ default: false, type: { boolean: true } }),
    );
    expect(propFor(contract, 'errorMessage')?.type).toEqual({ content: true });
    expect(contract.publicApi.forwardNativeAttributes).toBe(true);
  });

  it('maps Figma representation controls to semantic/native/derived runtime behavior', () => {
    const contract = readContract(textFieldContractPath);
    if (!contract) return;

    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'figma.label', kind: 'public', mapsTo: 'publicApi.label' }),
        expect.objectContaining({ source: 'figma.supportingText', kind: 'public', mapsTo: 'publicApi.supportingText' }),
        expect.objectContaining({ source: 'figma.required', kind: 'native', mapsTo: 'native required' }),
        expect.objectContaining({ source: 'figma.value', kind: 'native' }),
        expect.objectContaining({ source: 'figma.placeholder', kind: 'native', mapsTo: 'native placeholder' }),
        expect.objectContaining({ source: 'figma.state.hover', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.focus', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.disabled', kind: 'native', mapsTo: 'native disabled' }),
        expect.objectContaining({ source: 'figma.state.invalid', kind: 'public', mapsTo: 'publicApi.invalid' }),
        expect.objectContaining({ source: 'figma.state.invalid-focus', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.content', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.showSupportingText', kind: 'derived' }),
      ]),
    );
  });

  it('keeps Figma state/content/internal size out of the public API', () => {
    const contract = readContract(textFieldContractPath);
    if (!contract) return;

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const forbidden of ['state', 'content', 'size', 'showSupportingText']) {
      expect(publicNames).not.toContain(forbidden);
    }
    expect(contract.forbidden).toEqual(
      expect.arrayContaining(['state', 'content', 'size', 'showSupportingText']),
    );
    expect(contract.composition['input-control']?.allowedChildren).toContain('dse._input-control');
  });

  it('requires native input semantics, label association, described-by messaging, and invalid semantics', () => {
    const contract = readContract(textFieldContractPath);
    if (!contract) return;

    expect(contract.semantics.element).toBe('input');
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/label.*associated/i),
        expect.stringMatching(/aria-describedby/i),
        expect.stringMatching(/aria-invalid/i),
        expect.stringMatching(/controlled.*uncontrolled/i),
        expect.stringMatching(/44/i),
      ]),
    );
  });
});
