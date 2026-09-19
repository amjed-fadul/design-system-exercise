import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const css = readFileSync(
  fileURLToPath(new URL('./ConnectedProductPrototype.css', import.meta.url)),
  'utf8',
);

describe('Connected Product Prototype shell behavior', () => {
  it('lets Brand and Account wrappers inherit RTL while keeping only the Latin word LTR', () => {
    const brandRule = css.match(/\.dse-product-prototype__brand\s*\{[^}]*\}/)?.[0] ?? '';
    const brandWordRule =
      css.match(/\.dse-product-prototype__brand\s*>\s*strong\s*\{[^}]*\}/)?.[0] ?? '';
    const accountRule = css.match(/\.dse-product-prototype__account\s*\{[^}]*\}/)?.[0] ?? '';

    expect(brandRule).not.toMatch(/direction:\s*ltr/);
    expect(accountRule).not.toMatch(/direction:\s*ltr/);
    expect(brandWordRule).toMatch(/direction:\s*ltr/);
  });

  it('fits the current viewport height so the shell does not force page scrolling', () => {
    const rootRule = css.match(/\.dse-product-prototype\s*\{[^}]*\}/)?.[0] ?? '';

    expect(rootRule).toMatch(/block-size:\s*100dvh/);
    expect(rootRule).toMatch(/max-block-size:\s*100dvh/);
    expect(rootRule).not.toMatch(/block-size:\s*960px/);
  });

  it('squares only the docked inline-end Side Panel corners', () => {
    const panelRule =
      css.match(/\.dse-product-prototype__detail-panel\s*\{[^}]*\}/)?.[0] ?? '';

    expect(panelRule).toMatch(/border-start-end-radius:\s*0/);
    expect(panelRule).toMatch(/border-end-end-radius:\s*0/);
    expect(panelRule).not.toMatch(/border-start-start-radius:\s*0/);
    expect(panelRule).not.toMatch(/border-end-start-radius:\s*0/);
  });
});
