import type { Meta, StoryObj } from '@storybook/react-vite';
import authoringPolicy from '../../../../packages/contracts/ai/authoring-policy.json';
import colorSemantic from '../../../../packages/tokens/src/color/semantic.tokens.json';
import layoutSemantic from '../../../../packages/tokens/src/layout/semantic.tokens.json';
import typographySemantic from '../../../../packages/tokens/src/typography/semantic.tokens.json';

const sectionStyle = {
  display: 'grid',
  gap: 'var(--dse-spacing-semantic-stack-md)',
} as const;

const cardStyle = {
  display: 'grid',
  gap: 'var(--dse-spacing-semantic-stack-sm)',
  padding: 'var(--dse-spacing-semantic-inset-lg)',
  background: 'var(--dse-color-semantic-surface-raised)',
  border: 'var(--dse-border-role-container) solid var(--dse-color-semantic-border-subtle)',
  borderRadius: 'var(--dse-radius-shape-surface)',
} as const;

function AuthoringRulesPage() {
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
          <strong>{authoringPolicy.name}</strong>
          <span
            style={{
              marginInlineStart: 'var(--dse-spacing-semantic-inline-md)',
              color: 'var(--dse-color-semantic-fg-secondary)',
            }}
          >
            v{authoringPolicy.version} · {authoringPolicy.status}
          </span>
        </div>
        <p style={{ margin: 0, color: 'var(--dse-color-semantic-fg-secondary)' }}>
          Canonical source: packages/contracts/ai/authoring-policy.json
        </p>
        <p style={{ margin: 0 }}>
          Storybook renders this policy for human review. It does not own or override these rules.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Authority order</h2>
        <ol style={{ margin: 0, paddingInlineStart: 'var(--dse-spacing-semantic-container-md)' }}>
          {authoringPolicy.authorityOrder.map((authority) => (
            <li key={authority}>{authority}</li>
          ))}
        </ol>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Token mode activation</h2>
        <p style={{ margin: 0, color: 'var(--dse-color-semantic-fg-secondary)' }}>
          Canonical activation metadata is read directly from token source JSON.
        </p>
        <div style={{ display: 'grid', gap: 'var(--dse-spacing-semantic-stack-md)' }}>
          {[
            ['theme', colorSemantic],
            ['language', typographySemantic],
            ['layout', layoutSemantic],
          ].map(([label, source]) => {
            const metadata = source.$extensions['design-system-exercise'];
            return (
              <article key={label as string} style={cardStyle}>
                <strong>{label as string}</strong>
                <p style={{ margin: 0 }}>
                  Attribute: <code>{metadata.selectorAttribute}</code>
                </p>
                <ul style={{ margin: 0 }}>
                  {Object.entries(metadata.selectorValues).map(([mode, value]) => (
                    <li key={mode}>
                      <code>{mode}</code> → <code>{value}</code>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Canonical rules</h2>
        <div style={{ display: 'grid', gap: 'var(--dse-spacing-semantic-stack-lg)' }}>
          {authoringPolicy.rules.map((rule) => (
            <article
              key={rule.id}
              data-ai-rule-id={rule.id}
              style={{
                display: 'grid',
                gap: 'var(--dse-spacing-semantic-stack-sm)',
                padding: 'var(--dse-spacing-semantic-inset-lg)',
                background: 'var(--dse-color-semantic-surface-raised)',
                border: 'var(--dse-border-role-container) solid var(--dse-color-semantic-border-subtle)',
                borderRadius: 'var(--dse-radius-shape-surface)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--dse-spacing-semantic-inline-md)',
                  alignItems: 'center',
                }}
              >
                <code>{rule.id}</code>
                <strong>{rule.requirement}</strong>
                <span style={{ color: 'var(--dse-color-semantic-fg-secondary)' }}>
                  {rule.category}
                </span>
              </div>
              <p style={{ margin: 0 }}>{rule.statement}</p>
              <p style={{ margin: 0, color: 'var(--dse-color-semantic-fg-secondary)' }}>
                {rule.rationale}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Local CSS authority</h2>
        <div>
          <strong>Allowed authority sources</strong>
          <ul>
            {authoringPolicy.localCss.allowedAuthorities.map((authority) => (
              <li key={authority}>{authority}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Forbidden</strong>
          <ul>
            {authoringPolicy.localCss.forbidden.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Escalate when</strong>
          <ul>
            {authoringPolicy.localCss.escalateWhen.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Storybook role</h2>
        <p style={{ margin: 0 }}>
          <strong>{authoringPolicy.storybook.role}</strong>
        </p>
        <div>
          <strong>May</strong>
          <ul>
            {authoringPolicy.storybook.may.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Must not</strong>
          <ul>
            {authoringPolicy.storybook.mustNot.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

const meta = {
  title: 'AI Readiness/Authoring Rules',
  component: AuthoringRulesPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Human-visible rendering of the canonical packages/contracts/ai/authoring-policy.json policy. Storybook is evidence only; machine-readable policy remains the source of truth.',
      },
    },
  },
} satisfies Meta<typeof AuthoringRulesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Policy: Story = {
  render: () => <AuthoringRulesPage />,
};
