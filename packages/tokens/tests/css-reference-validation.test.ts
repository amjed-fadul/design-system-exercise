import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { loadRegistry } from '../scripts/lib/load.js';
import { validateGovernedCssReferences } from '../scripts/lib/consumer.js';

const registry = loadRegistry(fileURLToPath(new URL('../src/', import.meta.url)));

it('rejects guessed governed CSS custom-property names', () => {
  expect(
    validateGovernedCssReferences(
      'gap: var(--dse-layout-wide-region-gap); color: var(--dse-color-semantic-fg-primary);',
      registry,
    ),
  ).toEqual(['--dse-layout-wide-region-gap']);
});

const evaluationRoot = fileURLToPath(
  new URL('../../../apps/storybook/src/ai-readiness/evaluations/', import.meta.url),
);

const collectAuthoredFiles = (dir: string): string[] => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return collectAuthoredFiles(path);
    return /\.(css|tsx?|md)$/.test(entry.name) ? [path] : [];
  });
};

it('contains no unknown governed token references in blind evaluation output', () => {
  const failures = collectAuthoredFiles(evaluationRoot).flatMap((path) =>
    validateGovernedCssReferences(readFileSync(path, 'utf8'), registry).map(
      (reference) => `${path}: ${reference}`,
    ),
  );

  expect(failures).toEqual([]);
});
