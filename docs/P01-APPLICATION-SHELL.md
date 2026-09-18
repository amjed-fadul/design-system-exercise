# P01 — Application Shell

Status: implementation complete; final record pending exact-HEAD CI at the time this file is authored.

## Authority

- Pattern: **Application Shell**
- Pattern contract: `dse.pattern.application-shell@1.0.0`
- Figma guide: `68:494`
- Live anatomy specimen: `606:2496`
- AI knowledge guidance: `patterns-and-product.md` / frame `3024:9813`
- Base milestone: C17 Table final record `9b3ec6e09ab08516f3732f75b722f9dd349e5e56`

A fresh read-only Figma audit was completed before code changes, and the live authority was re-read during final review.

## Governed boundary

Application Shell owns only stable application-frame composition and responsive placement:

- governed Top Navbar placement
- governed Sidebar responsive mode selection
- optional Page Heading placement
- one scrollable main content region
- expanded/compact shell resolution

Product/workflow authority stays outside the pattern. P01 does not own query, selection, drafts, request lifecycle, member records, permissions, routing policy, modal/detail workflow, backend operations, or authoritative outcomes.

### Responsive contract

- `auto`: expanded at **>= 1200 CSS px**
- `auto`: compact below **1200 CSS px**
- expanded Sidebar: **208px**
- compact Sidebar: **64px**
- Top Navbar: **64px**
- page inset: **32px**
- reviewed desktop evidence: **960–1440px**
- explicit boundary evidence: **1199 / 1200px**
- additional robustness evidence: **320 CSS px / zoom**
- short windows scroll the **main** region

The runtime consumes the existing layout token authority rather than introducing a second breakpoint or shell-width source.

## Public API

```ts
export interface ApplicationShellProps {
  sidebar: React.ReactElement<SidebarProps, typeof Sidebar>;
  topNavbar: React.ReactElement<TopNavbarProps, typeof TopNavbar>;
  pageHeading?: React.ReactElement<PageHeadingProps, typeof PageHeading>;
  children: React.ReactNode;
  viewportMode?: 'auto' | 'expanded' | 'compact';
}
```

The original planning sketch used a generic `ReactNode` Sidebar boundary. The fresh audit caught that this conflicts with the already-approved Sidebar contract, which explicitly assigns responsive Sidebar mode selection to Application Shell. P01 therefore requires the actual governed Sidebar element and clones only its `mode` prop. Final self-review tightened the other shell regions as well: Top Navbar and optional Page Heading must also be their governed component elements, with runtime rejection of substitutes.

`expanded` and `compact` are deterministic Storybook/test overrides. They are not new product states.

## Runtime and semantics

- `ApplicationShell` composes existing public React components rather than reimplementing primitives.
- The supplied Top Navbar retains its native `header` landmark.
- The supplied Sidebar retains its named native `nav` landmark.
- The shell contributes one native `main` landmark.
- Page Heading is optional and remains consumer supplied.
- Logical flow and logical CSS properties support RTL without a direction prop.
- Main content is the short-window scroll owner.
- `useSyncExternalStore` + `matchMedia('(min-width: 1200px)')` resolves auto mode without unsafe browser-global access during SSR.
- Crossing the breakpoint changes Sidebar presentation without remounting the consumer page subtree; a state-retention runtime test proves this.

## Package activation

P01 activates `@design-system-exercise/patterns` as the first real public patterns package.

Package evidence includes:

- ESM public export for `ApplicationShell`
- public TypeScript declarations
- packaged `styles.css`
- React 18.3+ / React DOM peer compatibility
- workspace dependencies on the approved React and token packages
- package-local prepack verification
- clean tarball inspection
- installed scratch-consumer SSR rendering of Application Shell
- installed public CSS export verification

The repository CI was deliberately extended during final review so a broken Patterns tarball cannot pass merely because Tokens and React still pack correctly.

## Storybook evidence

P01 Storybook covers:

- `Wide1440`
- `Narrow960`
- `Boundary1199`
- `Boundary1200`
- `ShortWindow`
- `Zoom320`
- `Dark`
- `Arabic`
- `DarkArabic`

