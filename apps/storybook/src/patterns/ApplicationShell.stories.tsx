import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar,
  Breadcrumbs,
  Button,
  PageHeading,
  SearchField,
  Sidebar,
  StatusBadge,
  Table,
  TopNavbar,
  type SidebarItem,
  type TableRowData,
} from '@design-system-exercise/react';
import {
  ApplicationShell,
  type ApplicationShellProps,
} from '@design-system-exercise/patterns';

function NavIcon({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'grid',
        placeItems: 'center',
        inlineSize: 20,
        blockSize: 20,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label.slice(0, 1)}
    </span>
  );
}

const englishItems: readonly SidebarItem[] = [
  { id: 'overview', label: 'Overview', href: '#overview', icon: <NavIcon label="Overview" /> },
  { id: 'projects', label: 'Projects', href: '#projects', icon: <NavIcon label="Projects" /> },
  { id: 'team', label: 'Team & access', href: '#team', icon: <NavIcon label="Team" /> },
  { id: 'settings', label: 'Settings', href: '#settings', icon: <NavIcon label="Settings" /> },
];

const arabicItems: readonly SidebarItem[] = [
  { id: 'overview', label: 'نظرة عامة', href: '#overview', icon: <NavIcon label="Overview" /> },
  { id: 'projects', label: 'المشاريع', href: '#projects', icon: <NavIcon label="Projects" /> },
  { id: 'team', label: 'الفريق والصلاحيات', href: '#team', icon: <NavIcon label="Team" /> },
  { id: 'settings', label: 'الإعدادات', href: '#settings', icon: <NavIcon label="Settings" /> },
];

function Brand() {
  return (
    <div style={{ direction: 'ltr', display: 'flex', alignItems: 'center', gap: 14 }}>
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
          fontWeight: 600,
        }}
      >
        N
      </span>
      <strong>Northstar</strong>
    </div>
  );
}

function Account({ arabic = false }: { arabic?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
      <span dir="auto">{arabic ? 'أمل حسن · مشرفة' : 'Amal Hassan · Admin'}</span>
      <Avatar initials={arabic ? 'أح' : 'AH'} />
    </div>
  );
}

function ShellSidebar({ arabic = false }: { arabic?: boolean }) {
  return (
    <Sidebar
      label={arabic ? 'مساحة العمل' : 'WORKSPACE'}
      items={arabic ? arabicItems : englishItems}
      currentId="team"
      footer={
        <div style={{ display: 'grid', gap: 2 }}>
          <strong style={{ fontSize: 14 }}>{arabic ? 'مساحة نورث ستار' : 'Northstar workspace'}</strong>
          <span style={{ fontSize: 12, color: 'var(--dse-color-semantic-fg-secondary)' }}>
            {arabic ? 'تم تسجيل الدخول كمشرفة' : 'Signed in as Admin'}
          </span>
        </div>
      }
    />
  );
}

function ShellTopNavbar({ arabic = false }: { arabic?: boolean }) {
  return (
    <TopNavbar
      brand={<Brand />}
      contextLabel={arabic ? 'إدارة مساحة العمل' : 'Workspace administration'}
      account={<Account arabic={arabic} />}
    />
  );
}

function ShellPageHeading({ arabic = false }: { arabic?: boolean }) {
  return (
    <PageHeading
      title={arabic ? 'أعضاء الفريق' : 'Team members'}
      description={
        arabic
          ? 'إدارة الأعضاء والدعوات المعلقة في مساحة العمل.'
          : 'Manage members and pending invitations in your workspace.'
      }
      breadcrumbs={
        <Breadcrumbs
          ariaLabel={arabic ? 'مسار الصفحة' : 'Breadcrumbs'}
          ancestors={[{ label: arabic ? 'مساحة العمل' : 'Workspace', href: '#workspace' }]}
          currentLabel={arabic ? 'الفريق والصلاحيات' : 'Team & access'}
        />
      }
      actions={<Button>{arabic ? 'دعوة عضو' : 'Invite member'}</Button>}
    />
  );
}

