// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TeamEvaluation, type TeamEvaluationProps } from "./TeamEvaluation";

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

async function renderTeam(props: TeamEvaluationProps = {}) {
  await act(async () => {
    root.render(<TeamEvaluation {...props} />);
  });
}

async function activate(element: Element | null | undefined) {
  if (!(element instanceof HTMLElement)) throw new Error("Expected an activatable element");
  await act(async () => {
    element.click();
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function enterValue(input: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  if (!valueSetter) throw new Error("Native input value setter is unavailable");

  await act(async () => {
    valueSetter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await Promise.resolve();
  });
}

function visibleText(element: Element) {
  const clone = element.cloneNode(true) as Element;
  clone.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove());
  return clone.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function accessibleName(element: Element) {
  const directName = element.getAttribute("aria-label");
  if (directName) return directName;
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    return labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
      .filter(Boolean)
      .join(" ");
  }
  return visibleText(element);
}

function button(name: string, scope: ParentNode = document) {
  return Array.from(scope.querySelectorAll("button")).find(
    (candidate) => accessibleName(candidate).toLocaleLowerCase() === name.toLocaleLowerCase(),
  );
}

function dialog(name: string) {
  return Array.from(document.querySelectorAll('[role="dialog"]')).find(
    (candidate) => accessibleName(candidate).toLocaleLowerCase() === name.toLocaleLowerCase(),
  );
}

function tableRow(identity: string) {
  return Array.from(document.querySelectorAll("tbody tr")).find((row) =>
    row.textContent?.includes(identity),
  );
}

describe("TeamEvaluation", () => {
  it("filters people by name or email and reports active and invited counts", async () => {
    await renderTeam();
    const search = document.querySelector<HTMLInputElement>('input[aria-label="Search people"]');
    expect(search).not.toBeNull();
    expect(document.querySelector(".team-evaluation__summary")?.textContent).toContain("3 active");
    expect(document.querySelector(".team-evaluation__summary")?.textContent).toContain("2 invited");

    await enterValue(search!, "sara");
    const table = document.querySelector("table");
    expect(table?.textContent).toContain("Sara Ahmed");
    expect(table?.textContent).not.toContain("Amal Hassan");
    expect(document.querySelector(".team-evaluation__summary")?.textContent).toContain("1 active");
    expect(document.querySelector(".team-evaluation__summary")?.textContent).toContain("0 invited");

    await enterValue(search!, "invitee.two@example.com");
    expect(document.querySelector("table")?.textContent).toContain("invitee.two@example.com");
    expect(document.querySelector(".team-evaluation__summary")?.textContent).toContain("0 active");
    expect(document.querySelector(".team-evaluation__summary")?.textContent).toContain("1 invited");
  });

  it("shows an empty result state and lets the admin clear the query", async () => {
    await renderTeam({ initialQuery: "zoe" });
    const emptyHeading = Array.from(document.querySelectorAll("h1, h2, h3")).find(
      (heading) => heading.textContent === "No people found",
    );
    expect(emptyHeading).not.toBeUndefined();
    const emptyState = emptyHeading?.closest("section");
    await activate(button("Clear search", emptyState ?? document));

    expect(document.querySelector("table")?.textContent).toContain("Amal Hassan");
    expect(document.body.textContent).not.toContain("No people found");
  });

  it("blocks an invalid invitation before making a request", async () => {
    const inviteMember = vi.fn().mockResolvedValue(undefined);
    await renderTeam({ inviteMember });
    await activate(button("Invite member"));
    const email = document.querySelector<HTMLInputElement>('input[type="email"]');
    expect(email).not.toBeNull();
    await enterValue(email!, "not-an-email");
    await activate(button("Send invitation"));

    expect(email?.getAttribute("aria-invalid")).toBe("true");
    expect(inviteMember).not.toHaveBeenCalled();
  });

  it("retains an invitation draft after failure and adds the invitation after retry", async () => {
    const inviteMember = vi
      .fn()
      .mockRejectedValueOnce(new Error("Request failed"))
      .mockResolvedValueOnce(undefined);
    await renderTeam({ inviteMember });
    await activate(button("Invite member"));
    const email = document.querySelector<HTMLInputElement>('input[type="email"]');
    await enterValue(email!, "new.person@example.com");
    await activate(button("Send invitation"));

    expect(document.querySelector('[role="alert"]')).not.toBeNull();
    expect(email?.value).toBe("new.person@example.com");
    await activate(button("Retry invitation"));

    expect(document.querySelector('[role="status"]')?.textContent).toContain("Invitation sent");
    expect(document.querySelector("table")?.textContent).toContain("new.person@example.com");
    expect(document.querySelector(".team-evaluation__summary")?.textContent).toContain("3 invited");
    expect(dialog("Invite a member")).toBeUndefined();
  });

  it("keeps the saved role unchanged when a role update fails", async () => {
    const saveMemberRole = vi.fn().mockRejectedValue(new Error("Request failed"));
    await renderTeam({ saveMemberRole });
    await activate(button("View details for Sara Ahmed"));
    const detail = dialog("Member details: Sara Ahmed");
    const admin = detail?.querySelector<HTMLInputElement>('input[type="radio"][value="Admin"]');
    await activate(admin ?? null);
    await activate(button("Save role", detail));

    expect(detail?.querySelector('[role="alert"]')).not.toBeNull();
    expect(admin?.checked).toBe(true);
    expect(tableRow("Sara Ahmed")?.textContent).toContain("Member");
  });

  it("saves a role and reflects the saved value in the directory", async () => {
    await renderTeam();
    await activate(button("View details for Sara Ahmed"));
    const detail = dialog("Member details: Sara Ahmed");
    await activate(detail?.querySelector('input[type="radio"][value="Admin"]') ?? null);
    await activate(button("Save role", detail));

    expect(detail?.querySelector('[role="status"]')?.textContent).toContain("Role updated");
    expect(tableRow("Sara Ahmed")?.textContent).toContain("Admin");
  });

  it("requires an explicit decision before closing with an unsaved role", async () => {
    await renderTeam();
    const trigger = button("View details for Omar Khalid");
    await activate(trigger ?? null);
    const detail = dialog("Member details: Omar Khalid");
    await activate(detail?.querySelector('input[type="radio"][value="Admin"]') ?? null);
    await activate(button("Close member details", detail));

    let confirmation = dialog("Discard unsaved role change?");
    expect(confirmation).not.toBeUndefined();
    await activate(button("Keep editing", confirmation));
    expect(dialog("Member details: Omar Khalid")).not.toBeUndefined();

    await activate(button("Close member details", detail));
    confirmation = dialog("Discard unsaved role change?");
    await activate(button("Discard changes", confirmation));

    expect(dialog("Member details: Omar Khalid")).toBeUndefined();
    expect(tableRow("Omar Khalid")?.textContent).toContain("Member");
    expect(document.activeElement).toBe(trigger);
  });

  it("mirrors the Arabic shell while keeping email values intrinsically LTR", async () => {
    await renderTeam({ locale: "ar", theme: "dark", viewportMode: "compact" });
    const evaluation = document.querySelector('[data-testid="team-evaluation"]');
    const email = Array.from(document.querySelectorAll("span")).find(
      (element) => element.textContent === "invitee.one@example.com",
    );

    expect(evaluation?.getAttribute("dir")).toBe("rtl");
    expect(evaluation?.getAttribute("lang")).toBe("ar");
    expect(evaluation?.getAttribute("data-theme")).toBe("dark");
    expect(email?.getAttribute("dir")).toBe("ltr");
  });
});
