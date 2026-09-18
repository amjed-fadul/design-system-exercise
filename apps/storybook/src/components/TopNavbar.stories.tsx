import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar,
  IconButton,
  TopNavbar,
  type TopNavbarProps,
} from '@design-system-exercise/react';

const moonIconUrl = new URL('./assets/top-navbar-moon.svg', import.meta.url).href;

function Brand() {
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
        dir="ltr"
        style={{
          color: 'var(--dse-color-semantic-fg-primary)',
          fontFamily: 'var(--dse-typography-semantic-title-component-family)',
          fontSize: 'var(--dse-typography-semantic-title-component-size)',
          fontWeight: 'var(--dse-typography-semantic-title-component-weight)',
          lineHeight: 'var(--dse-typography-semantic-title-component-line-height)',
        }}
      >
        Northstar
      </strong>
    </div>
  );
}

function MoonIcon() {
  return (
    <span
      style={{
        display: 'block',
        inlineSize: 20,
        blockSize: 20,
        background: 'currentColor',
        WebkitMaskImage: `url("${moonIconUrl}")`,
        WebkitMaskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskImage: `url("${moonIconUrl}")`,
        maskPosition: 'center',
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
      }}
    />
  );
}

function Account({ arabic = false }: { arabic?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        whiteSpace: 'nowrap',
        color: 'var(--dse-color-semantic-fg-secondary)',
        fontFamily: 'var(--dse-typography-semantic-body-small-family)',
        fontSize: 'var(--dse-typography-semantic-body-small-size)',
        lineHeight: 'var(--dse-typography-semantic-body-small-line-height)',
      }}
    >
      <IconButton
        aria-label={arabic ? 'التبديل إلى الوضع الداكن' : 'Switch to dark mode'}
        icon={<MoonIcon />}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span dir="auto">{arabic ? 'أمل حسن · مشرفة' : 'Amal Hassan · Admin'}</span>
        <Avatar initials={arabic ? 'أح' : 'AH'} />
      </div>
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
  excludeStories: /.*Meta$/,
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
          'Public contract: dse.top-navbar@1.0.0 from Figma 228:18954. Top Navbar is the persistent 64px Application Shell header: one Brand slot at inline-start, optional concise context, flexible space, one Account slot at inline-end, and a subtle bottom divider. The shell inherits document direction: LTR places Brand left and Account right; RTL places Brand right and Account left. The Brand composition follows inherited direction so the mark stays at inline-start; only the Latin Northstar word itself remains LTR. Figma order=forward is a render selector, not a public prop, and theme is inherited through semantic tokens. Application Shell owns placement, Product owns Brand/Account data plus appearance or account interactions, and page patterns own page heading and task actions. The Storybook account example composes the existing IconButton and Avatar plus the exact Figma Moon source to mirror the reviewed evidence without moving that behavior into Top Navbar.',
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
    brand: <Brand />,
    contextLabel: 'إدارة مساحة العمل',
    account: <Account arabic />,
  },
  render: (args) => <TopNavbarCanvas {...(args as TopNavbarProps)} />,
};

export const DarkArabic: Story = {
  globals: { theme: 'dark', language: 'arabic' },
  args: {
    brand: <Brand />,
    contextLabel: 'إدارة مساحة العمل',
    account: <Account arabic />,
  },
  render: (args) => <TopNavbarCanvas {...(args as TopNavbarProps)} />,
};
