# Structure Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Execute C13-C17 one milestone at a time and update the master progress tracker before proceeding.

**Goal:** Implement Sidebar, Top Navbar, Breadcrumbs, Page Heading, and Table with private structural helpers, validated contracts, accessible runtime semantics, Storybook coverage, and Figma parity.

**Architecture:** Structure components expose composition and layout boundaries without absorbing product routing/data logic. Internal underscore components are implementation units only. Public APIs prefer semantic data/composition models over exporting internal Figma helper components.

**Tech Stack:** React, TypeScript, plain CSS custom properties, Vitest, Testing Library, Storybook, Ajv contract validation.

**Spec:** `docs/superpowers/plans/2026-09-17-design-system-master-roadmap.md` and `docs/superpowers/specs/2026-09-17-component-contracts-design.md`.

## Global Constraints

- Sources: `_Navigation Item` `143:2948`, Sidebar `146:166`, Top Navbar `228:18954`, `_Breadcrumb Link Item` `139:16`, Breadcrumbs `139:20`, Page Heading `142:2488`, `_Table Header` `152:3685`, `_Table Row` `152:3729`, Table `152:3730`.
- Internal helpers must remain unreachable through public React exports.
- Navigation components own semantics/layout, not application route authorization.
- Table is a bounded four-region table, not a generic data-grid platform.
- Responsive shell behavior belongs to P01 Application Shell, not Sidebar alone.

---

## C13 — `_Navigation Item` + Sidebar

**Live Figma facts:**
- `_Navigation Item`: label/icon, `mode=expanded|compact`, `current=false|true`, `state=default|hover|focus|pressed`.
- Sidebar: label, Navigation slot, Footer slot, `mode=expanded|compact`.

**Files:**
- `packages/contracts/components/_navigation-item.contract.json`
- `packages/contracts/components/sidebar.contract.json`
- `packages/contracts/tests/sidebar.contract.test.ts`
- `packages/react/src/internal/navigation-item/NavigationItem.tsx`
- `packages/react/src/sidebar/Sidebar.tsx`
- `packages/react/src/sidebar/Sidebar.css`
- `packages/react/src/sidebar/Sidebar.test.tsx`
- `apps/storybook/src/components/Sidebar.stories.tsx`
- public React barrel modification

**Public data boundary:**

```ts
export interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  current?: boolean;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  label: React.ReactNode;
  mode?: 'expanded' | 'compact';
  items: readonly SidebarItem[];
  footer?: React.ReactNode;
}
```

`mode` is a legal low-level layout input because the Figma source exposes it; P01 Application Shell decides the responsive threshold. Internal NavigationItem renders native links, `aria-current="page"` for current destination, icon-only compact labels via accessible names/tooltips only if the contract approves the implementation.

**Acceptance:**
- contract RED/GREEN including private helper visibility;
- runtime tests for nav landmark label, current link semantics, href forwarding, compact accessible names, no public visual state prop;
- Storybook expanded/compact/current/Arabic RTL;
- verify internal helper absent from exports;
- full verification + fresh review; commit `feat(react): add Sidebar`.

---

## C14 — Top Navbar

**Live Figma facts:** contextLabel, showContext, Brand slot, Account slot, `order=forward` only.

**Files:** contract/test + `TopNavbar.tsx/css/test`, Storybook, public barrel.

**Public API:**

```ts
export interface TopNavbarProps extends React.HTMLAttributes<HTMLElement> {
  contextLabel?: React.ReactNode;
  brand: React.ReactNode;
  account: React.ReactNode;
}
```

No public `order` prop is needed while the only legal Figma value is `forward`; the contract records it as fixed representation. Do not invent notification/search/page-action regions. Navbar is global/workspace identity, not page-specific action ownership.

**Acceptance:** semantic header/navigation tests, brand/account slot order, optional context, RTL logical layout, Storybook account example using Avatar, full verification; commit `feat(react): add Top Navbar`.

---

## C15 — `_Breadcrumb Link Item` + Breadcrumbs

**Live Figma facts:** Breadcrumbs has Ancestors slot + currentLabel; internal breadcrumb item has no exposed Figma properties.

**Files:**
- internal/public contracts and tests
- `packages/react/src/internal/breadcrumb-link-item/BreadcrumbLinkItem.tsx`
- `packages/react/src/breadcrumbs/Breadcrumbs.tsx`
- `Breadcrumbs.css`, tests, Storybook
- public barrel modification

