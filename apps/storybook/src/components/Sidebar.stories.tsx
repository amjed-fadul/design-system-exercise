import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar, type SidebarItem, type SidebarProps } from '@design-system-exercise/react';

const navIconUrls = {
  home: new URL(
    '../patterns/assets/application-shell-sidebar-overview.svg',
    import.meta.url,
  ).href,
  team: new URL(
    '../patterns/assets/application-shell-sidebar-team.svg',
    import.meta.url,
  ).href,
  settings: new URL(
    '../patterns/assets/application-shell-sidebar-settings.svg',
    import.meta.url,
  ).href,
} as const;

function NavIcon({ type }: { type: keyof typeof navIconUrls }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        inlineSize: 'var(--dse-icons-size-md)',
        blockSize: 'var(--dse-icons-size-md)',
        background: 'currentColor',
        WebkitMaskImage: `url("${navIconUrls[type]}")`,
        WebkitMaskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskImage: `url("${navIconUrls[type]}")`,
        maskPosition: 'center',
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
      }}
    />
  );
}

const englishItems: readonly SidebarItem[] = [
  { id: 'overview', label: 'Overview', href: '/overview', icon: <NavIcon type="home" /> },
  { id: 'team', label: 'Team & access', href: '/team', icon: <NavIcon type="team" /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <NavIcon type="settings" /> },
];

const arabicItems: readonly SidebarItem[] = [
  { id: 'overview', label: 'نظرة عامة', href: '/overview', icon: <NavIcon type="home" /> },
  { id: 'team', label: 'الفريق والوصول', href: '/team', icon: <NavIcon type="team" /> },
  { id: 'settings', label: 'الإعدادات', href: '/settings', icon: <NavIcon type="settings" /> },
];

function Footer({ arabic = false }: { arabic?: boolean }) {
  return (
    <div style={{ display: 'grid', gap: 2 }}>
      <strong
        style={{
          color: 'var(--dse-color-semantic-fg-primary)',
          fontFamily: 'var(--dse-typography-semantic-label-default-family)',
          fontSize: 'var(--dse-typography-semantic-label-default-size)',
          fontWeight: 'var(--dse-typography-semantic-label-default-weight)',
          lineHeight: 'var(--dse-typography-semantic-label-default-line-height)',
          letterSpacing: 'var(--dse-typography-semantic-label-default-letter-spacing)',
        }}
      >
        {arabic ? 'مساحة أكمي' : 'Acme workspace'}
      </strong>
      <span
        style={{
          color: 'var(--dse-color-semantic-fg-secondary)',
          fontFamily: 'var(--dse-typography-semantic-caption-default-family)',
          fontSize: 'var(--dse-typography-semantic-caption-default-size)',
          fontWeight: 'var(--dse-typography-semantic-caption-default-weight)',
          lineHeight: 'var(--dse-typography-semantic-caption-default-line-height)',
          letterSpacing: 'var(--dse-typography-semantic-caption-default-letter-spacing)',
        }}
      >
        {arabic ? 'خطة الفريق' : 'Team plan'}
      </span>
    </div>
  );
}

function SidebarCanvas(args: SidebarProps) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        minHeight: 640,
        height: 640,
        background: 'var(--dse-color-semantic-surface-canvas)',
      }}
    >
      <Sidebar {...args} />
    </div>
  );
}

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Navigation/Sidebar',
  component: Sidebar,
  args: {
    mode: 'expanded',
    label: 'WORKSPACE',
    items: englishItems,
    currentId: 'team',
    footer: <Footer />,
  },
  argTypes: {
    mode: { control: 'select', options: ['expanded', 'compact'] },
    label: { control: 'text' },
    items: { control: false },
    currentId: { control: false },
    footer: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "**Contract**\n\nPublic: `dse.sidebar@1.0.0`  \nPrivate: `dse._navigation-item@1.0.0`\n\n**Runtime**\n\n`@design-system-exercise/react`\n\n**Guidance**\n\nSidebar renders a named native navigation region and ordered native anchor destinations; `currentId` derives exactly one `aria-current=\"page\"` destination. Expanded and compact modes preserve the same destination identity and order while compact visually hides labels without removing accessible text. The internal Navigation Item stays private. Application Shell owns responsive mode selection and placement; product or router code owns route configuration and navigation effects.",
      },
    },
  },
} satisfies Meta<typeof Sidebar>;

export const sidebarMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  render: (args) => <SidebarCanvas {...(args as SidebarProps)} />,
};

export const Compact: Story = {
  args: { mode: 'compact' },
  render: (args) => <SidebarCanvas {...(args as SidebarProps)} />,
};

export const DarkExpanded: Story = {
  parameters: { presentation: { theme: 'dark' } },
  render: (args) => <SidebarCanvas {...(args as SidebarProps)} />,
};

export const ArabicExpanded: Story = {
  parameters: { presentation: { language: 'arabic' } },
  args: {
    label: 'مساحة العمل',
    items: arabicItems,
    currentId: 'team',
    footer: <Footer arabic />,
  },
  render: (args) => <SidebarCanvas {...(args as SidebarProps)} />,
};

export const DarkArabicExpanded: Story = {
  parameters: { presentation: { theme: 'dark', language: 'arabic' } },
  args: {
    label: 'مساحة العمل',
    items: arabicItems,
    currentId: 'team',
    footer: <Footer arabic />,
  },
  render: (args) => <SidebarCanvas {...(args as SidebarProps)} />,
};

export const WithoutFooter: Story = {
  args: { footer: undefined },
  render: (args) => <SidebarCanvas {...(args as SidebarProps)} />,
};
