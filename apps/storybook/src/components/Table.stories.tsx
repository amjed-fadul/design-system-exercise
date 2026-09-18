import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar,
  Button,
  StatusBadge,
  Table,
  type TableProps,
  type TableRowData,
} from '@design-system-exercise/react';

interface IdentityProps {
  initials: string;
  name: string;
  email: string;
}

function Identity({ initials, name, email }: IdentityProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 0,
      }}
    >
      <Avatar initials={initials} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <span
          style={{
            color: 'var(--dse-color-semantic-fg-primary)',
            fontFamily: 'var(--dse-typography-semantic-label-default-family)',
            fontSize: 'var(--dse-typography-semantic-label-default-size)',
            fontWeight: 'var(--dse-typography-semantic-label-default-weight)',
            lineHeight: 'var(--dse-typography-semantic-label-default-line-height)',
            letterSpacing: 'var(--dse-typography-semantic-label-default-letter-spacing)',
            overflowWrap: 'anywhere',
          }}
        >
          {name}
        </span>
        <span
          style={{
            color: 'var(--dse-color-semantic-fg-secondary)',
            fontFamily: 'var(--dse-typography-semantic-body-small-family)',
            fontSize: 'var(--dse-typography-semantic-body-small-size)',
            fontWeight: 'var(--dse-typography-semantic-body-small-weight)',
            lineHeight: 'var(--dse-typography-semantic-body-small-line-height)',
            letterSpacing: 'var(--dse-typography-semantic-body-small-letter-spacing)',
            overflowWrap: 'anywhere',
          }}
        >
          {email}
        </span>
      </div>
    </div>
  );
}

function Role({ children }: { children: string }) {
  return (
    <span
      style={{
        color: 'var(--dse-color-semantic-fg-primary)',
        fontFamily: 'var(--dse-typography-semantic-body-small-family)',
        fontSize: 'var(--dse-typography-semantic-body-small-size)',
        fontWeight: 'var(--dse-typography-semantic-body-small-weight)',
        lineHeight: 'var(--dse-typography-semantic-body-small-line-height)',
        letterSpacing: 'var(--dse-typography-semantic-body-small-letter-spacing)',
      }}
    >
      {children}
    </span>
  );
}

interface PersonRowInput {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
  status: string;
  actionLabel: string;
  actionAriaLabel: string;
  selected?: boolean;
}

function personRow({
  id,
  initials,
  name,
  email,
  role,
  status,
  actionLabel,
  actionAriaLabel,
  selected,
}: PersonRowInput): TableRowData {
  return {
    id,
    primary: <Identity initials={initials} name={name} email={email} />,
    secondary: <Role>{role}</Role>,
    status: <StatusBadge label={status} />,
    action: (
      <Button emphasis="secondary" aria-label={actionAriaLabel}>
        {actionLabel}
      </Button>
    ),
    selected,
  };
}

const defaultRows: TableRowData[] = [
  personRow({
    id: 'sara-ahmed',
    initials: 'SA',
    name: 'Sara Ahmed',
    email: 'sara.ahmed@example.com',
    role: 'Admin',
    status: 'Active',
    actionLabel: 'View details',
    actionAriaLabel: 'View Sara Ahmed details',
  }),
  personRow({
    id: 'omar-ali',
    initials: 'OA',
    name: 'Omar Ali',
    email: 'omar.ali@example.com',
    role: 'Member',
    status: 'Invitation pending',
    actionLabel: 'View details',
    actionAriaLabel: 'View Omar Ali details',
  }),
];

const selectedRows: TableRowData[] = defaultRows.map((row, index) => ({
  ...row,
  selected: index === 0,
}));

const longIdentityRows: TableRowData[] = [
  personRow({
    id: 'long-identity',
    initials: 'LN',
    name: 'Layla Noor Al-Sayegh with an intentionally long account name',
    email: 'layla.noor.al-sayegh.with-a-long-address@example-company.com',
    role: 'Member',
    status: 'Active',
    actionLabel: 'View details',
    actionAriaLabel: 'View Layla Noor Al-Sayegh details',
  }),
];

