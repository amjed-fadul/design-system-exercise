import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const storyDirectories = ['components', 'patterns'];

function descriptionFrom(source: string): string | null {
  const match = source.match(/description:\s*{\s*component:\s*("(?:\\.|[^"\\])*")/s);
  return match ? (JSON.parse(match[1]) as string) : null;
}

describe('Storybook Docs copy', () => {
  it('uses a readable Contract / Runtime / Guidance hierarchy without Figma references', () => {
    for (const directory of storyDirectories) {
      const root = resolve(process.cwd(), 'src', directory);

      for (const entry of readdirSync(root).filter((name) => /\.stories\.(ts|tsx)$/.test(name))) {
        const source = readFileSync(resolve(root, entry), 'utf8');
        const description = descriptionFrom(source);
        if (!description) continue;

        expect(description, entry).toContain('**Contract**');
        expect(description, entry).toContain('**Runtime**');
        expect(description, entry).toContain('**Guidance**');
        expect(description, entry).not.toMatch(/Figma/i);
        expect(description, entry).not.toMatch(/\b\d{2,3}:\d{1,5}\b/);
      }
    }
  });
});
