# Nav Redesign — Design Spec

**Date:** 2026-06-17
**Scope:** os-webview only. No CMS changes. New structural content (Rice logo, Learn extra-links) is hardcoded in the repo for now.

## Goal

Update the site header to match the new mockup:

- Remove the top gray utility bar.
- Single main nav row: OpenStax logo · divider · Rice logo · … · `Learn  Teach  AI  Research  About` · divider · Give · Log in.
- Rename **Subjects → Learn** with a rich two-column "mega" dropdown.
- Give is a solid orange button (still date-gated by CMS `give-today`). Log in is a blue link.

## Decisions (confirmed)

1. **Utility bar:** removed entirely. `Order Print` moves into the Learn dropdown as "Order a print copy". `Our Impact`, `Supporters`, `Blog`, `Help` drop off the top nav for now.
2. **Learn subjects:** dynamic from the CMS subject categories already loaded (`useSubjectCategoryContext`), laid out in two columns. Excludes the `K12` category and the `View All` entry.
3. **Give button:** keeps existing CMS date-window gating; only restyled as the orange button when shown.
4. **Tagline** ("Access. The future of education.") is dropped on desktop, replaced by the divider + Rice logo.
5. **Mobile:** Rice logo and former utility links do not appear. Mobile popover shows main menu items + Give + Log in only.

## Components

### `menus.tsx`
- Remove the desktop `<nav class="meta-nav">` + `UpperMenu`.
- Remove `UpperMenu` from the mobile popover.
- Desktop `.nav > .container` holds: `Logo` · divider · Rice logo · `MainMenu`.

### `logo.tsx`
- Drop the `.logo-quote` tagline span.
- Add a vertical divider + Rice logo (reusing the existing `rice-logo-blue` asset) after the OpenStax logo. (May live in `logo.tsx` or a small sibling in `menus.tsx`; whichever keeps the divider/Rice grouping clean.)

### `main-menu.tsx`
- Replace `SubjectsMenu` with a new `LearnMenu` (rich dropdown), labeled **Learn**.
- Keep `MenusFromCMS` (Teach, AI, Research, About).
- Add a vertical divider before the Give cluster.
- `GiveButton` (date-gated, restyled orange) then `LoginMenu`.

### Learn mega-dropdown (new)
Matches mockup image #4:
- Header: **"Visit the library →"** (blue, bold) linking to `/subjects`.
- Two-column grid of CMS subject categories (excluding `K12` and `View All`).
- Horizontal divider.
- Stacked links: **Assignable**, **Order a print copy** (`/print/`), **OpenStax in Spanish**, **OpenStax in Polish** (last two reuse existing `LanguageLink` behavior).

### `dropdown.tsx` extension
Add an optional "mega" content mode so the rich panel reuses the existing open/close, hover, keyboard, and ARIA logic rather than duplicating it:
- A flag to skip the per-child `<li>` wrapping in `DropdownContents` (render children raw).
- A modifier class on `.dropdown-container` / `.dropdown-menu` so SCSS can widen and grid-lay the panel.

### Styling
- New SCSS for the mega panel: two-column grid, blue header with right arrow, left accent rule, horizontal divider, stacked links.
- Nav labels: bolder, darker (navy / dark gray) per mockup.
- Vertical divider styling between logo group, menu, and Give/Log-in cluster.
- Give → solid orange button; Log in → blue link.
- Adjust header height now that the gray bar is gone (`header.scss`).

## Out of scope
- No CMS schema/content changes.
- The Learn extra-links and Rice logo are hardcoded for now.
- Subjects remain dynamic from CMS.

## Testing
- Existing header/menu tests must continue to pass; update snapshots/queries that reference the removed utility bar or "Subjects" label.
- Add coverage for the Learn mega-dropdown rendering (header link, subject grid, extra links) and that the utility bar is gone.
- `yarn lint` (JS/TS/CSS) clean.
