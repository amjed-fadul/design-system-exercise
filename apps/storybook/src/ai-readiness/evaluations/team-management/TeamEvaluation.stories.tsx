import type { Meta, StoryObj } from '@storybook/react-vite';
import { TeamEvaluation } from './TeamEvaluation';

const meta = {
  title: 'AI Readiness/Evaluations/Team Management',
  component: TeamEvaluation,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    locale: { control: 'radio', options: ['en', 'ar'] },
    theme: { control: 'radio', options: ['light', 'dark'] },
    viewportMode: { control: 'radio', options: ['expanded', 'compact'] },
    initialDetailId: { control: false },
    initialDirty: { control: false },
    showMemberActions: {
      control: 'boolean',
      description: 'Evaluation-only compact presentation switch. Narrow member-detail behavior is unresolved by approved guidance.',
    },
    simulateInviteFailure: {
      control: 'boolean',
      description: 'Evaluation-only request outcome switch. Turn off after a simulated failure to retry successfully; this is not a production failure rule.',
    },
    simulateSaveFailure: {
      control: 'boolean',
      description: 'Evaluation-only request outcome switch. Turn off after a simulated failure to retry successfully; this is not a production failure rule.',
    },
  },
} satisfies Meta<typeof TeamEvaluation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Directory: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'expanded',
  },
};

export const DarkMode: Story = {
  args: {
    locale: 'en',
    theme: 'dark',
    viewportMode: 'expanded',
  },
};

export const ArabicRtl: Story = {
  args: {
    locale: 'ar',
    theme: 'light',
    viewportMode: 'expanded',
  },
};

export const ArabicDarkRtl: Story = {
  args: {
    locale: 'ar',
    theme: 'dark',
    viewportMode: 'expanded',
  },
};

export const CompactDirectory: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'compact',
    showMemberActions: false,
  },
  globals: {
    viewport: { value: 'desktop', isRotated: false },
  },
};

export const MemberDetails: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'expanded',
    initialDetailId: 'sara-ahmed',
  },
};

export const UnsavedRoleChanges: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'expanded',
    initialDetailId: 'sara-ahmed',
    initialDirty: true,
  },
};

export const InviteFailureAndRetry: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'expanded',
    simulateInviteFailure: true,
  },
};

export const RoleSaveFailureAndRetry: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'expanded',
    initialDetailId: 'sara-ahmed',
    initialDirty: true,
    simulateSaveFailure: true,
  },
};
