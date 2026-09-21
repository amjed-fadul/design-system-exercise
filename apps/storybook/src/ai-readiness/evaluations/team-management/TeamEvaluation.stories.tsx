import '@fontsource/geist/400.css';
import '@fontsource/geist/500.css';
import '@fontsource/geist/600.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@design-system-exercise/tokens/css';
import '@design-system-exercise/react/styles.css';
import '@design-system-exercise/patterns/styles.css';
import './TeamEvaluation.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TeamEvaluation } from './TeamEvaluation';

const meta = {
  title: 'AI Readiness/Evaluations/Team Management',
  component: TeamEvaluation,
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => <TeamEvaluation key={args.scenario} {...args} />,
  argTypes: {
    scenario: { control: false },
  },
} satisfies Meta<typeof TeamEvaluation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EnglishWide: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'expanded',
    scenario: 'default',
  },
};

export const EnglishDark: Story = {
  args: {
    locale: 'en',
    theme: 'dark',
    viewportMode: 'expanded',
    scenario: 'default',
  },
};

export const ArabicRtl: Story = {
  args: {
    locale: 'ar',
    theme: 'light',
    viewportMode: 'expanded',
    scenario: 'default',
  },
};

export const CompactDirectory: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'compact',
    scenario: 'default',
  },
};

export const NoResults: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'expanded',
    scenario: 'no-results',
  },
};

export const InviteDialog: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'expanded',
    scenario: 'invite-open',
  },
};

export const InviteFailureAndRetry: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'expanded',
    scenario: 'invite-failure-once',
  },
};

export const RoleSaveFailureAndRetry: Story = {
  args: {
    locale: 'en',
    theme: 'light',
    viewportMode: 'expanded',
    scenario: 'role-save-failure-once',
  },
};
