import { describe, expect, it } from 'vitest';

async function loadValidator() {
  return import('../src/validate.js').catch(() => null);
}

function componentFixture(options?: {
  id?: string;
  visibility?: 'public' | 'internal';
  implementationPackage?: string;
  omitVisibility?: boolean;
}) {
  const candidate: Record<string, unknown> = {
    $schema: '../schema/component-contract.schema.json',
    id: options?.id ?? 'dse.example',
    kind: 'component',
    version: '1.0.0',
    status: 'approved',
    visibility: options?.visibility ?? 'public',
    name: 'Example',
    description: 'Example component contract.',
    sources: {
      figma: { fileKey: 'example', nodeId: '1:1' },
      ...(options?.implementationPackage
        ? { implementationPackage: options.implementationPackage }
        : {}),
    },
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

  if (options?.omitVisibility) delete candidate.visibility;
  return candidate;
}

describe('component contract visibility', () => {
  it('accepts a public id explicitly marked public', async () => {
    const validator = await loadValidator();
    expect(validator).not.toBeNull();
    if (!validator) return;

    expect(validator.validateComponent(componentFixture()).valid).toBe(true);
  });

  it('accepts an underscore id explicitly marked internal when no public package is declared', async () => {
    const validator = await loadValidator();
    expect(validator).not.toBeNull();
    if (!validator) return;

    expect(
      validator.validateComponent(
        componentFixture({ id: 'dse._input-control', visibility: 'internal' }),
      ).valid,
    ).toBe(true);
  });

  it('rejects an internal id marked public', async () => {
    const validator = await loadValidator();
    expect(validator).not.toBeNull();
    if (!validator) return;

    expect(
      validator.validateComponent(
        componentFixture({ id: 'dse._input-control', visibility: 'public' }),
      ).valid,
    ).toBe(false);
  });

  it('rejects a public id marked internal', async () => {
    const validator = await loadValidator();
    expect(validator).not.toBeNull();
    if (!validator) return;

    expect(
      validator.validateComponent(componentFixture({ id: 'dse.example', visibility: 'internal' })).valid,
    ).toBe(false);
  });

  it('rejects an internal contract that declares a public implementation package', async () => {
    const validator = await loadValidator();
    expect(validator).not.toBeNull();
    if (!validator) return;

    expect(
      validator.validateComponent(
        componentFixture({
          id: 'dse._input-control',
          visibility: 'internal',
          implementationPackage: '@design-system-exercise/react',
        }),
      ).valid,
    ).toBe(false);
  });

  it('requires visibility on every component contract', async () => {
    const validator = await loadValidator();
    expect(validator).not.toBeNull();
    if (!validator) return;

    expect(validator.validateComponent(componentFixture({ omitVisibility: true })).valid).toBe(false);
  });
});
