import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import authoringPolicy from '../../../../packages/contracts/ai/authoring-policy.json';
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
