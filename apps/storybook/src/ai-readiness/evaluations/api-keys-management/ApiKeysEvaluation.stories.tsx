import type { Meta, StoryObj } from "@storybook/react";
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
    viewportMode: "auto",
  },
  argTypes: {
    language: {
      control: "inline-radio",
      options: ["en", "ar"],
    },
    theme: {
      control: "inline-radio",
      options: ["light", "dark"],
    },
    viewportMode: {
      control: "select",
      options: ["auto", "expanded", "compact"],
    },
  },
} satisfies Meta<typeof ApiKeysEvaluation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnglishLightWide: Story = {
  args: {
    language: "en",
    theme: "light",
    viewportMode: "expanded",
  },
};

export const ArabicDarkCompact: Story = {
  args: {
    language: "ar",
    theme: "dark",
    viewportMode: "compact",
  },
};

export const EnglishDarkCompact: Story = {
  args: {
    language: "en",
    theme: "dark",
    viewportMode: "compact",
  },
};

export const ArabicLightWide: Story = {
  args: {
    language: "ar",
    theme: "light",
    viewportMode: "expanded",
  },
};
