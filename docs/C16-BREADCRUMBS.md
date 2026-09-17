# C16 — Breadcrumbs completion record

C16 implements and verifies the public `dse.breadcrumbs@1.0.0` contract from Figma authority `139:20` plus the private `dse._breadcrumb-link-item@1.0.0` anatomy from Figma `139:16`, stacked on the completed C15 Page Heading record `67caeeb585c105fc4d74700c517c100b85b19488` (CI run 370 PASS).

## Implementation authority

Implementation/package HEAD: `38f9458cfe81b0893c5a35e9f3c6d309becd80c4`.

GitHub Actions run **384** passed on that exact implementation HEAD with:

- 20 validated component contracts / 0 pattern contracts;
- 223 validated and generated logical tokens;
- Contracts: **80/80**;
- Tokens: **17/17**;
- React: **197/197**;
- Storybook: **51/51**;
- **345 automated tests passing** total;
- TypeScript typecheck: PASS;
- Storybook production build: PASS;
- packed-package/prepack verification: PASS, including `verify-breadcrumbs-dist.mjs`.

## Public boundary

Breadcrumbs exposes only:

- required `ancestors: readonly BreadcrumbAncestor[]`, with at least one item;
- each ancestor is `{ label: string; href: string }` with non-empty values;
- required non-empty `currentLabel`;
- optional localized `ariaLabel`, defaulting to `Breadcrumbs`.

The public API deliberately excludes generic children, separator customization, collapse/overflow controls, current-page href/link behavior, disabled/visited state, theme controls, back behavior, and workflow-progress semantics.

## Internal anatomy

`dse._breadcrumb-link-item@1.0.0` remains internal-only and maps to Figma `139:16`. It composes the existing governed `Link` plus a fixed slash separator. The nested Link is the only interactive/focusable element; the slash is decorative and `aria-hidden`.

The private helper is absent from the public React barrel and unsupported by the package exports map. Only the public `Breadcrumbs`, `BreadcrumbAncestor`, and `BreadcrumbsProps` symbols are exported.

## Runtime and accessibility

The runtime renders a named native `<nav>` containing an ordered `<ol>` route hierarchy. Ancestors are native destinations through `Link`; the current route remains plain text with `aria-current="page"`. Separators are outside the link target and excluded from the accessibility tree.

Runtime validation rejects empty ancestor arrays, empty ancestor labels/hrefs, empty current labels, and empty navigation labels. Writing direction is inherited, so RTL follows the surrounding document without a dedicated prop.

## Layout and token evidence

Fresh Figma design-context and Plugin API review confirmed:

- Breadcrumbs root is **HUG/HUG**, 169×24 in the reviewed one-ancestor example;
- runtime preserves content sizing with `inline-size: fit-content` plus `max-inline-size: 100%`;
- 8px gap between ancestor hierarchy and current label;
- 8px gap between private Link and separator;
- governed Link retains its 24px minimum target height;
- Label/small typography governs separator/current text;
- current text uses semantic `fg/secondary`;
- separator uses semantic `fg/tertiary`;
- ancestor Link retains its existing interaction/focus token behavior;
- trail units remain nowrap, with no invented collapse, overflow menu, ellipsis, or truncation behavior.

## Page Heading integration

C15 Page Heading Storybook no longer uses the temporary Breadcrumbs fixture. C16 replaces it with the real public `Breadcrumbs` implementation without expanding the Page Heading API.

C16 Storybook evidence covers one ancestor, multiple ancestors, explicit Page Heading integration, and Light/Dark × English/Arabic.

## TDD and review history

- **Run 371 — RED:** contract tests failed only because the public/private C16 contract files did not yet exist.
- **Run 372 — GREEN:** both contracts and source inventory passed all gates.
- **Run 373 — RED:** runtime/CSS/export/package/default tests failed only because the React implementation did not yet exist.
- **Run 374 — GREEN:** runtime and package distribution passed all gates.
- **Run 376 — RED:** Storybook evidence failed because Breadcrumbs stories were absent and Page Heading still used the C15 temporary fixture.
- **Run 379:** 50/51 Storybook tests passed; the single failure was a test-harness assumption that imported CSF stories materialize meta args on `Default.args`.
- **Run 380 — GREEN:** the Storybook harness was corrected; all gates passed.
- **Run 381 — RED:** fresh Figma review caught the real HUG-root mismatch; the new regression test failed only because the runtime root could stretch full width.
- **Run 384 — GREEN:** HUG-width runtime CSS, contract wording, and packed-distribution verification all passed.

Fresh final review therefore closed two meaningful issues before record creation: the Storybook meta-args harness assumption and the Breadcrumbs HUG/HUG sizing mismatch. No unresolved Critical or Important findings remain.

## Figma implementation record

The marker `IMPLEMENTATION / C16 · dse.breadcrumbs@1.0.0` was written to Figma Breadcrumbs authority `139:20` while preserving the authored design guidance.

An independent read-back confirmed exactly one marker and every recorded field: implementation HEAD/run 384, public API, private-helper boundary, native nav/current-location/separator semantics, validation, HUG/HUG sizing, both 8px gaps, no-overflow boundary, semantic token usage, RTL inheritance, real Page Heading integration, all test counts, package/build gates, and final-review status.

## Final review

**APPROVED — no unresolved Critical or Important findings.**

PR #18 remains Draft, open, and unmerged. This documentation record commit must pass CI on its exact HEAD before it becomes the authoritative C16 final record.