function Identity({
  initials,
  name,
  email,
}: {
  initials: string;
  name: string;
  email: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
      <Avatar initials={initials} />
      <div style={{ display: 'grid', minWidth: 0 }}>
        <strong style={{ overflowWrap: 'anywhere' }}>{name}</strong>
        <span
          dir="ltr"
          style={{
            color: 'var(--dse-color-semantic-fg-secondary)',
            overflowWrap: 'anywhere',
          }}
        >
          {email}
        </span>
      </div>
    </div>
  );
}

function directoryRows(arabic = false): readonly TableRowData[] {
  const people = [
    ['amal', arabic ? 'أح' : 'AH', arabic ? 'أمل حسن (أنت)' : 'Amal Hassan (you)', 'amal@example.com', arabic ? 'مشرفة' : 'Admin', arabic ? 'نشط' : 'Active', false],
    ['sara', arabic ? 'سا' : 'SA', arabic ? 'سارة أحمد' : 'Sara Ahmed', 'sara@example.com', arabic ? 'عضو' : 'Member', arabic ? 'نشط' : 'Active', true],
    ['omar', arabic ? 'عم' : 'OK', arabic ? 'عمر خالد' : 'Omar Khalid', 'omar@example.com', arabic ? 'عضو' : 'Member', arabic ? 'نشط' : 'Active', true],
    ['leila', arabic ? 'لي' : 'LI', arabic ? 'ليلى إبراهيم' : 'Leila Ibrahim', 'leila@example.com', arabic ? 'عضو' : 'Member', arabic ? 'نشط' : 'Active', true],
    ['daniel', 'DC', arabic ? 'دانيال تشين' : 'Daniel Chen', 'daniel@example.com', arabic ? 'عضو' : 'Member', arabic ? 'نشط' : 'Active', true],
    ['jamal', '@', arabic ? 'لم ينضم بعد' : 'Has not joined yet', 'jamal@example.com', arabic ? 'عضو' : 'Member', arabic ? 'الدعوة معلقة' : 'Invitation pending', false],
    ['maya', '@', arabic ? 'لم تنضم بعد' : 'Has not joined yet', 'maya@example.com', arabic ? 'عضو' : 'Member', arabic ? 'الدعوة معلقة' : 'Invitation pending', false],
  ] as const;

  return people.map(([id, initials, name, email, role, status, showAction]) => ({
    id,
    primary: <Identity initials={initials} name={name} email={email} />,
    secondary: <span>{role}</span>,
    status: <StatusBadge label={status} />,
    action: showAction ? (
      <Button
        emphasis="text"
        aria-label={arabic ? `عرض تفاصيل ${name}` : `View ${name} details`}
      >
        {arabic ? 'عرض' : 'View'}
      </Button>
    ) : (
      <span aria-hidden="true">—</span>
    ),
  }));
}

function DirectoryContent({ arabic = false }: { arabic?: boolean }) {
  return (
    <div aria-label="Directory content" style={{ display: 'grid', gap: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          justifyContent: 'space-between',
          minWidth: 0,
        }}
      >
        <div style={{ inlineSize: 360, maxInlineSize: '100%' }}>
          <SearchField
            aria-label={arabic ? 'البحث عن عضو' : 'Search team members'}
            clearButtonLabel={arabic ? 'مسح البحث' : 'Clear search'}
            placeholder={arabic ? 'ابحث بالاسم أو البريد الإلكتروني' : 'Search by name or email'}
          />
        </div>
        <span style={{ color: 'var(--dse-color-semantic-fg-secondary)' }}>
          {arabic
            ? '7 أشخاص · 5 نشطين · دعوتان معلقتان'
            : '7 people · 5 active · 2 invitations pending'}
        </span>
      </div>

      <Table
        rows={directoryRows(arabic)}
        primaryLabel={arabic ? 'الشخص' : 'Person'}
        secondaryLabel={arabic ? 'الدور' : 'Role'}
        statusLabel={arabic ? 'الحالة' : 'Status'}
        actionLabel={arabic ? 'التفاصيل' : 'Details'}
        footerText={arabic ? 'تم عرض 7 أشخاص' : '7 people shown'}
      />
    </div>
  );
}

