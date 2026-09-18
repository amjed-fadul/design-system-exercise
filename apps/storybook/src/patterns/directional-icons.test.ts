import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const css = readFileSync(
  fileURLToPath(new URL('../directional-icons.css', import.meta.url)),
  'utf8',
);

describe('Storybook directional icon RTL utility', () => {
  it('mirrors only explicitly directional glyphs in RTL', () => {
    expect(css).toMatch(/\[dir=['"]rtl['"]\][^{]*\[data-dse-directional-icon=['"]true['"]\]/);
    expect(css).toMatch(/scaleX\(-1\)/);
  });
});
