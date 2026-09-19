import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { syncDocsCanvasPresentation } from './presentation';

const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8');
const preview = readFileSync(
  resolve(process.cwd(), '.storybook/preview.tsx'),
  'utf8',
);

function createCanvasElement() {
  return {
    dataset: {} as Record<string, string | undefined>,
    dir: '',
    removeAttribute(name: string) {
      if (name === 'dir') {
        this.dir = '';
      }
    },
  };
}

function createInlineStoryHarness() {
  const canvas = createCanvasElement();

  const storyRoot = {
    closest(selector: string) {
      return selector === '.dse-docs-canvas' ? canvas : null;
    },
    ownerDocument: {
      defaultView: {
        frameElement: null,
      },
    },
  } as unknown as Element;

  return { canvas, storyRoot };
}

function createIframeStoryHarness() {
  const canvas = createCanvasElement();

  const frameElement = {
    closest(selector: string) {
      return selector === '.dse-docs-canvas' ? canvas : null;
    },
  };

  const storyRoot = {
    closest() {
      return null;
    },
    ownerDocument: {
      defaultView: {
        frameElement,
      },
    },
  } as unknown as Element;

  return { canvas, storyRoot };
}

function expectDarkArabicPresentation(
  canvas: ReturnType<typeof createCanvasElement>,
) {
  expect(canvas.dataset.theme).toBe('dark');
  expect(canvas.dataset.language).toBe('ar');
  expect(canvas.dir).toBe('rtl');
}

function expectPresentationCleanup(
  canvas: ReturnType<typeof createCanvasElement>,
) {
  expect(canvas.dataset.theme).toBeUndefined();
  expect(canvas.dataset.language).toBeUndefined();
  expect(canvas.dir).toBe('');
}

describe('Storybook Docs playground theming', () => {
  it('assigns one global class to every Docs Canvas preview element', () => {
    expect(preview).toMatch(
      /docs:\s*\{[\s\S]*canvas:\s*\{[\s\S]*className:\s*['"]dse-docs-canvas['"]/,
    );
  });

  it('applies the local story presentation to an inline Docs Canvas host', () => {
    const { canvas, storyRoot } = createInlineStoryHarness();

    const cleanup = syncDocsCanvasPresentation(storyRoot, {
      theme: 'dark',
      language: 'arabic',
    });

    expectDarkArabicPresentation(canvas);

    cleanup();

    expectPresentationCleanup(canvas);
  });

  it('applies the local story presentation to the outer Docs Canvas for an iframe story', () => {
    const { canvas, storyRoot } = createIframeStoryHarness();

    const cleanup = syncDocsCanvasPresentation(storyRoot, {
      theme: 'dark',
      language: 'arabic',
    });

    expectDarkArabicPresentation(canvas);

    cleanup();

    expectPresentationCleanup(canvas);
  });

  it('does not overwrite a newer Canvas presentation during stale cleanup', () => {
    const { canvas, storyRoot } = createIframeStoryHarness();

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
