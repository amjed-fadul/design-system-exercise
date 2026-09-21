# AI Readiness — Team Prototype vs Blind Evaluation Parity Audit

**Date:** 2026-09-20  
**Status:** REVIEW COMPLETE — TASK 8 REOPENED  
**Prototype authority reviewed:** `apps/storybook/src/prototypes/ConnectedProductPrototype.tsx`  
**Blind evidence reviewed:** Team Run 009 — `fd87e55a2d79a8f99c30bf68e88ac192ed6de705`

## Why this audit exists

The original Task 8 gate emphasized contract/API compliance. Visual comparison of the reviewed prototype against the blind Team evaluation shows that an agent can be contract-valid while still producing a materially weaker product surface.

This audit classifies each visible difference as:

- component implementation;
- contract/token authority;
- composition guidance;
- product brief / product data;
- agent mistake;
- evaluation methodology.

The hidden prototype is not automatically authoring authority for the blind agent. Product-specific differences are only system failures when the agent had, or should have had, explicit machine-readable authority for them.

## Finding P1 — invalid design-token CSS variable names

**Classification:** token consumer authority gap + evaluation validation gap  
**Severity:** Critical for AI-readiness

Team Run 009 references 37 `--dse-*` variables. Four do not exist in the generated token CSS:

- `--dse-layout-wide-detail-available-width`
- `--dse-layout-wide-region-gap`
- `--dse-layout-wide-top-height`
- `--dse-layout-narrow-region-gap`

The real public generated names are mode-independent semantic variables such as:

- `--dse-layout-semantic-detail-available-width`
- `--dse-layout-semantic-region-gap`
- `--dse-layout-semantic-top-height`

The blind agent saw token JSON and mode metadata but did not have a public machine-readable manifest mapping logical token paths to generated CSS custom-property names.

TypeScript, Storybook build, and the existing tests did not catch these references because browsers accept unresolved custom-property references syntactically.

### User-visible consequence

The Team evaluation attempts to size the Side Panel with:

`inlineSize: "var(--dse-layout-wide-detail-available-width)"`

That variable does not exist. An unresolved custom property makes the inline declaration invalid at computed-value time, so the authored width is lost rather than using the intended governed detail width.

The same issue affects top offset and region spacing references.

### Required system correction

1. Expose the exact public CSS custom-property inventory/mapping as machine-readable token consumer authority.
2. Add validation that rejects unknown `--dse-*` references in AI-evaluation authored CSS/TSX.

Do not teach agents to infer public CSS names from implementation-source generator code.

## Finding P2 — Status Badge violates its content-width contract in CSS Grid

**Classification:** component implementation bug  
**Severity:** Important

`dse.status-badge` explicitly requires:

- “content-driven width”;
- “width grows with the label content.”

Current implementation:

```css
.dse-status-badge {
  display: inline-flex;
  ...
}
```

As a CSS Grid item, an inline element is blockified and the default grid-item alignment can stretch its auto inline size. In the blind Team Side Panel this makes “Active” appear as a wide bar rather than the compact badge shown in the prototype.

The component does not currently enforce its own content-driven sizing in arbitrary consumer layout contexts.

### Required system correction

Make Status Badge intrinsically sized in grid/flex/normal-flow consumers and add a regression test protecting the contract.

This is not a product-composition responsibility because intrinsic compact width is explicitly owned by the component contract.

## Finding P3 — visual-fidelity evaluation lacked product-composition authority

**Classification:** evaluation/product-brief gap  
**Severity:** Important for the final AI-readiness methodology

Several large visible differences are **not** component bugs. The prototype contains product-specific shell/content choices that the blind Team task never supplied.

### Top Navbar

Prototype supplies:

- branded mark + Northstar name;
- appearance utility;
- `Amal Hassan · Admin`;
- account Avatar.

Blind task supplies no account identity, appearance requirement, or brand-mark asset.

Top Navbar correctly leaves Brand and Account content product-owned and optional.

**Classification:** product brief / product shell authority missing, not Top Navbar failure.

### Sidebar

Prototype supplies:

- Overview;
- Projects;
- Team & access;
- Settings;
- workspace footer.

Blind task only requires Team Management and supplies no standard Northstar navigation fixture.

Sidebar correctly allows 1–8 product-owned destinations and optional footer.

**Classification:** product brief / product shell authority missing, not Sidebar failure.

### Breadcrumbs

Prototype supplies `Workspace / Team & access`.

Page Heading correctly makes Breadcrumbs optional.

The Team evaluator lists `dse.breadcrumbs` under expected authorities, but the agent-visible product requirement never asks for breadcrumbs or supplies a hierarchy.

**Classification:** evaluation task inconsistency. If Breadcrumbs are required for fidelity, the hierarchy must be agent-visible.

### Invite action icon

Prototype gives Invite member a leading icon. Blind task supplies no icon requirement or canonical glyph.

**Classification:** product brief / asset authority missing.

### Search width and toolbar proportions

Prototype uses a product-evidenced narrower search width.

Directory guidance intentionally says a fixed Search width requires product/Figma authority. The blind Team task supplied no such authority, so the agent's flexible search is valid.

**Classification:** product evidence absent; not a DS failure.

### Team data richness

Prototype shows more people and joined-member emails. The blind task supplies exactly three joined members without emails plus two pending invitation emails.

