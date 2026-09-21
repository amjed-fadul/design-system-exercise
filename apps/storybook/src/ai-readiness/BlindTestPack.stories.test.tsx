import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import pack from '../../../../packages/contracts/ai/evals/test-pack.json';
import apiKeys from '../../../../packages/contracts/ai/evals/api-keys-management.task.json';
import projects from '../../../../packages/contracts/ai/evals/projects-directory.task.json';
import team from '../../../../packages/contracts/ai/evals/team-management.task.json';
import * as stories from './BlindTestPack.stories';

const tasks = [projects, team, apiKeys] as const;

const renderedText = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replaceAll('&#x27;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');

describe('Task 4 Storybook blind test pack', () => {
  it('renders the canonical protocol and all three task briefs', () => {
    expect(stories.default.title).toBe('AI Readiness/Blind Test Pack');

    const html = renderToStaticMarkup(
      stories.Pack.render?.({} as never, { globals: {} } as never) as never,
    );
    const text = renderedText(html);

    expect(text).toContain(pack.name);
    expect(text).toContain(pack.status);

    for (const task of tasks) {
      expect(text).toContain(task.id);
      expect(text).toContain(task.name);
      expect(text).toContain(task.caseType);
      expect(text).toContain(task.agentVisible.productRequirement.summary);
      expect(text).toContain(task.agentVisible.deliverable.writeRoot);
    }
  });

  it('visibly labels evaluator-only content as forbidden from the agent payload', () => {
    const html = renderToStaticMarkup(
      stories.Pack.render?.({} as never, { globals: {} } as never) as never,
    );

    expect(html).toContain('Evaluator only — never include in agent payload');
    expect(html).toContain('dse.composition.directory-page');
  });

  it('shows the shared allowed and denied context boundaries', () => {
    const html = renderToStaticMarkup(
      stories.Pack.render?.({} as never, { globals: {} } as never) as never,
    );

    for (const path of pack.agentContext.allow) {
      expect(html).toContain(path);
    }
    for (const path of pack.agentContext.deny) {
      expect(html).toContain(path);
    }
  });
});
