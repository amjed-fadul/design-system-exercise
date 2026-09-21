import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  validateAuthoringPolicy,
  validateRepositoryContracts,
} from '../src/validate.js';

const policy = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('../ai/authoring-policy.json', import.meta.url)),
    'utf8',
  ),
) as {
  rules: Array<{ id: string }>;
  [key: string]: unknown;
};

describe('AI authoring policy', () => {
  it('validates the canonical policy as part of repository contracts', () => {
    expect(validateAuthoringPolicy(policy)).toEqual({
      valid: true,
      errors: [],
    });
    expect(validateRepositoryContracts().valid).toBe(true);
  });

  it('requires explicit authority for evaluation-only deterministic placeholders', () => {
    const fixtureRule = policy.rules.find(
      (rule) => rule.id === 'uncertainty.evaluation-placeholder',
    ) as { statement?: string; rationale?: string } | undefined;

    expect(fixtureRule).toBeDefined();
    expect(fixtureRule?.statement).toMatch(/evaluation|demo/i);
    expect(fixtureRule?.statement).toMatch(/deterministic placeholder/i);
    expect(fixtureRule?.statement).toMatch(/production/i);
    expect(fixtureRule?.rationale).toMatch(/unresolved/i);
  });

  it('rejects removal of the evaluation-placeholder authority rule', () => {
    const incomplete = structuredClone(policy);
    incomplete.rules = incomplete.rules.filter(
      (rule) => rule.id !== 'uncertainty.evaluation-placeholder',
    );

    expect(validateAuthoringPolicy(incomplete)).toEqual(
      expect.objectContaining({
        valid: false,
        errors: expect.arrayContaining([
          expect.stringMatching(
            /missing required AI authoring rule uncertainty\.evaluation-placeholder/i,
          ),
        ]),
      }),
    );
  });

  it('recognizes approved product context as product-specific authoring authority', () => {
    expect(policy.authorityOrder).toEqual([
      'component-contracts',
      'pattern-contracts',
      'tokens',
      'composition-guidance',
      'product-context',
      'product-figma-evidence',
    ]);
    expect((policy.localCss as { allowedAuthorities?: string[] }).allowedAuthorities).toContain(
      'approved-product-context',
    );
    expect(policy.rules.some((rule) => rule.id === 'composition.use-product-context')).toBe(true);
  });

  it('rejects duplicate rule ids', () => {
    const duplicate = structuredClone(policy);
    duplicate.rules.push({ ...duplicate.rules[0]! });

    expect(validateAuthoringPolicy(duplicate)).toEqual(
      expect.objectContaining({
        valid: false,
        errors: expect.arrayContaining([
          expect.stringMatching(/duplicate AI authoring rule id/i),
        ]),
      }),
    );
  });

  it('rejects removal of a required authoring rule', () => {
    const incomplete = structuredClone(policy);
    incomplete.rules = incomplete.rules.filter(
      (rule) => rule.id !== 'uncertainty.do-not-guess',
    );

    expect(validateAuthoringPolicy(incomplete)).toEqual(
      expect.objectContaining({
        valid: false,
        errors: expect.arrayContaining([
          expect.stringMatching(/missing required AI authoring rule uncertainty\.do-not-guess/i),
        ]),
      }),
    );
  });
});
