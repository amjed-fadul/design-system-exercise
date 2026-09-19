import type { Meta, StoryObj } from '@storybook/react-vite';
import pack from '../../../../packages/contracts/ai/evals/test-pack.json';
import apiKeys from '../../../../packages/contracts/ai/evals/api-keys-management.task.json';
import projects from '../../../../packages/contracts/ai/evals/projects-directory.task.json';
import team from '../../../../packages/contracts/ai/evals/team-management.task.json';

const tasks = [projects, team, apiKeys] as const;

const sectionStyle = {
  display: 'grid',
  gap: 'var(--dse-spacing-semantic-stack-md)',
} as const;

const cardStyle = {
  display: 'grid',
  gap: 'var(--dse-spacing-semantic-stack-md)',
  padding: 'var(--dse-spacing-semantic-inset-lg)',
  background: 'var(--dse-color-semantic-surface-raised)',
  border:
    'var(--dse-border-role-container) solid var(--dse-color-semantic-border-subtle)',
  borderRadius: 'var(--dse-radius-shape-surface)',
} as const;

function BlindTestPackPage() {
  return (
    <main
      style={{
        display: 'grid',
        gap: 'var(--dse-spacing-semantic-section-md)',
        padding: 'var(--dse-spacing-semantic-container-md)',
        background: 'var(--dse-color-semantic-surface-canvas)',
        color: 'var(--dse-color-semantic-fg-primary)',
      }}
    >
      <header style={sectionStyle}>
        <div>
          <strong>{pack.name}</strong>
          <span
            style={{
              marginInlineStart: 'var(--dse-spacing-semantic-inline-md)',
              color: 'var(--dse-color-semantic-fg-secondary)',
            }}
          >
            v{pack.version} · {pack.status}
          </span>
        </div>
        <p style={{ margin: 0 }}>
          Three isolated blind authoring tasks. Task 5 must give Claude only the
          agent-visible payload and shared allowed context.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Blind protocol</h2>
        <ul>
          {Object.entries(pack.blindProtocol).map(([key, value]) => (
            <li key={key}>
              <code>{key}</code>: {String(value)}
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Agent context</h2>
        <div>
          <strong>Allowed</strong>
          <ul>
            {pack.agentContext.allow.map((path) => (
              <li key={path}>
                <code>{path}</code>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Denied answer/source context</strong>
          <ul>
            {pack.agentContext.deny.map((path) => (
              <li key={path}>
                <code>{path}</code>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Tasks</h2>
        {tasks.map((task) => (
          <article key={task.id} data-ai-eval-task={task.id} style={cardStyle}>
            <div>
              <strong>{task.name}</strong>
              <span
                style={{
                  marginInlineStart: 'var(--dse-spacing-semantic-inline-md)',
                  color: 'var(--dse-color-semantic-fg-secondary)',
                }}
              >
                {task.caseType} · {task.status}
              </span>
            </div>

            <p style={{ margin: 0 }}>
              {task.agentVisible.productRequirement.summary}
            </p>

            <div>
              <strong>Required states</strong>
              <ul>
                {task.agentVisible.productRequirement.requiredStates.map(
                  (state) => (
                    <li key={state}>{state}</li>
                  ),
                )}
              </ul>
            </div>

            <p style={{ margin: 0 }}>
              Write root:{' '}
              <code>{task.agentVisible.deliverable.writeRoot}</code>
            </p>

            <div
              style={{
                padding: 'var(--dse-spacing-semantic-inset-md)',
                border:
                  'var(--dse-border-role-container) solid var(--dse-color-semantic-border-subtle)',
                borderRadius: 'var(--dse-radius-shape-control)',
              }}
            >
              <strong>Evaluator only — never include in agent payload</strong>
              <p style={{ marginBlockEnd: 0 }}>
                Expected compositions:{' '}
                {task.evaluatorOnly.expectedAuthorities.compositions.join(', ')}
              </p>
              <p style={{ marginBlockEnd: 0 }}>
                Expected escalations:{' '}
                {task.evaluatorOnly.expectedEscalations.join(' · ')}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Evaluation dimensions</h2>
        <ol>
          {pack.evaluationDimensions.map((dimension) => (
            <li key={dimension}>{dimension}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}

const meta = {
  title: 'AI Readiness/Blind Test Pack',
  component: BlindTestPackPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Human review surface for the canonical Task 4 blind test pack. Evaluator-only content shown here must never be passed into the Task 5 agent prompt.',
      },
    },
  },
} satisfies Meta<typeof BlindTestPackPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pack: Story = {
  render: () => <BlindTestPackPage />,
};