const arabicRows: TableRowData[] = [
  personRow({
    id: 'sara-ar',
    initials: 'سأ',
    name: 'سارة أحمد',
    email: 'sara.ahmed@example.com',
    role: 'مسؤولة',
    status: 'نشط',
    actionLabel: 'عرض التفاصيل',
    actionAriaLabel: 'عرض تفاصيل سارة أحمد',
    selected: true,
  }),
  personRow({
    id: 'omar-ar',
    initials: 'عع',
    name: 'عمر علي',
    email: 'omar.ali@example.com',
    role: 'عضو',
    status: 'دعوة معلّقة',
    actionLabel: 'عرض التفاصيل',
    actionAriaLabel: 'عرض تفاصيل عمر علي',
  }),
];

function TableCanvas({ args, width }: { args: TableProps; width: number }) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        minHeight: 320,
        padding: 32,
        overflowX: 'auto',
        background: 'var(--dse-color-semantic-surface-canvas)',
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          inlineSize: width,
          minInlineSize: width,
          marginInline: 'auto',
        }}
      >
        <Table {...args} />
      </div>
    </div>
  );
}

const renderWide = (args: TableProps) => <TableCanvas args={args} width={1168} />;
const renderNarrow = (args: TableProps) => <TableCanvas args={args} width={736} />;

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Structure/Table',
  component: Table,
  args: {
    rows: defaultRows,
    primaryLabel: 'Person',
    secondaryLabel: 'Role',
    statusLabel: 'Status',
    actionLabel: 'Details',
    footerText: '2 people shown',
  },
  argTypes: {
    rows: { control: false },
    primaryLabel: { control: 'text' },
    secondaryLabel: { control: 'text' },
    statusLabel: { control: 'text' },
    actionLabel: { control: 'text' },
    footerText: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "**Contract**\n\nPublic: `dse.table@1.0.0`  \nPrivate: `dse._table-header@1.0.0`, `dse._table-row@1.0.0`\n\n**Runtime**\n\n`@design-system-exercise/react`\n\n**Guidance**\n\nThe runtime is a native semantic four-column table in fixed Primary / Secondary / Status / Action order, with optional footer copy and contextual selected-row presentation. Selected means the record is associated with open detail; it is not bulk selection. Hover is CSS-derived and the row itself is never an activation target. There is no sorting, pagination, bulk selection, search, editable cells, expansion, or arbitrary columns. It is not a data grid. The narrow evidence uses a 736px table and the wide evidence uses 1168px while Primary absorbs flexible width. Theme and writing direction are inherited.",
      },
    },
  },
} satisfies Meta<typeof Table>;

export const tableMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: renderWide,
};

export const SelectedRow: Story = {
  args: {
    rows: selectedRows,
  },
  render: renderWide,
};

export const WithoutFooter: Story = {
  args: {
    footerText: undefined,
  },
  render: renderWide,
};

export const Narrow736: Story = {
  parameters: {
    tableWidth: 736,
  },
  render: renderNarrow,
};

export const LongIdentity: Story = {
  args: {
    rows: longIdentityRows,
    footerText: '1 person shown',
  },
  parameters: {
    tableWidth: 736,
  },
  render: renderNarrow,
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: renderWide,
};

const arabicArgs = {
  rows: arabicRows,
  primaryLabel: 'الشخص',
  secondaryLabel: 'الدور',
  statusLabel: 'الحالة',
  actionLabel: 'التفاصيل',
  footerText: 'شخصان ظاهران',
} satisfies Partial<TableProps>;

export const Arabic: Story = {
  globals: {
    language: 'arabic',
  },
  args: arabicArgs,
  render: renderWide,
};

export const DarkArabic: Story = {
  globals: {
    theme: 'dark',
    language: 'arabic',
  },
  args: arabicArgs,
  render: renderWide,
};
