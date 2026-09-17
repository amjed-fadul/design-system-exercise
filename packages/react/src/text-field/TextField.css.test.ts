import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const inputControlCssPath = resolve(process.cwd(), 'src/internal/input-control/InputControl.css');
const textFieldCssPath = resolve(process.cwd(), 'src/text-field/TextField.css');
const internalContractPath = resolve(
  process.cwd(),
  '../contracts/components/_input-control.contract.json',
);
const textFieldContractPath = resolve(
  process.cwd(),
  '../contracts/components/text-field.contract.json',
);

function readRequired(path: string) {
  expect(existsSync(path)).toBe(true);
  if (!existsSync(path)) return '';
  return readFileSync(path, 'utf8');
}

function tokenDependencies(path: string): string[] {
  return (JSON.parse(readFileSync(path, 'utf8')) as { tokenDependencies: string[] }).tokenDependencies;
}

describe('Text Field visual contract', () => {
  it('uses every internal-shell contract token dependency', () => {
    const css = readRequired(inputControlCssPath);
    for (const token of tokenDependencies(internalContractPath)) {
      expect(css, `missing governed internal token ${token}`).toContain(`var(${token})`);
    }
  });

  it('derives compact and default shell heights from public spacing tokens', () => {
    const css = readRequired(inputControlCssPath);
    expect(css).toMatch(
      /\.dse-input-control\[data-size=['"]compact['"]\]\s*\{[^}]*block-size:\s*var\(--dse-spacing-primitive-space-700\)/s,
    );
    expect(css).toMatch(
      /\.dse-input-control\[data-size=['"]default['"]\]\s*\{[^}]*block-size:\s*calc\(\s*var\(--dse-spacing-primitive-space-700\)\s*\+\s*var\(--dse-spacing-primitive-space-100\)\s*\)/s,
    );
  });

  it('derives shell hover, focus, disabled, invalid, and invalid-focus from the descendant input', () => {
    const css = readRequired(inputControlCssPath);
    expect(css).toContain(':has(input:hover');
    expect(css).toContain(':has(input:focus-visible)');
    expect(css).toContain(':has(input:disabled)');
    expect(css).toContain(":has(input[aria-invalid='true'])");
    expect(css).toContain(":has(input[aria-invalid='true']:focus-visible)");
    expect(css).not.toContain('[data-state=');
  });

  it('uses every public Text Field contract token dependency', () => {
    const css = readRequired(textFieldCssPath);
    for (const token of tokenDependencies(textFieldContractPath)) {
      expect(css, `missing governed Text Field token ${token}`).toContain(`var(${token})`);
    }
  });

  it('keeps Text Field CSS token-driven and direction-safe', () => {
    const css = `${readRequired(inputControlCssPath)}\n${readRequired(textFieldCssPath)}`;
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
    expect(css).not.toMatch(/\b(margin|padding|border)-(left|right)\b/i);
    expect(css).not.toMatch(/\b(left|right)\s*:/i);
  });

  it('styles invalid messaging separately while the private shell owns visible focus presentation', () => {
    const fieldCss = readRequired(textFieldCssPath);
    const shellCss = readRequired(inputControlCssPath);
    expect(fieldCss).toContain('.dse-text-field__message--invalid');
    expect(fieldCss).toContain('var(--dse-color-semantic-feedback-negative-fg)');
    expect(fieldCss).toContain('.dse-text-field__input');
    expect(shellCss).toContain(':has(input:focus-visible)');
    expect(shellCss).toContain('var(--dse-color-semantic-focus-default)');
  });
});
