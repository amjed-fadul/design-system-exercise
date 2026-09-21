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
          "**Contract**\n\n`dse.status-badge@1.0.0`\n\n**Runtime**\n\n`@design-system-exercise/react`\n\n**Guidance**\n\nStatus Badge is a neutral, static state label with an exact 28px height, 5px block padding, 10px inline padding, and content-driven width. Product code owns the status definitions and supplies labels such as Active or Invitation pending; there is no tone variant or status enum. Meaning comes from visible text rather than color. A static Status Badge is not an alert or live region, is not interactive or focusable, and dynamic announcements belong to the containing workflow.",
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
  parameters: { presentation: { theme: 'dark' } },
};

export const DarkInvitationPending: Story = {
  args: { label: 'Invitation pending' },
  parameters: { presentation: { theme: 'dark' } },
};

export const ArabicActive: Story = {
  args: { label: 'نشط' },
  parameters: { presentation: { language: 'arabic' } },
};

export const ArabicInvitationPending: Story = {
  args: { label: 'دعوة معلّقة' },
  parameters: { presentation: { language: 'arabic' } },
};

export const DarkArabicActive: Story = {
  args: { label: 'نشط' },
  parameters: { presentation: { theme: 'dark', language: 'arabic' } },
};

export const DarkArabicInvitationPending: Story = {
  args: { label: 'دعوة معلّقة' },
  parameters: { presentation: { theme: 'dark', language: 'arabic' } },
};
