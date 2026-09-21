/// <reference types="vite/client" />

import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const evaluationModules = import.meta.glob(
  './evaluations/**/*Evaluation.tsx',
  { eager: true },
) as Record<string, Record<string, unknown>>;

const evaluationComponents = Object.entries(evaluationModules).flatMap(
  ([path, module]) =>
    Object.entries(module)
      .filter(
        ([name, value]) =>
          name.endsWith('Evaluation') && typeof value === 'function',
      )
      .map(([name, value]) => ({
        label: `${path}#${name}`,
        component: value as ComponentType<Record<string, never>>,
      })),
);

describe('AI evaluation runtime render smoke', () => {
  if (evaluationComponents.length === 0) {
    it('has no mounted blind evaluation output on the baseline branch', () => {
      expect(evaluationComponents).toEqual([]);
    });
    return;
  }

  for (const { label, component } of evaluationComponents) {
    it(`${label} renders without a runtime exception`, () => {
      expect(() =>
        renderToStaticMarkup(createElement(component)),
      ).not.toThrow();
    });
  }
});