The agent correctly did not invent joined-member email addresses.

**Classification:** product fixture difference.

### Side Panel content

Prototype additionally supplies:

- member email under identity;
- “Current saved role”;
- role-option descriptions;
- “Changes take effect only after you save”;
- Close + Save footer actions.

The blind task requires role editing, failures/success, and unsaved-close protection, but does not require those exact content regions/copy or footer action composition.

Radio Group already supports option descriptions. Side Panel already supports multiple actions. No missing component capability is proven.

**Classification:** product/workflow requirement missing if these details are intended target fidelity.

## Finding P4 — Task 8 visual-fidelity gate was too permissive

**Classification:** evaluation methodology gap  
**Severity:** Important

The previous Task 8 review marked visual fidelity PASS* when no pixel target was supplied.

That allowed:

- unknown CSS custom-property references;
- a component contract violation visible only in a consumer layout context;
- substantial product-shell differences that could not be judged because product-specific authority was hidden.

The gate therefore measured API compliance more strongly than reproducible product fidelity.

### Required correction

The final gate must distinguish two questions:

1. **DS compliance:** did the agent use governed APIs/tokens/guidance correctly?
2. **Product fidelity:** did the agent receive enough explicit product authority to reproduce the intended shell/content/layout, and then follow it?

Do not grade an agent against hidden prototype decisions it was never allowed to know.

## Difference classification summary

| Visible difference | Classification | DS change? |
| --- | --- | --- |
| Side Panel wrong governed width/spacing refs | Token consumer authority gap | **Yes** |
| Stretched Status Badge | Component implementation bug | **Yes** |
| Minimal Top Navbar | Missing product-shell brief | No component change |
| Single Sidebar destination / no footer | Missing product-shell brief | No component change |
| Missing Breadcrumbs | Task/product-brief inconsistency | No component change |
| Invite action without icon | Missing product/asset requirement | No component change |
| Wider Search field | No product width authority supplied | No |
| Five records instead of prototype dataset | Product fixture difference | No |
| Missing joined-member email | Product fixture omission; correctly not guessed | No |
| Missing current saved role / role descriptions / save note / Close action | Product/workflow brief omission | No component change |
| Team title/copy differs | Product copy choice | No |

## Revised Task 8 decision

Task 8 must be reopened.

The prior final-gate result is not sufficient because P1 and P2 are genuine system defects discovered by prototype-vs-evaluation parity review.

Next sequence:

1. fix P1 token consumer CSS-name authority and unknown-token validation;
2. fix P2 Status Badge intrinsic sizing;
3. strengthen the Team agent-visible product brief only for product-specific fidelity decisions that are actually expected;
4. rerun Team blind from the corrected baseline;
5. perform the final gate using separate DS-compliance and product-fidelity criteria.


## Correction status

- **P1:** FIXED and verified — CI run 621 PASS on `79ef0b5211eb7727d3a48feacddb0d377f3cbe54`.
- **P2:** FIXED and verified — CI run 623 PASS on `619de1ff468ae782d5bf64d343a82ae8b9e2f46a`.
- **P3:** Team product-fidelity authority made agent-visible and verified — CI run 625 PASS on `d7b37a8bc835e31afec5991333c6e8c80cb52df6`.
- **Run 010:** COMPLETED; static/component parity improved but human visual review exposed P5 product-shell authority/assets gap and agent mistake M3 (`showClose={false}`).
- **P5:** FIXED and verified — CI run 650 PASS on `615f035e639ac943102a58ee6348b20fffc7655b`.


## Finding P5 — missing Northstar product-shell authority and canonical assets

**Classification:** product-context authority gap  
**Severity:** Important for product fidelity

Run 010 still showed weak Sidebar/Top Navbar fidelity even after the product brief was expanded:

- Sidebar used letter placeholders instead of the reviewed Overview / Projects / Team / Settings icons;
- Sidebar footer copy had no governed two-line composition hierarchy;
- Top Navbar omitted the Northstar brand mark;
- Top Navbar omitted the reviewed moon/appearance utility;
- account slot ordering was not explicitly governed.

The generic Top Navbar and Sidebar contracts intentionally leave these values product-owned, so changing their generic APIs would be incorrect.

The correct fix is a product-context layer.

### Correction

Added approved machine-readable context:

`packages/contracts/ai/product-contexts/northstar-workspace-shell.context.json`

It defines:

- Northstar brand mark + wordmark ordering and product-owned geometry;
- Top Navbar context label;
- appearance utility asset and account-slot ordering;
- account label and Avatar initials;
- canonical Sidebar labels/destinations;
- canonical Sidebar nav SVG assets;
- stacked Sidebar footer hierarchy and typography;
- English/Arabic shell copy.

Canonical shell assets were copied out of denied prototype/Storybook source into:

`packages/contracts/ai/product-contexts/assets/`

The authoring policy now places approved product context between composition guidance and product/Figma evidence, and permits product-context-authorized local CSS.

The Team blind task references `dse.product-context.northstar-workspace-shell`; the test pack allowlist exposes the context and its SVG assets while prototype source remains denied.

**Verification:** CI run 650 PASS on exact canonical HEAD `615f035e639ac943102a58ee6348b20fffc7655b`.
