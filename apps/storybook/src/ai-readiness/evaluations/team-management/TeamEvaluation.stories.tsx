import type { Meta, StoryObj } from "@storybook/react-vite";
import "@design-system-exercise/tokens/css";
import "@design-system-exercise/react/styles.css";
import "@design-system-exercise/patterns/styles.css";
import "./TeamEvaluation.css";
import { TeamEvaluation } from "./TeamEvaluation";

const meta = {
  title: "AI Readiness/Evaluations/Team Management",
  component: TeamEvaluation,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    scenario: "populated",
    language: "en",
    theme: "light",
    viewportMode: "auto",
  },
} satisfies Meta<typeof TeamEvaluation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PopulatedDirectory: Story = {};

export const WideShell: Story = {
  args: { viewportMode: "expanded" },
};

export const FilteredNoResults: Story = {
  args: { scenario: "filtered-empty" },
};

export const InviteValidation: Story = {
  args: { scenario: "invite-validation" },
};

export const InviteRequestFailureAndRetry: Story = {
  args: { scenario: "invite-retry" },
  parameters: {
    docs: {
      description: {
        story:
          "The recoverable error is a deterministic evaluation fixture. Retry completes locally so the failure, retained values, and success outcome can be reviewed without asserting a production request rule.",
      },
    },
  },
};

export const InviteSuccess: Story = {
  args: { scenario: "invite-success" },
};

export const JoinedMemberDetail: Story = {
  args: { scenario: "member-detail", viewportMode: "expanded" },
  parameters: {
    docs: {
      description: {
        story: "Open this story in a wide viewport to review the approved modal Side Panel composition.",
      },
    },
  },
};

export const RoleSaveFailure: Story = {
  args: { scenario: "role-save-failure", viewportMode: "expanded" },
};

export const RoleSaveSuccess: Story = {
  args: { scenario: "role-save-success", viewportMode: "expanded" },
};

export const UnsavedRoleCloseGuard: Story = {
  args: { scenario: "unsaved-close-guard", viewportMode: "expanded" },
};

export const CompactDirectory: Story = {
  args: { viewportMode: "compact" },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the compact shell and stacked directory controls. Contextual detail activation is intentionally unavailable here because approved guidance leaves its narrow behavior unresolved; see AUTHORING-REPORT.md.",
      },
    },
  },
};

export const ArabicRtl: Story = {
  args: { language: "ar" },
};

export const DarkTheme: Story = {
  args: { theme: "dark" },
};

export const ArabicDarkCompact: Story = {
  args: { language: "ar", theme: "dark", viewportMode: "compact" },
};
