import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import authoringPolicy from '../../../../packages/contracts/ai/authoring-policy.json';
import colorSemantic from '../../../../packages/tokens/src/color/semantic.tokens.json';
import layoutSemantic from '../../../../packages/tokens/src/layout/semantic.tokens.json';
import typographySemantic from '../../../../packages/tokens/src/typography/semantic.tokens.json';
import * as stories from './AuthoringRules.stories';

describe('AI Authoring Rules Storybook evidence', () => {
  it('renders every canonical policy rule from the machine-readable source', () => {
    expect(stories.default.title).toBe('AI Readiness/Authoring Rules');

    const html = renderToStaticMarkup(
      stories.Policy.render?.({} as never, { globals: {} } as never) as never,
    );

    for (const rule of authoringPolicy.rules) {
      expect(html).toContain(rule.id);
      expect(html).toContain(rule.statement);
    }
  });

  it('renders canonical token mode activation metadata', () => {
    const html = renderToStaticMarkup(
      stories.Policy.render?.({} as never, { globals: {} } as never) as never,
    );

    const sources = [colorSemantic, typographySemantic, layoutSemantic] as const;
    for (const source of sources) {
      const meta = source.$extensions['design-system-exercise'];
      expect(html).toContain(meta.selectorAttribute);
      for (const value of Object.values(meta.selectorValues)) {
        expect(html).toContain(value);
      }
    }
  });

  it('shows the policy authority order and Storybook evidence role', () => {
    const html = renderToStaticMarkup(
      stories.Policy.render?.({} as never, { globals: {} } as never) as never,
    );

    for (const authority of authoringPolicy.authorityOrder) {
      expect(html).toContain(authority);
    }

    expect(html).toContain(authoringPolicy.storybook.role);
    expect(html).toContain('packages/contracts/ai/authoring-policy.json');
  });
});
