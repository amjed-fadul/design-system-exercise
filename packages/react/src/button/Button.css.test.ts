import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/button/Button.css');
const contractPath = resolve(process.cwd(), '../contracts/components/button.contract.json');

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

describe('Button visual contract', () => {
  it('uses every declared v1 public token dependency', () => {
    const css = readCss();
    const contract = readContract();

    for (const token of contract.tokenDependencies) {
      expect(css, `missing governed token ${token}`).toContain(`var(${token})`);
    }
  });

  it('contains no raw color literals', () => {
    const css = readCss();
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
  });

  it('uses logical direction-sensitive properties', () => {
    const css = readCss();
    expect(css).not.toMatch(/\b(margin|padding|border)-(left|right)\b/i);
    expect(css).not.toMatch(/\b(left|right)\s*:/i);
  });

  it('keeps normal and loading layers in one intrinsic grid track', () => {
    const css = readCss();
    expect(css).toMatch(/\.dse-button__content\s*\{[^}]*display:\s*inline-grid;/s);
    expect(css).toMatch(/\.dse-button__layer\s*\{[^}]*grid-area:\s*1\s*\/\s*1;/s);
    expect(css).toMatch(/\.dse-button__layer\[aria-hidden=['"]true['"]\]\s*\{[^}]*visibility:\s*hidden;/s);
    expect(css).not.toMatch(/\.dse-button__layer\[aria-hidden=['"]true['"]\]\s*\{[^}]*display:\s*none;/s);
  });
});
