import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import "@design-system-exercise/tokens/css";
import "@design-system-exercise/react/styles.css";
import "@design-system-exercise/patterns/styles.css";

import { TeamEvaluation, type TeamEvaluationProps } from "./TeamEvaluation";

const meta = {
  title: "AI Readiness/Evaluations/Team Management",
  component: TeamEvaluation,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    locale: "en",
    theme: "light",
    viewportMode: "expanded",
  },
  argTypes: {
    locale: {
      control: "inline-radio",
      options: ["en", "ar"],
    },
    theme: {
      control: "inline-radio",
      options: ["light", "dark"],
    },
    viewportMode: {
      control: "inline-radio",
      options: ["auto", "expanded", "compact"],
    },
    initialQuery: {
      control: "text",
    },
    inviteMember: { control: false },
    saveMemberRole: { control: false },
  },
} satisfies Meta<typeof TeamEvaluation>;

export default meta;
type Story = StoryObj<typeof meta>;

function pageFor(canvasElement: HTMLElement) {
  return within(canvasElement.ownerDocument.body);
}

function RecoveringInvitation(props: TeamEvaluationProps) {
  const attempts = useRef(0);
  return (
    <TeamEvaluation
      {...props}
      inviteMember={() => {
        attempts.current += 1;
        return attempts.current === 1
          ? Promise.reject(new Error("Recoverable invitation failure"))
          : Promise.resolve();
      }}
    />
  );
}

export const EnglishLightWide: Story = {};

export const ArabicDarkWide: Story = {
  args: {
    locale: "ar",
    theme: "dark",
  },
};

export const CompactDirectory: Story = {
  args: {
    viewportMode: "compact",
  },
};

export const FilteredDirectory: Story = {
  args: {
    initialQuery: "sara",
  },
};

export const NoResults: Story = {
  args: {
    initialQuery: "zoe",
  },
};

export const InviteValidation: Story = {
  play: async ({ canvasElement }) => {
    const page = pageFor(canvasElement);
    await userEvent.click(page.getByRole("button", { name: /invite member/i }));
    const dialog = page.getByRole("dialog", { name: /invite a member/i });
    await userEvent.click(within(dialog).getByRole("button", { name: /^send invitation$/i }));
    await expect(within(dialog).getByRole("textbox", { name: /email address/i })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  },
};

export const InviteRequestFailure: Story = {
  render: (args) => (
    <TeamEvaluation
      {...args}
      inviteMember={() => Promise.reject(new Error("Recoverable invitation failure"))}
    />
  ),
  play: async ({ canvasElement }) => {
    const page = pageFor(canvasElement);
    await userEvent.click(page.getByRole("button", { name: /invite member/i }));
    const dialog = page.getByRole("dialog", { name: /invite a member/i });
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: /email address/i }),
      "new.person@example.com",
    );
    await userEvent.click(within(dialog).getByRole("button", { name: /^send invitation$/i }));
    await expect(await within(dialog).findByRole("alert")).toBeInTheDocument();
  },
};

export const InviteRetrySuccess: Story = {
  render: (args) => <RecoveringInvitation {...args} />,
  play: async ({ canvasElement }) => {
    const page = pageFor(canvasElement);
    await userEvent.click(page.getByRole("button", { name: /invite member/i }));
    const dialog = page.getByRole("dialog", { name: /invite a member/i });
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: /email address/i }),
      "new.person@example.com",
    );
    await userEvent.click(within(dialog).getByRole("button", { name: /^send invitation$/i }));
    await within(dialog).findByRole("alert");
    await userEvent.click(within(dialog).getByRole("button", { name: /retry invitation/i }));
    await expect(await page.findByRole("status")).toHaveTextContent(/invitation sent/i);
  },
};

export const JoinedMemberDetail: Story = {
  play: async ({ canvasElement }) => {
    const page = pageFor(canvasElement);
    await userEvent.click(page.getByRole("button", { name: /view details for sara ahmed/i }));
    await expect(
      await page.findByRole("dialog", { name: /member details: sara ahmed/i }),
    ).toBeInTheDocument();
  },
};

export const RoleSaveFailure: Story = {
  render: (args) => (
    <TeamEvaluation
      {...args}
      saveMemberRole={() => Promise.reject(new Error("Recoverable role-save failure"))}
    />
  ),
  play: async ({ canvasElement }) => {
    const page = pageFor(canvasElement);
    await userEvent.click(page.getByRole("button", { name: /view details for sara ahmed/i }));
    const detail = page.getByRole("dialog", { name: /member details: sara ahmed/i });
    await userEvent.click(within(detail).getByText(/^Admin$/));
    await userEvent.click(within(detail).getByRole("button", { name: /save role/i }));
    await expect(await within(detail).findByRole("alert")).toBeInTheDocument();
  },
};

export const RoleSaveSuccess: Story = {
  play: async ({ canvasElement }) => {
    const page = pageFor(canvasElement);
    await userEvent.click(page.getByRole("button", { name: /view details for sara ahmed/i }));
    const detail = page.getByRole("dialog", { name: /member details: sara ahmed/i });
    await userEvent.click(within(detail).getByText(/^Admin$/));
    await userEvent.click(within(detail).getByRole("button", { name: /save role/i }));
    await expect(await within(detail).findByRole("status")).toHaveTextContent(/role updated/i);
  },
};

export const UnsavedChangeGuard: Story = {
  play: async ({ canvasElement }) => {
    const page = pageFor(canvasElement);
    await userEvent.click(page.getByRole("button", { name: /view details for omar khalid/i }));
    const detail = page.getByRole("dialog", { name: /member details: omar khalid/i });
    await userEvent.click(within(detail).getByText(/^Admin$/));
    await userEvent.click(within(detail).getByRole("button", { name: /close member details/i }));
    await expect(
      await page.findByRole("dialog", { name: /discard unsaved role change/i }),
    ).toBeInTheDocument();
  },
};
