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

const renderedText = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replaceAll('&#x27;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');

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
      const text = renderedText(html);

      expect(text).toContain(guidance.id);
      expect(text).toContain(guidance.name);
      expect(text).toContain(guidance.status);
      expect(text).toContain('Guidance only');

      for (const region of guidance.structure) {
        expect(text).toContain(region.key);
        expect(text).toContain(region.role);
        expect(text).toContain(`owner: ${region.owner}`);
      }

      for (const rule of allRules(guidance as typeof directoryPage)) {
        expect(text).toContain(rule.id);
        expect(text).toContain(rule.statement);
      }

      for (const forbidden of guidance.forbidden) {
        expect(text).toContain(forbidden);
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
