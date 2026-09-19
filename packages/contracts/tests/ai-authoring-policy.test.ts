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
