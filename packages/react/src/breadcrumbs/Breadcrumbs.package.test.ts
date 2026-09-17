import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageJsonPath = resolve(process.cwd(), 'package.json');
const copyAssetsPath = resolve(process.cwd(), 'scripts/copy-assets.mjs');
const verifierPath = resolve(process.cwd(), 'scripts/verify-breadcrumbs-dist.mjs');
const indexPath = resolve(process.cwd(), 'src/index.ts');

describe('Breadcrumbs packaged distribution gate', () => {
  it('ships Breadcrumbs CSS through the aggregated package stylesheet', () => {
    const copyAssets = readFileSync(copyAssetsPath, 'utf8');
    expect(copyAssets).toContain("../src/breadcrumbs/Breadcrumbs.css");
    expect(copyAssets).toContain('breadcrumbsCss.trimEnd()');
  });

  it('exports Breadcrumbs publicly without exporting the private Breadcrumb Link Item', () => {
    const indexSource = readFileSync(indexPath, 'utf8');
    expect(indexSource).toMatch(/export \{ Breadcrumbs \}/);
    expect(indexSource).toMatch(/BreadcrumbAncestor/);
    expect(indexSource).toMatch(/BreadcrumbsProps/);
    expect(indexSource).not.toMatch(/BreadcrumbLinkItem/);
  });

  it('runs a component-specific packed distribution verifier from prepack', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      scripts?: Record<string, string>;
    };

    expect(existsSync(verifierPath)).toBe(true);
    expect(packageJson.scripts?.prepack).toContain('verify-breadcrumbs-dist.mjs');
  });
});
