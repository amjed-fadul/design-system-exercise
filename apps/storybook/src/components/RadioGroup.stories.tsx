import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RadioGroup,
  type RadioGroupOption,
  type RadioGroupProps,
} from '@design-system-exercise/react';

const genericOptions: RadioGroupProps['options'] = [
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'View shared work without changing it.',
  },
  {
    value: 'editor',
    label: 'Editor',
    description: 'Create and update shared work.',
  },
];

const teamAccessOptions: RadioGroupProps['options'] = [
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
];

function ControlledDemo() {
  const [value, setValue] = useState('member');
  return (
    <RadioGroup
      label="Role"
      name="controlled-role"
      options={teamAccessOptions}
      value={value}
      onValueChange={setValue}
    />
  );
}

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Controls/Radio Group',
  component: RadioGroup,
  decorators: [
    (Story) => (
      <div style={{ width: 464, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Access level',
    name: 'access-level',
    options: genericOptions,
    required: true,
  },
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    options: { control: 'object' },
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    required: { control: 'boolean' },
    onValueChange: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "**Contract**\n\nPublic: `dse.radio-group@1.0.0`  \nPrivate: `dse._radio-option@1.0.0`\n\n**Runtime**\n\n`@design-system-exercise/react`\n\n**Guidance**\n\nThe runtime uses a native fieldset, legend, and same-named radio inputs; browser selection and keyboard behavior remain native. At least two uniquely valued options are required. Selected state and description visibility are derived rather than public controls. Member preselection is a product fixture only, never the reusable component default.",
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export const radioGroupMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const RequiredRoles: Story = {
  args: {
    label: 'Access level',
    name: 'required-access-level',
    options: genericOptions,
    required: true,
  },
};

export const TeamAccess: Story = {
  args: {
    label: 'Role',
    name: 'team-role',
    options: teamAccessOptions,
    defaultValue: 'member',
  },
  parameters: {
    docs: {
      description: {
        story: 'Product fixture only: Team & Access starts with Member. The generic Radio Group does not auto-select any option.',
      },
    },
  },
};

export const ControlledSelection: Story = {
  render: () => <ControlledDemo />,
};

export const Descriptions: Story = {
  args: {
    label: 'Access level',
    name: 'described-access-level',
    options: genericOptions,
  },
};

export const WithoutDescriptions: Story = {
  args: {
    label: 'Access level',
    name: 'plain-access-level',
    options: [
      { value: 'viewer', label: 'Viewer' },
      { value: 'editor', label: 'Editor' },
    ] as const,
  },
};

export const DisabledOption: Story = {
  args: {
    label: 'Access level',
    name: 'disabled-access-level',
    options: [
      genericOptions[0],
      { ...genericOptions[1], disabled: true },
    ] as [RadioGroupOption, RadioGroupOption],
  },
};

export const LongDescription: Story = {
  args: {
    label: 'Access level',
    name: 'long-access-level',
    options: [
      genericOptions[0],
      {
        value: 'editor',
        label: 'Editor',
        description:
          'Create and update shared work, collaborate across projects, and keep access decisions understandable even when this explanation wraps onto multiple lines.',
      },
    ],
  },
};

export const Focused: Story = {
  args: {
    label: 'Access level',
    name: 'focused-access-level',
    options: genericOptions,
  },
  play: ({ canvasElement }) => {
    canvasElement.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus evidence uses the real native radio focus state; there is no state or focus prop.',
      },
    },
  },
};

export const Arabic: Story = {
  args: {
    label: 'الدور',
    name: 'arabic-role',
    options: [
      {
        value: 'member',
        label: 'عضو',
        description: 'استخدام مساحة العمل دون إدارة الأشخاص.',
      },
      {
        value: 'admin',
        label: 'مسؤول',
        description: 'دعوة الأشخاص وإدارة الأعضاء والأدوار.',
      },
    ],
    defaultValue: 'member',
  },
  globals: {
    language: 'arabic',
  },
};
