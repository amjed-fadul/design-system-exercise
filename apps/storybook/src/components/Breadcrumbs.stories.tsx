import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Breadcrumbs,
  Button,
  PageHeading,
  type BreadcrumbsProps,
} from '@design-system-exercise/react';

function BreadcrumbsCanvas(args: BreadcrumbsProps) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        minHeight: 160,
        padding: 32,
        background: 'var(--dse-color-semantic-surface-canvas)',
      }}
    >
      <Breadcrumbs {...args} />
    </div>
  );
}

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    ancestors: [{ label: 'Workspace', href: '#workspace' }],
    currentLabel: 'Team & access',
    ariaLabel: 'Breadcrumbs',
  },
  argTypes: {
    ancestors: { control: 'object' },
    currentLabel: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Public contract: dse.breadcrumbs@1.0.0 from Figma 139:20. Breadcrumbs represents route hierarchy: one or more ancestors render through the governed Link component and the current route remains plain text with aria-current="page". Internal _Breadcrumb Link Item anatomy comes from Figma 139:16 and is not publicly exported. Separators are decorative. This release establishes no collapse or overflow-menu behavior, no custom separator, and no current-page link.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export const breadcrumbsMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <BreadcrumbsCanvas {...(args as BreadcrumbsProps)} />,
};

export const MultipleAncestors: Story = {
  args: {
    ancestors: [
      { label: 'Workspace', href: '#workspace' },
      { label: 'Settings', href: '#settings' },
      { label: 'People', href: '#people' },
    ],
    currentLabel: 'Team & access',
  },
  render: (args) => <BreadcrumbsCanvas {...(args as BreadcrumbsProps)} />,
};

export const InPageHeading: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div
      style={{
        boxSizing: 'border-box',
        minHeight: 220,
        padding: 32,
        background: 'var(--dse-color-semantic-surface-canvas)',
      }}
    >
      <PageHeading
        title="Team members"
        description="Manage members and pending invitations in your workspace."
        breadcrumbs={<Breadcrumbs {...(args as BreadcrumbsProps)} />}
        actions={<Button>Invite member</Button>}
      />
    </div>
  ),
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  render: (args) => <BreadcrumbsCanvas {...(args as BreadcrumbsProps)} />,
};

export const Arabic: Story = {
  globals: { language: 'arabic' },
  args: {
    ancestors: [{ label: 'مساحة العمل', href: '#workspace' }],
    currentLabel: 'الفريق والصلاحيات',
    ariaLabel: 'مسار التنقل',
  },
  render: (args) => <BreadcrumbsCanvas {...(args as BreadcrumbsProps)} />,
};

export const DarkArabic: Story = {
  globals: { theme: 'dark', language: 'arabic' },
  args: {
    ancestors: [{ label: 'مساحة العمل', href: '#workspace' }],
    currentLabel: 'الفريق والصلاحيات',
    ariaLabel: 'مسار التنقل',
  },
  render: (args) => <BreadcrumbsCanvas {...(args as BreadcrumbsProps)} />,
};
