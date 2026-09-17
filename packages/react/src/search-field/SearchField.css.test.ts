import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const searchFieldCssPath = resolve(process.cwd(), 'src/search-field/SearchField.css');
const searchFieldContractPath = resolve(
  process.cwd(),
  '../contracts/components/search-field.contract.json',
);

function readRequired(path: string) {
  expect(existsSync(path)).toBe(true);
  if (!existsSync(path)) return '';
  return readFileSync(path, 'utf8');
}

function tokenDependencies(): string[] {
  return (JSON.parse(readFileSync(searchFieldContractPath, 'utf8')) as { tokenDependencies: string[] })
    .tokenDependencies;
}

describe('Search Field visual contract', () => {
  it('uses every Search Field contract token dependency', () => {
    const css = readRequired(searchFieldCssPath);
    for (const token of tokenDependencies()) {
      expect(css, `missing governed Search Field token ${token}`).toContain(`var(${token})`);
    }
  });

  it('preserves the live icon and text viewport geometry with logical properties', () => {
    const css = readRequired(searchFieldCssPath);

    expect(css).toMatch(
      /\.dse-search-field__search-icon\s*\{[^}]*inset-inline-start:\s*var\(--dse-spacing-primitive-space-300\)/s,
    );
    expect(css).toMatch(
      /\.dse-search-field__search-icon\s*\{[^}]*inline-size:\s*var\(--dse-icons-size-md\)[^}]*block-size:\s*var\(--dse-icons-size-md\)/s,
    );
    expect(css).toMatch(
      /\.dse-search-field__input\s*\{[^}]*padding-inline-start:\s*var\(--dse-spacing-primitive-space-700\)/s,
    );
    expect(css).toMatch(
      /\.dse-search-field__input\s*\{[^}]*padding-inline-end:\s*calc\(\s*var\(--dse-spacing-primitive-space-700\)\s*\+\s*var\(--dse-spacing-primitive-space-200\)\s*\)/s,
    );
    expect(css).toMatch(
      /\.dse-search-field__clear-action\s*\{[^}]*inset-inline-end:\s*0/s,
    );
  });

  it('suppresses the browser search cancel affordance so the governed clear button is unique', () => {
    const css = readRequired(searchFieldCssPath);
    expect(css).toContain('::-webkit-search-cancel-button');
    expect(css).toMatch(/::-webkit-search-cancel-button[^}]*appearance:\s*none/s);
  });

  it('keeps text and icon color semantic across enabled and disabled states without validation styling', () => {
    const css = readRequired(searchFieldCssPath);
    expect(css).toContain('var(--dse-color-semantic-fg-primary)');
    expect(css).toContain('var(--dse-color-semantic-fg-tertiary)');
    expect(css).toContain('var(--dse-color-semantic-fg-disabled)');
    expect(css).not.toContain('feedback-negative');
    expect(css).not.toContain('aria-invalid');
  });

  it('is token-driven and direction-safe', () => {
    const css = readRequired(searchFieldCssPath);
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
    expect(css).not.toMatch(/\b(margin|padding|border)-(left|right)\b/i);
    expect(css).not.toMatch(/\b(left|right)\s*:/i);
  });
});
