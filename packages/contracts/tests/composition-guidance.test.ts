import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadCompositionGuidance } from '../src/load.js';
import {
  validateCompositionGuidance,
  validateRepositoryContracts,
} from '../src/validate.js';

const readGuidance = (name: string) =>
  JSON.parse(
    readFileSync(
      fileURLToPath(new URL(`../ai/compositions/${name}.guidance.json`, import.meta.url)),
      'utf8',
    ),
  ) as {
    id: string;
    structure: Array<{ key: string; order: number; componentIds?: string[] }>;
    rules: {
      layout: Array<{ id: string; statement: string }>;
      responsive: Array<{ id: string; statement: string }>;
      direction: Array<{ id: string; statement: string }>;
      accessibility: Array<{ id: string; statement: string }>;
      behavior: Array<{ id: string; statement: string }>;
    };
    localCss: { allowed: Array<{ id: string; statement: string }> };
    [key: string]: unknown;
  };

const records = [
  readGuidance('directory-page'),
  readGuidance('modal-list-detail'),
  readGuidance('create-flow'),
];

describe('Task 3 composition guidance', () => {
  it('validates all three canonical guidance records and repository dependencies', () => {
    expect(loadCompositionGuidance().map((entry) => (entry.contract as { id: string }).id)).toEqual([
      'dse.composition.create-flow',
      'dse.composition.directory-page',
      'dse.composition.modal-list-detail',
    ]);

    for (const record of records) {
      expect(validateCompositionGuidance(record), record.id).toEqual({
        valid: true,
        errors: [],
      });
    }

    expect(validateRepositoryContracts().valid).toBe(true);
  });

  it('defines the Create Flow boundary for invitation and access workflows', () => {
    const createFlow = records.find(
      (record) => record.id === 'dse.composition.create-flow',
    );
    const scopeRule = createFlow?.rules.behavior.find(
      (rule) => rule.id === 'behavior.scope-boundary',
    );

    expect(scopeRule).toBeDefined();
    expect(scopeRule?.statement).toMatch(/invite|invitation/i);
    expect(scopeRule?.statement).toMatch(/add-member|access-grant/i);
    expect(scopeRule?.statement).toMatch(/product-owned Dialog workflow/i);
  });

  it('binds modal host stacking to the governed overlay elevation plane', () => {
    const modalDetail = records.find(
      (record) => record.id === 'dse.composition.modal-list-detail',
    );
    const stackingRule = modalDetail?.localCss.allowed.find(
      (rule) => rule.id === 'css.modal-host-stacking',
    );

    expect(stackingRule).toBeDefined();
    expect(stackingRule?.statement).toContain('--dse-elevation-plane-overlay');
    expect(stackingRule?.statement).toMatch(/z-index/i);
  });

  it('rejects duplicate rule ids across composition rule groups', () => {
    const duplicate = structuredClone(records[0]!);
    duplicate.rules.responsive.push({
      ...duplicate.rules.layout[0]!,
    });

    expect(validateCompositionGuidance(duplicate)).toEqual(
      expect.objectContaining({
        valid: false,
        errors: expect.arrayContaining([
          expect.stringMatching(/duplicate composition rule id/i),
        ]),
      }),
    );
  });

  it('rejects structure references that bypass declared dependencies', () => {
    const invalid = structuredClone(records[0]!);
    invalid.structure[0]!.componentIds = ['dse.unknown-component'];

    expect(validateCompositionGuidance(invalid)).toEqual(
      expect.objectContaining({
        valid: false,
        errors: expect.arrayContaining([
          expect.stringMatching(/must be declared in componentDependencies/i),
        ]),
      }),
    );
  });

  it('rejects duplicate structure order', () => {
    const invalid = structuredClone(records[0]!);
    invalid.structure[1]!.order = invalid.structure[0]!.order;

    expect(validateCompositionGuidance(invalid)).toEqual(
      expect.objectContaining({
        valid: false,
        errors: expect.arrayContaining([
          expect.stringMatching(/duplicate structure order/i),
        ]),
      }),
    );
  });
});
