import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/icon-button/IconButton.css');
const contractPath = resolve(
  process.cwd(),
  '../contracts/components/icon-button.contract.json',
);

function readCss() {
  expect(existsSync(cssPath)).toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

function readContract() {
  return JSON.parse(readFileSync(contractPath, 'utf8')) as {
    tokenDependencies: string[];
  };
}

describe('IconButton CSS contract', () => {
  it('uses every declared v1 public token dependency', () => {
    const css = readCss();
    const contract = readContract();

    for (const token of contract.tokenDependencies) {
      expect(css, `missing governed token ${token}`).toContain(`var(${token})`);
    }
  });

  it('keeps the Figma-proven 40px target and 20px icon geometry', () => {
    const css = readCss();

    expect(css).toContain('inline-size: var(--dse-spacing-primitive-space-700)');
    expect(css).toContain('block-size: var(--dse-spacing-primitive-space-700)');
    expect(css).toContain('inline-size: var(--dse-icons-size-md)');
    expect(css).toContain('block-size: var(--dse-icons-size-md)');
  });

  it('contains no raw color literals', () => {
    const css = readCss();
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
  });

  it('uses logical direction-safe properties', () => {
    const css = readCss();
    expect(css).not.toMatch(/\b(margin|padding|border)-(left|right)\b/i);
    expect(css).not.toMatch(/\b(left|right)\s*:/i);
  });
});
