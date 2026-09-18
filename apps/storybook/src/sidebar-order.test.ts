import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const preview = readFileSync(
  resolve(process.cwd(), '.storybook/preview.tsx'),
  'utf8',
);

describe('Storybook sidebar order', () => {
  it('orders the top-level sections Foundations → Components → Patterns → Prototypes', () => {
    expect(preview).toContain(
      "order: ['Foundations', 'Components', 'Patterns', 'Prototypes']",
    );
  });
});
