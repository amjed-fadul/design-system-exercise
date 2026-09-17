import type { Meta, StoryObj } from '@storybook/react-vite';
import { InlineFeedback } from '@design-system-exercise/react';

const meta = {
  title: 'Components/Feedback/Inline Feedback',
  component: InlineFeedback,
  decorators: [
    (Story) => (
      <div style={{ width: 464, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    intent: 'error',
    title: 'Invitation not sent',
    message: 'We could not send this invitation. Your entries are kept here; try again.',
  },
  argTypes: {
    intent: { control: 'select', options: ['error', 'success'] },
    title: { control: 'text' },
    message: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Contract: dse.inline-feedback@1.0.0. Figma authority: Inline Feedback 127:30. intent is explicit: error renders role=alert and success renders role=status. The message is required and non-empty; title is optional and Figma showTitle is derived from title presence. The component never moves focus. Alert and Check geometry comes from the exact Figma assets while semantic token color adapts to theme. Recovery actions such as a Try again Button remain siblings supplied by the containing pattern; there is no action or dismiss slot.',
      },
    },
  },
} satisfies Meta<typeof InlineFeedback>;

export const inlineFeedbackMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {};

export const Success: Story = {
  args: {
    intent: 'success',
    title: 'Invitation sent',
    message: 'The invitation was sent. Access remains pending until the person joins.',
  },
};

export const WithoutTitle: Story = {
  args: {
    intent: 'success',
    title: undefined,
    message: 'Changes saved.',
  },
};

export const LongMessage: Story = {
  args: {
    intent: 'error',
    title: 'Changes not saved',
    message:
      'Sara is still a Member. Your Admin selection is kept here so you can review it and try saving again without losing the surrounding task.',
  },
};

export const DarkError: Story = {
  globals: { theme: 'dark' },
};

export const DarkSuccess: Story = {
  args: {
    intent: 'success',
    title: 'Invitation sent',
    message: 'The invitation was sent. Access remains pending until the person joins.',
  },
  globals: { theme: 'dark' },
};

export const ArabicError: Story = {
  args: {
    intent: 'error',
    title: 'لم يتم حفظ التغييرات',
    message: 'ما زالت التغييرات غير محفوظة. اختياراتك محفوظة هنا ويمكنك المحاولة مرة أخرى.',
  },
  globals: { language: 'arabic' },
};

export const ArabicSuccess: Story = {
  args: {
    intent: 'success',
    title: 'تم حفظ التغييرات',
    message: 'تم حفظ التغييرات بنجاح.',
  },
  globals: { language: 'arabic' },
};

export const DarkArabicError: Story = {
  args: {
    intent: 'error',
    title: 'لم يتم حفظ التغييرات',
    message: 'ما زالت التغييرات غير محفوظة. اختياراتك محفوظة هنا ويمكنك المحاولة مرة أخرى.',
  },
  globals: { theme: 'dark', language: 'arabic' },
};

export const DarkArabicSuccess: Story = {
  args: {
    intent: 'success',
    title: 'تم حفظ التغييرات',
    message: 'تم حفظ التغييرات بنجاح.',
  },
  globals: { theme: 'dark', language: 'arabic' },
};
