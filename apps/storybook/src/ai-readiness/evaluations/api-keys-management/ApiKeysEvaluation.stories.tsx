import type { Meta, StoryObj } from '@storybook/react-vite';
import { ApiKeysEvaluation } from './ApiKeysEvaluation';
import './ApiKeysEvaluation.css';

const meta = {
  title: 'AI Readiness/Evaluations/API Keys Management',
  component: ApiKeysEvaluation,
  parameters: {
    layout: 'fullscreen',
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
    initialQuery: { control: 'text' },
    initialDialog: {
      control: 'select',
      options: [null, 'create', 'detail', 'revoke'],
    },
    initialDetailKeyId: { control: 'text' },
    initialCreateAttempted: { control: 'boolean' },
    initialFeedback: {
      control: 'select',
      options: [null, 'created', 'revoked'],
    },
    initialCreatedKey: { control: 'boolean' },
    initialRevokedKeyId: { control: 'text' },
  },
  render: (args) => (
    <div
      className={`api-keys-story-frame ${
        args.viewportMode === 'compact'
          ? 'api-keys-story-frame--compact'
          : 'api-keys-story-frame--wide'
      }`}
    >
      <ApiKeysEvaluation {...args} />
    </div>
  ),
} satisfies Meta<typeof ApiKeysEvaluation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PopulatedDirectory: Story = {
  name: 'Populated directory',
  args: {
    language: 'en',
    theme: 'light',
    viewportMode: 'auto',
  },
};

export const FilteredDirectory: Story = {
  name: 'Filtered directory',
  args: {
    language: 'en',
    theme: 'light',
    viewportMode: 'auto',
    initialQuery: 'analytics',
  },
};

export const NoResults: Story = {
  name: 'No results',
  args: {
    language: 'en',
    theme: 'light',
    viewportMode: 'auto',
    initialQuery: 'no-matching-key',
  },
};

export const CreateKeyValidation: Story = {
  name: 'Create key validation',
  args: {
    language: 'en',
    theme: 'light',
    viewportMode: 'auto',
    initialDialog: 'create',
    initialCreateAttempted: true,
  },
};

export const CreatedKeyOutcome: Story = {
  name: 'Created key outcome',
  args: {
    language: 'en',
    theme: 'light',
    viewportMode: 'auto',
    initialFeedback: 'created',
    initialCreatedKey: true,
  },
};

export const KeyDetails: Story = {
  name: 'Key details',
  args: {
    language: 'en',
    theme: 'light',
    viewportMode: 'expanded',
    initialDialog: 'detail',
    initialDetailKeyId: 'prod-deploy',
  },
};

export const RevokeConfirmation: Story = {
  name: 'Revoke confirmation',
  args: {
    language: 'en',
    theme: 'light',
    viewportMode: 'expanded',
    initialDialog: 'revoke',
    initialDetailKeyId: 'prod-deploy',
  },
};

export const RevokedOutcome: Story = {
  name: 'Revoked outcome',
  args: {
    language: 'en',
    theme: 'light',
    viewportMode: 'auto',
    initialRevokedKeyId: 'prod-deploy',
    initialFeedback: 'revoked',
  },
};

export const ArabicRtl: Story = {
  name: 'Arabic RTL',
  args: {
    language: 'ar',
    theme: 'light',
    viewportMode: 'auto',
  },
};

export const DarkTheme: Story = {
  name: 'Dark theme',
  args: {
    language: 'en',
    theme: 'dark',
    viewportMode: 'auto',
  },
};

export const CompactDirectory: Story = {
  name: 'Compact directory',
  args: {
    language: 'en',
    theme: 'light',
    viewportMode: 'compact',
  },
};
