# API Keys Management — Authoring Report

## Implementation

The evaluation page uses the approved `PageHeading`, `SearchField`, `Table`, `EmptyState`, `StatusBadge`, `Button`, `Dialog`, `TextField`, `RadioGroup`, `InlineFeedback`, and `SidePanel` APIs. It supports name/prefix filtering, an accurate result count, the governed no-results state, required name/scope validation, an in-memory create outcome, record-specific details, selected-row association, and an explicit nested confirmation before revoking an active key. Revoke confirmation is owned by `Dialog`; the outer detail host owns modality, background inertness, focus containment/restoration, and Escape handling as required by the Modal List → Detail guidance.

The page and detail portal inherit English/Arabic language, LTR/RTL direction, and Light/Dark mode from evaluation wrapper attributes. Supplied key prefixes are isolated with `dir="ltr"`. No actual secret token is revealed, copied, generated, or stored. Search and detail metadata operate on the supplied fixtures and local evaluation state only.

## Governed styling and local CSS

- Semantic color tokens provide the page canvas, foregrounds, and modal overlay. The wrapper sets the matching native `color-scheme`; governed components retain ownership of their surfaces, controls, status treatment, and typography.
- Spacing uses semantic section/gap/stack tokens. Page inset, modal top offset, detail width, and the modal stacking plane use the approved layout/elevation tokens.
- The compact directory stacks Search Field and result summary below the Application Shell's approved 1200 CSS-pixel expanded breakpoint. `max-width: 1199px` is the inclusive compact side of that documented boundary, not a new breakpoint. The results wrapper owns horizontal overflow so the governed Table keeps its minimum width.
- Local CSS arranges the directory controls, key identity content, metadata definition list, create-form fields, and the composition-owned detail host. The host starts below the Top Navbar, attaches to logical inline-end, uses the semantic overlay surface and Side Panel width authority, and adds no local shadow.
- `100vh` fills the Storybook evidence surface; logical zero insets and `position: fixed` place the approved modal host. No raw product color or guessed component variant is used.

## Unresolved authority — intentionally not guessed

1. **Application Shell public API:** the approved `application-shell.contract.json` documents shell behavior, dependencies, and responsive states, but does not declare consumer prop/slot names. The blind-run allowlist does not authorize inspecting the package implementation or other Storybook source to discover them. To avoid invented API or a local shell reimplementation, this evidence renders the governed page heading and directory content without Top Navbar/Sidebar/Application Shell integration. Wide-shell composition remains unresolved and is a known gap in this deliverable.
2. **Narrow contextual detail:** approved modal-list-detail guidance explicitly leaves narrow detail presentation unresolved. The compact evaluation keeps record-specific detail controls visible but disabled, links them to an explanatory note, and does not invent a drawer, full-page detail, or alternate navigation model.
3. **Production key allocation:** no approved source defines secret generation or prefix allocation. A created evaluation record therefore uses the explicit non-production label “Not generated (evaluation only)”; the success message states that no secret value was generated or stored.
4. **Created-date fixtures and current-user identity:** supplied records have no created dates, and no signed-in administrator identity is provided. The detail field reports “Not provided in evaluation fixture”; a locally created record uses the clearly marked generic “Current administrator (evaluation)” label. Neither value is presented as production data.

## Verification artifact

`ApiKeysEvaluation.test.tsx` exercises filtering/no-results, details and focus restoration, create validation/success, consequential revoke confirmation, compact-detail disclosure, and Arabic RTL/dark-mode attributes with LTR key prefixes.
