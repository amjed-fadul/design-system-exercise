import { describe, expect, it } from 'vitest';

async function loadValidator() {
  return import('../src/validate.js').catch(() => null);
}

function validComponentFixture() {
  return {
    $schema: '../schema/component-contract.schema.json',
    id: 'dse.example',
    kind: 'component',
    version: '1.0.0',
    status: 'approved',
    visibility: 'public',
    name: 'Example',
    description: 'Example component contract.',
    sources: { figma: { fileKey: 'example', nodeId: '1:1' } },
    publicApi: { props: [], forwardNativeAttributes: false },
    representations: [],
    anatomy: [],
    tokenDependencies: [],
    states: [],
    semantics: {
      element: 'div',
      accessibleName: 'not required',
      keyboardActivation: 'none',
      focus: 'none',
    },
    composition: {},
    events: [],
    forbidden: [],
    provenance: { lastReviewed: '2026-09-17', references: ['figma:example:1:1'] },
  };
}

function validPatternFixture() {
  return {
    $schema: '../schema/pattern-contract.schema.json',
    id: 'dse.pattern.example',
    kind: 'pattern',
    version: '1.0.0',
    status: 'approved',
    name: 'Example pattern',
    description: 'Example pattern contract.',
    sources: { figma: { fileKey: 'example', nodeId: '2:2' } },
    componentDependencies: [],
    stateModel: [{ key: 'status', owner: 'pattern' }],
    transitions: [],
    invariants: ['State remains explicit.'],
    exits: [],
    responsiveRules: [],
    runtimeRequirements: [],
    forbidden: [],
    provenance: { lastReviewed: '2026-09-17', references: ['figma:example:2:2'] },
  };
}

describe('contract schemas', () => {
  it('rejects a component without a stable id', async () => {
    const validator = await loadValidator();
    expect(validator).not.toBeNull();
    if (!validator) return;

    expect(validator.validateComponent({ kind: 'component', version: '1.0.0' })).toEqual(
      expect.objectContaining({ valid: false }),
    );
  });

  it('rejects unknown component top-level fields', async () => {
    const validator = await loadValidator();
    expect(validator).not.toBeNull();
    if (!validator) return;

    const candidate = validComponentFixture() as Record<string, unknown>;
    candidate.invented = true;
    expect(validator.validateComponent(candidate).valid).toBe(false);
  });

  it('rejects a pattern with a missing state model', async () => {
    const validator = await loadValidator();
    expect(validator).not.toBeNull();
    if (!validator) return;

    const candidate = validPatternFixture() as Record<string, unknown>;
    delete candidate.stateModel;
    expect(validator.validatePattern(candidate).valid).toBe(false);
  });
});
