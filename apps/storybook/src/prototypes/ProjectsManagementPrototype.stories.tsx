import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProjectsManagementPrototype } from './ProjectsManagementPrototype';

const meta = {
  title: 'Prototypes/Projects Management',
  component: ProjectsManagementPrototype,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Connected Northstar Projects workflow built only from the governed Design System Exercise React components and dse.pattern.application-shell@1.0.0. It covers project search/no-results, create with deterministic fail-then-retry success, non-modal project detail/edit in the governed Side Panel, save failure/retry, and archive confirmation. Product-only code owns fixtures, copy, request simulation, and layout composition; this Storybook demo does not create a new reusable component or pattern contract.',
      },
    },
  },
} satisfies Meta<typeof ProjectsManagementPrototype>;

export default meta;

type Story = StoryObj<typeof meta>;

function renderConnected(
  _args: unknown,
  context: { globals?: Record<string, unknown> },
) {
  const language =
    context.globals?.language === 'arabic' ? 'arabic' : 'english';
  const theme = context.globals?.theme === 'dark' ? 'dark' : 'light';

  return <ProjectsManagementPrototype language={language} theme={theme} />;
}

export const Connected: Story = {
  name: 'Connected projects flow',
  render: renderConnected,
};
