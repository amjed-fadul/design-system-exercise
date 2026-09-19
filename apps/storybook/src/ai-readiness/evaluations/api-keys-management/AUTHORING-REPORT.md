# API Keys Management — Authoring Report

## Authority used

- `TASK-PAYLOAD.json` supplied the product goals, records, states, modes, write root, and story title.
- `packages/contracts/ai/authoring-policy.json` supplied the authoring policy and authority order.
- Approved directory-page, create-flow, and modal-list-detail composition guidance supplied the page structure, modal workflow, contextual-detail behavior, breakpoint, logical-direction, and accessibility rules.
- Approved public contracts supplied Application Shell, Top Navbar, Sidebar, Page Heading, Breadcrumbs, Search Field, Table, Status Badge, Empty State, Dialog, Text Field, Radio Group, Inline Feedback, Side Panel, Button, and Avatar responsibilities and APIs.
- Governed token JSON supplied every product-UI color, spacing, layout, radius, border, elevation-plane, icon-size/stroke, and typography value used by local CSS.

No denied Storybook source, governed implementation source, history, diff, branch, tag, external answer, or full `*.task.json` file was read.

## Implemented states and behavior

- The directory renders all three supplied API-key fixtures with name/prefix identity, scope, status, and a record-specific details action.
- Search matches names and intrinsically LTR key prefixes, updates the result summary, and switches to the governed Empty State when no results remain.
- The create Dialog validates the required display name, captures exactly one governed Radio Group scope, closes on success, adds the new record, clears the active query, and announces the outcome with Inline Feedback. It never reveals or stores a secret token value.
- The contextual modal host overlays rather than squeezes the directory, preserves selected-row association, makes the background inert/hidden, moves and contains focus, supports Escape, restores trigger focus, and composes the non-modal governed Side Panel.
- Active keys alone expose the critical revoke action. A nested governed Dialog confirms the consequence, after which the record and detail status become Revoked and an outcome is announced.
- English/LTR, Arabic/RTL, Light, Dark, expanded, compact, filtered, no-results, create, and detail evidence stories are included.

## Local CSS decisions and authority

- Directory controls, region gaps, compact stacking at the governed 1200px shell boundary, and horizontal result overflow implement approved Directory Page guidance. Search is flexible rather than assigned an unevidenced fixed width.
- Modal-host placement begins below `--dse-layout-primitive-top-height`, attaches to logical inline-end, uses the governed overlay surface, elevation plane, and `--dse-layout-primitive-detail-inline-width`, and lets Side Panel fill the available block size. These are the local responsibilities authorized by Modal List → Detail guidance.
- Product-owned Top Navbar slot content, Sidebar icon wrappers, key identity stacks, detail definition-list content, and Dialog form/body stacks use only governed spacing, icon, foreground, and typography tokens. The small inline SVGs are product-supplied Sidebar slot content; their rendered size and stroke use governed icon tokens, while view-box coordinates are vector geometry rather than CSS layout dimensions.
- `100%` and `100vh` are container/viewport-relative extents, not raw product dimensions. `0` is used only for resets and logical inset edges. The only numeric media boundary is `1199px`, the exact below-threshold complement of the governed 1200px expanded-shell breakpoint.
- No local raw colors, shadows, border radii, font sizes, spacing lengths, panel widths, or component lookalikes were authored.

## Unresolved decisions

- Approved Modal List → Detail guidance explicitly leaves narrow-screen contextual-detail navigation unresolved. This implementation supplies the approved overlay/Side Panel model without inventing a drawer, full-page detail, or alternate navigation model; no distinct narrow-detail behavior is claimed.
- The supplied fixtures do not include existing-key creation dates. Their detail field is therefore present but displays a localized “Not provided” value instead of inventing historical dates. Newly created records use the actual creation date.
- The authority does not define a production prefix-allocation service or returned prefix format for newly created keys. The local interactive evidence uses a clearly non-secret deterministic `nsk_created_###` display prefix only to make successful in-memory creation inspectable; this is not asserted as a reusable product or backend rule.

