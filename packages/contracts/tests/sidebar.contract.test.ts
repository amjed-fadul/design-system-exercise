import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = fileURLToPath(
  new URL('../components/sidebar.contract.json', import.meta.url),
);

function readContract() {
  expect(existsSync(contractPath)).toBe(true);
  if (!existsSync(contractPath)) return null;
  return JSON.parse(readFileSync(contractPath, 'utf8')) as any;
}

function propFor(contract: any, name: string) {
  return contract?.publicApi?.props?.find((prop: any) => prop.name === name);
}

describe('dse.sidebar contract', () => {
  it('defines the approved public boundary and exact Figma provenance', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.id).toBe('dse.sidebar');
    expect(contract.version).toBe('1.0.0');
    expect(contract.visibility).toBe('public');
    expect(contract.sources.figma).toEqual({
      fileKey: 'tYCXBBYoQ92AUKVbND5WkG',
      nodeId: '146:166',
    });

    expect(propFor(contract, 'mode')).toEqual(
      expect.objectContaining({
        required: false,
        default: 'expanded',
        type: { enum: ['expanded', 'compact'] },
      }),
    );
    expect(propFor(contract, 'label')).toEqual(
      expect.objectContaining({ required: false, default: 'WORKSPACE' }),
    );
    expect(propFor(contract, 'items')).toEqual(
      expect.objectContaining({ required: true, type: { content: true } }),
    );
    expect(propFor(contract, 'currentId')).toEqual(
      expect.objectContaining({ required: true, type: { native: true } }),
    );
    expect(propFor(contract, 'footer')).toEqual(
      expect.objectContaining({ required: false, type: { content: true } }),
    );
  });

  it('keeps routing, shell placement, and interaction representation outside the public API', () => {
    const contract = readContract();
    if (!contract) return;

    const publicNames = contract.publicApi.props.map((prop: any) => prop.name);
    for (const unsupported of [
      'children',
      'navigation',
      'state',
      'selected',
      'collapsed',
      'open',
      'placement',
      'breakpoint',
      'onNavigate',
      'routeConfig',
    ]) {
      expect(publicNames).not.toContain(unsupported);
      expect(contract.forbidden).toContain(unsupported);
    }
  });

  it('requires one to eight stable destinations and exactly one current route', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/1.?8|one.*eight|eight.*one/i),
        expect.stringMatching(/exactly one current|one current route/i),
        expect.stringMatching(/order.*mode|same.*order|preserve.*order/i),
        expect.stringMatching(/current.*mode|preserve.*current|same.*current/i),
      ]),
    );
    expect(contract.composition.navigation.allowedChildren).toEqual(['dse._navigation-item']);
  });

  it('documents named navigation semantics and compact accessible labels without focus trapping', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.semantics.element).toMatch(/nav/i);
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/named navigation|navigation.*name/i),
        expect.stringMatching(/aria-current|current location|current destination/i),
        expect.stringMatching(/compact.*accessible|accessible.*compact|assistive/i),
        expect.stringMatching(/focus.*order|keyboard.*order/i),
        expect.stringMatching(/does not trap focus|no focus trap|never traps focus/i),
      ]),
    );
  });

  it('locks the Figma widths and approved public token dependencies', () => {
    const contract = readContract();
    if (!contract) return;

    expect(contract.tokenDependencies).toEqual(
      expect.arrayContaining([
        '--dse-color-semantic-surface-section',
        '--dse-color-semantic-border-subtle',
        '--dse-color-semantic-fg-tertiary',
        '--dse-spacing-primitive-space-300',
        '--dse-typography-semantic-label-small-family',
        '--dse-typography-semantic-label-small-size',
        '--dse-typography-semantic-label-small-weight',
        '--dse-typography-semantic-label-small-line-height',
        '--dse-typography-semantic-label-small-letter-spacing',
      ]),
    );
    expect(contract.semantics.requirements).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/208.*64|64.*208/i),
        expect.stringMatching(/184.*40|40.*184/i),
        expect.stringMatching(/44.*44/i),
      ]),
    );
  });
});
