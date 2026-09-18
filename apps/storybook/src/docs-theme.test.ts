import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8');

describe('Storybook Docs semantic theming', () => {
  it('binds the Autodocs shell to DS semantic theme tokens', () => {
    expect(css).toMatch(
      /\.sbdocs-wrapper,[\s\S]*\.sbdocs-content\s*\{[^}]*background:\s*var\(--dse-color-semantic-surface-canvas\)[^}]*color:\s*var\(--dse-color-semantic-fg-primary\)/s,
    );
  });

  it('uses semantic foreground and link colors for Docs copy', () => {
    expect(css).toMatch(/\.sbdocs-title,[\s\S]*--dse-color-semantic-fg-primary/s);
    expect(css).toMatch(/\.sbdocs-a\s*\{[^}]*--dse-color-semantic-link-default/s);
  });

  it('themes inline Docs code without changing component story CSS', () => {
    expect(css).toMatch(
      /\.sbdocs-wrapper code:not\(\[class\*='language-'\]\),[\s\S]*--dse-color-semantic-surface-section/s,
    );
  });
});
