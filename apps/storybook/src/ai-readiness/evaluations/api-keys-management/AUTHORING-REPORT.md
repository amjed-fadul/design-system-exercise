# API Keys Management — Authoring Report

## Authority used

- Followed `packages/contracts/ai/authoring-policy.json` and the approved `directory-page`, `create-flow`, and `modal-list-detail` composition guidance.
- Composed the public `ApplicationShell`, `PageHeading`, `SearchField`, `Table`, `EmptyState`, `Button`, `Dialog`, `TextField`, `RadioGroup`, `InlineFeedback`, `StatusBadge`, `SidePanel`, `TopNavbar`, and `Sidebar` APIs from their approved contracts.
- Used semantic color, typography, spacing, layout, icon, elevation, and detail-width tokens wherever the local composition needed them. Key prefixes use `dir="ltr"`; the surrounding shell inherits English LTR or Arabic RTL.

## Implemented evidence

- The directory starts with the three supplied records. Search matches key names and prefixes, updates the result summary, and switches to the governed Empty State when nothing matches.
- The create dialog validates a required name and one of the two required scopes. A successful local creation updates the directory and announces an evaluation-only outcome.
- Details open from a record-specific Table action in the wide presentation. The selected Table row reflects the open record. Active keys can be revoked only after the governed confirmation dialog; revoked keys no longer offer a revoke action.
- Storybook states cover populated, filtered, no-results, create validation and success, details, revoke confirmation and outcome, Arabic RTL, Dark, and compact directory presentations.

## Unresolved authority decisions

- **Narrow contextual detail:** `modal-list-detail` guidance governs the modal Side Panel only for wide/available detail presentation and marks narrow behavior unresolved. The compact directory remains usable; activating a Details action there displays an explicit unresolved-authority note. No narrow drawer, full-page detail, or alternate navigation model is supplied.
- **Production key allocation:** No production key-generation or prefix-allocation rule is supplied. The evaluation does not create or store a secret. A newly created local row shows `Not allocated` with an `Evaluation only` label; it is in-memory evidence, not a production credential.
- **Seeded creation dates:** The supplied fixtures contain creator names but no dates. Their details show “Not supplied in evaluation data” instead of invented dates. A key created during the local interaction records the actual evaluation-time date and uses the generic actor label “You”; no account identity is supplied.
- **Routing:** No production route is supplied. The Sidebar link targets the evaluation page anchor only.
- **Navigation icon asset:** The Sidebar contract requires a compatible icon, while the allowed context provides icon dimensions and strokes but no governed glyph asset. The evaluation uses a small current-color key outline and does not treat its shape as a canonical product icon.

## Local CSS decisions

- Page regions use the approved layout region-gap token. The wide control row uses the semantic gap token, and the compact row stacks below the Application Shell threshold. The Table wrapper owns horizontal overflow as required by directory guidance.
- The Side Panel host begins below the tokenized Top Navbar height, fills the remaining block size, uses the approved overlay elevation and surface tokens, and aligns the Side Panel at logical inline-end at the approved detail width. The Side Panel fills the host as modal-list-detail guidance requires.
- The metadata definition list uses a local grid composition with governed spacing and foreground tokens. The key name/prefix stack and evaluation labels are product-owned directory content.
- `@container (width < 1200px)` uses the exact approved expanded-shell breakpoint so the evidence-frame and the live viewport both demonstrate the stacked compact directory. The corresponding runtime viewport check reads `--dse-layout-primitive-breakpoint-expanded-shell`, with the same approved 1200px value as its fallback.
- The compact and wide Storybook frames use the approved 960px and 1440px viewport tokens as evidence-frame limits; those values do not define product page widths.
- The visually hidden record name uses the conventional 1px box, -1px margin, and zero clipping rectangle to preserve record-specific Button names. Zero minimum sizes let grid and flex content shrink before the Table wrapper scrolls. These values are local accessibility/overflow mechanics, not product spacing decisions.
- Theme and direction are placed on the Storybook document root while this story is mounted so portaled Dialogs inherit them, then the previous document attributes are restored on unmount. The visible evaluation root also carries the selected theme and direction.
- No raw product colors or custom component states were introduced.
