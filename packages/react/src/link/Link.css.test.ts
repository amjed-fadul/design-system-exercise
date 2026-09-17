import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/link/Link.css');
const contractPath = resolve(process.cwd(), '../contracts/components/link.contract.json');

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

describe('Link visual contract', () => {
  it('uses every declared public token dependency', () => {
    const css = readCss();
    const contract = readContract();

    for (const token of contract.tokenDependencies) {
      expect(css, `missing governed token ${token}`).toContain(`var(${token})`);
    }
  });

  it('uses browser-derived hover, active, and focus-visible selectors', () => {
    const css = readCss();
    expect(css).toContain('.dse-link:hover');
    expect(css).toContain('.dse-link:active');
    expect(css).toContain('.dse-link:focus-visible');
    expect(css).not.toContain('[data-state=');
  });

  it('does not invent visited or disabled component styling', () => {
    const css = readCss();
    expect(css).not.toContain(':visited');
    expect(css).not.toContain(':disabled');
    expect(css).not.toContain('[aria-disabled');
    expect(css).not.toContain('[data-disabled');
  });

  it('contains no raw color literals or physical direction-sensitive properties', () => {
    const css = readCss();
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
    expect(css).not.toMatch(/\b(margin|padding|border)-(left|right)\b/i);
    expect(css).not.toMatch(/\b(left|right)\s*:/i);
  });
});
