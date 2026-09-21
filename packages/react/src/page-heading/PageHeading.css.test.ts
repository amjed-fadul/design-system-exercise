import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/page-heading/PageHeading.css');

function readCss() {
  expect(existsSync(cssPath), 'Page Heading CSS source must exist').toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

describe('Page Heading CSS boundary', () => {
  it('matches the reviewed Figma layout geometry without fixing the example width', () => {
    const css = readCss();

    expect(css).toContain('.dse-page-heading');
    expect(css).toMatch(/inline-size:\s*100%/);
    expect(css).not.toMatch(/inline-size:\s*1168px/);
    expect(css).toMatch(/gap:\s*10px/);
    expect(css).toMatch(/\.dse-page-heading__row\s*\{[^}]*justify-content:\s*space-between/);
    expect(css).not.toMatch(/\.dse-page-heading__row\s*\{[^}]*gap:\s*24px/);
    expect(css).toMatch(/\.dse-page-heading__text\s*\{[^}]*gap:\s*var\(--dse-spacing-semantic-stack-sm\)/);
    expect(css).toMatch(/\.dse-page-heading__actions\s*\{[^}]*gap:\s*var\(--dse-spacing-primitive-space-300\)/);
  });

  it('uses governed page-heading/body typography and semantic foreground tokens', () => {
    const css = readCss();

    for (const token of [
      '--dse-typography-semantic-headline-page-family',
      '--dse-typography-semantic-headline-page-size',
      '--dse-typography-semantic-headline-page-weight',
      '--dse-typography-semantic-headline-page-line-height',
      '--dse-typography-semantic-headline-page-letter-spacing',
      '--dse-typography-semantic-body-small-family',
      '--dse-typography-semantic-body-small-size',
      '--dse-typography-semantic-body-small-weight',
      '--dse-typography-semantic-body-small-line-height',
      '--dse-typography-semantic-body-small-letter-spacing',
      '--dse-color-semantic-fg-primary',
      '--dse-color-semantic-fg-secondary',
      '--dse-spacing-semantic-stack-sm',
      '--dse-spacing-primitive-space-300',
    ]) {
      expect(css).toContain(token);
    }
  });

  it('inherits writing direction and keeps text flexible so actions do not crowd long titles', () => {
    const css = readCss();

    expect(css).not.toMatch(/direction:\s*ltr/);
    expect(css).not.toMatch(/flex-direction:\s*row-reverse/);
    expect(css).toMatch(/\.dse-page-heading__text\s*\{[^}]*min-inline-size:\s*0/);
    expect(css).toMatch(/\.dse-page-heading__text\s*\{[^}]*flex:\s*1/);
    expect(css).toMatch(/\.dse-page-heading__actions\s*\{[^}]*flex-shrink:\s*0/);
  });
});
