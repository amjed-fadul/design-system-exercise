import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/radio-group/RadioGroup.css');
const groupContractPath = resolve(
  process.cwd(),
  '../contracts/components/radio-group.contract.json',
);
const optionContractPath = resolve(
  process.cwd(),
  '../contracts/components/_radio-option.contract.json',
);

function readRequired(path: string) {
  expect(existsSync(path)).toBe(true);
  if (!existsSync(path)) return '';
  return readFileSync(path, 'utf8');
}

function dependencies(path: string): string[] {
  return (JSON.parse(readFileSync(path, 'utf8')) as { tokenDependencies: string[] })
    .tokenDependencies;
}

describe('Radio Group visual contract', () => {
  it('uses every governed Radio Group and Radio Option token dependency', () => {
    const css = readRequired(cssPath);
    for (const token of [...dependencies(groupContractPath), ...dependencies(optionContractPath)]) {
      expect(css, `missing governed Radio token ${token}`).toContain(`var(${token})`);
    }
  });

  it('preserves the audited group and option geometry without fixing wrapped option height', () => {
    const css = readRequired(cssPath);

    expect(css).toMatch(
      /\.dse-radio-group__legend\s*\{[^}]*gap:\s*var\(--dse-spacing-primitive-space-100\)[^}]*margin-block-end:\s*var\(--dse-spacing-primitive-space-200\)/s,
    );
    expect(css).toMatch(
      /\.dse-radio-group__options\s*\{[^}]*gap:\s*var\(--dse-spacing-primitive-space-100\)/s,
    );
    expect(css).toMatch(
      /\.dse-radio-option\s*\{[^}]*min-block-size:\s*var\(--dse-spacing-primitive-space-900\)[^}]*padding:\s*var\(--dse-spacing-primitive-space-200\)[^}]*gap:\s*10px[^}]*border-radius:\s*var\(--dse-radius-shape-control\)/s,
    );
    expect(css).not.toMatch(/\.dse-radio-option\s*\{[^}]*\bblock-size:\s*64px/s);
    expect(css).toMatch(/\.dse-radio-option__control\s*\{[^}]*inline-size:\s*28px[^}]*block-size:\s*28px/s);
    expect(css).toMatch(
      /\.dse-radio-option__indicator\s*\{[^}]*inline-size:\s*var\(--dse-icons-size-md\)[^}]*block-size:\s*var\(--dse-icons-size-md\)/s,
    );
    expect(css).toMatch(/\.dse-radio-option__text\s*\{[^}]*gap:\s*2px/s);
    expect(css).toContain('var(--dse-radius-shape-rounded)');
    expect(css).not.toMatch(/border-radius:\s*999px/);
  });

  it('derives checked, hover, pressed, focus-visible, and disabled presentation from native state', () => {
    const css = readRequired(cssPath);

    expect(css).toContain('.dse-radio-option__input:checked');
    expect(css).toContain('.dse-radio-option:hover');
    expect(css).toContain('.dse-radio-option:active');
    expect(css).toContain('.dse-radio-option__input:focus-visible');
    expect(css).toContain('.dse-radio-option:has(.dse-radio-option__input:disabled)');
    expect(css).toContain('var(--dse-color-semantic-control-selected)');
    expect(css).toContain('var(--dse-color-semantic-focus-default)');
    expect(css).toContain('var(--dse-color-semantic-state-hover)');
    expect(css).toContain('var(--dse-color-semantic-action-ghost-pressed)');
  });

  it('allows label and description content to wrap and grow', () => {
    const css = readRequired(cssPath);
    expect(css).toMatch(/\.dse-radio-option__text\s*\{[^}]*min-inline-size:\s*0/s);
    expect(css).not.toMatch(/\.dse-radio-option__(label|description)\s*\{[^}]*white-space:\s*nowrap/s);
    expect(css).not.toMatch(/\.dse-radio-option__(label|description)\s*\{[^}]*overflow:\s*hidden/s);
  });

  it('is token-driven and direction-safe without mirroring the radio glyph', () => {
    const css = readRequired(cssPath);
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
    expect(css).not.toMatch(/\b(margin|padding|border)-(left|right)\b/i);
    expect(css).not.toMatch(/\b(left|right)\s*:/i);
    expect(css).not.toMatch(/scaleX\s*\(\s*-1\s*\)/i);
  });
});
