import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const css = readFileSync(
  fileURLToPath(new URL('./ProjectsManagementPrototype.css', import.meta.url)),
  'utf8',
);

describe('Projects Management detail composition', () => {
  it('does not squeeze the directory beside the Side Panel', () => {
    expect(css).not.toMatch(/grid-template-columns/);
    expect(css).not.toMatch(/dse-projects-prototype__side-panel/);
  });

  it('keeps LTR project keys at the parent logical start in RTL and LTR', () => {
    expect(css).toMatch(
      /\.dse-projects-prototype__project-key\s*\{[^}]*justify-self:\s*start[^}]*inline-size:\s*fit-content[^}]*unicode-bidi:\s*isolate[^}]*\}/s,
    );
  });
});
