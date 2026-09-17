import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = fileURLToPath(
  new URL('../components/status-badge.contract.json', import.meta.url),
);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.status-badge contract', () => {
  it('defines the approved public boundary and exact Figma provenance', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.status-badge');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '128:1821',
    });

    expect(contract.publicApi.props).toHaveLength(1);
    expect(propFor(contract, 'label')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
  });

  it('keeps product status values as label content rather than component variants', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'figma.label', kind: 'public' }),
      ]),
    );
    expect(contract.states).toEqual([]);

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const unsupported of ['status', 'tone', 'size', 'selected', 'icon', 'dismissible']) {
      expect(publicNames).not.toContain(unsupported);
      expect(contract.forbidden).toContain(unsupported);
    }
  });

  it('documents static, text-first, non-interactive semantics', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.semantics.element).toBe('span');
    expect(contract.semantics.keyboardActivation).toBe('none');
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/text|color/i),
        expect.stringMatching(/not.*alert|static.*alert/i),
        expect.stringMatching(/focus|interactive/i),
      ]),
    );
  });

  it('locks the neutral Figma token mapping and geometry', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.tokenDependencies).toEqual(
      expect.arrayContaining([
        '--dse-color-semantic-surface-section',
        '--dse-color-semantic-fg-primary',
        '--dse-radius-shape-surface',
        '--dse-typography-semantic-label-small-family',
        '--dse-typography-semantic-label-small-size',
        '--dse-typography-semantic-label-small-weight',
        '--dse-typography-semantic-label-small-line-height',
        '--dse-typography-semantic-label-small-letter-spacing',
      ]),
    );
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/28.*CSS pixels|28px/i),
        expect.stringMatching(/5.*10|10.*5/i),
      ]),
    );
  });
});
