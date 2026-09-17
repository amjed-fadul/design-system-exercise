# C14 — Top Navbar

Implementation target: `dse.top-navbar@1.0.0`.

- Base: C13 record `3ccdb8bdc69ba9b7be792dd896f4ff3a17ab0adf`.
- Figma authority: Top Navbar `228:18954`; reviewed rendering component `147:2`.
- Public API: `brand`, `contextLabel`, `showContext`, `account` only.
- `order=forward` is a Figma rendering selector, not a product API.
- Theme is inherited from semantic tokens.
- Top Navbar owns the persistent header regions and divider.
- Application Shell owns placement and content below.
- Product owns Brand/Account data, appearance behavior, and any account interaction.
- Page patterns own task actions and page headings.
