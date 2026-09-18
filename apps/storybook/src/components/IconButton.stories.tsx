import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton, type IconButtonProps } from '@design-system-exercise/react';

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M5 5l10 10M15 5 5 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClearSearchIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 8l4 4M12 8l-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function localizedArgs(
  args: IconButtonProps,
  language: string | undefined,
  arabicLabel: string,
): IconButtonProps {
  if (language !== 'arabic') return args;
  return { ...args, 'aria-label': arabicLabel };
}

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Controls/Icon Button',
  component: IconButton,
  args: {
    icon: <CloseIcon />,
    'aria-label': 'Close',
    disabled: false,
  },
  argTypes: {
    icon: { control: false },
    'aria-label': { control: 'text' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          "**Contract**\n\n`dse.icon-button@1.0.0`\n\n**Runtime**\n\n`@design-system-exercise/react`\n\n**Guidance**\n\nUse Icon Button for familiar compact commands such as closing a surface or clearing search. `aria-label` is required and owns the accessible name; the supplied icon is decorative. Hover, pressed, and focus-visible are browser/CSS-derived interaction states rather than public props. The target remains 40×40 with a 20×20 icon across themes and writing directions.",
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export const iconButtonMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args, context) => (
    <IconButton {...localizedArgs(args, context.globals.language, 'إغلاق')} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default evidence. Hover, press, and keyboard-focus this real button in the canvas to inspect the derived interaction states; no state prop is involved.',
      },
    },
  },
};

export const Close: Story = {
  args: {
    icon: <CloseIcon />,
    'aria-label': 'Close',
  },
  render: (args, context) => (
    <IconButton {...localizedArgs(args, context.globals.language, 'إغلاق')} />
  ),
};

export const ClearSearch: Story = {
  args: {
    icon: <ClearSearchIcon />,
    'aria-label': 'Clear search',
  },
  render: (args, context) => (
    <IconButton {...localizedArgs(args, context.globals.language, 'مسح البحث')} />
  ),
};

export const Disabled: Story = {
  args: {
    icon: <CloseIcon />,
    'aria-label': 'Close',
    disabled: true,
  },
  render: (args, context) => (
    <IconButton {...localizedArgs(args, context.globals.language, 'إغلاق')} />
  ),
};
