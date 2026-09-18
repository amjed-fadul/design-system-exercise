import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link, type LinkProps } from '@design-system-exercise/react';

function localizedArgs(args: LinkProps, language: string | undefined): LinkProps {
  if (language !== 'arabic') return args;
  return {
    ...args,
    children: 'مساحة العمل',
  };
}

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Controls/Link',
  component: Link,
  args: {
    children: 'Workspace',
    href: '/workspace',
  },
  argTypes: {
    children: { control: 'text' },
    href: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Contract: dse.link@1.0.0. Figma authority: Link node 114:13. Use Link when activation primarily navigates to a destination. Visible content owns the normal accessible name; href and other native anchor attributes are forwarded unchanged. Hover, pressed, and focus-visible are browser/CSS-derived states and are intentionally not public props. This release has no disabled, visited, icon, size, or loading Link API.',
      },
    },
  },
} satisfies Meta<typeof Link>;

export const linkMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args, context) => <Link {...localizedArgs(args, context.globals.language)} />,
  parameters: {
    docs: {
      description: {
        story:
          'Default navigational evidence. Hover, press, and keyboard-focus this real anchor to inspect the browser-derived interaction states; no state prop is involved.',
      },
    },
  },
};

export const LongLabel: Story = {
  args: {
    children: 'Manage workspace access and permissions',
    href: '/workspace/access',
  },
};

export const ArabicLabel: Story = {
  args: {
    children: 'مساحة العمل',
    href: '/workspace',
  },
};

export const ExternalTarget: Story = {
  args: {
    children: 'Open external documentation',
    href: 'https://example.com/docs',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Native external-target example. target and rel are ordinary anchor attributes, not Link variants or design-system state.',
      },
    },
  },
};
