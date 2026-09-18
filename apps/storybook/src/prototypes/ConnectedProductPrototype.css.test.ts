import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const css = readFileSync(
  fileURLToPath(new URL('./ConnectedProductPrototype.css', import.meta.url)),
  'utf8',
);

describe('Connected Product Prototype RTL shell composition', () => {
  it('lets Brand and Account wrappers inherit RTL while keeping only the Latin word LTR', () => {
    const brandRule = css.match(/\.dse-product-prototype__brand\s*\{[^}]*\}/)?.[0] ?? '';
    const brandWordRule =
      css.match(/\.dse-product-prototype__brand\s*>\s*strong\s*\{[^}]*\}/)?.[0] ?? '';
    const accountRule = css.match(/\.dse-product-prototype__account\s*\{[^}]*\}/)?.[0] ?? '';

    expect(brandRule).not.toMatch(/direction:\s*ltr/);
    expect(accountRule).not.toMatch(/direction:\s*ltr/);
    expect(brandWordRule).toMatch(/direction:\s*ltr/);
  });
});
