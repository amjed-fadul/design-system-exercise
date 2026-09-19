import type { Meta, StoryObj } from "@storybook/react-vite";

import "@design-system-exercise/tokens/css";
import "@design-system-exercise/react/styles.css";
import "@design-system-exercise/patterns/styles.css";

import { ApiKeysEvaluation } from "./ApiKeysEvaluation";

const meta = {
  title: "AI Readiness/Evaluations/API Keys Management",
  component: ApiKeysEvaluation,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    language: "en",
    theme: "light",
    viewportMode: "expanded",
  },
  argTypes: {
    language: { control: "inline-radio", options: ["en", "ar"] },
    theme: { control: "inline-radio", options: ["light", "dark"] },
    viewportMode: {
      control: "inline-radio",
      options: ["auto", "expanded", "compact"],
    },
    initialQuery: { control: "text" },
    initialCreateOpen: { control: "boolean" },
    initialDetailId: { control: "text" },
  },
} satisfies Meta<typeof ApiKeysEvaluation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnglishLightWide: Story = {};

export const ArabicRtl: Story = {
  args: {
    language: "ar",
  },
};

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

export const CompactDirectory: Story = {
  args: {
    viewportMode: "compact",
  },
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};

export const FilteredDirectory: Story = {
  args: {
    initialQuery: "nsk_analytics",
  },
};

export const NoResults: Story = {
  args: {
    initialQuery: "billing service",
  },
};

export const CreateKey: Story = {
  args: {
    initialCreateOpen: true,
  },
};

export const KeyDetails: Story = {
  args: {
    initialDetailId: "production-deploy",
  },
};

