import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  InlineFeedback,
  RadioGroup,
  SidePanel,
  StatusBadge,
  type SidePanelProps,
} from '@design-system-exercise/react';

const roleOptions = [
  {
    value: 'member',
    label: 'Member',
    description: 'Use the workspace without managing people.',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Invite people and manage members and roles.',
  },
] as const;

const arabicRoleOptions = [
  {
    value: 'member',
    label: 'عضو',
    description: 'يستخدم مساحة العمل من دون إدارة الأشخاص.',
  },
  {
    value: 'admin',
    label: 'مسؤول',
    description: 'يدعو الأشخاص ويدير الأعضاء والأدوار.',
  },
] as const;

function MemberHeader({ arabic = false }: { arabic?: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--dse-spacing-primitive-space-100)',
      }}
    >
      <strong
        style={{
          color: 'var(--dse-color-semantic-fg-primary)',
          fontFamily: 'var(--dse-typography-semantic-title-component-family)',
          fontSize: 'var(--dse-typography-semantic-title-component-size)',
          fontWeight: 'var(--dse-typography-semantic-title-component-weight)',
          lineHeight: 'var(--dse-typography-semantic-title-component-line-height)',
          letterSpacing: 'var(--dse-typography-semantic-title-component-letter-spacing)',
        }}
      >
        {arabic ? 'سارة أحمد' : 'Sara Ahmed'}
      </strong>
      <span
        style={{
          color: 'var(--dse-color-semantic-fg-secondary)',
          fontFamily: 'var(--dse-typography-semantic-body-small-family)',
          fontSize: 'var(--dse-typography-semantic-body-small-size)',
          fontWeight: 'var(--dse-typography-semantic-body-small-weight)',
          lineHeight: 'var(--dse-typography-semantic-body-small-line-height)',
          letterSpacing: 'var(--dse-typography-semantic-body-small-letter-spacing)',
        }}
      >
        sara@example.com
      </span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--dse-spacing-primitive-space-100)',
      }}
    >
      <span
        style={{
          color: 'var(--dse-color-semantic-fg-secondary)',
          fontFamily: 'var(--dse-typography-semantic-label-small-family)',
          fontSize: 'var(--dse-typography-semantic-label-small-size)',
          fontWeight: 'var(--dse-typography-semantic-label-small-weight)',
          lineHeight: 'var(--dse-typography-semantic-label-small-line-height)',
          letterSpacing: 'var(--dse-typography-semantic-label-small-letter-spacing)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: 'var(--dse-color-semantic-fg-primary)',
          fontFamily: 'var(--dse-typography-semantic-body-default-family)',
          fontSize: 'var(--dse-typography-semantic-body-default-size)',
          fontWeight: 'var(--dse-typography-semantic-body-default-weight)',
          lineHeight: 'var(--dse-typography-semantic-body-default-line-height)',
          letterSpacing: 'var(--dse-typography-semantic-body-default-letter-spacing)',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function MemberBody({ arabic = false, long = false }: { arabic?: boolean; long?: boolean }) {
  return (
    <>
      <DetailRow label={arabic ? 'البريد الإلكتروني' : 'Email'} value="sara@example.com" />
      <DetailRow label={arabic ? 'الدور المحفوظ' : 'Saved role'} value={arabic ? 'عضو' : 'Member'} />
      <RadioGroup
        label={arabic ? 'الدور الجديد' : 'New role'}
        name={arabic ? 'member-role-ar' : 'member-role'}
        options={arabic ? arabicRoleOptions : roleOptions}
        defaultValue="member"
      />
      {long ? (
        <>
          <DetailRow label={arabic ? 'الفريق' : 'Team'} value={arabic ? 'التصميم' : 'Design'} />
          <DetailRow label={arabic ? 'الحالة' : 'Status'} value={arabic ? 'نشط' : 'Active'} />
          <DetailRow label={arabic ? 'آخر نشاط' : 'Last active'} value={arabic ? 'اليوم' : 'Today'} />
          <DetailRow label={arabic ? 'تاريخ الانضمام' : 'Joined'} value="12 Sep 2026" />
          <DetailRow label={arabic ? 'الموقع' : 'Location'} value={arabic ? 'دبي' : 'Dubai'} />
          <InlineFeedback
            intent="success"
            message={arabic ? 'التغييرات المحفوظة تظهر هنا.' : 'Saved changes appear here.'}
          />
        </>
      ) : null}
    </>
  );
}

function MemberActions({ arabic = false }: { arabic?: boolean }) {
  return (
    <>
      <Button emphasis="secondary">{arabic ? 'إلغاء' : 'Cancel'}</Button>
      <Button>{arabic ? 'حفظ التغييرات' : 'Save changes'}</Button>
    </>
  );
}

function SidePanelCanvas(args: SidePanelProps) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'flex-end',
        minHeight: 720,
        padding: 32,
        background: 'var(--dse-color-semantic-surface-canvas)',
      }}
    >
      <SidePanel {...args} />
    </div>
  );
}

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Feedback & Surfaces/Side Panel',
  component: SidePanel,
  args: {
    eyebrow: 'MEMBER DETAILS',
    header: <MemberHeader />,
    children: <MemberBody />,
    actions: <MemberActions />,
    showClose: true,
    closeLabel: 'Close member details',
    onClose: () => {},
  },
  argTypes: {
    eyebrow: { control: 'text' },
    header: {
      control: false,
      table: { type: { summary: 'ReactNode' } },
    },
    children: {
      control: false,
      table: { type: { summary: 'ReactNode' } },
    },
    actions: {
      control: false,
      table: { type: { summary: 'ReactNode' } },
    },
    showClose: { control: 'boolean' },
    closeLabel: { control: 'text' },
    onClose: {
      control: false,
      table: { type: { summary: '() => void' } },
    },
    className: { control: false },
    style: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "**Contract**\n\n`dse.side-panel@1.0.0`\n\n**Runtime**\n\n`@design-system-exercise/react`\n\n**Guidance**\n\nSide Panel is a non-modal contextual detail surface. It owns the raised surface, eyebrow, Header/Body/Actions regions, a scrollable flexible Body, anchored Actions, and the optional close Icon Button. It does not create a portal or backdrop, trap or restore focus, handle Escape, or make background content inert. A host pattern or workflow supplies those behaviors when it deliberately wraps the surface in a modal editor. Selection, dirty-exit protection, request progression, save outcomes, and narrow-screen navigation remain outside this component.",
      },
    },
  },
} satisfies Meta<typeof SidePanel>;

