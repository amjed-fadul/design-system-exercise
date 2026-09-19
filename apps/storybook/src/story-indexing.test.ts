import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

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

describe('Storybook CSF indexing', () => {
  it('excludes exported *Meta test helpers from the story index', () => {
    const files = storyFiles(resolve(process.cwd(), 'src'));

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      const exportsMetaHelper = /export\s+const\s+\w+Meta\s*=\s*meta\s*;/.test(source);

      if (!exportsMetaHelper) continue;

      expect(
        source,
        `${file} exports a *Meta helper but does not exclude it from Storybook indexing`,
      ).toMatch(/excludeStories\s*:\s*\/\.\*Meta\$\//);
    }
  });
});
