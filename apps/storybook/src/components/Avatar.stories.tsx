import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '@design-system-exercise/react';

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Data Display/Avatar',
  component: Avatar,
  args: {
    initials: 'AF',
    size: 'sm',
    'aria-label': undefined,
  },
  argTypes: {
    initials: { control: 'text' },
    size: { control: 'select', options: ['sm', 'lg'] },
    'aria-label': { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          "**Contract**\n\n`dse.avatar@1.0.0`\n\n**Runtime**\n\n`@design-system-exercise/react`\n\n**Guidance**\n\nSupports 32px `sm` and 48px `lg` sizes, with consumer-supplied initials or the derived neutral `@` fallback. Avatar does not infer initials from a name or email and has no photo, presence, status, role, verified, selected, or click variants. In normal identity rows the visible name should own identity, so Avatar is decorative with `aria-hidden` by default. A standalone meaningful Avatar becomes image-like with `role=img` only when an explicit `aria-label` is supplied.",
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export const avatarMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const SmallInitials: Story = {};

export const LargeInitials: Story = {
  args: { size: 'lg' },
};

export const Fallback: Story = {
  args: { initials: undefined },
};

export const DarkSmallInitials: Story = {
  parameters: { presentation: { theme: 'dark' } },
};

export const DarkLargeInitials: Story = {
  args: { size: 'lg' },
  parameters: { presentation: { theme: 'dark' } },
};

export const DarkFallback: Story = {
  args: { initials: undefined },
  parameters: { presentation: { theme: 'dark' } },
};

export const ArabicSmallInitials: Story = {
  args: { initials: 'أف' },
  parameters: { presentation: { language: 'arabic' } },
};

export const ArabicLargeInitials: Story = {
  args: { initials: 'أف', size: 'lg' },
  parameters: { presentation: { language: 'arabic' } },
};

export const ArabicFallback: Story = {
  args: { initials: undefined },
  parameters: { presentation: { language: 'arabic' } },
};

export const DarkArabicSmallInitials: Story = {
  args: { initials: 'أف' },
  parameters: { presentation: { theme: 'dark', language: 'arabic' } },
};

export const DarkArabicLargeInitials: Story = {
  args: { initials: 'أف', size: 'lg' },
  parameters: { presentation: { theme: 'dark', language: 'arabic' } },
};

export const DarkArabicFallback: Story = {
  args: { initials: undefined },
  parameters: { presentation: { theme: 'dark', language: 'arabic' } },
};

export const LabeledStandalone: Story = {
  args: {
    initials: 'AF',
    'aria-label': 'Amjed Fadul',
  },
};