The evidence composes the existing Top Navbar, Sidebar, Page Heading, Breadcrumbs, Search Field, Table, Avatar, Status Badge, and Button implementations. Product copy/data in the fixture remains demo content, not pattern API.

## Verification

Implementation/package HEAD:

`f0270695c682efce6a9d5d97dc470a92cc51798b`

GitHub Actions:

- **run 408 — PASS on that exact implementation/package HEAD**

Final run 408 evidence:

- contract repository validation: **23 component contracts + 1 pattern contract**
- Contracts tests: **89/89**
- Tokens tests: **17/17**
- React tests: **210/210**
- Patterns tests: **10/10**
- Storybook tests: **58/58**
- **384 automated tests passing**
- TypeScript typecheck: **PASS**
- Storybook production build: **PASS**
- Tokens package pack/install verification: **PASS**
- React package pack/install verification: **PASS**
- Patterns package pack/install verification: **PASS**
- installed Application Shell SSR + stylesheet proof: **PASS**

## TDD and review corrections

The milestone used real failing gates rather than only a final green run.

Notable corrections before closure:

1. **Contract/API audit correction** — generic Sidebar `ReactNode` was too weak for the approved ownership boundary; P01 now controls only the governed Sidebar `mode`.
2. **Contract assertion correction** — initial RED/GREEN test wording was stricter than the semantically equivalent contract prose; the test was corrected without changing the product boundary.
3. **Runtime test isolation** — one test left rendered DOM available to a later case, producing duplicate stateful controls; explicit cleanup was added.
4. **Storybook API parity** — the Application Shell fixture initially omitted Search Field's required `clearButtonLabel`; typecheck caught it and the fixture was corrected.
5. **Package gate** — fresh final review found that CI activated the Patterns package without actually packing/installing it. CI now packs Tokens, React, and Patterns and verifies the installed Application Shell.
6. **Governed composition boundary** — the first green implementation typed Sidebar props but could still accept substitute React element types, while Top Navbar/Page Heading were generic React nodes. Final re-review tightened TypeScript and runtime checks so only the actual governed Sidebar, Top Navbar, and optional Page Heading components satisfy those shell regions.
7. **Pattern dependency versions** — repository validation resolved dependency IDs but ignored each pattern contract's declared `minimumVersion`. The final hardening adds numeric semantic-version comparison and rejects an installed public component contract below the declared minimum.
8. **Pattern package regression gate** — a source-level package test now locks the public entry/style exports, runtime package dependencies, absence of a production contracts dependency, and the Application Shell prepack verifier.

## Figma knowledge synchronization

After run 406 passed and the fresh final review found no remaining Critical/Important issues:

- `patterns-and-product.md` was updated to identify `dse.pattern.application-shell@1.0.0` as the first validated pattern contract.
- P02–P05 remain guidance-only until their own contracts validate.
- P01 implementation evidence records HEAD `f0270695c682efce6a9d5d97dc470a92cc51798b` and CI run 408.
- The synchronized evidence also records the exact governed component composition hardening, minimum component-contract version enforcement, and the **384-test** verification total.
- Independent read-back confirmed the contract marker, implementation HEAD, run 408 marker, 384-test marker, and minimum-version marker persisted in Figma node `3024:9815`.

## Final self-review

**APPROVED — no unresolved Critical or Important findings.**

The final review compared the complete C17 → P01 diff against the current live Figma Application Shell authority and token/layout facts again. Review corrections closed the missing installed-package CI proof, overly permissive shell component composition, and missing `minimumVersion` enforcement for pattern dependencies. Run 408 then passed the complete repository/package gate on the hardened implementation. A duplicate test-cleanup hook was also removed as a minor test-quality cleanup.

Scope remains P01-only. No P02 workflow implementation has started.

## Pull request

- PR **#20 — P01 Application Shell**
- remains **Draft**
- remains **open**
- remains **unmerged**

## Next milestone

After this completion-record commit itself passes CI on its exact HEAD, the next planned milestone is **P02 — Form Submit and Recover**. Do not start P02 without explicit user direction.
