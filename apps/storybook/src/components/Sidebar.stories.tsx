import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar, type SidebarItem, type SidebarProps } from '@design-system-exercise/react';

function NavIcon({ type }: { type: 'home' | 'team' | 'settings' }) {
  if (type === 'home') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M3 9.2 10 3l7 6.2V17h-4.5v-5h-5v5H3V9.2Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'settings') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="7" cy="7" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="8" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.8 16c.5-2.7 2.1-4.2 4.2-4.2s3.8 1.5 4.2 4.2M11.5 12.5c1.1-.9 2.5-1.1 3.6-.6 1.2.5 1.9 1.7 2.1 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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
      <strong style={{ fontSize: 14 }}>{arabic ? 'مساحة أكمي' : 'Acme workspace'}</strong>
      <span style={{ color: 'var(--dse-color-semantic-fg-secondary)', fontSize: 12 }}>
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
