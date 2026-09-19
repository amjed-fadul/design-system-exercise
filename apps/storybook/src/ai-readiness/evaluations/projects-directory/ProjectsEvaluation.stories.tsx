import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProjectsEvaluation } from './ProjectsEvaluation';

const meta = {
  title: 'AI Readiness/Evaluations/Projects Directory',
  component: ProjectsEvaluation,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    language: 'en',
    scenario: 'default',
    theme: 'light',
    viewportMode: 'expanded',
  },
  argTypes: {
    language: {
      control: 'inline-radio',
      options: ['en', 'ar'],
    },
    theme: {
      control: 'inline-radio',
      options: ['light', 'dark'],
    },
    viewportMode: {
      control: 'inline-radio',
      options: ['auto', 'expanded', 'compact'],
    },
    scenario: {
      control: 'select',
      options: [
        'default',
        'filtered',
        'no-results',
        'create-invalid',
        'create-pending',
        'create-failure',
        'create-success',
        'detail-open',
        'save-failure',
        'save-success',
        'archive-confirmation',
        'archived',
      ],
    },
  },
} satisfies Meta<typeof ProjectsEvaluation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PopulatedDirectory: Story = {};

export const FilteredDirectory: Story = {
  args: { scenario: 'filtered' },
};

export const NoResults: Story = {
  args: { scenario: 'no-results' },
};

export const CreateValidation: Story = {
  args: { scenario: 'create-invalid' },
};

export const CreatePending: Story = {
  args: { scenario: 'create-pending' },
};

export const CreateFailureAndRetry: Story = {
  args: { scenario: 'create-failure' },
};

export const CreatedOutcome: Story = {
  args: { scenario: 'create-success' },
};

export const ProjectDetail: Story = {
  args: { scenario: 'detail-open' },
};

export const SaveFailureAndRetry: Story = {
  args: { scenario: 'save-failure' },
};

export const SavedOutcome: Story = {
  args: { scenario: 'save-success' },
};

export const ArchiveConfirmation: Story = {
  args: { scenario: 'archive-confirmation' },
};

export const ArchivedOutcome: Story = {
  args: { scenario: 'archived' },
};

export const ArabicRtl: Story = {
  args: {
    language: 'ar',
  },
};

export const Dark: Story = {
  args: {
    theme: 'dark',
  },
};

export const ArabicRtlDark: Story = {
  args: {
    language: 'ar',
    theme: 'dark',
  },
};

export const CompactDirectory: Story = {
  args: {
    viewportMode: 'compact',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
