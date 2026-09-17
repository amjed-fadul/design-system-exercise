import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageJsonPath = resolve(process.cwd(), 'package.json');
const copyAssetsPath = resolve(process.cwd(), 'scripts/copy-assets.mjs');
const verifierPath = resolve(process.cwd(), 'scripts/verify-table-dist.mjs');
const indexPath = resolve(process.cwd(), 'src/index.ts');

describe('Table packaged distribution gate', () => {
  it('ships Table CSS through the aggregated package stylesheet', () => {
    const copyAssets = readFileSync(copyAssetsPath, 'utf8');
    expect(copyAssets).toContain("../src/table/Table.css");
    expect(copyAssets).toContain('tableCss.trimEnd()');
  });

  it('exports only public Table symbols and keeps private helpers internal', () => {
    const indexSource = readFileSync(indexPath, 'utf8');
    expect(indexSource).toMatch(/export { Table }/);
    expect(indexSource).toMatch(/TableRowData/);
    expect(indexSource).toMatch(/TableProps/);
    expect(indexSource).not.toMatch(/TableHeader/);
    expect(indexSource).not.toMatch(/TableRow[^D]/);
  });

  it('runs a component-specific packed distribution verifier from prepack', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      scripts?: Record<string, string>;
    };

    expect(existsSync(verifierPath)).toBe(true);
    expect(packageJson.scripts?.prepack).toContain('verify-table-dist.mjs');
  });
});
