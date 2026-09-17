import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = fileURLToPath(
  new URL('../components/inline-feedback.contract.json', import.meta.url),
);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.inline-feedback contract', () => {
  it('defines the approved public boundary and exact Figma provenance', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.inline-feedback');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '127:30',
    });
    expect(propFor(contract, 'intent')).toEqual(
      expect.objectContaining({ required: true, type: { enum: ['error', 'success'] } }),
    );
    expect(propFor(contract, 'message')).toEqual(
      expect.objectContaining({ required: true }),
    );
    expect(propFor(contract, 'title')).toEqual(
      expect.objectContaining({ required: false }),
    );
    expect(contract.publicApi.forwardNativeAttributes).toBe(false);
  });

  it('derives Figma showTitle from optional title presence', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'figma.intent', kind: 'public' }),
        expect.objectContaining({ source: 'figma.message', kind: 'public' }),
        expect.objectContaining({ source: 'figma.title', kind: 'public' }),
        expect.objectContaining({ source: 'figma.showTitle', kind: 'derived' }),
      ]),
    );
  });

  it('owns semantic announcement behavior without focus movement', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/error.*alert|alert.*error/i),
        expect.stringMatching(/success.*status|status.*success/i),
        expect.stringMatching(/focus/i),
        expect.stringMatching(/icon.*decorative|aria-hidden/i),
      ]),
    );
  });

  it('forbids unsupported variants and embedded interaction APIs', () => {
    const contract = readContract();
    if (!contract) return;

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const forbidden of [
      'children',
      'showTitle',
      'action',
      'dismissible',
      'onDismiss',
      'role',
      'aria-live',
      'warning',
      'info',
      'loading',
    ]) {
      expect(publicNames).not.toContain(forbidden);
      expect(contract.forbidden).toContain(forbidden);
    }
  });
});
