import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(
  resolve(process.cwd(), 'src/inline-feedback/InlineFeedback.css'),
  'utf8',
);

describe('InlineFeedback layout resilience', () => {
  it('cannot be vertically compressed below its wrapped content in flex-column hosts', () => {
    expect(css).toMatch(/\.dse-inline-feedback\s*\{[^}]*flex:\s*0\s+0\s+auto/s);
    expect(css).toMatch(
      /\.dse-inline-feedback__title,[\s\S]*\.dse-inline-feedback__message\s*\{[^}]*flex:\s*0\s+0\s+auto/s,
    );
    expect(css).toMatch(
      /\.dse-inline-feedback__title,[\s\S]*\.dse-inline-feedback__message\s*\{[^}]*inline-size:\s*100%/s,
    );
  });
});
