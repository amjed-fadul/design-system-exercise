import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  EmptyState,
  Link,
  type EmptyStateProps,
} from '@design-system-exercise/react';

function EmptyStateCanvas(args: EmptyStateProps) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        minHeight: 440,
        background: 'var(--dse-color-semantic-surface-default)',
      }}
    >
      <EmptyState {...args} />
    </div>
  );
}

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Feedback & Surfaces/Empty State',
  component: EmptyState,
  args: {
    title: 'No people found',
    body: 'No names or email addresses match “zoe”.\nTry a different search or clear it to see everyone.',
    showIcon: true,
    showBody: true,
    actions: <Button emphasis="secondary">Clear search</Button>,
  },
  argTypes: {
    title: { control: 'text' },
    body: { control: 'text' },
    showIcon: { control: 'boolean' },
    showBody: { control: 'boolean' },
    icon: { control: false },
    actions: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "**Contract**\n\n`dse.empty-state@1.0.0`\n\n**Runtime**\n\n`@design-system-exercise/react`\n\n**Guidance**\n\nEmpty State owns the centered absence-message composition, a discoverable title heading, optional decorative icon and supporting body, polite status announcement, and an optional recovery Actions region. Actions stay outside the live status message; prefer one Button or Link and use at most two actions. The component does not move focus and does not own loading, error, query or filter logic, result counts, permissions, or recovery outcomes. Those decisions remain with the containing pattern, workflow, or product.",
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export const emptyStateMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const NoResults: Story = {
  render: (args) => <EmptyStateCanvas {...(args as EmptyStateProps)} />,
};

export const DarkNoResults: Story = {
  parameters: { presentation: { theme: 'dark' } },
  render: (args) => <EmptyStateCanvas {...(args as EmptyStateProps)} />,
};

export const ArabicNoResults: Story = {
  parameters: { presentation: { language: 'arabic' } },
  args: {
    title: 'لم يتم العثور على أشخاص',
    body: 'لا توجد أسماء أو عناوين بريد إلكتروني تطابق «zoe».\nجرّب بحثاً مختلفاً أو امسح البحث لعرض الجميع.',
    actions: <Button emphasis="secondary">مسح البحث</Button>,
  },
  render: (args) => <EmptyStateCanvas {...(args as EmptyStateProps)} />,
};

export const DarkArabicNoResults: Story = {
  parameters: { presentation: { theme: 'dark', language: 'arabic' } },
  args: {
    title: 'لم يتم العثور على أشخاص',
    body: 'لا توجد أسماء أو عناوين بريد إلكتروني تطابق «zoe».\nجرّب بحثاً مختلفاً أو امسح البحث لعرض الجميع.',
    actions: <Button emphasis="secondary">مسح البحث</Button>,
  },
  render: (args) => <EmptyStateCanvas {...(args as EmptyStateProps)} />,
};

export const WithoutBody: Story = {
  args: {
    title: 'No saved views yet',
    showBody: false,
    actions: <Button>Create a view</Button>,
  },
  render: (args) => <EmptyStateCanvas {...(args as EmptyStateProps)} />,
};

export const WithoutIcon: Story = {
  args: {
    showIcon: false,
  },
  render: (args) => <EmptyStateCanvas {...(args as EmptyStateProps)} />,
};

export const TwoActions: Story = {
  args: {
    actions: (
      <>
        <Button emphasis="secondary">Clear search</Button>
        <Link href="/people">View everyone</Link>
      </>
    ),
  },
  render: (args) => <EmptyStateCanvas {...(args as EmptyStateProps)} />,
};
