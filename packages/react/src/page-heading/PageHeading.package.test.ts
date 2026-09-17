import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageJsonPath = resolve(process.cwd(), 'package.json');
const copyAssetsPath = resolve(process.cwd(), 'scripts/copy-assets.mjs');
const verifierPath = resolve(process.cwd(), 'scripts/verify-page-heading-dist.mjs');

describe('Page Heading packaged distribution gate', () => {
  it('ships Page Heading CSS through the aggregated package stylesheet', () => {
    const copyAssets = readFileSync(copyAssetsPath, 'utf8');
    expect(copyAssets).toContain("../src/page-heading/PageHeading.css");
    expect(copyAssets).toContain('pageHeadingCss.trimEnd()');
  });

  it('runs a component-specific packed distribution verifier from prepack', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      scripts?: Record<string, string>;
    };

    expect(existsSync(verifierPath)).toBe(true);
    expect(packageJson.scripts?.prepack).toContain('verify-page-heading-dist.mjs');
  });
});
