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
