import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/table/Table.css');

function readCss() {
  expect(existsSync(cssPath), 'Table CSS source must exist').toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

describe('Table CSS boundary', () => {
  it('locks the reviewed semantic shell, fixed four-column geometry, and content-growing rows', () => {
    const css = readCss();

    expect(css).toContain('.dse-table-shell');
    expect(css).toMatch(/.dse-table-shells*{[^}]*min-inline-size:s*736px/);
    expect(css).toMatch(/.dse-tables*{[^}]*table-layout:s*fixed/);
    expect(css).toMatch(/.dse-table__header-cells*{[^}]*block-size:s*44px/);
    expect(css).toMatch(/.dse-table__rows*{[^}]*min-block-size:s*60px/);
    expect(css).toMatch(/.dse-table__footer-cells*{[^}]*block-size:s*48px/);

    expect(css).toMatch(/.dse-table__col-secondarys*{[^}]*inline-size:s*124px/);
    expect(css).toMatch(/.dse-table__col-statuss*{[^}]*inline-size:s*184px/);
    expect(css).toMatch(/.dse-table__col-actions*{[^}]*inline-size:s*156px/);

    expect(css).toMatch(/.dse-table__cell-primarys*{[^}]*padding-inline-start:s*20px/);
    expect(css).toMatch(/.dse-table__cell-secondarys*{[^}]*padding-inline-start:s*24px/);
    expect(css).toMatch(/.dse-table__cell-statuss*{[^}]*padding-inline-start:s*24px/);
    expect(css).toMatch(/.dse-table__cell-actions*{[^}]*padding-inline-start:s*8px/);
    expect(css).toMatch(/.dse-table__cell-actions*{[^}]*padding-inline-end:s*20px/);
    expect(css).toMatch(/.dse-table__body-cells*{[^}]*padding-block:s*6px/);
  });

  it('uses the reviewed semantic colors, radius, and typography tokens', () => {
    const css = readCss();

    for (const token of [
      '--dse-color-semantic-surface-default',
      '--dse-color-semantic-surface-section',
      '--dse-color-semantic-border-subtle',
      '--dse-color-semantic-fg-secondary',
      '--dse-color-semantic-state-hover',
      '--dse-color-semantic-state-selected',
      '--dse-radius-shape-surface',
      '--dse-typography-semantic-label-default-family',
      '--dse-typography-semantic-label-default-size',
      '--dse-typography-semantic-label-default-weight',
      '--dse-typography-semantic-label-default-line-height',
      '--dse-typography-semantic-label-default-letter-spacing',
      '--dse-typography-semantic-caption-default-family',
      '--dse-typography-semantic-caption-default-size',
      '--dse-typography-semantic-caption-default-weight',
      '--dse-typography-semantic-caption-default-line-height',
      '--dse-typography-semantic-caption-default-letter-spacing',
    ]) {
      expect(css).toContain(token);
    }
  });

  it('derives hover from CSS, lets selected win, and inherits writing direction', () => {
    const css = readCss();

    expect(css).toMatch(/.dse-table__row:not([data-selected='true']):hover/);
    expect(css).toMatch(/.dse-table__row[data-selected='true']/);
    expect(css).not.toMatch(/direction:s*ltr/);
    expect(css).not.toMatch(/direction:s*rtl/);
    expect(css).not.toMatch(/margin-left|margin-right|padding-left|padding-right/);
  });
});
