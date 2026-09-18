import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8');
const preview = readFileSync(
  resolve(process.cwd(), '.storybook/preview.tsx'),
  'utf8',
);

describe('Storybook Docs playground theming', () => {
  it('assigns one global class to every Docs Canvas preview element', () => {
    expect(preview).toMatch(
      /docs:\s*\{[\s\S]*canvas:\s*\{[\s\S]*className:\s*['"]dse-docs-canvas['"]/,
    );
  });

  it('themes only the Docs playground with DS semantic tokens', () => {
    expect(css).toMatch(
      /\.dse-docs-canvas\s*\{[^}]*background:\s*var\(--dse-color-semantic-surface-canvas\)[^}]*color:\s*var\(--dse-color-semantic-fg-primary\)/s,
    );
  });

  it('does not theme the entire Autodocs page shell', () => {
    expect(css).not.toMatch(/\.sbdocs-wrapper/);
    expect(css).not.toMatch(/\.sbdocs-content/);
  });
});
