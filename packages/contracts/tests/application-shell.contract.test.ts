import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = fileURLToPath(
  new URL('../patterns/application-shell.contract.json', import.meta.url),
);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

describe('dse.pattern.application-shell contract', () => {
  it('locks P01 to the live Application Shell authority and approved component dependencies', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.pattern.application-shell');
    expect(contract.version).toBe('1.0.0');
    expect(contract.status).toBe('approved');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '68:494',
    });
    expect(contract.sources.implementationPackage).toBe('@design-system-exercise/patterns');

    expect(contract.componentDependencies).toEqual(
      expect.arrayContaining([
        { id: 'dse.sidebar', minimumVersion: '1.0.0' },
        { id: 'dse.top-navbar', minimumVersion: '1.0.0' },
        { id: 'dse.page-heading', minimumVersion: '1.0.0' },
      ]),
    );
  });

  it('declares the public consumer export and exact runtime props', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.publicApi.exportName).toBe('ApplicationShell');
    expect(contract.publicApi.forwardNativeAttributes).toBe(false);
    expect(contract.publicApi.props).toEqual([
      expect.objectContaining({
        name: 'sidebar',
        required: true,
        type: { component: 'dse.sidebar' },
      }),
      expect.objectContaining({
        name: 'topNavbar',
        required: true,
        type: { component: 'dse.top-navbar' },
      }),
      expect.objectContaining({
        name: 'pageHeading',
        required: false,
        type: { component: 'dse.page-heading' },
      }),
      expect.objectContaining({
        name: 'children',
        required: true,
        type: { content: true },
      }),
      expect.objectContaining({
        name: 'viewportMode',
        required: false,
        default: 'auto',
        type: { enum: ['auto', 'expanded', 'compact'] },
      }),
    ]);
  });

  it('keeps responsive layout ownership in the shell without taking workflow or product state', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.stateModel).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'viewportMode', owner: 'pattern' }),
        expect.objectContaining({ key: 'resolvedLayoutMode', owner: 'pattern' }),
        expect.objectContaining({ key: 'workflowState', owner: 'consumer' }),
      ]),
    );

    expect(contract.responsiveRules).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/1200.*expanded|expanded.*1200/i),
        expect.stringMatching(/below 1200.*compact|compact.*below 1200/i),
        expect.stringMatching(/expanded.*208|208.*expanded/i),
        expect.stringMatching(/compact.*64|64.*compact/i),
        expect.stringMatching(/32.*inset/i),
        expect.stringMatching(/960.*1440/i),
        expect.stringMatching(/320.*zoom|zoom.*320/i),
      ]),
    );

    expect(contract.invariants).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/does not remount|must not remount/i),
        expect.stringMatching(/logical.*rtl|rtl.*logical/i),
        expect.stringMatching(/main.*scroll|scroll.*main/i),
        expect.stringMatching(/sidebar.*mode|mode.*sidebar/i),
      ]),
    );
  });

  it('forbids product workflow authority and duplicate primitive implementations', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.forbidden).toEqual(
      expect.arrayContaining([
        'query state',
        'selection state',
        'draft state',
        'request lifecycle',
        'member records',
        'permissions',
        'backend operations',
        'reimplemented Sidebar',
        'reimplemented Top Navbar',
        'reimplemented Page Heading',
      ]),
    );
  });

  it('requires native landmarks and short-window/resize runtime verification', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.runtimeRequirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/header.*nav.*main|landmark/i),
        expect.stringMatching(/1199.*1200/i),
        expect.stringMatching(/resiz.*state|state.*resiz/i),
        expect.stringMatching(/short.*window.*scroll|scroll.*short.*window/i),
      ]),
    );
  });
});