function ShellCanvas({
  args,
  width,
  height,
  arabic = false,
}: {
  args: ApplicationShellProps;
  width: number;
  height: number;
  arabic?: boolean;
}) {
  return (
    <div
      style={{
        inlineSize: width,
        blockSize: height,
        maxInlineSize: '100%',
        overflow: 'hidden',
        border: '1px solid var(--dse-color-semantic-border-subtle)',
      }}
    >
      <ApplicationShell
        {...args}
        sidebar={<ShellSidebar arabic={arabic} />}
        topNavbar={<ShellTopNavbar arabic={arabic} />}
        pageHeading={<ShellPageHeading arabic={arabic} />}
      >
        <DirectoryContent arabic={arabic} />
      </ApplicationShell>
    </div>
  );
}

const meta = {
  title: 'Patterns/Application Shell',
  component: ApplicationShell,
  args: {
    sidebar: <ShellSidebar />,
    topNavbar: <ShellTopNavbar />,
    pageHeading: <ShellPageHeading />,
    children: <DirectoryContent />,
    viewportMode: 'auto',
  },
  argTypes: {
    sidebar: { control: false },
    topNavbar: { control: false },
    pageHeading: { control: false },
    children: { control: false },
    viewportMode: {
      control: 'select',
      options: ['auto', 'expanded', 'compact'],
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Pattern contract: dse.pattern.application-shell@1.0.0 from Figma 68:494. Application Shell composes the governed 64px Top Navbar, Sidebar, optional Page Heading, and a scrollable main region. At 1200 CSS px and above the Sidebar is expanded (208px); below 1200 it is compact (64px). The shell uses the governed layout tokens for the 32px page inset and responsive decision, supports RTL through logical flow, and does not remount page content when its layout mode changes. It does not own query, selection, draft, request, member, permission, or backend state; those remain with product/workflow patterns.',
      },
    },
  },
} satisfies Meta<typeof ApplicationShell>;

export const applicationShellMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

function story(width: number, height = 960, arabic = false) {
  return (args: ApplicationShellProps) => (
    <ShellCanvas args={args} width={width} height={height} arabic={arabic} />
  );
}

export const Wide1440: Story = {
  args: { viewportMode: 'expanded' },
  parameters: { shellWidth: 1440, shellHeight: 960 },
  render: story(1440),
};

export const Narrow960: Story = {
  args: { viewportMode: 'compact' },
  parameters: { shellWidth: 960, shellHeight: 960 },
  render: story(960),
};

export const Boundary1199: Story = {
  args: { viewportMode: 'compact' },
  parameters: { shellWidth: 1199, shellHeight: 900 },
  render: story(1199, 900),
};

export const Boundary1200: Story = {
  args: { viewportMode: 'expanded' },
  parameters: { shellWidth: 1200, shellHeight: 900 },
  render: story(1200, 900),
};

export const ShortWindow: Story = {
  args: { viewportMode: 'compact' },
  parameters: { shellWidth: 960, shellHeight: 720 },
  render: story(960, 720),
};

export const Zoom320: Story = {
  args: { viewportMode: 'compact' },
  parameters: { shellWidth: 320, shellHeight: 720 },
  render: story(320, 720),
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  args: { viewportMode: 'expanded' },
  parameters: { shellWidth: 1440, shellHeight: 960 },
  render: story(1440),
};

export const Arabic: Story = {
  globals: { language: 'arabic' },
  args: { viewportMode: 'expanded' },
  parameters: { shellWidth: 1440, shellHeight: 960 },
  render: story(1440, 960, true),
};

export const DarkArabic: Story = {
  globals: { theme: 'dark', language: 'arabic' },
  args: { viewportMode: 'expanded' },
  parameters: { shellWidth: 1440, shellHeight: 960 },
  render: story(1440, 960, true),
};
