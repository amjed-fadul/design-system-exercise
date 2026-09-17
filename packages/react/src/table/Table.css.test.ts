import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/table/Table.css');

function readCss() {
  expect(existsSync(cssPath), 'Table CSS source must exist').toBe(true);
  if (!existsSync(cssPath)) return '';
  return readFileSync(cssPath, 'utf8');
}

function rule(css: string, selector: string) {
  const marker = `${selector} {`;
  const start = css.indexOf(marker);
  expect(start, `missing CSS rule: ${selector}`).toBeGreaterThanOrEqual(0);
  if (start < 0) return '';
  const end = css.indexOf('}', start);
  expect(end, `unterminated CSS rule: ${selector}`).toBeGreaterThan(start);
  return css.slice(start, end + 1);
}

describe('Table CSS boundary', () => {
  it('locks the reviewed semantic shell, fixed four-column geometry, and content-growing rows', () => {
    const css = readCss();

    expect(rule(css, '.dse-table-shell')).toContain('min-inline-size: 736px');
    expect(rule(css, '.dse-table')).toContain('table-layout: fixed');
    expect(rule(css, '.dse-table__header-cell')).toContain('block-size: 44px');
    expect(rule(css, '.dse-table__row')).toContain('min-block-size: 60px');
    expect(rule(css, '.dse-table__footer-cell')).toContain('block-size: 48px');

    expect(rule(css, '.dse-table__col-secondary')).toContain('inline-size: 124px');
    expect(rule(css, '.dse-table__col-status')).toContain('inline-size: 184px');
    expect(rule(css, '.dse-table__col-action')).toContain('inline-size: 156px');

    expect(rule(css, '.dse-table__cell-primary')).toContain('padding-inline-start: 20px');
    expect(rule(css, '.dse-table__cell-secondary')).toContain('padding-inline-start: 24px');
    expect(rule(css, '.dse-table__cell-status')).toContain('padding-inline-start: 24px');
    expect(rule(css, '.dse-table__cell-action')).toContain('padding-inline-start: 8px');
    expect(rule(css, '.dse-table__cell-action')).toContain('padding-inline-end: 20px');
    expect(rule(css, '.dse-table__body-cell')).toContain('padding-block: 6px');
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

    expect(rule(css, ".dse-table__row:not([data-selected='true']):hover > .dse-table__body-cell"))
      .toContain('var(--dse-color-semantic-state-hover)');
    expect(rule(css, ".dse-table__row[data-selected='true'] > .dse-table__body-cell"))
      .toContain('var(--dse-color-semantic-state-selected)');

    expect(css).not.toContain('direction: ltr');
    expect(css).not.toContain('direction: rtl');
    expect(css).not.toContain('margin-left');
    expect(css).not.toContain('margin-right');
    expect(css).not.toContain('padding-left');
    expect(css).not.toContain('padding-right');
  });
});
