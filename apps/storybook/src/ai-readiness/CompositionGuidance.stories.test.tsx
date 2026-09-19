import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import createFlow from '../../../../packages/contracts/ai/compositions/create-flow.guidance.json';
import directoryPage from '../../../../packages/contracts/ai/compositions/directory-page.guidance.json';
import modalListDetail from '../../../../packages/contracts/ai/compositions/modal-list-detail.guidance.json';
import * as stories from './CompositionGuidance.stories';

const cases = [
  [directoryPage, stories.DirectoryPage],
  [modalListDetail, stories.ModalListDetail],
  [createFlow, stories.CreateFlow],
] as const;

const allRules = (guidance: typeof directoryPage) => [
  ...guidance.rules.layout,
  ...guidance.rules.responsive,
  ...guidance.rules.direction,
  ...guidance.rules.accessibility,
  ...guidance.rules.behavior,
  ...guidance.localCss.allowed,
];

describe('Task 3 Storybook composition guidance', () => {
  it('renders canonical guidance instead of a duplicate Storybook rule set', () => {
    expect(stories.default.title).toBe('AI Readiness/Composition Guidance');

    for (const [guidance, story] of cases) {
      const html = renderToStaticMarkup(
        story.render?.({} as never, { globals: {} } as never) as never,
      );

      expect(html).toContain(guidance.id);
      expect(html).toContain(guidance.name);
      expect(html).toContain(guidance.status);
      expect(html).toContain('Guidance only');

      for (const region of guidance.structure) {
        expect(html).toContain(region.key);
        expect(html).toContain(region.role);
        expect(html).toContain(`owner: ${region.owner}`);
      }

      for (const rule of allRules(guidance as typeof directoryPage)) {
        expect(html).toContain(rule.id);
        expect(html).toContain(rule.statement);
      }

      for (const forbidden of guidance.forbidden) {
        expect(html).toContain(forbidden);
      }
    }
  });

  it('keeps the unresolved narrow List → Detail rule visible to reviewers', () => {
    const html = renderToStaticMarkup(
      stories.ModalListDetail.render?.(
        {} as never,
        { globals: {} } as never,
      ) as never,
    );

    expect(html).toContain('responsive.narrow-unresolved');
    expect(html).toContain(
      'Do not invent a narrow drawer, full-page detail, or alternate navigation model',
    );
  });

  it('does not present Task 3 guidance as a runtime pattern', () => {
    for (const [, story] of cases) {
      const html = renderToStaticMarkup(
        story.render?.({} as never, { globals: {} } as never) as never,
      );
      expect(html).toContain('not a runtime pattern');
    }
  });
});
