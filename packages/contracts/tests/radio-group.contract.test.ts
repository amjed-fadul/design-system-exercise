import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const radioGroupContractPath = fileURLToPath(
  new URL('../components/radio-group.contract.json', import.meta.url),
);
const radioOptionContractPath = fileURLToPath(
  new URL('../components/_radio-option.contract.json', import.meta.url),
);

function readContract(path: string) {
  expect(existsSync(path)).toBe(true);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse._radio-option contract', () => {
  it('defines the exact private Figma source and never becomes a public package component', () => {
    const contract = readContract(radioOptionContractPath);
    if (!contract) return;

    expect(contract.id).toBe('dse._radio-option');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('internal');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '116:174',
    });
    expect(contract.forbidden).toContain('public package export');
  });

  it('records label/description as data while deriving Figma-only presentation axes', () => {
    const contract = readContract(radioOptionContractPath);
    if (!contract) return;

    expect(propFor(contract, 'label')).toEqual(expect.objectContaining({ required: true }));
    expect(propFor(contract, 'description')).toBeTruthy();
    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'figma.label', kind: 'public' }),
        expect.objectContaining({ source: 'figma.description', kind: 'public' }),
        expect.objectContaining({ source: 'figma.showDescription', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.selected', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.hover', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.focus', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.pressed', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.state.disabled', kind: 'native' }),
      ]),
    );

    for (const forbidden of ['selected', 'state', 'showDescription']) {
      expect(contract.forbidden).toContain(forbidden);
    }
  });
});

describe('dse.radio-group contract', () => {
  it('defines the public Radio Group boundary and exact Figma provenance', () => {
    const contract = readContract(radioGroupContractPath);
    if (!contract) return;

    expect(contract.id).toBe('dse.radio-group');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '116:175',
    });
    expect(contract.sources.implementationPackage).toBe('@design-system-exercise/react');

    expect(propFor(contract, 'label')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
    expect(propFor(contract, 'name')).toEqual(
      expect.objectContaining({ required: true, type: { native: true } }),
    );
    expect(propFor(contract, 'options')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
    expect(propFor(contract, 'value')?.type).toEqual({ native: true });
    expect(propFor(contract, 'defaultValue')?.type).toEqual({ native: true });
    expect(propFor(contract, 'onValueChange')?.type).toEqual({ callback: true });
    expect(propFor(contract, 'required')).toEqual(
      expect.objectContaining({ default: true, type: { boolean: true } }),
    );
    expect(contract.publicApi.forwardNativeAttributes).toBe(false);
  });

  it('locks the option slot to at least two unique-valued internal options', () => {
    const contract = readContract(radioGroupContractPath);
    if (!contract) return;

    expect(contract.composition.options?.allowedChildren).toContain('dse._radio-option');
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/at least two/i),
        expect.stringMatching(/unique.*value/i),
        expect.stringMatching(/shared.*name|same.*name/i),
      ]),
    );
  });

  it('keeps selection semantic and Figma state axes derived rather than public visual props', () => {
    const contract = readContract(radioGroupContractPath);
    if (!contract) return;

    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'figma.label', kind: 'public' }),
        expect.objectContaining({ source: 'figma.required', kind: 'public' }),
        expect.objectContaining({ source: 'figma.Options', kind: 'public' }),
        expect.objectContaining({ source: 'figma._radio-option.selected', kind: 'derived' }),
        expect.objectContaining({ source: 'figma._radio-option.state', kind: 'derived' }),
      ]),
    );
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/controlled.*uncontrolled/i),
        expect.stringMatching(/native radio/i),
        expect.stringMatching(/arrow|keyboard/i),
        expect.stringMatching(/no automatic|does not automatically|must not automatically/i),
      ]),
    );
  });

  it('forbids representation, product, validation, arbitrary-children, and group-disabled APIs', () => {
    const contract = readContract(radioGroupContractPath);
    if (!contract) return;

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const forbidden of [
      'children',
      'state',
      'selected',
      'selectedValue',
      'showDescription',
      'invalid',
      'errorMessage',
      'role',
      'disabled',
    ]) {
      expect(publicNames).not.toContain(forbidden);
      expect(contract.forbidden).toContain(forbidden);
    }
  });

  it('keeps option-level disabled and description ownership inside option data', () => {
    const contract = readContract(radioGroupContractPath);
    if (!contract) return;

    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/option.*disabled/i),
        expect.stringMatching(/description.*aria-describedby|aria-describedby.*description/i),
        expect.stringMatching(/selected.*disabled.*remain|disabled.*selected.*remain/i),
      ]),
    );
    expect(contract.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'valueChange', trigger: 'native radio selection change' }),
      ]),
    );
  });
});
