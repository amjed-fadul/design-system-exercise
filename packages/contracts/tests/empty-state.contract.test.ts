import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = fileURLToPath(
  new URL('../components/empty-state.contract.json', import.meta.url),
);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.empty-state contract', () => {
  it('defines the approved public boundary and exact Figma provenance', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.empty-state');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '131:2',
    });

    expect(propFor(contract, 'title')).toEqual(
      expect.objectContaining({ required: false, default: 'No people found' }),
    );
    expect(propFor(contract, 'body')).toEqual(
      expect.objectContaining({ required: false }),
    );
    expect(propFor(contract, 'showIcon')).toEqual(
      expect.objectContaining({ required: false, default: true, type: { boolean: true } }),
    );
    expect(propFor(contract, 'showBody')).toEqual(
      expect.objectContaining({ required: false, default: true, type: { boolean: true } }),
    );
    expect(propFor(contract, 'icon')).toEqual(
      expect.objectContaining({ required: false, type: { content: true } }),
    );
    expect(propFor(contract, 'actions')).toEqual(
      expect.objectContaining({ required: false, type: { content: true } }),
    );
  });

  it('keeps loading, failure, query logic, and result reasoning outside the component', () => {
    const contract = readContract();
    if (!contract) return;

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const unsupported of [
      'loading',
      'error',
      'reason',
      'resultCount',
      'query',
      'onClear',
      'onRetry',
      'status',
      'tone',
      'state',
    ]) {
      expect(publicNames).not.toContain(unsupported);
      expect(contract.forbidden).toContain(unsupported);
    }
    expect(contract.states).toEqual([]);
  });

  it('documents title-first status communication without making the recovery action a live region', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/heading|title/i),
        expect.stringMatching(/status|announce|live/i),
        expect.stringMatching(/action.*outside|outside.*action|recovery.*outside/i),
        expect.stringMatching(/focus/i),
        expect.stringMatching(/decorative.*icon|icon.*decorative/i),
      ]),
    );
  });

  it('locks the centered Figma composition and approved token families', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.tokenDependencies).toEqual(
      expect.arrayContaining([
        '--dse-color-semantic-surface-default',
        '--dse-color-semantic-fg-primary',
        '--dse-color-semantic-fg-secondary',
        '--dse-spacing-primitive-space-300',
        '--dse-icons-size-lg',
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
    expect(contract.tokenDependencies).not.toContain('--dse-icons-size-md');
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/440.*CSS pixels|440px/i),
        expect.stringMatching(/680.*CSS pixels|680px/i),
        expect.stringMatching(/40.*24|24.*40/i),
        expect.stringMatching(/12.*CSS pixels|12px/i),
      ]),
    );
  });
});
