import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { SOURCE_FILES } from '../scripts/lib/sources.js';

const contractPath = fileURLToPath(
  new URL('../consumer-contract.json', import.meta.url),
);

it('publishes the token CSS consumer contract used by blind authors', () => {
  expect(existsSync(contractPath)).toBe(true);
  const contract = JSON.parse(readFileSync(contractPath, 'utf8')) as {
    id: string;
    css: {
      import: string;
      customProperty: {
        prefix: string;
        logicalPathSeparator: string;
        cssSeparator: string;
        modeNamesInVariable: boolean;
      };
      sourceLogicalPrefixes: Record<string, string>;
    };
  };

  expect(contract.id).toBe('dse.tokens.consumer-contract');
  expect(contract.css.import).toBe('@design-system-exercise/tokens/css');
  expect(contract.css.customProperty).toEqual({
    prefix: '--dse-',
    logicalPathSeparator: '.',
    cssSeparator: '-',
    modeNamesInVariable: false,
  });
  expect(contract.css.sourceLogicalPrefixes).toEqual(
    Object.fromEntries(SOURCE_FILES),
  );
});
