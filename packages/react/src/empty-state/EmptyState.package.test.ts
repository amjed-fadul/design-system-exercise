import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageJsonPath = resolve(process.cwd(), 'package.json');
const copyAssetsPath = resolve(process.cwd(), 'scripts/copy-assets.mjs');
const verifierPath = resolve(process.cwd(), 'scripts/verify-empty-state-dist.mjs');

describe('EmptyState packaged distribution gate', () => {
  it('ships Empty State CSS through the aggregated package stylesheet', () => {
    const copyAssets = readFileSync(copyAssetsPath, 'utf8');

    expect(copyAssets).toContain("../src/empty-state/EmptyState.css");
    expect(copyAssets).toContain('emptyStateCss.trimEnd()');
  });

  it('runs a component-specific packed distribution verifier from prepack', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      scripts?: Record<string, string>;
    };

    expect(existsSync(verifierPath)).toBe(true);
    expect(packageJson.scripts?.prepack).toContain('verify-empty-state-dist.mjs');
  });
});
