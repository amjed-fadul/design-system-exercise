import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Breadcrumbs,
  Button,
  PageHeading,
  type PageHeadingProps,
} from '@design-system-exercise/react';

function PageBreadcrumbs({ arabic = false }: { arabic?: boolean }) {
  return (
    <Breadcrumbs
      ariaLabel={arabic ? 'مسار الصفحة' : 'Breadcrumbs'}
      ancestors={[
        {
          label: arabic ? 'مساحة العمل' : 'Workspace',
          href: '#workspace',
        },
      ]}
      currentLabel={arabic ? 'الفريق والصلاحيات' : 'Team & access'}
    />
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
    breadcrumbs: <PageBreadcrumbs />,
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
          'Public contract: dse.page-heading@1.0.0 from Figma 142:2488. Page Heading owns one page h1, optional supporting description, one Breadcrumbs slot, and up to two page-level Button actions. Application Shell owns placement; product code supplies copy and outcomes. Search Field and primary navigation stay outside Page Heading. C16 now supplies the governed dse.breadcrumbs@1.0.0 implementation for the Breadcrumbs slot without expanding the Page Heading API.',
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
  args: { breadcrumbs: <PageBreadcrumbs /> },
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
    breadcrumbs: <PageBreadcrumbs arabic />,
    actions: <PrimaryAction arabic />,
  },
  render: (args) => <PageHeadingCanvas {...(args as PageHeadingProps)} />,
};

export const DarkArabic: Story = {
  globals: { theme: 'dark', language: 'arabic' },
  args: {
    title: 'أعضاء الفريق',
    description: 'إدارة الأعضاء والدعوات المعلقة في مساحة العمل.',
    breadcrumbs: <PageBreadcrumbs arabic />,
    actions: <TwoActions arabic />,
  },
  render: (args) => <PageHeadingCanvas {...(args as PageHeadingProps)} />,
};
