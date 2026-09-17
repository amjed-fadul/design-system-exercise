import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = fileURLToPath(
  new URL('../components/side-panel.contract.json', import.meta.url),
);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.side-panel contract', () => {
  it('defines the approved public boundary and exact Figma provenance', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.side-panel');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '137:2',
    });

    expect(propFor(contract, 'eyebrow')).toEqual(
      expect.objectContaining({ required: false, default: 'MEMBER DETAILS', type: { native: true } }),
    );
    expect(propFor(contract, 'header')).toEqual(
      expect.objectContaining({ required: false, type: { content: true } }),
    );
    expect(propFor(contract, 'children')).toEqual(
      expect.objectContaining({ required: false, type: { content: true } }),
    );
    expect(propFor(contract, 'actions')).toEqual(
      expect.objectContaining({ required: false, type: { content: true } }),
    );
    expect(propFor(contract, 'showClose')).toEqual(
      expect.objectContaining({ required: false, default: true, type: { boolean: true } }),
    );
    expect(propFor(contract, 'closeLabel')).toEqual(
      expect.objectContaining({ required: false, default: 'Close panel', type: { native: true } }),
    );
    expect(propFor(contract, 'onClose')).toEqual(
      expect.objectContaining({ required: true, type: { callback: true } }),
    );
  });
});