**Public data boundary:**

```ts
export interface BreadcrumbItem {
  href: string;
  label: React.ReactNode;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  ancestors?: readonly BreadcrumbItem[];
  currentLabel: React.ReactNode;
  ariaLabel?: string;
}
```

Render `<nav aria-label="Breadcrumb">` + ordered list. Ancestors are links; current item uses `aria-current="page"` and is not a link. Separator is decorative and mirrors logically without altering label order.

**Acceptance:** contract + runtime tests for no-ancestor/single/multiple/current semantics, RTL separator behavior, Link-compatible hrefs; Storybook; internal export check; verification; commit `feat(react): add Breadcrumbs`.

---

## C16 — Page Heading

**Live Figma facts:** title, description/showDescription, Breadcrumbs slot, Actions slot.

**Files:** contract/test + `PageHeading.tsx/css/test`, Storybook, public barrel.

**Public API:**

```ts
export interface PageHeadingProps extends React.HTMLAttributes<HTMLElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  headingLevel?: 1 | 2;
}
```

Default `headingLevel=1`. Contract restricts breadcrumbs to Breadcrumbs-compatible content in governed examples and actions to command/navigation components; runtime stays ReactNode-composable. Component owns page-purpose hierarchy only, not workspace identity.

**Acceptance:** heading semantics, optional regions, action wrap/RTL, long title/description, Storybook all context combinations, verification; commit `feat(react): add Page Heading`.

---

## C17 — `_Table Header` + `_Table Row` + Table

**Live Figma facts:**
- Header: four labels `primary/secondary/status/action`.
- Row: Primary/Secondary/Status/Action slots; `state=default|hover|selected`.
- Table: footerText, Header slot, Rows slot.

**Files:**
- `packages/contracts/components/_table-header.contract.json`
- `packages/contracts/components/_table-row.contract.json`
- `packages/contracts/components/table.contract.json`
- `packages/contracts/tests/table.contract.test.ts`
- `packages/react/src/internal/table-header/TableHeader.tsx`
- `packages/react/src/internal/table-row/TableRow.tsx`
- `packages/react/src/table/Table.tsx`
- `Table.css`, `Table.test.tsx`, Storybook
- public barrel modification

**Public data boundary:**

```ts
export interface TableColumns {
  primary: React.ReactNode;
  secondary: React.ReactNode;
  status: React.ReactNode;
  action: React.ReactNode;
}

export interface TableRowData {
  id: string;
  primary: React.ReactNode;
  secondary: React.ReactNode;
  status: React.ReactNode;
  action: React.ReactNode;
  selected?: boolean;
}

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  columns: TableColumns;
  rows: readonly TableRowData[];
  footerText?: React.ReactNode;
}
```

The contract must explicitly decide whether `selected` is legal public semantic state. This plan chooses **yes** because the live Figma row exposes selected independently of pointer hover; selected is represented via `aria-selected` only if the rendered semantic row context supports it. Hover remains CSS-derived. No sorting/pagination/bulk selection/query APIs.

Render real semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`. The action column label may be visually hidden when appropriate but remains structurally defined. Responsive overflow belongs to the table wrapper; columns do not collapse into invented cards in v1.

**Acceptance tests:**
- exactly four governed columns;
- stable row IDs/keys;
- semantic headers associated by native table structure;
- selected style/ARIA decision matches contract;
- hover not exposed as prop;
- arbitrary product content may use Avatar/StatusBadge/Link/Button nodes without Table interpreting them;
- footer optional;
- no sorting/pagination APIs/types;
- horizontal overflow wrapper remains keyboard/zoom usable.

Storybook: full team table, selected row, long/Arabic content, narrow overflow, empty rows only when paired with pattern-level Empty State story—not an invented Table empty state.

Full verification + fresh review; commit `feat(react): add Table`.

---

## Structure wave completion gate

Before P01 Application Shell begins:

```bash
pnpm contracts:validate
pnpm tokens:validate
pnpm tokens:build
pnpm test
pnpm typecheck
pnpm build-storybook
```

Packed consumer imports Sidebar, TopNavbar, Breadcrumbs, PageHeading, and Table. It must fail to import `_NavigationItem`, `_BreadcrumbLinkItem`, `_TableHeader`, or `_TableRow` through supported package exports.