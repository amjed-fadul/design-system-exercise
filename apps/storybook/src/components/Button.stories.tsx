import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, type ButtonProps } from '@design-system-exercise/react';

const emphasisOptions = ['primary', 'secondary', 'text'] as const;
const toneOptions = ['default', 'critical'] as const;
const iconPositionOptions = ['leading', 'trailing'] as const;

const arrowIconUrl = new URL(
  '../patterns/assets/application-shell-view-chevron.svg',
  import.meta.url,
).href;

function ArrowIcon() {
  return (
    <span
      aria-hidden="true"
      data-dse-directional-icon="true"
      style={{
        display: 'block',
        inlineSize: 'var(--dse-icons-size-md)',
        blockSize: 'var(--dse-icons-size-md)',
        background: 'currentColor',
        WebkitMaskImage: `url("${arrowIconUrl}")`,
        WebkitMaskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskImage: `url("${arrowIconUrl}")`,
        maskPosition: 'center',
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
      }}
    />
  );
}

function localizedArgs(args: ButtonProps, language: string | undefined): ButtonProps {
  if (language !== 'arabic') return args;
  return {
    ...args,
    children: 'إرسال الدعوة',
    loadingLabel: 'جارٍ الإرسال…',
  };
}

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Controls/Button',
  component: Button,
  args: {
    children: 'Send invite',
    emphasis: 'primary',
    tone: 'default',
    loading: false,
    loadingLabel: 'Sending…',
    iconPosition: 'leading',
    disabled: false,
  },
  argTypes: {
    children: { control: 'text' },
    emphasis: { control: 'select', options: [...emphasisOptions] },
    tone: { control: 'select', options: [...toneOptions] },
    loading: { control: 'boolean' },
    loadingLabel: { control: 'text' },
    icon: { control: false },
    iconPosition: { control: 'inline-radio', options: [...iconPositionOptions] },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          "**Contract**\n\n`dse.button@1.0.0`\n\n**Runtime**\n\n`@design-system-exercise/react`\n\n**Guidance**\n\nUse Button for deliberate commands. Emphasis communicates action hierarchy, while `tone=\"critical\"` is reserved for destructive or high-risk commands.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export const buttonMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args, context) => <Button {...localizedArgs(args, context.globals.language)} />,
};

export const EmphasisMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: (_args, context) => {
    const arabic = context.globals.language === 'arabic';
    const label = arabic ? 'متابعة' : 'Continue';
    return (
      <div
        style={{
          display: 'grid',
          gap: 'var(--dse-spacing-semantic-gap-md)',
          maxWidth: 720,
        }}
      >
        {toneOptions.map((tone) => (
          <div
            key={tone}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--dse-spacing-primitive-space-300)',
              alignItems: 'center',
            }}
          >
            {emphasisOptions.map((emphasis) => (
              <Button key={`${tone}-${emphasis}`} emphasis={emphasis} tone={tone}>
                {label}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const CriticalTone: Story = {
  args: {
    tone: 'critical',
    children: 'Remove member',
  },
  render: (args, context) => (
    <Button {...localizedArgs(args, context.globals.language)}>
      {context.globals.language === 'arabic' ? 'إزالة العضو' : args.children}
    </Button>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Send invite',
  },
  render: (args, context) => <Button {...localizedArgs(args, context.globals.language)} />,
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Send invite',
    loadingLabel: 'Sending…',
  },
  render: (args, context) => <Button {...localizedArgs(args, context.globals.language)} />,
};

export const WithLeadingIcon: Story = {
  args: {
    icon: <ArrowIcon />,
    iconPosition: 'leading',
    children: 'Continue',
  },
  render: (args, context) => (
    <Button {...args}>{context.globals.language === 'arabic' ? 'متابعة' : args.children}</Button>
  ),
};

export const WithTrailingIcon: Story = {
  args: {
    icon: <ArrowIcon />,
    iconPosition: 'trailing',
    children: 'Continue',
  },
  render: (args, context) => (
    <Button {...args}>{context.globals.language === 'arabic' ? 'متابعة' : args.children}</Button>
  ),
};
