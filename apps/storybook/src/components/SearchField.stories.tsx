import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchField, type SearchFieldProps } from '@design-system-exercise/react';

function localizedArgs(args: SearchFieldProps, language: string | undefined): SearchFieldProps {
  if (language !== 'arabic') return args;

  return {
    ...args,
    'aria-label': 'البحث في الفريق',
    clearButtonLabel: 'مسح البحث',
    placeholder: 'ابحث بالاسم أو البريد الإلكتروني',
  };
}

const meta = {
  excludeStories: /.*Meta$/,
  title: 'Components/Controls/Search Field',
  component: SearchField,
  decorators: [
    (Story) => (
      <div style={{ width: 360, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    'aria-label': 'Search team',
    clearButtonLabel: 'Clear search',
    placeholder: 'Search by name or email',
    disabled: false,
  },
  argTypes: {
    'aria-label': { control: 'text' },
    clearButtonLabel: { control: 'text' },
    defaultValue: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    onClear: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Contract: dse.search-field@1.0.0. Figma authority: Search Field node 112:1710, composed with the private compact _Input Control and governed Icon Button. The source evidence is 360px wide with a fixed 40px control height; width remains layout-owned and is not a Search Field prop. The runtime is a native search input with a required accessible name, fixed search icon, and a named clear action derived from whether the live query is filled. Figma state/content axes are derived. Invalid/error, loading, results, suggestions, result counts, and debouncing are intentionally outside the component boundary.',
      },
    },
  },
} satisfies Meta<typeof SearchField>;

export const searchFieldMeta = meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args, context) => (
    <SearchField {...localizedArgs(args, context.globals.language)} />
  ),
};

export const Empty: Story = {
  args: {
    placeholder: 'Search by name or email',
  },
};

export const Filled: Story = {
  args: {
    defaultValue: 'sara',
  },
};

export const FocusedEmpty: Story = {
  args: {
    placeholder: 'Search by name or email',
  },
  play: ({ canvasElement }) => {
    canvasElement.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus evidence uses the real native search input focus state; there is no focus/state prop.',
      },
    },
  },
};

export const FocusedFilled: Story = {
  args: {
    defaultValue: 'sara',
  },
  play: ({ canvasElement }) => {
    canvasElement.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
  },
};

export const DisabledEmpty: Story = {
  args: {
    placeholder: 'Search by name or email',
    disabled: true,
  },
};

export const DisabledFilled: Story = {
  args: {
    defaultValue: 'sara',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A filled disabled Search Field keeps the clear action visible but disables the Icon Button, matching the live Figma source.',
      },
    },
  },
};

export const LongQuery: Story = {
  args: {
    defaultValue: 'sara.al-hassan@example-company-with-a-very-long-domain.example',
  },
  parameters: {
    docs: {
      description: {
        story: 'Long-query evidence remains a bounded single-line search viewport. Result/help content belongs outside the field.',
      },
    },
  },
};

export const ArabicLatinEmail: Story = {
  args: {
    'aria-label': 'البحث في الفريق',
    clearButtonLabel: 'مسح البحث',
    defaultValue: 'sara@example.com',
    placeholder: 'ابحث بالاسم أو البريد الإلكتروني',
  },
  parameters: {
    docs: {
      description: {
        story: 'RTL/localization evidence: the page language global controls direction while the Search and X glyphs remain unmirrored. A Latin email query stays valid search content.',
      },
    },
  },
};
