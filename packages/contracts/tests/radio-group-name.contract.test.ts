import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = fileURLToPath(
  new URL('../components/radio-group.contract.json', import.meta.url),
);

describe('dse.radio-group native name invariant', () => {
  it('requires a non-empty shared name so native radios form one browser-managed group', () => {
    const contract = JSON.parse(readFileSync(contractPath, 'utf8')) as any;
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([expect.stringMatching(/non-empty.*name|name.*non-empty/i)]),
    );
  });
});