export const sidePanelMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const MemberDetails: Story = {
  render: (args) => <SidePanelCanvas {...(args as SidePanelProps)} />,
};

export const DarkMemberDetails: Story = {
  parameters: { presentation: { theme: 'dark' } },
  render: (args) => <SidePanelCanvas {...(args as SidePanelProps)} />,
};

export const ArabicMemberDetails: Story = {
  parameters: { presentation: { language: 'arabic' } },
  args: {
    eyebrow: 'تفاصيل العضو',
    header: <MemberHeader arabic />,
    children: <MemberBody arabic />,
    actions: <MemberActions arabic />,
    closeLabel: 'إغلاق تفاصيل العضو',
  },
  render: (args) => <SidePanelCanvas {...(args as SidePanelProps)} />,
};

export const DarkArabicMemberDetails: Story = {
  parameters: { presentation: { theme: 'dark', language: 'arabic' } },
  args: {
    eyebrow: 'تفاصيل العضو',
    header: <MemberHeader arabic />,
    children: <MemberBody arabic />,
    actions: <MemberActions arabic />,
    closeLabel: 'إغلاق تفاصيل العضو',
  },
  render: (args) => <SidePanelCanvas {...(args as SidePanelProps)} />,
};

export const LongBody: Story = {
  args: {
    header: <MemberHeader />,
    children: <MemberBody long />,
    actions: <MemberActions />,
    style: { blockSize: '612px' },
  },
  render: (args) => <SidePanelCanvas {...(args as SidePanelProps)} />,
};

export const DedicatedDetail: Story = {
  args: {
    eyebrow: 'MEMBER DETAILS',
    header: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <MemberHeader />
        <StatusBadge label="Active" />
      </div>
    ),
    children: <MemberBody />,
    actions: <MemberActions />,
    showClose: false,
    style: { inlineSize: '640px' },
  },
  render: (args) => <SidePanelCanvas {...(args as SidePanelProps)} />,
};
