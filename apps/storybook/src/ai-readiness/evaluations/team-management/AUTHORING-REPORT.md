# Team Management Authoring Report

## Outcome

This implementation provides a Northstar workspace-admin directory for three active members and two pending invitations. It supports name/email search, live active/invited counts, an empty result state, a one-person invitation flow, joined-member detail, saved-versus-draft role editing, recoverable request failures, success feedback, and an explicit unsaved-change decision.

The supplied English names and invitation email addresses are preserved. Joined-member email addresses were not supplied, so none were invented. Invitation email values and the email input use intrinsic LTR direction inside Arabic RTL presentation.

## Approved authorities used

- `dse.pattern.application-shell` owns the persistent Top Navbar, Sidebar placement, main landmark, and expanded/compact shell modes.
- `dse.composition.directory-page` owns the Page Heading → controls → results structure, compact control stacking, logical placement, and results overflow responsibility.
- `dse.composition.create-flow` owns the Button → Dialog → form/feedback/actions invitation composition.
- `dse.composition.modal-list-detail` owns the Table action → modal host → Side Panel detail composition and nested consequential Dialog precedence.
- Governed public components used: `TopNavbar`, `Sidebar`, `PageHeading`, `Breadcrumbs`, `Button`, `Avatar`, `SearchField`, `Table`, `StatusBadge`, `EmptyState`, `Dialog`, `TextField`, `RadioGroup`, `InlineFeedback`, and `SidePanel`.
- Governed semantic/primitive token variables own all authored colors, typography, icon size/stroke, spacing, panel width, top offset, elevation plane, and region gap.

No governed component, pattern, contract, token, or canonical guidance was changed.

## Product-owned behavior

- Search is case-insensitive across the supplied name/email fields. Counts and the Table/Empty State switch derive from the actual filtered records.
- Invitation state owns draft email/role, product validation, pending, retry, error, and success. A rejected request preserves the draft; a successful retry closes Dialog, adds a pending row, updates counts, and announces success.
- Detail state keeps the saved role separate from the draft. A failed save preserves the draft and leaves the directory unchanged; a successful save updates the directory and announces success.
- Detail opens only from a record-specific Button in the Table action region. The row remains non-activating and is selected only while associated detail is open.
- The composition-owned detail host supplies `role=dialog`, modality, background `inert`/`aria-hidden`, focus entry/containment/restoration, Escape close requests, and logical-inline-end placement. Side Panel remains a named non-modal region.
- A dirty close request opens governed Dialog. “Keep editing” returns to the draft; “Discard changes” closes detail without updating the saved record.
- Theme/language/direction are established on the document root while this full-screen evaluation is mounted so governed portal Dialogs inherit Light/Dark and LTR/RTL context; prior document attributes are restored on unmount.

## Local CSS decisions and authority

| Local CSS responsibility | Decision and authority |
| --- | --- |
| Evaluation host | Fill the preview block size, establish the semantic canvas/foreground/body typography, and normalize descendant `box-sizing`. This frames the full-screen product evidence; governed components retain their own surfaces and typography. |
| Product identity slots | Brand, account, row identity, detail identity, and action children use small flex compositions because slot content/order is product-owned. Gaps, colors, typography, and icon geometry use governed tokens. Only the Latin `Northstar` word is bidi-isolated; the Brand composition continues to follow surrounding logical direction. |
| Directory regions | The directory uses the governed layout region gap. Controls use logical space-between in expanded presentation and stack in compact presentation, exactly as Directory Page guidance requires. Search flexes into available space; no unsupported fixed search width was introduced. |
| Results | The local results wrapper owns inline overflow so governed Table is never compressed below its own minimum width. Empty results switch to governed Empty State rather than fake rows. |
| Mixed-direction data | Invitation emails use `dir=ltr`, `unicode-bidi:isolate`, logical `text-align:start`, and wrapping. The surrounding shell, Table, and controls remain inherited LTR/RTL. |
| Workflow slots | Form/detail bodies use a tokenized vertical section gap. Authored action groups use logical-end flex alignment and the governed 12px spacing token; Dialog and Side Panel continue to own their surfaces and structural regions. |
| Contextual detail host | The host is fixed below the governed Top Navbar height, covers the remaining logical viewport, uses the semantic overlay surface and governed overlay plane, and attaches Side Panel at logical inline-end. Side Panel width uses `layout.primitive.detail.inline-width` and fills the host block size so its body/actions retain governed scrolling/anchoring. No local shadow or alternate radius was added. |
| Compact transition | Explicit compact evidence stacks controls. Auto mode uses `max-width: 1199px`, the compact side of the approved 1200 CSS-pixel Application Shell boundary; this is not a new breakpoint. |

## Remaining raw dimensions

- `100vh` is used only to make the evaluation host and shell fill the preview viewport; it is a viewport-relative host mechanic, not a fixed product frame copied from Storybook.
- `100%` makes Side Panel fill the approved modal host. This directly implements `layout.panel-fills-host`.
- `0` values reset default margins, permit flex/grid children to shrink, attach the overlay to its logical edges, and remove the component minimum block constraint only when Side Panel is given a definite host size. They do not introduce visual spacing.
- `1199px` is the last compact pixel below the explicitly governed `1200px` expanded-shell boundary. CSS media-query syntax cannot consume the design token variable.
- Inline SVGs use a `0 0 20 20` coordinate view box to match the governed medium-icon contract. Their rendered size and stroke width use `--dse-icons-size-md` and `--dse-icons-stroke-default`; path coordinates are local product artwork rather than layout dimensions.

There are no authored raw product colors, fixed search widths, custom component radii, local shadows, or ungoverned spacing values.

## Accessibility and direction review

- Native table headers/cells and genuine descendant controls preserve the governed Table model.
- Every repeated detail action has a record-specific accessible name.
- Search has localized input and clear-action names; Empty State does not move focus.
- Dialog and form labels are localized. Error and success outcomes use governed alert/status semantics.
- Detail focus is contained, nested Dialog takes Escape/focus precedence, and closing detail restores focus to the originating record action when present.
- Arabic presentation mirrors the shell, controls, panel attachment, and action alignment. Search/close/status icons are not directionally mirrored. Email values alone remain LTR.

## Explicitly unresolved

Approved Modal List → Detail guidance governs the modal Side Panel only for wide/available-detail presentation and explicitly leaves narrow contextual-detail behavior unresolved. This implementation therefore does not invent a narrow drawer, full-page detail route, or alternate navigation model. `CompactDirectory` demonstrates only the approved compact directory state with detail closed. Future product evidence or composition guidance is required before narrow detail can be authored.

## Story evidence

The story title is `AI Readiness/Evaluations/Team Management`. Stories cover:

- English Light expanded shell and Arabic Dark RTL expanded shell;
- compact directory, filtered directory, and no-results recovery;
- invite validation, recoverable failure, retry, and success;
- joined-member detail, role-save failure, and role-save success;
- consequential unsaved-change confirmation.

## Verification

- Focused Vitest interaction suite: 8 tests passed.
- Storybook TypeScript check: passed with no diagnostics.
- Storybook production build: passed. The existing global Storybook bundle reports its standard chunk-size advisory; it does not fail the build and is outside this task's write scope.
- Browser verification: populated, filtered, empty, compact, English Light, Arabic Dark, invitation failure/retry/success, role failure/success, and unsaved guard all rendered and behaved as expected. Clean post-fix runs had no browser console errors or warnings.
- The workspace does not expose a root `check` command, so the explicit focused test, app typecheck, production build, and browser checks above are the verification set used for this run.
