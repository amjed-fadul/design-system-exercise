import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageJsonPath = resolve(process.cwd(), 'package.json');
const verifierPath = resolve(process.cwd(), 'scripts/verify-application-shell-dist.mjs');
const indexPath = resolve(process.cwd(), 'src/index.ts');

describe('Application Shell packaged distribution gate', () => {
  it('publishes only the built package entry and stylesheet', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as any;

    expect(packageJson.private).toBe(false);
    expect(packageJson.files).toEqual(['dist']);
    expect(packageJson.exports?.['.']).toEqual(
      expect.objectContaining({
        types: './dist/index.d.ts',
        import: './dist/index.js',
      }),
    );
    expect(packageJson.exports?.['./styles.css']).toBe('./dist/styles.css');
  });

  it('depends on approved runtime packages without pulling contracts into production', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as any;

    expect(packageJson.dependencies?.['@design-system-exercise/react']).toBe('workspace:*');
    expect(packageJson.dependencies?.['@design-system-exercise/tokens']).toBe('workspace:*');
    expect(packageJson.dependencies?.['@design-system-exercise/contracts']).toBeUndefined();
  });

  it('exports ApplicationShell and runs its packed distribution verifier from prepack', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as any;
    const indexSource = readFileSync(indexPath, 'utf8');

    expect(indexSource).toMatch(/export \{ ApplicationShell \}/);
    expect(indexSource).toMatch(/ApplicationShellProps/);
    expect(existsSync(verifierPath)).toBe(true);
    expect(packageJson.scripts?.prepack).toContain('verify-application-shell-dist.mjs');
  });
});
