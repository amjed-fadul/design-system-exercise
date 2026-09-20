# API Keys Management — Authoring Report

## Implementation

The evaluation implements a searchable Northstar API-key directory in the governed Application Shell. The directory uses the public Page Heading, Search Field, Table, Status Badge, and Empty State APIs. Creation uses the governed Dialog, Text Field, Radio Group, Button, and Inline Feedback APIs. Record details use the governed Side Panel inside a composition-owned modal host; the host keeps the matching table row selected, makes the workspace inert, contains focus, closes on Escape, and restores focus to the invoking action. Revocation is offered only for active keys and changes local evaluation state only after confirmation.

English/LTR and Arabic/RTL copy, Light/Dark token contexts, and expanded/compact shell modes are available as Storybook args. Key prefixes and fixture names with known intrinsic LTR direction are isolated from surrounding Arabic text. Narrow directory results keep the governed Table at its minimum width and scroll within the results wrapper.

## Evaluation-only behavior and unresolved product decisions

- No production API, credential allocator, authentication/authorization check, or revoke endpoint was supplied. Create and revoke therefore update only in-memory evaluation state; no backend request is made.
- Production prefix allocation and secret-token generation/reveal behavior are unresolved. A newly created row explicitly says “Not generated in this evaluation”; no token or production prefix format is fabricated or stored.
- The fixtures supply creator names but no creation dates. Details say “Not supplied in this evaluation” rather than inventing dates or a date format. The new evaluation record uses an explicitly labeled evaluation admin and likewise has no date.
- Approved modal/list/detail guidance leaves narrow-screen contextual-detail behavior unresolved. Compact mode displays that limitation and does not substitute a drawer, full-page detail, or alternate navigation model.
- The approved token JSON declares theme and language mode axes but the allowlisted authorities do not specify the generated CSS mode-selector contract. The Storybook-only harness applies `data-theme` and `data-language` to the document root, plus native `lang` and `dir`, so portaled content receives the same context. Confirm that selector convention before reusing it as a production integration. JSDOM interaction tests verify the context attributes, not rendered token colors.

## Local CSS and dimensional authority

- Expanded and compact Storybook evidence frames cap at the governed 1440px wide and 960px narrow viewport tokens. These are evidence-frame limits, not product content-width rules.
- The controls stack at `max-width: 1199px`, derived from the Application Shell’s governed 1200px expanded-shell breakpoint. CSS media queries cannot consume the custom-property token directly, so the breakpoint is repeated as this local media-query value; no independent breakpoint is introduced.
- The detail host uses the approved Side Panel width token and begins below the governed Top Navbar height. Its host overlay and logical inline-end placement follow modal/list/detail guidance. `z-index: 1000` is a local stacking-order value because the approved token set does not map elevation planes to CSS stacking levels; the composition guidance requires the host to overlay the workspace.
- Side Panel sizing fills the modal host; the composition-level `min-block-size: 0` override permits that fill without retaining the panel’s standalone minimum block size.
- Directory controls, metadata rows, and the narrow horizontal-overflow wrapper are composition-owned layouts, implemented with logical properties and governed spacing, typography, border, and semantic color tokens. No raw product colors are used.
- The Sidebar needs an icon content slot, while the allowlisted contracts expose no public key-icon component or asset. A local 20×20 key SVG supplies that product-owned glyph; its rendered size and stroke use icon tokens. The evaluation-only “not generated” placeholder is italicized to distinguish it from a real prefix.
- Semantic theme colors are always consumed through the governed token stylesheet. No component-owned theme prop, custom component variant, or design-system source change was introduced.

## Verification

The task-local Vitest suite passes 9/9 tests. It exercises filtering, empty results, required-field validation, successful creation without secret generation, Arabic/RTL and compact mode attributes, record metadata, focus restoration after closing details or revoking a key, confirmation-gated revocation, and the unresolved narrow-detail behavior.

A scoped strict TypeScript no-emit check passed for `ApiKeysEvaluation.tsx` against the public package declarations. The Storybook metadata file was not typechecked: `@storybook/react` was not resolvable from the permitted React package execution context, and no broader Storybook build was run because its other sources are outside the blind-run allowlist.
