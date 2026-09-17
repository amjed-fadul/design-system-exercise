import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Link,
  PageHeading,
  type PageHeadingProps,
} from '@design-system-exercise/react';

function BreadcrumbsFixture({ arabic = false }: { arabic?: boolean }) {
  const trailTextStyle = {
    color: 'var(--dse-color-semantic-fg-secondary)',
    fontFamily: 'var(--dse-typography-semantic-label-small-family)',
    fontSize: 'var(--dse-typography-semantic-label-small-size)',
    fontWeight: 'var(--dse-typography-semantic-label-small-weight)',
    lineHeight: 'var(--dse-typography-semantic-label-small-line-height)',
    letterSpacing: 'var(--dse-typography-semantic-label-small-letter-spacing)',
  } as const;

  return (
    <nav aria-label={arabic ? 'مسار الصفحة' : 'Breadcrumbs'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="#workspace">{arabic ? 'مساحة العمل' : 'Workspace'}</Link>
        <span aria-hidden="true" style={trailTextStyle}>
          /
        </span>
        <span aria-current="page" style={trailTextStyle}>
          {arabic ? 'الفريق والصلاحيات' : 'Team & access'}
        </span>
      </div>
    </nav>
  );
}

function PrimaryAction({ arabic = false }: { arabic?: boolean }) {
  return <Button>{arabic ? 'دعوة عضو' : 'Invite member'}</Button>;
}

function TwoActions({ arabic = false }: { arabic?: boolean }) {
  return (
    <>
      <Button emphasis="secondary">{arabic ? 'تصدير' : 'Export'}</Button>
      <Button>{arabic ? 'دعوة عضو' : 'Invite member'}</Button>
    </>
  );
}

function PageHeadingCanvas(args: PageHeadingProps) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        minHeight: 220,
        padding: 32,
        background: 'var(--dse-color-semantic-surface-canvas)',
      }}
    >
      <PageHeading {...args} />
    </div>
  );
}

const meta = {
  title: 'Components/Navigation/Page Heading',
  component: PageHeading,
  args: {
    title: 'Team members',
    description: 'Manage members and pending invitations in your workspace.',
    showDescription: true,
    breadcrumbs: <BreadcrumbsFixture />,
    actions: <PrimaryAction />,
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    showDescription: { control: 'boolean' },
    breadcrumbs: { control: false },
    actions: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Public contract: dse.page-heading@1.0.0 from Figma 142:2488. Page Heading owns one page h1, optional supporting description, one Breadcrumbs slot, and up to two page-level Button actions. Application Shell owns placement; product code supplies copy and outcomes. Search Field and primary navigation stay outside Page Heading. Breadcrumbs is not yet implemented in the React package in C15, so this Storybook evidence uses a semantic story-only fixture styled with the governed Label/small tokens; the future C16 Breadcrumbs milestone should replace that fixture without expanding the Page Heading API.',
      },
    },
  },
} satisfies Meta<typeof PageHeading>;

export const pageHeadingMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <PageHeadingCanvas {...(args as PageHeadingProps)} />,
};

export const WithoutDescription: Story = {
  args: { showDescription: false },
  render: (args) => <PageHeadingCanvas {...(args as PageHeadingProps)} />,
};

export const WithTwoActions: Story = {
  args: { actions: <TwoActions /> },
  render: (args) => <PageHeadingCanvas {...(args as PageHeadingProps)} />,
};

export const WithBreadcrumbs: Story = {
  args: { breadcrumbs: <BreadcrumbsFixture /> },
  render: (args) => <PageHeadingCanvas {...(args as PageHeadingProps)} />,
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  render: (args) => <PageHeadingCanvas {...(args as PageHeadingProps)} />,
};

export const Arabic: Story = {
  globals: { language: 'arabic' },
  args: {
    title: 'أعضاء الفريق',
    description: 'إدارة الأعضاء والدعوات المعلقة في مساحة العمل.',
    breadcrumbs: <BreadcrumbsFixture arabic />,
    actions: <PrimaryAction arabic />,
  },
  render: (args) => <PageHeadingCanvas {...(args as PageHeadingProps)} />,
};

export const DarkArabic: Story = {
  globals: { theme: 'dark', language: 'arabic' },
  args: {
    title: 'أعضاء الفريق',
    description: 'إدارة الأعضاء والدعوات المعلقة في مساحة العمل.',
    breadcrumbs: <BreadcrumbsFixture arabic />,
    actions: <TwoActions arabic />,
  },
  render: (args) => <PageHeadingCanvas {...(args as PageHeadingProps)} />,
};
