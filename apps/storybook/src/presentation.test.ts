import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  direction,
  languageCode,
  resolveStoryPresentation,
} from './presentation';

function storyFiles(root: string): string[] {
  return readdirSync(root).flatMap((entry) => {
    const path = resolve(root, entry);
    return statSync(path).isDirectory()
      ? storyFiles(path)
      : /\.stories\.(ts|tsx)$/.test(entry)
        ? [path]
        : [];
  });
}

describe('Storybook presentation scoping', () => {
  it('keeps Docs on toolbar globals while locally scoping a variant story', () => {
    const result = resolveStoryPresentation({
      globals: { theme: 'light', language: 'english' },
      parameters: {
        presentation: { theme: 'dark', language: 'arabic' },
      },
      viewMode: 'docs',
    });

    expect(result.document).toEqual({ theme: 'light', language: 'english' });
    expect(result.story).toEqual({ theme: 'dark', language: 'arabic' });
    expect(languageCode(result.story.language)).toBe('ar');
    expect(direction(result.story.language)).toBe('rtl');
  });

  it('lets a standalone named variant own the whole Canvas presentation', () => {
    const result = resolveStoryPresentation({
      globals: { theme: 'light', language: 'english' },
      parameters: {
        presentation: { theme: 'dark', language: 'arabic' },
      },
      viewMode: 'story',
    });

    expect(result.document).toEqual({ theme: 'dark', language: 'arabic' });
    expect(result.story).toEqual(result.document);
  });

  it('uses toolbar globals when a story has no local presentation override', () => {
    const result = resolveStoryPresentation({
      globals: { theme: 'dark', language: 'arabic' },
      parameters: {},
      viewMode: 'docs',
    });

    expect(result.document).toEqual({ theme: 'dark', language: 'arabic' });
    expect(result.story).toEqual(result.document);
  });

  it('does not allow story files to override Storybook globals directly', () => {
    const files = storyFiles(resolve(process.cwd(), 'src'));

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      expect(
        source,
        `${file} must use parameters.presentation for local theme/language variants`,
      ).not.toMatch(/\n\s*globals:\s*\{/);
    }
  });

  it('wires the shared preview decorator to document and story presentation separately', () => {
    const preview = readFileSync(
      resolve(process.cwd(), '.storybook/preview.tsx'),
      'utf8',
    );

    expect(preview).toMatch(/presentation\.document\.theme/);
    expect(preview).toMatch(/data-dse-story-presentation/);
    expect(preview).toMatch(/data-theme=\{presentation\.story\.theme\}/);
    expect(preview).toMatch(/dir=\{direction\(presentation\.story\.language\)\}/);
  });
});
