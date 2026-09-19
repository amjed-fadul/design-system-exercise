// @vitest-environment jsdom

import { createRequire } from "node:module";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiKeysEvaluation } from "./ApiKeysEvaluation";

const requireFromReactPackage = createRequire(`${process.cwd()}/package.json`);
const { act, cleanup, render, screen, within } = requireFromReactPackage("@testing-library/react");
const userEvent = requireFromReactPackage("@testing-library/user-event").default;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("API keys directory", () => {
  it("filters by key name or prefix and shows an empty state for no matches", async () => {
    const user = userEvent.setup();
    render(<ApiKeysEvaluation />);

    const search = screen.getByRole("searchbox", { name: "Search API keys" });

    await user.type(search, "analytics");
    expect(screen.getByRole("button", { name: "View details for Analytics reader" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "View details for Production deploy" })).toBeNull();

    await user.clear(search);
    await user.type(search, "nsk_prod_7H2");
    expect(screen.getByRole("button", { name: "View details for Production deploy" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "View details for Analytics reader" })).toBeNull();

    await user.clear(search);
    await user.type(search, "no-such-key");
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByRole("heading", { name: "No API keys found" })).not.toBeNull();
  });

  it("opens the requested key's details and restores focus to its record action", async () => {
    const user = userEvent.setup();
    render(<ApiKeysEvaluation />);

    const trigger = screen.getByRole("button", { name: "View details for Production deploy" });
    await user.click(trigger);

    const detailDialog = screen.getByRole("dialog", { name: "Details for Production deploy" });
    expect(detailDialog.getAttribute("aria-modal")).toBe("true");
    expect(screen.getByRole("region", { name: "API key details" })).not.toBeNull();
    expect(screen.getAllByText("nsk_prod_7H2")).toHaveLength(2);
    expect(screen.getByText("Amal Hassan")).not.toBeNull();
    expect(screen.getByText("Not provided in evaluation fixture")).not.toBeNull();
    expect((document.getElementById("api-keys") as HTMLElement).inert).toBe(true);

    const closePanel = within(detailDialog).getByRole("button", { name: "Close panel" });
    const revokeKey = within(detailDialog).getByRole("button", { name: "Revoke key" });
    expect(document.activeElement).toBe(closePanel);
    await user.tab();
    expect(document.activeElement).toBe(revokeKey);
    await user.tab();
    expect(document.activeElement).toBe(closePanel);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Details for Production deploy" })).toBeNull();
    expect(document.activeElement).toBe(trigger);

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Close panel" }));
    expect(document.activeElement).toBe(trigger);
    expect(Boolean((document.getElementById("api-keys") as HTMLElement).inert)).toBe(false);
  });

  it("requires a name and access scope before adding a key without creating a secret", async () => {
    const user = userEvent.setup();
    render(<ApiKeysEvaluation />);

    await user.click(screen.getByRole("button", { name: "Create API key" }));
    const dialog = screen.getByRole("dialog", { name: "Create API key" });
    const submit = within(dialog).getByRole("button", { name: "Create API key" });

    await user.click(submit);
    expect(within(dialog).getByRole("textbox", { name: "Key name" }).getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(within(dialog).getByRole("alert").textContent).toContain("Choose an access scope.");

    await user.type(within(dialog).getByRole("textbox", { name: "Key name" }), "Evaluation reader");
    await user.click(within(dialog).getByRole("radio", { name: "Read only" }));
    await user.click(submit);

    expect(screen.getByRole("button", { name: "View details for Evaluation reader" })).not.toBeNull();
    expect(screen.getByText("Not generated (evaluation only)")).not.toBeNull();
    expect(screen.getByRole("status").textContent).toContain(
      "API key added to the local evaluation directory. No secret value was generated or stored.",
    );
  });

  it("revokes an active key only after an explicit confirmation", async () => {
    const user = userEvent.setup();
    render(<ApiKeysEvaluation />);

    await user.click(screen.getByRole("button", { name: "View details for Production deploy" }));
    let detailDialog = screen.getByRole("dialog", { name: "Details for Production deploy" });
    await user.click(within(detailDialog).getByRole("button", { name: "Revoke key" }));

    let confirmation = screen.getByRole("dialog", { name: "Revoke API key?" });
    expect(confirmation.textContent).toContain("cannot be undone");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Revoke API key?" })).toBeNull();

    detailDialog = screen.getByRole("dialog", { name: "Details for Production deploy" });
    expect(within(detailDialog).getByText("Active")).not.toBeNull();
    await user.click(within(detailDialog).getByRole("button", { name: "Revoke key" }));
    confirmation = screen.getByRole("dialog", { name: "Revoke API key?" });
    await user.click(within(confirmation).getByRole("button", { name: "Revoke key" }));

    expect(screen.getByRole("status").textContent).toContain("Production deploy was revoked.");
    expect(document.activeElement).toBe(
      within(detailDialog).getByRole("button", { name: "Close panel" }),
    );
    expect(within(screen.getByRole("region", { name: "API key details" })).getByText("Revoked")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Revoke key" })).toBeNull();
  });

  it("marks contextual detail as unresolved instead of opening it in compact evidence", () => {
    render(<ApiKeysEvaluation layout="compact" />);

    const details = screen.getByRole("button", { name: "View details for Production deploy" });
    expect(details.hasAttribute("disabled")).toBe(true);
    expect(details.getAttribute("aria-describedby")).toBe("api-keys-detail-limit");
    expect(screen.getByRole("note").textContent).toContain("does not define a narrow-screen model");
  });

  it("inherits Arabic RTL and dark mode while keeping API key prefixes LTR", () => {
    const { container } = render(
      <ApiKeysEvaluation language="ar" theme="dark" layout="compact" />,
    );
    const root = container.querySelector(".api-keys-evaluation");
    const prefix = screen.getByText("nsk_analytics_4F9");

    expect(root?.getAttribute("dir")).toBe("rtl");
    expect(root?.getAttribute("lang")).toBe("ar");
    expect(root?.getAttribute("data-theme")).toBe("dark");
    expect(root?.getAttribute("data-language")).toBe("arabic");
    expect(screen.getByRole("searchbox", { name: "ابحث عن مفاتيح API" })).not.toBeNull();
    expect(prefix.getAttribute("dir")).toBe("ltr");
  });

  it("follows the approved expanded-shell boundary in automatic layout mode", async () => {
    let matches = true;
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    const mediaQuery = {
      get matches() {
        return matches;
      },
      media: "(max-width: 1199px)",
      onchange: null,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener);
      },
      removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener);
      },
    } as unknown as MediaQueryList;
    vi.stubGlobal("matchMedia", () => mediaQuery);

    render(<ApiKeysEvaluation layout="auto" />);
    const details = screen.getByRole("button", { name: "View details for Production deploy" });
    expect(details.hasAttribute("disabled")).toBe(true);

    await act(async () => {
      matches = false;
      listeners.forEach((listener) => listener({ matches: false } as MediaQueryListEvent));
    });
    expect(details.hasAttribute("disabled")).toBe(false);
  });
});
