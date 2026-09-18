import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge } from '@design-system-exercise/react';

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Data Display/Status Badge',
  component: StatusBadge,
  args: {
    label: 'Active',
  },
  argTypes: {
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Contract: dse.status-badge@1.0.0. Figma authority: Status Badge 128:1821. This is a neutral, static state label with an exact 28px height, 5px block padding, 10px inline padding, and content-driven width. Product code owns the status definitions and supplies labels such as Active or Invitation pending; there is no tone or status enum variant. Meaning comes from visible text rather than color. A static Status Badge is not an alert or live region, is not interactive or focusable, and dynamic announcements belong to the containing workflow. Semantic tokens adapt the same neutral presentation across Light/Dark and English/Arabic/RTL.',
      },
    },
  },
} satisfies Meta<typeof StatusBadge>;

export const statusBadgeMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: { label: 'Active' },
};

export const InvitationPending: Story = {
  args: { label: 'Invitation pending' },
};

export const DarkActive: Story = {
  args: { label: 'Active' },
  globals: { theme: 'dark' },
};

export const DarkInvitationPending: Story = {
  args: { label: 'Invitation pending' },
  globals: { theme: 'dark' },
};

export const ArabicActive: Story = {
  args: { label: 'نشط' },
  globals: { language: 'arabic' },
};

export const ArabicInvitationPending: Story = {
  args: { label: 'دعوة معلّقة' },
  globals: { language: 'arabic' },
};

export const DarkArabicActive: Story = {
  args: { label: 'نشط' },
  globals: { theme: 'dark', language: 'arabic' },
};

export const DarkArabicInvitationPending: Story = {
  args: { label: 'دعوة معلّقة' },
  globals: { theme: 'dark', language: 'arabic' },
};
