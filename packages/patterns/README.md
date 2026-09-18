# @design-system-exercise/patterns

Reusable product-pattern compositions built only from approved Design System Exercise components.

## P01 — Application Shell

`ApplicationShell` is governed by `dse.pattern.application-shell@1.0.0` and the live Figma guide `68:494`.

It owns stable shell layout only:

- Top Navbar placement
- governed Sidebar responsive mode selection
- optional Page Heading placement
- scrollable main content region
- the 1200 CSS-pixel expanded/compact decision

It does **not** own product query, selection, draft, request, member, permission, routing-policy, or backend state.
