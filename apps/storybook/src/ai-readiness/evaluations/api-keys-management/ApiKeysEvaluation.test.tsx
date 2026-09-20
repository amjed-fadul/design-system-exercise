import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentType } from "react";
import { afterEach, expect, it } from "vitest";

type EvaluationProps = {
  language?: "en" | "ar";
  theme?: "light" | "dark";
  viewportMode?: "auto" | "expanded" | "compact";
};

const evaluationModules = import.meta.glob("./ApiKeysEvaluation.tsx");

async function loadEvaluation() {
  const load = evaluationModules["./ApiKeysEvaluation.tsx"];
  expect(load, "the API keys evaluation component should be available").toBeDefined();

  const module = (await load!()) as {
    ApiKeysEvaluation?: ComponentType<EvaluationProps>;
  };
  expect(module.ApiKeysEvaluation, "the API keys evaluation component should be exported").toBeDefined();
  return module.ApiKeysEvaluation!;
}

afterEach(() => cleanup());

it("filters keys by name or prefix", async () => {
  const user = userEvent.setup();
  const ApiKeysEvaluation = await loadEvaluation();
  render(<ApiKeysEvaluation language="en" theme="light" viewportMode="expanded" />);

  expect(screen.getByText("Production deploy")).toBeTruthy();
  expect(screen.getByText("Analytics reader")).toBeTruthy();
  expect(screen.getByText("Legacy integration")).toBeTruthy();

  const search = screen.getByRole("searchbox", { name: "Search API keys" });
  await user.type(search, "nsk_analytics_4F9");

  expect(screen.getByText("Analytics reader")).toBeTruthy();
  expect(screen.queryByText("Production deploy")).toBeNull();
  expect(screen.queryByText("Legacy integration")).toBeNull();
});

it("replaces the table with an empty state when a search has no matches", async () => {
  const user = userEvent.setup();
  const ApiKeysEvaluation = await loadEvaluation();
  render(<ApiKeysEvaluation language="en" theme="light" viewportMode="expanded" />);

  const search = screen.getByRole("searchbox", { name: "Search API keys" });

  await user.type(search, "no-such-key");

  expect(screen.getByRole("heading", { name: "No API keys found" })).toBeTruthy();
  expect(screen.queryByRole("table")).toBeNull();
});

