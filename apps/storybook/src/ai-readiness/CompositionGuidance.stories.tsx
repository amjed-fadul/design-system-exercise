import type { Meta, StoryObj } from '@storybook/react-vite';
import createFlow from '../../../../packages/contracts/ai/compositions/create-flow.guidance.json';
import directoryPage from '../../../../packages/contracts/ai/compositions/directory-page.guidance.json';
import modalListDetail from '../../../../packages/contracts/ai/compositions/modal-list-detail.guidance.json';

interface GuidanceDependency {
  id: string;
  minimumVersion?: string;
}

interface GuidanceRule {
  id: string;
  statement: string;
}

interface GuidanceRecord {
  id: string;
  version: string;
  status: string;
  name: string;
  description: string;
  scope: string;
  componentDependencies: GuidanceDependency[];
  patternDependencies: GuidanceDependency[];
  structure: Array<{
    key: string;
    order: number;
    required: boolean;
    role: string;
    componentIds?: string[];
    patternIds?: string[];
  }>;
  rules: {
    layout: GuidanceRule[];
    responsive: GuidanceRule[];
    direction: GuidanceRule[];
    accessibility: GuidanceRule[];
    behavior: GuidanceRule[];
  };
  localCss: {
    allowed: GuidanceRule[];
    mustUseGovernedTokensWhenAvailable: boolean;
  };
  forbidden: string[];
  provenance: {
    lastReviewed: string;
    audit: string;
    evidence: string[];
  };
}

const sectionStyle = {
  display: 'grid',
  gap: 'var(--dse-spacing-semantic-stack-md)',
} as const;

const cardStyle = {
  display: 'grid',
  gap: 'var(--dse-spacing-semantic-stack-sm)',
  padding: 'var(--dse-spacing-semantic-inset-lg)',
  background: 'var(--dse-color-semantic-surface-raised)',
  border:
    'var(--dse-border-role-container) solid var(--dse-color-semantic-border-subtle)',
  borderRadius: 'var(--dse-radius-shape-surface)',
} as const;

const ruleGroups = [
  'layout',
  'responsive',
  'direction',
  'accessibility',
  'behavior',
] as const;

function DependencyList({
  title,
  dependencies,
}: {
  title: string;
  dependencies: GuidanceDependency[];
}) {
  return (
    <div>
      <strong>{title}</strong>
      {dependencies.length > 0 ? (
        <ul>
          {dependencies.map((dependency) => (
            <li key={dependency.id}>
              <code>{dependency.id}</code>
              {dependency.minimumVersion
                ? ` ≥ ${dependency.minimumVersion}`
                : null}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ margin: 0 }}>None.</p>
      )}
    </div>
  );
}

function CompositionGuidancePage({
  guidance,
}: {
  guidance: GuidanceRecord;
}) {
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
          <strong>{guidance.name}</strong>
          <span
            style={{
              marginInlineStart: 'var(--dse-spacing-semantic-inline-md)',
              color: 'var(--dse-color-semantic-fg-secondary)',
            }}
          >
            {guidance.id} · v{guidance.version} · {guidance.status}
          </span>
        </div>
        <p style={{ margin: 0 }}>{guidance.description}</p>
        <p
          style={{
            margin: 0,
            color: 'var(--dse-color-semantic-fg-secondary)',
          }}
        >
          Guidance only — not a runtime pattern. Scope: {guidance.scope}.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Dependencies</h2>
        <DependencyList
          title="Components"
          dependencies={guidance.componentDependencies}
        />
        <DependencyList
          title="Patterns"
          dependencies={guidance.patternDependencies}
        />
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Structure</h2>
        <ol
          style={{
            display: 'grid',
            gap: 'var(--dse-spacing-semantic-stack-md)',
            margin: 0,
            paddingInlineStart: 'var(--dse-spacing-semantic-container-md)',
          }}
        >
          {[...guidance.structure]
            .sort((a, b) => a.order - b.order)
            .map((region) => (
              <li key={region.key} data-composition-region={region.key}>
                <strong>
                  {region.key}
                  {region.required ? ' · required' : ' · optional'}
                </strong>
                <p style={{ margin: 0 }}>{region.role}</p>
              </li>
            ))}
        </ol>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Rules</h2>
        {ruleGroups.map((group) => (
          <div key={group} style={sectionStyle}>
            <h3 style={{ margin: 0 }}>{group}</h3>
            {guidance.rules[group].map((rule) => (
              <article key={rule.id} data-composition-rule={rule.id} style={cardStyle}>
                <code>{rule.id}</code>
                <p style={{ margin: 0 }}>{rule.statement}</p>
              </article>
            ))}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Allowed local CSS</h2>
        {guidance.localCss.allowed.map((rule) => (
          <article key={rule.id} data-composition-rule={rule.id} style={cardStyle}>
            <code>{rule.id}</code>
            <p style={{ margin: 0 }}>{rule.statement}</p>
          </article>
        ))}
        <p style={{ margin: 0 }}>
          Governed tokens required when available:{' '}
          <strong>
            {guidance.localCss.mustUseGovernedTokensWhenAvailable
              ? 'yes'
              : 'no'}
          </strong>
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Forbidden</h2>
        <ul>
          {guidance.forbidden.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Evidence</h2>
        <p style={{ margin: 0 }}>
          Audit: <code>{guidance.provenance.audit}</code>
        </p>
        <ul>
          {guidance.provenance.evidence.map((item) => (
            <li key={item}>
              <code>{item}</code>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const meta: Meta = {
  title: 'AI Readiness/Composition Guidance',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Human-visible rendering of canonical Task 3 composition guidance. These records are guidance-only and do not create runtime patterns.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const DirectoryPage: Story = {
  name: 'Directory Page',
  render: () => (
    <CompositionGuidancePage guidance={directoryPage as GuidanceRecord} />
  ),
};

export const ModalListDetail: Story = {
  name: 'Modal List → Detail',
  render: () => (
    <CompositionGuidancePage guidance={modalListDetail as GuidanceRecord} />
  ),
};

export const CreateFlow: Story = {
  name: 'Create Flow',
  render: () => (
    <CompositionGuidancePage guidance={createFlow as GuidanceRecord} />
  ),
};
