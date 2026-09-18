import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField, type TextFieldProps } from '@design-system-exercise/react';

function localizedArgs(args: TextFieldProps, language: string | undefined): TextFieldProps {
  if (language !== 'arabic') return args;

  return {
    ...args,
    label: 'البريد الإلكتروني',
    supportingText:
      args.supportingText == null ? args.supportingText : 'شخص واحد لكل دعوة.',
    errorMessage:
      args.errorMessage == null ? args.errorMessage : 'أدخل عنوان بريد إلكتروني صالحًا.',
  };
}

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Controls/Text Field',
  component: TextField,
  args: {
    label: 'Email address',
    placeholder: 'name@example.com',
    supportingText: 'One person per invitation.',
    invalid: false,
    required: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    defaultValue: { control: 'text' },
    placeholder: { control: 'text' },
    supportingText: { control: 'text' },
    errorMessage: { control: 'text' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Contract: dse.text-field@1.0.0. Figma authority: Text Field node 112:263, composed with private _Input Control node 111:22. Text Field renders a native input with an explicit visible label, optional supporting/error message, native required/disabled/value/placeholder behavior, and semantic invalid state. Figma state and content axes are derived from native runtime behavior; the private size axis is not public. The public Text Field always uses the 44px default internal shell.',
      },
    },
  },
} satisfies Meta<typeof TextField>;

export const textFieldMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args, context) => <TextField {...localizedArgs(args, context.globals.language)} />,
};

export const Empty: Story = {
  args: {
    label: 'Email address',
    placeholder: 'name@example.com',
    supportingText: 'One person per invitation.',
  },
};

export const Filled: Story = {
  args: {
    label: 'Email address',
    defaultValue: 'alex@example.com',
    supportingText: 'One person per invitation.',
  },
};

export const Required: Story = {
  args: {
    label: 'Email address',
    placeholder: 'name@example.com',
    supportingText: 'One person per invitation.',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email address',
    defaultValue: 'alex@example.com',
    supportingText: 'One person per invitation.',
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    label: 'Email address',
    defaultValue: 'not-an-email',
    invalid: true,
    errorMessage: 'Enter a valid email address.',
  },
};

export const InvalidFocused: Story = {
  args: {
    label: 'Email address',
    defaultValue: 'not-an-email',
    invalid: true,
    errorMessage: 'Enter a valid email address.',
  },
  play: ({ canvasElement }) => {
    canvasElement.querySelector<HTMLInputElement>('input')?.focus();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Invalid-focus evidence uses the real native input focus state. No focus or visual state prop is introduced.',
      },
    },
  },
};

export const LongSupportingText: Story = {
  args: {
    label: 'Workspace display name',
    placeholder: 'Enter a display name',
    supportingText:
      'Use a clear name that teammates can recognize across invitations, access management, and workspace settings.',
  },
};

export const ArabicEmail: Story = {
  args: {
    label: 'البريد الإلكتروني',
    defaultValue: 'alex@example.com',
    supportingText: 'شخص واحد لكل دعوة.',
    dir: 'ltr',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Arabic field label with an isolated left-to-right Latin email value. The page direction remains controlled by the existing language global.',
      },
    },
  },
};
