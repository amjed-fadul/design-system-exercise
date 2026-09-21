import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadProductContexts } from '../src/load.js';
import { validateProductContext } from '../src/validate.js';

const contexts = loadProductContexts();

describe('Northstar workspace shell product context', () => {
  it('publishes exactly one approved Northstar shell context', () => {
    expect(contexts).toHaveLength(1);
    const context = contexts[0]?.contract;
    expect(validateProductContext(context)).toEqual({ valid: true, errors: [] });
    expect(context).toEqual(
      expect.objectContaining({
        id: 'dse.product-context.northstar-workspace-shell',
        kind: 'product-context',
        status: 'approved',
        scope: 'workspace-shell',
        patternId: 'dse.pattern.application-shell',
      }),
    );
  });

  it('owns the canonical shell content hierarchy and asset references', () => {
    const context = contexts[0]?.contract as any;

    expect(context.composition.brand).toEqual(
      expect.objectContaining({
        productName: 'Northstar',
        order: ['brand-mark', 'product-name'],
      }),
    );
    expect(context.composition.topNavbar.accountOrder).toEqual([
      'appearance-utility',
      'account-label',
      'avatar',
    ]);
    expect(context.composition.sidebar.destinations.map((item: any) => item.label.en)).toEqual([
      'Overview',
      'Projects',
      'Team & access',
      'Settings',
    ]);
    expect(context.composition.sidebar.footer).toEqual(
      expect.objectContaining({
        layout: 'stack',
        primary: expect.objectContaining({ en: 'Northstar workspace' }),
        secondary: expect.objectContaining({ en: 'Signed in as Admin' }),
      }),
    );

    const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
    for (const asset of context.assets) {
      const assetPath = resolve(repoRoot, asset.path);
      expect(existsSync(assetPath), asset.path).toBe(true);
      const svg = readFileSync(assetPath, 'utf8');
      expect(svg).toContain('<svg');
    }
  });
});
