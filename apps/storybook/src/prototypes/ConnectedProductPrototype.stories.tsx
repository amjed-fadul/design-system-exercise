import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConnectedProductPrototype } from './ConnectedProductPrototype';

const meta = {
  title: 'Prototypes/Connected Product Prototype',
  component: ConnectedProductPrototype,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Interactive Storybook reconstruction of the current live wide Figma prototype page 199:10635. The Figma page currently contains 39 top-level 1440×960 product frames. This Storybook demo consolidates those connected wide-state screens into a functional flow using the governed Design System Exercise components and dse.pattern.application-shell@1.0.0. It covers directory/search/no-results, member invitation with deterministic fail-then-retry success, wide member-role editing, save failure/retry, and the unsaved-change guard. There is one Connected story only. The Storybook top toolbar is the single source of truth for both language (English/Arabic with LTR/RTL) and theme (Light/Dark), and the prototype reacts live to both globals. This is Storybook/demo product behavior only: it does not create or validate P02, P03, P04, or P05 pattern contracts. The deleted/stale narrow prototype frames are deliberately not invented here.',
      },
    },
  },
} satisfies Meta<typeof ConnectedProductPrototype>;

export const prototypeMeta = meta;
export default meta;

type Story = StoryObj<typeof meta>;

function renderConnected(_args: unknown, context: { globals?: Record<string, unknown> }) {
  const language = context.globals?.language === 'arabic' ? 'arabic' : 'english';
  const theme = context.globals?.theme === 'dark' ? 'dark' : 'light';

  return <ConnectedProductPrototype language={language} theme={theme} />;
}

export const Connected: Story = {
  name: 'Connected wide flow',
  render: renderConnected,
};
