# Projects Directory Authoring Report

## Result

This evaluation implements a Northstar projects directory with browse, name/key search, count and empty results, create, contextual detail editing, recoverable create/save failures, and confirmed archive. The Storybook matrix covers English/LTR, Arabic/RTL, Light, Dark, expanded, compact, and every required workflow state.

## Approved authority used

- `packages/contracts/ai/authoring-policy.json`
- `packages/contracts/ai/compositions/directory-page.guidance.json`
- `packages/contracts/ai/compositions/create-flow.guidance.json`
- `packages/contracts/ai/compositions/modal-list-detail.guidance.json`
- Public component contracts for Top Navbar, Sidebar, Page Heading, Breadcrumbs, Search Field, Table, Empty State, Button, Dialog, Text Field, Radio Group, Inline Feedback, Side Panel, and Status Badge
- `packages/contracts/patterns/application-shell.contract.json`
- Governed spacing, layout, color, border, radius, typography, icon, and elevation token JSON
- Public package boundaries declared by the React, Patterns, and Tokens package manifests

No denied Storybook source, governed implementation source, full `*.task.json`, repository history, other branch, tag, prototype, or external answer source was read.

## Governed composition choices

- `ApplicationShell` owns the Top Navbar, Sidebar, Page Heading placement, shell landmarks, and expanded/compact behavior.
- `PageHeading` owns the title, description, Breadcrumbs, and the create action.
- `SearchField` owns query entry and clearing; product state owns filtering and the localized live result count.
- `Table` renders non-empty results with the fixed Project / Owner / Status / Details regions. `EmptyState` replaces it for zero results.
- Each Details button has a record-specific accessible name. The row itself never activates. A row is selected only while its associated contextual detail is open.
- `Dialog`, `TextField`, `RadioGroup`, `Button`, and `InlineFeedback` compose create and confirmation flows without invented component props.
- The contextual detail composition supplies modal semantics, background inertness, focus entry/containment/restoration, and Escape handling. The nested governed `SidePanel` stays a named non-modal region, and nested archive `Dialog` takes precedence while open.
- Project keys use `dir="ltr"` and Unicode isolation while the surrounding interface inherits LTR or RTL.
- Light/Dark and English/Arabic are inherited through the evaluation root rather than passed as invented component props.

## Local CSS decisions and raw values

All product CSS is composition-only; component geometry and interaction styling remain governed.

- The directory regions use `--dse-layout-primitive-region-gap`, matching Directory Page guidance.
- Search/count use a flexible logical row at wide sizes and stack below the approved 1200 CSS-pixel shell boundary. The authored `1199px` media-query maximum is the exact lower side of that governed 1199/1200 boundary, not a new directory breakpoint.
- The results wrapper owns horizontal overflow so the governed Table can retain its minimum width.
- Product identity, brand slot content, form stacks, and detail header use governed spacing and typography tokens. These wrappers arrange product content only.
- The contextual detail host starts below `--dse-layout-primitive-top-height`, attaches at logical inline-end, and uses `--dse-layout-primitive-detail-inline-width`. It does not squeeze the directory.
- The host backdrop uses the semantic overlay surface token. No local shadow or raw product color is introduced.
- `100%`, `100dvh`, `0`, `1px`, and `-1px` occur only for fluid fill, viewport fill, edge anchoring, and the standard visually-hidden utility; no fixed product geometry is derived from them.
- The inline SVG navigation artwork uses the governed icon size and stroke-width tokens. Its `24 24` viewBox and path coordinates are asset geometry, not layout dimensions; the symbols are non-directional and are not mirrored in RTL.
- The deterministic `180ms` request delay exists only to make pending/failure/retry outcomes observable in this evaluation. It is not a production timing or request-policy rule.

## Product-owned behavior

- Query, records, selected record, drafts, validation, request phases, retries, success/failure outcomes, and archive state remain inside the product composition.
- Name and key are required. Values survive recoverable create/save failures. The first interactive create/save attempt fails deterministically and a retry succeeds solely so the blind evaluation can exercise every required state.
- Successful create updates the directory; successful save updates the associated row; confirmed archive removes the project and closes detail.

## Unresolved decisions

1. **Narrow contextual detail:** approved Modal List → Detail guidance explicitly governs only wide/available detail presentation. It does not authorize a narrow drawer, full-page route, or alternate navigation model. This implementation supplies no new narrow detail model; the compact story demonstrates the directory with detail closed. Product/design-system guidance is still required before shipping contextual detail on genuinely narrow screens.
2. **Project-key format:** the task calls the key “short” but provides no approved exact length, character set, uniqueness rule, or normalization rule. The implementation enforces required presence and intrinsic LTR direction only; it does not invent a max length or forced uppercase behavior.
3. **Owner assignment on create:** the task does not define how a new project receives an owner. A newly created evaluation record displays an em dash in the Owner region rather than asserting an assignment policy. Production guidance must define that outcome.
4. **Persistence and backend errors:** no API, permission, conflict, or backend error contract is supplied. Request phases are local deterministic evidence states only and do not claim a production persistence model.
