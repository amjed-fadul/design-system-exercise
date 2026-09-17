import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const publicContractPath = fileURLToPath(
  new URL('../components/breadcrumbs.contract.json', import.meta.url),
);
const internalContractPath = fileURLToPath(
  new URL('../components/_breadcrumb-link-item.contract.json', import.meta.url),
);

function readContract(path: string) {
  expect(existsSync(path)).toBe(true);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.breadcrumbs contract', () => {
  it('locks the public Figma source and route-hierarchy API', () => {
    const contract = readContract(publicContractPath);
    if (!contract) return;

    expect(contract.id).toBe('dse.breadcrumbs');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '139:20',
    });
    expect(contract.sources.implementationPackage).toBe('@design-system-exercise/react');

    expect(propFor(contract, 'ancestors')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
    expect(propFor(contract, 'currentLabel')).toEqual(
      expect.objectContaining({ required: true, type: { native: true } }),
    );
    expect(propFor(contract, 'ariaLabel')).toEqual(
      expect.objectContaining({ required: false, default: 'Breadcrumbs', type: { native: true } }),
    );

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const forbidden of ['separator', 'collapse', 'overflow', 'currentHref', 'disabled', 'visited', 'theme', 'children']) {
      expect(publicNames).not.toContain(forbidden);
    }
  });

  it('requires at least one ancestor and keeps current location plain text', () => {
    const contract = readContract(publicContractPath);
    if (!contract) return;

    expect(contract.semantics.element).toMatch(/nav/i);
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/at least one ancestor/i),
        expect.stringMatching(/current.*plain text|plain text.*current/i),
        expect.stringMatching(/aria-current/i),
        expect.stringMatching(/separator.*decorative|decorative.*separator/i),
      ]),
    );
    expect(contract.forbidden).toEqual(
      expect.arrayContaining(['collapse', 'overflow menu', 'custom separator', 'current page link']),
    );
  });
});

describe('dse._breadcrumb-link-item contract', () => {
  it('stays internal and composes the governed Link plus decorative separator', () => {
    const contract = readContract(internalContractPath);
    if (!contract) return;

    expect(contract.id).toBe('dse._breadcrumb-link-item');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('internal');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '139:16',
    });
    expect(contract.sources.implementationPackage).toBeUndefined();
    expect(contract.publicApi.props).toEqual([]);
    expect(contract.composition).toEqual(
      expect.objectContaining({
        content: expect.objectContaining({ allowedChildren: expect.arrayContaining(['Link', 'decorative separator']) }),
      }),
    );
    expect(contract.forbidden).toEqual(
      expect.arrayContaining(['public package export', 'separator prop', 'current prop']),
    );
  });
});
