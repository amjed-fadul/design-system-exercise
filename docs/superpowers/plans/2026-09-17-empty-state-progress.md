# C12 Empty State — completion record

## Authority

- Contract: `dse.empty-state@1.0.0`
- Figma authority: `tYCXBBYoQ92AUKVbND5WkG` node `131:2`
- Base milestone: C11 Side Panel final record `fea87d0c2e076a7ededb16699896ea37d6757b85` — run 277 PASS
- Implementation/package HEAD: `f806e669e59d3fd026b4bdb99fb92901c604f9b1`
- Implementation CI: run 300 PASS on that exact HEAD
- PR: #14 remains Draft, open, and unmerged

## Governed public boundary

`EmptyStateProps` exposes only:

- `title?: string` — visible non-empty heading; default `No people found`
- `body?: string` — supporting explanation; defaults to the Figma no-results copy and must be non-empty while visible
- `showBody?: boolean` — default `true`
- `icon?: ReactNode` — compatible decorative icon content; default is the governed Search source
- `showIcon?: boolean` — default `true`
- `actions?: ReactNode` — optional recovery or next-step controls; Button/Link composition is preferred and Figma caps the direct slot at two controls

The component does not own loading, error handling, empty-case reasoning, result counts, query/filter logic, retry/clear behavior, permissions, recovery outcomes, or arbitrary native/live-region overrides.

## Runtime semantics

- Native named `section` with a generated heading id.
- The visible title is an `h2` and labels the empty region.
- Visible title/body content is grouped in `role="status"` with `aria-atomic="true"` for polite result-status communication.
- Recovery actions are outside the live status group.
- The icon wrapper is `aria-hidden="true"`.
- Empty State does not move focus when it appears; recovery controls remain in normal document order.
- Empty or whitespace-only title is rejected. A visible empty or whitespace-only body is rejected.
- Untyped workflow props, `children`, root `role`, and `aria-live` overrides do not escape the governed boundary.

## Figma visual parity

- Host-filling surface with a 440px minimum block size; the 1168px Figma example width is not turned into a fixed public width.
- Centered content stack capped at 680px with 12px semantic gaps.
- Optional 40px icon region with a centered 24px Search glyph (`icons/size/lg`).
- Live Figma inspection confirmed the Search instance uses the `Muted` icon-render mode, resolving to semantic `fg/tertiary`; body copy remains `fg/secondary`.
- Title uses semantic `title/component`; body uses semantic `body/small`.
- Logical centered geometry preserves LTR/RTL behavior.

## Verification

- 262 automated tests passing:
  - Contracts: 63/63
  - Tokens: 17/17
  - React: 146/146
  - Storybook: 36/36
- TypeScript typecheck: PASS
- Storybook production build: PASS
- Packed-package/prepack verification: PASS
- `EmptyState.css` is included in the distributed `styles.css` bundle.
- `verify-empty-state-dist.mjs` runs from React `prepack` and verifies public export, SSR semantics, invalid-copy rejection, forbidden-boundary protection, packaged CSS, 440/680 geometry, 24px icon sizing, and `fg/tertiary` muted icon tone.
- Runtime defaults are checked directly against the contract defaults.
- Compile-time boundary guards protect the six-prop public API and forbidden workflow/native keys.

## Review corrections closed

The fresh final self-review caught and corrected real issues before closure:

1. Empty State CSS was initially missing from the aggregated packed stylesheet.
2. Empty State initially lacked a component-specific distribution verifier in `prepack`.
3. Runtime defaults initially lacked direct contract-drift protection.
4. The public TypeScript boundary initially lacked compile-time forbidden-key guards.
5. The contract initially referenced the 20px `icons/size/md` token even though the live Figma instance is 24px; corrected to `icons/size/lg`.
6. Final live Figma inspection showed the Search icon is in the `Muted` render mode, resolving to `fg/tertiary`; implementation, contract, tests, and packed verification were corrected from `fg/secondary`.

Final inline self-review: **APPROVED — no unresolved Critical or Important findings.**

## Figma AI knowledge pack

The `IMPLEMENTATION / C12 · dse.empty-state@1.0.0` knowledge pack was written to live Figma node `131:2` and independently read back. The marker appears exactly once and the read-back confirms implementation HEAD `f806e669e59d3fd026b4bdb99fb92901c604f9b1`, run 300 PASS, the 262-test record, packed-package evidence, and the final `fg/tertiary` icon mapping.
