import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = fileURLToPath(
  new URL('../components/dialog.contract.json', import.meta.url),
);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.dialog contract', () => {
  it('defines the approved public boundary and exact Figma provenance', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.dialog');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '133:6',
    });

    expect(propFor(contract, 'open')).toEqual(
      expect.objectContaining({ required: true, type: { boolean: true } }),
    );
    expect(propFor(contract, 'onOpenChange')).toEqual(
      expect.objectContaining({ required: true, type: { callback: true } }),
    );
    expect(propFor(contract, 'title')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
    expect(propFor(contract, 'children')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
    expect(propFor(contract, 'showClose')).toEqual(
      expect.objectContaining({ required: false, default: true, type: { boolean: true } }),
    );
    expect(propFor(contract, 'description')).toEqual(
      expect.objectContaining({ required: false, type: { content: true } }),
    );
    expect(propFor(contract, 'actions')).toEqual(
      expect.objectContaining({ required: false, type: { content: true } }),
    );
    expect(propFor(contract, 'closeLabel')).toEqual(
      expect.objectContaining({ required: false, default: 'Close dialog', type: { native: true } }),
    );
    expect(propFor(contract, 'initialFocusRef')).toEqual(
      expect.objectContaining({ required: false, type: { native: true } }),
    );
    expect(contract.publicApi.forwardNativeAttributes).toBe(false);
  });

  it('maps Figma visual properties and slots without inventing business state', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'figma.title', mapsTo: 'publicApi.title' }),
        expect.objectContaining({ source: 'figma.description', mapsTo: 'publicApi.description when present' }),
        expect.objectContaining({ source: 'figma.showDescription', kind: 'derived' }),
        expect.objectContaining({ source: 'figma.showClose', mapsTo: 'publicApi.showClose' }),
        expect.objectContaining({ source: 'figma.Body', mapsTo: 'publicApi.children' }),
        expect.objectContaining({ source: 'figma.Actions', mapsTo: 'publicApi.actions when present' }),
      ]),
    );

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const unsupported of [
      'onSubmit',
      'requestStatus',
      'state',
      'pending',
      'validation',
      'dirty',
      'dismissOnBackdrop',
      'showDescription',
    ]) {
      expect(publicNames).not.toContain(unsupported);
      expect(contract.forbidden).toContain(unsupported);
    }
  });

  it('requires complete modal focus, dismissal, and background semantics', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.semantics.element).toMatch(/dialog|div/i);
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/role=dialog|dialog role/i),
        expect.stringMatching(/aria-modal/i),
        expect.stringMatching(/initial focus/i),
        expect.stringMatching(/contain|trap.*focus|tab.*dialog/i),
        expect.stringMatching(/escape/i),
        expect.stringMatching(/return.*focus|restore.*focus/i),
        expect.stringMatching(/background.*inert|inert.*background/i),
        expect.stringMatching(/outside|backdrop/i),
        expect.stringMatching(/close.*label|label.*close/i),
      ]),
    );
  });

  it('locks Figma surface, shape, typography, and layout token dependencies', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.tokenDependencies).toEqual(
      expect.arrayContaining([
        '--dse-color-semantic-surface-overlay',
        '--dse-color-semantic-surface-elevated',
        '--dse-color-semantic-fg-primary',
        '--dse-color-semantic-fg-secondary',
        '--dse-color-semantic-border-subtle',
        '--dse-radius-shape-overlay',
        '--dse-spacing-primitive-space-100',
        '--dse-spacing-primitive-space-200',
        '--dse-spacing-primitive-space-300',
        '--dse-spacing-primitive-space-400',
        '--dse-spacing-primitive-space-500',
        '--dse-spacing-primitive-space-800',
        '--dse-icons-size-md',
        '--dse-typography-semantic-title-component-family',
        '--dse-typography-semantic-title-component-size',
        '--dse-typography-semantic-title-component-weight',
        '--dse-typography-semantic-title-component-line-height',
        '--dse-typography-semantic-title-component-letter-spacing',
        '--dse-typography-semantic-body-small-family',
        '--dse-typography-semantic-body-small-size',
        '--dse-typography-semantic-body-small-weight',
        '--dse-typography-semantic-body-small-line-height',
        '--dse-typography-semantic-body-small-letter-spacing',
      ]),
    );
  });
});