it("shows required-name and access-scope validation before creating a key", async () => {
  const user = userEvent.setup();
  const ApiKeysEvaluation = await loadEvaluation();
  render(<ApiKeysEvaluation language="en" theme="light" viewportMode="expanded" />);

  await user.click(screen.getByRole("button", { name: "Create API key" }));
  expect(screen.getByRole("dialog", { name: "Create API key" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Create key" }));

  expect(screen.getByText("Enter a name for this API key.")).toBeTruthy();
  expect(
    screen.getByText("No API key was created. Enter a name and choose an access scope before trying again."),
  ).toBeTruthy();
});

it("creates an active key with the selected scope without generating a secret token", async () => {
  const user = userEvent.setup();
  const ApiKeysEvaluation = await loadEvaluation();
  render(<ApiKeysEvaluation language="en" theme="light" viewportMode="expanded" />);

  await user.click(screen.getByRole("button", { name: "Create API key" }));
  await user.type(screen.getByRole("textbox", { name: "Key name" }), "CI pipeline");
  await user.click(screen.getByRole("radio", { name: "Read only" }));
  await user.click(screen.getByRole("button", { name: "Create key" }));

  expect(
    screen.getByRole("row", {
      name: /CI pipeline.*Not generated in this evaluation.*Read only.*Active/,
    }),
  ).toBeTruthy();
  expect(
    screen.getByText("API key created in this evaluation. No secret token was generated or displayed."),
  ).toBeTruthy();
  expect(screen.queryByRole("dialog", { name: "Create API key" })).toBeNull();
});

it("renders Arabic in RTL with dark tokens and compact navigation while isolating key prefixes as LTR", async () => {
  const ApiKeysEvaluation = await loadEvaluation();
  render(<ApiKeysEvaluation language="ar" theme="dark" viewportMode="compact" />);

  const evaluation = document.querySelector(".api-keys-evaluation");
  expect(evaluation?.getAttribute("lang")).toBe("ar");
  expect(evaluation?.getAttribute("dir")).toBe("rtl");
  expect(evaluation?.getAttribute("data-theme")).toBe("dark");
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  expect(document.documentElement.getAttribute("data-language")).toBe("arabic");
  expect(document.documentElement.style.colorScheme).toBe("dark");
  expect(document.documentElement.lang).toBe("ar");
  expect(document.documentElement.dir).toBe("rtl");
  expect(screen.getByRole("navigation", { name: "مساحة العمل" }).getAttribute("data-mode")).toBe(
    "compact",
  );
  expect(screen.getByText("nsk_prod_7H2").getAttribute("dir")).toBe("ltr");
});

it("opens the selected key's detail panel with its metadata", async () => {
  const user = userEvent.setup();
  const ApiKeysEvaluation = await loadEvaluation();
  render(<ApiKeysEvaluation language="en" theme="light" viewportMode="expanded" />);

  const detailTrigger = screen.getByRole("button", { name: "View details for Analytics reader" });
  await user.click(detailTrigger);

  const details = screen.getByRole("dialog", { name: "Analytics reader details" });
  expect(details).toBeTruthy();
  expect(details.getAttribute("aria-modal")).toBe("true");
  const prefixes = within(details).getAllByText("nsk_analytics_4F9");
  expect(prefixes).toHaveLength(2);
  expect(prefixes.every((prefix) => prefix.getAttribute("dir") === "ltr")).toBe(true);
  expect(within(details).getByText("Sara Ahmed")).toBeTruthy();
  expect(within(details).getByText("Not supplied in this evaluation")).toBeTruthy();
  expect(
    screen.getByRole("row", {
      name: /Analytics reader.*Read only.*Active/,
      hidden: true,
    }),
  ).toBeTruthy();

  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog", { name: "Analytics reader details" })).toBeNull();
  expect(document.activeElement).toBe(detailTrigger);
});

it("returns focus to search if the selected key disappears from the filtered results", async () => {
  const user = userEvent.setup();
  const ApiKeysEvaluation = await loadEvaluation();
  render(<ApiKeysEvaluation language="en" theme="light" viewportMode="expanded" />);

  const search = screen.getByRole("searchbox", { name: "Search API keys" });
  await user.click(screen.getByRole("button", { name: "View details for Analytics reader" }));
  fireEvent.change(search, { target: { value: "no-such-key" } });

  expect(screen.queryByRole("dialog", { name: "Analytics reader details" })).toBeNull();
  expect(screen.getByRole("heading", { name: "No API keys found" })).toBeTruthy();
  expect(document.activeElement).toBe(search);
});

it("revokes an active key only after the confirmation action", async () => {
  const user = userEvent.setup();
  const ApiKeysEvaluation = await loadEvaluation();
  render(<ApiKeysEvaluation language="en" theme="light" viewportMode="expanded" />);

  await user.click(screen.getByRole("button", { name: "View details for Production deploy" }));
  await user.click(screen.getByRole("button", { name: "Revoke API key" }));

  expect(screen.getByRole("dialog", { name: "Revoke API key?" })).toBeTruthy();
  expect(
    screen.getByRole("row", { name: /Production deploy.*Active/, hidden: true }),
  ).toBeTruthy();

  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog", { name: "Revoke API key?" })).toBeNull();
  expect(screen.getByRole("dialog", { name: "Production deploy details" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Revoke API key" }));

  await user.click(screen.getByRole("button", { name: "Confirm revoke" }));

  expect(
    screen.getByRole("row", { name: /Production deploy.*Revoked/, hidden: true }),
  ).toBeTruthy();
  expect(screen.getByRole("dialog", { name: "Production deploy details" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Revoke API key" })).toBeNull();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close key details" }));
});

it("keeps narrow key-detail behavior unresolved instead of opening an alternate surface", async () => {
  const user = userEvent.setup();
  const ApiKeysEvaluation = await loadEvaluation();
  render(<ApiKeysEvaluation language="en" theme="light" viewportMode="compact" />);

  await user.click(screen.getByRole("button", { name: "View details for Production deploy" }));

  expect(
    screen.getByText(
      "Narrow-screen key details are unresolved. This evaluation does not introduce a drawer or alternate navigation model.",
    ),
  ).toBeTruthy();
  expect(screen.queryByRole("dialog", { name: "Production deploy details" })).toBeNull();
});
