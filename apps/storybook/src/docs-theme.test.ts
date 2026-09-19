import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { syncDocsCanvasPresentation } from './presentation';

const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8');
const preview = readFileSync(
  resolve(process.cwd(), '.storybook/preview.tsx'),
  'utf8',
);

function createDocsCanvasHarness() {
  const canvas = {
    dataset: {} as Record<string, string | undefined>,
    dir: '',
    removeAttribute(name: string) {
      if (name === 'dir') {
        this.dir = '';
      }
    },
  };

  const storyRoot = {
    closest(selector: string) {
      return selector === '.dse-docs-canvas' ? canvas : null;
    },
  } as unknown as Element;

  return { canvas, storyRoot };
}

describe('Storybook Docs playground theming', () => {
  it('assigns one global class to every Docs Canvas preview element', () => {
    expect(preview).toMatch(
      /docs:\s*\{[\s\S]*canvas:\s*\{[\s\S]*className:\s*['"]dse-docs-canvas['"]/,
    );
  });

  it('applies the local story presentation to its Docs Canvas host', () => {
    const { canvas, storyRoot } = createDocsCanvasHarness();

    const cleanup = syncDocsCanvasPresentation(storyRoot, {
      theme: 'dark',
      language: 'arabic',
    });

    expect(canvas.dataset.theme).toBe('dark');
    expect(canvas.dataset.language).toBe('ar');
    expect(canvas.dir).toBe('rtl');

    cleanup();

    expect(canvas.dataset.theme).toBeUndefined();
    expect(canvas.dataset.language).toBeUndefined();
    expect(canvas.dir).toBe('');
  });

  it('does not overwrite a newer Canvas presentation during stale cleanup', () => {
    const { canvas, storyRoot } = createDocsCanvasHarness();

    const cleanup = syncDocsCanvasPresentation(storyRoot, {
      theme: 'dark',
      language: 'arabic',
    });

    canvas.dataset.theme = 'light';
    canvas.dataset.language = 'en';
    canvas.dir = 'ltr';
    cleanup();

    expect(canvas.dataset.theme).toBe('light');
    expect(canvas.dataset.language).toBe('en');
    expect(canvas.dir).toBe('ltr');
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
