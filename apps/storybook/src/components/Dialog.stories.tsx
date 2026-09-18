import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Dialog,
  RadioGroup,
  TextField,
  type DialogProps,
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

function InviteBody({ arabic = false }: { arabic?: boolean }) {
  return (
    <>
      <TextField
        label={arabic ? 'البريد الإلكتروني' : 'Email address'}
        placeholder="name@example.com"
        supportingText={arabic ? 'شخص واحد لكل دعوة.' : 'One person per invitation.'}
        required
      />
      <RadioGroup
        label={arabic ? 'الدور' : 'Role'}
        name={arabic ? 'invite-role-ar' : 'invite-role'}
        options={arabic ? arabicRoleOptions : roleOptions}
        defaultValue="member"
      />
    </>
  );
}

function InviteActions({ arabic = false }: { arabic?: boolean }) {
  return (
    <>
      <Button emphasis="secondary">{arabic ? 'إلغاء' : 'Cancel'}</Button>
      <Button>{arabic ? 'إرسال الدعوة' : 'Send invite'}</Button>
    </>
  );
}

function DialogCanvas(args: DialogProps) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ minHeight: 620 }}>
      {!open ? <Button onClick={() => setOpen(true)}>Open dialog</Button> : null}
      <Dialog {...args} open={open} onOpenChange={setOpen} />
    </div>
  );
}

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Feedback & Surfaces/Dialog',
  component: Dialog,
  args: {
    open: true,
    onOpenChange: () => {},
    title: 'Invite a member',
    description: 'Send an invitation to join Northstar.',
    children: <InviteBody />,
    actions: <InviteActions />,
    showClose: true,
    closeLabel: 'Close dialog',
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    showClose: { control: 'boolean' },
    closeLabel: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Contract: dse.dialog@1.0.0. Figma authority: Dialog node 133:6. Dialog is a controlled modal surface for a short blocking task or consequential choice. Runtime moves focus into the task, contains Tab navigation, returns focus on close, and treats background content as inert while open. Escape requests close even when the visible close Icon Button is hidden. Backdrop/outside clicks do not dismiss in v1. Dialog deliberately has no onSubmit, requestStatus, or visual business-state API; the containing pattern/workflow owns request progression, pending restrictions, validation, dirty checks, and action outcomes.',
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export const dialogMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const InviteMember: Story = {
  render: (args) => <DialogCanvas {...(args as DialogProps)} />,
};

export const DarkInviteMember: Story = {
  globals: { theme: 'dark' },
  render: (args) => <DialogCanvas {...(args as DialogProps)} />,
};

export const ArabicInviteMember: Story = {
  globals: { language: 'arabic' },
  args: {
    title: 'دعوة عضو',
    description: 'أرسل دعوة للانضمام إلى مساحة العمل.',
    children: <InviteBody arabic />,
    actions: <InviteActions arabic />,
    closeLabel: 'إغلاق النافذة',
  },
  render: (args) => <DialogCanvas {...(args as DialogProps)} />,
};

export const DarkArabicInviteMember: Story = {
  globals: { theme: 'dark', language: 'arabic' },
  args: {
    title: 'دعوة عضو',
    description: 'أرسل دعوة للانضمام إلى مساحة العمل.',
    children: <InviteBody arabic />,
    actions: <InviteActions arabic />,
    closeLabel: 'إغلاق النافذة',
  },
  render: (args) => <DialogCanvas {...(args as DialogProps)} />,
};

export const ConfirmDiscard: Story = {
  args: {
    title: 'Discard unsaved changes?',
    description:
      'Your Admin change for Sara has not been saved. Discard it and return to the directory? Her saved role will remain Member.',
    children: <p style={{ margin: 0 }}>Choose whether to keep editing or discard the draft.</p>,
    actions: (
      <>
        <Button>Keep editing</Button>
        <Button emphasis="secondary">Discard</Button>
      </>
    ),
    showClose: false,
  },
  render: (args) => <DialogCanvas {...(args as DialogProps)} />,
};

export const WithoutDescription: Story = {
  args: {
    title: 'Confirm invitation',
    description: undefined,
    children: <p style={{ margin: 0 }}>Send this invitation now?</p>,
    actions: (
      <>
        <Button emphasis="secondary">Cancel</Button>
        <Button>Send invite</Button>
      </>
    ),
  },
  render: (args) => <DialogCanvas {...(args as DialogProps)} />,
};
