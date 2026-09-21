import type { Meta, StoryObj } from "@storybook/react-vite";
import "@design-system-exercise/tokens/css";
import "./TeamEvaluation.css";
import { TeamEvaluation } from "./TeamEvaluation";

const meta = {
  title: "AI Readiness/Evaluations/Team Management",
  component: TeamEvaluation,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    theme: {
      control: "inline-radio",
      options: ["light", "dark"],
    },
    language: {
      control: "inline-radio",
      options: ["en", "ar"],
    },
    viewportMode: {
      control: "inline-radio",
      options: ["auto", "expanded", "compact"],
    },
  },
  args: {
    theme: "light",
    language: "en",
    viewportMode: "auto",
  },
} satisfies Meta<typeof TeamEvaluation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TeamMembers: Story = {};

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

export const ArabicRtl: Story = {
  args: {
    language: "ar",
    viewportMode: "expanded",
  },
};

export const CompactDirectory: Story = {
  args: {
    viewportMode: "compact",
  },
};

export const InviteMember: Story = {
  args: {
    initialInviteOpen: true,
  },
};

export const SaraDetails: Story = {
  args: {
    initialDetailId: "sara",
    viewportMode: "expanded",
  },
};

export const NoResults: Story = {
  args: {
    initialQuery: "no matching person",
  },
};
