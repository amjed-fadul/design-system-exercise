import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar,
  TopNavbar,
  type TopNavbarProps,
} from '@design-system-exercise/react';

function Brand({ arabic = false }: { arabic?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        blockSize: 32,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'grid',
          placeItems: 'center',
          inlineSize: 30,
          blockSize: 30,
          borderRadius: 6,
          background: 'var(--dse-color-semantic-state-selected)',
          color: 'var(--dse-color-semantic-fg-primary)',
          fontFamily: 'var(--dse-typography-semantic-label-default-family)',
          fontSize: 'var(--dse-typography-semantic-label-default-size)',
          fontWeight: 'var(--dse-typography-semantic-label-default-weight)',
          lineHeight: 'var(--dse-typography-semantic-label-default-line-height)',
        }}
      >
        N
      </span>
      <strong
        style={{
          color: 'var(--dse-color-semantic-fg-primary)',
          fontFamily: 'var(--dse-typography-semantic-title-component-family)',
          fontSize: 'var(--dse-typography-semantic-title-component-size)',
          fontWeight: 'var(--dse-typography-semantic-title-component-weight)',
          lineHeight: 'var(--dse-typography-semantic-title-component-line-height)',
        }}
      >
        {arabic ? 'Northstar' : 'Northstar'}
      </strong>
    </div>
  );
}

function Account({ arabic = false }: { arabic?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        whiteSpace: 'nowrap',
        color: 'var(--dse-color-semantic-fg-secondary)',
        fontFamily: 'var(--dse-typography-semantic-body-small-family)',
        fontSize: 'var(--dse-typography-semantic-body-small-size)',
        lineHeight: 'var(--dse-typography-semantic-body-small-line-height)',
      }}
    >
      <span>{arabic ? 'أمل حسن · مشرفة' : 'Amal Hassan · Admin'}</span>
      <Avatar initials={arabic ? 'أح' : 'AH'} />
    </div>
  );
}

function TopNavbarCanvas(args: TopNavbarProps) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        minHeight: 128,
        paddingBlock: 32,
        paddingInline: 24,
        background: 'var(--dse-color-semantic-surface-canvas)',
      }}
    >
      <TopNavbar {...args} />
    </div>
  );
}

const meta = {
  title: 'Components/Navigation/Top Navbar',
  component: TopNavbar,
  args: {
    brand: <Brand />,
    contextLabel: 'Workspace administration',
    showContext: true,
    account: <Account />,
  },
  argTypes: {
    brand: { control: false },
    contextLabel: { control: 'text' },
    showContext: { control: 'boolean' },
    account: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Public contract: dse.top-navbar@1.0.0 from Figma 228:18954. Top Navbar is the persistent 64px Application Shell header: one Brand slot, optional concise context, flexible space, one Account slot, and a subtle bottom divider. The shell composition is fixed left-to-right even in Arabic contexts; text inside Brand, context, and Account can determine its own direction. Figma order=forward is a render selector, not a public prop, and theme is inherited through semantic tokens. Application Shell owns placement, Product owns Brand/Account data plus appearance or account interactions, and page patterns own page heading and task actions.',
      },
    },
  },
} satisfies Meta<typeof TopNavbar>;

export const topNavbarMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <TopNavbarCanvas {...(args as TopNavbarProps)} />,
};

export const WithoutContext: Story = {
  args: { showContext: false },
  render: (args) => <TopNavbarCanvas {...(args as TopNavbarProps)} />,
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  render: (args) => <TopNavbarCanvas {...(args as TopNavbarProps)} />,
};

export const Arabic: Story = {
  globals: { language: 'arabic' },
  args: {
    brand: <Brand arabic />,
    contextLabel: 'إدارة مساحة العمل',
    account: <Account arabic />,
  },
  render: (args) => <TopNavbarCanvas {...(args as TopNavbarProps)} />,
};

export const DarkArabic: Story = {
  globals: { theme: 'dark', language: 'arabic' },
  args: {
    brand: <Brand arabic />,
    contextLabel: 'إدارة مساحة العمل',
    account: <Account arabic />,
  },
  render: (args) => <TopNavbarCanvas {...(args as TopNavbarProps)} />,
};
