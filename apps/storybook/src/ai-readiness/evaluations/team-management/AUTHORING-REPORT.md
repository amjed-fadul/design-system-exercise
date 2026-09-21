# Team Management blind evaluation authoring report

## Implementation summary

- Composed the Northstar shell from the public `ApplicationShell`, `TopNavbar`, `Sidebar`, `Avatar`, and `PageHeading` APIs. Shell labels, account ordering, footer hierarchy, and SVG masks follow the approved Northstar workspace-shell context.
- Built the directory from `SearchField`, `Table`, `StatusBadge`, and `EmptyState`. Search matches names and email addresses; the summary reports visible active and invited records, and the Table footer reports the visible people count.
- Built invitation and unsaved-change confirmation flows with governed `Dialog`, `TextField`, `RadioGroup`, `InlineFeedback`, and `Button` APIs.
- Built joined-member detail from `SidePanel` inside the modal host required by Modal List → Detail guidance. The host owns modality, background inertness, focus entry/containment/restoration, and Escape; `SidePanel` remains a named non-modal region. The governed Dialog takes over modal keyboard/focus ownership for the discard confirmation.
- Included Storybook stories for English LTR, Arabic RTL, light and dark themes, compact directory, member detail, unsaved changes, and retryable invite/save failures.

## Authority decisions

- CSS custom properties use the consumer-contract naming rule: `--dse-` prefix, dot-to-hyphen path conversion, and no mode name in the variable. Examples used include `--dse-color-semantic-fg-primary`, `--dse-layout-semantic-region-gap`, `--dse-layout-semantic-detail-available-width`, `--dse-layout-primitive-top-height`, and `--dse-elevation-plane-overlay`.
- Semantic color, typography, spacing, border, layout, radius, and icon-size values come from governed tokens where they own the decision. No raw product colors or local shadows were added.
- Invite/save failure booleans are Storybook-only evaluation controls. They expose failure and retry states without claiming a production failure rule; the controls document this boundary.
- The compact directory story omits member-detail activation and displays an evaluation note. It does not choose a narrow drawer, full-page detail, or alternate navigation model.

## Local raw dimensions and CSS

- Northstar context-authorized brand mark: `30px` square, `6px` corner radius, and `14px` gap before the product name.
- Northstar context-authorized appearance glyph box: `40px` square; glyph size uses `--dse-icons-size-md`.
- Northstar context-authorized Sidebar footer stack gap: `2px`.
- Task-authorized wide Search Field width: `360px`, capped by its available inline size.
- Compact directory media-query cutoff: `1199px`, derived from the governed 1200 CSS-pixel Application Shell breakpoint. CSS media queries cannot consume a custom property directly.
- `100vh` fills the Storybook evidence viewport; `100%` and `min(..., 100%)` values only constrain composition to available space.
- The modal host starts below the governed `--dse-layout-primitive-top-height`, stacks at `--dse-elevation-plane-overlay`, and sizes the Side Panel with `--dse-layout-semantic-detail-available-width`.
- Other composition spacing uses governed spacing/layout tokens. Product SVGs render as `mask-currentColor` as specified by the product context.

## Unresolved authority decisions

- Production navigation and breadcrumb URLs remain product-owned. The Storybook evidence uses fragment placeholders (`#overview`, `#projects`, `#team-and-access`, `#settings`, and `#workspace`) solely to satisfy the governed native-link data contract.
- Modal List → Detail guidance governs only wide/available detail presentation. Narrow-screen member-detail behavior remains unresolved; no alternate model was authored.
- Northstar provides Arabic shell copy, while Team Management page and workflow strings have no approved Arabic source in the supplied context. The Arabic story uses direct translations for evaluation; production copy needs product localization approval.

## Unsatisfied product-context requirements

None of the explicit Northstar shell requirements could not be represented: the approved brand mark and word order, navigation assets/order/current destination, appearance glyph, account identity/order, sidebar footer hierarchy, and Arabic shell content are present. Production route destinations remain unresolved as noted above.
