import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contractPath = resolve(process.cwd(), 'components/page-heading.contract.json');

function readContract() {
  expect(existsSync(contractPath), 'Page Heading contract source must exist').toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

describe('dse.page-heading contract', () => {
  it('publishes only page title, optional description visibility, Breadcrumbs, and Actions composition', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.page-heading');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '142:2488',
    });

    expect(contract.publicApi.props.map((prop: any) => prop.name)).toEqual([
      'title',
      'description',
      'showDescription',
      'breadcrumbs',
      'actions',
    ]);
    expect(contract.publicApi.props.find((prop: any) => prop.name === 'title')?.required).toBe(true);
    expect(contract.publicApi.props.find((prop: any) => prop.name === 'showDescription')?.default).toBe(true);
    expect(contract.publicApi.forwardNativeAttributes).toBe(false);
  });

  it('records the Figma slot limits and keeps unrelated shell/search behavior out of the API', () => {
    const contract = readContract();
    if (!contract) return;

    const composition = JSON.stringify(contract.composition);
    expect(composition).toMatch(/breadcrumbs/i);
    expect(composition).toMatch(/max[^0-9]*1|at most one/i);
    expect(composition).toMatch(/actions/i);
    expect(composition).toMatch(/max[^0-9]*2|at most two/i);

    expect(contract.forbidden).toEqual(
      expect.arrayContaining([
        'children',
        'headingLevel',
        'search',
        'searchField',
        'navigation',
        'theme',
        'onNavigate',
        'onAction',
      ]),
    );

    const requirements = contract.semantics.requirements.join(' ');
    expect(requirements).toMatch(/h1|level-one/i);
    expect(requirements).toMatch(/Breadcrumbs/i);
    expect(requirements).toMatch(/two.*Button|Buttons.*two/i);
    expect(requirements).toMatch(/Application Shell|Shell/i);
  });
});
