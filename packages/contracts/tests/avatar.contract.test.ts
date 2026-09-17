import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = fileURLToPath(
  new URL('../components/avatar.contract.json', import.meta.url),
);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.avatar contract', () => {
  it('defines the approved public boundary and exact Figma provenance', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.avatar');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '128:14',
    });
    expect(propFor(contract, 'initials')).toEqual(expect.objectContaining({ required: false }));
    expect(propFor(contract, 'size')).toEqual(
      expect.objectContaining({ required: false, type: { enum: ['sm', 'lg'] } }),
    );
    expect(propFor(contract, 'aria-label')).toEqual(expect.objectContaining({ required: false }));
  });

  it('derives initials versus fallback content from initials presence', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.representations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'figma.initials', kind: 'public' }),
        expect.objectContaining({ source: 'figma.size', kind: 'public' }),
        expect.objectContaining({ source: 'figma.content', kind: 'derived' }),
      ]),
    );
  });

  it('documents decorative-by-default and labeled image-like semantics', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/aria-hidden.*aria-label|aria-label.*aria-hidden/i),
        expect.stringMatching(/image|img/i),
        expect.stringMatching(/infer.*initials|initials.*infer/i),
      ]),
    );
  });

  it('forbids unsupported photo, presence, role, and status APIs', () => {
    const contract = readContract();
    if (!contract) return;

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const forbidden of [
      'src',
      'alt',
      'photo',
      'online',
      'presence',
      'role',
      'status',
      'verified',
      'selected',
      'name',
    ]) {
      expect(publicNames).not.toContain(forbidden);
      expect(contract.forbidden).toContain(forbidden);
    }
  });
});
