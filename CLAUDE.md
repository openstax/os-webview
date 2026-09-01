# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenStax webview — the main openstax.org website. A Preact/TypeScript SPA that fetches content from an OpenStax CMS API and renders educational resource pages (textbooks, subjects, blog, errata, etc.).

## Commands

### Build
```bash
script/build             # Dev build (output in dev/)
```

### Testing
```bash
yarn test                # Run all tests with coverage
yarn jest layout.test    # Run a single test by name pattern
yarn jest test/src/components/shell.test.tsx  # Run a specific test file
```
Note: Tests require the dev build (`dev/` directory) to exist.

### Linting
```bash
yarn lint                # Run all linters (JS + TS + CSS)
yarn lint:js             # ESLint only
yarn lint:ts             # TypeScript type-checking only (tsc --noEmit)
yarn lint:css            # Stylelint on SCSS files
```

## Architecture

### Framework & Rendering
- **Preact** with `@preact/compat` aliased as `react`/`react-dom` (in both webpack and jest configs)
- **React Router DOM v6** for routing
- **Emotion** (`@emotion/react`, `@emotion/styled`) for CSS-in-JS alongside SCSS files
- **React Intl** for internationalization (babel-plugin-formatjs for message extraction)

### Entry Point & App Structure
- `src/app/main.js` — bootstraps the app: fetches CMS settings, renders `<App>` into `#app`
- `src/app/components/shell/shell.tsx` — top-level component, wraps everything in context providers
- Context provider nesting: `SharedData → User → Language → Portal → SubjectCategory → BrowserRouter`
- `src/app/components/shell/router.tsx` — main route definitions

### State Management
All state management uses React Context (no Redux). Key contexts in `src/app/contexts/`:
- `user.ts` — authentication, faculty status, account info
- `language.tsx` — locale/language selection
- `layout.tsx` — layout switching (default vs landing)
- `portal.tsx` — portal routing (landing page sub-sites)
- `salesforce.tsx` — Salesforce form integration
- `shared-data.ts` — shared data across components
- `subject-category.ts` — subject filtering

### Data Fetching
- `src/app/helpers/cms-fetch.ts` — primary data fetching utility, wraps `fetch()` with retry logic
- CMS API endpoint controlled by `API_ORIGIN` env var (defaults to `https://dev.openstax.org`)
- Settings loaded from `{API_ORIGIN}/cms/webview-settings`
- Custom hooks (`usePageData`, `useDocumentHead`, etc.) in `src/app/helpers/`

### Code Splitting
- `src/app/helpers/jit-load.tsx` — lazy loading wrapper using `React.lazy` + `Suspense`
- Webpack splits vendor chunks per-package
- Production chunk names are content-hashed, so a deploy invalidates all ~500 of them. A tab
  opened before a deploy 404s on the next chunk it requests; `src/app/helpers/stale-chunk.ts`
  detects that and reloads (at most twice per tab, tracked in sessionStorage).

### Patched dependencies
- `patches/` holds `patch-package` diffs, reapplied by the `postinstall` script on every install.
- `react-aria-carousel@0.2.0` is patched because its MutationObserver calls `hasAttribute` on
  every added node, including text nodes, which throws on any page with a carousel. 0.2.0 is the
  newest published version, so there is no upgrade to take instead. `test/src/components/
  carousel.test.tsx` asserts the patch is present, since an install that skips scripts drops it
  silently.

### Routing
Main routes in `router.tsx`:
- `/` — Home page
- `/errata/*` — Errata pages
- `/details/*` — Book detail pages
- `/embedded/*` — Embeddable pages (e.g., contact form)
- `/:dir/*` — Catch-all for CMS-driven pages (subjects, blog, general, flex pages, portals)

### Path Alias
- `~/` maps to `src/app/` (configured in webpack, tsconfig, and jest)

### Testing Patterns
- **Jest 27** with `@testing-library/preact` and `@testing-library/user-event`
- Tests live in `test/src/` mirroring `src/app/` structure
- Test data fixtures in `test/src/data/`
- Test helpers in `test/helpers/` (fetch mocker, localStorage mock, etc.)
- `test/setupFile.js` sets up global mocks (localStorage, requestAnimationFrame, ReactModal, etc.)
- Heavy use of `jest.spyOn` to mock imported modules and `usePageData` for CMS data

## Code Style

### Enforced by ESLint (strict)
- Max complexity: 6, max depth: 4, max params: 4, max line length: 120
- Single quotes, semicolons required, no trailing commas
- `prefer-const`, `prefer-arrow-callback`, `prefer-template`
- React hooks rules enforced (`exhaustive-deps` is an error)
- `no-shadow` enabled — avoid variable shadowing
- Unused vars pattern: prefix with `_`
- The `css` prop is allowed on JSX elements (Emotion)

### Prettier Config
- Single quotes, no trailing commas, no bracket spacing, JSX uses double quotes

### TypeScript
- Strict mode enabled, target ES6, module ES2020
- Gradually migrating from JS/JSX to TS/TSX

## Error reporting (Sentry)

- `src/app/sentry.js` is the only `Sentry.init` — imported first by `main.js`.
- `beforeSend` drops everything except `openstax.org`, so dev/staging errors never reach Sentry.
- Noise filtering lives in three lists there: `ignoreErrors` (exact messages), `ignoreMessages`
  (substring match, applied in `beforeSend`), and `denyUrls` (script origin). Use `denyUrls`,
  not `ignoreUrls` — the latter was removed in SDK v7 and silently does nothing.
- Integrations come from `@sentry/react` (v10). Do not add `@sentry/integrations`; it pulls a
  second copy of the SDK core into the bundle. `dedupe` is already on by default.
- Errors only — no tracing, replay, or feedback. `browserTracingIntegration` is deliberately
  absent, and the production webpack config defines `__SENTRY_TRACING__` and `__SENTRY_DEBUG__`
  as `false` so that code is stripped rather than merely unused. Adding a tracing integration
  back without removing those defines will silently not work.
- Render errors surface through `useErrorBoundary` in `shell/router-context.tsx`. That hook
  swallows the error unless a handler is passed, so the `Sentry.captureException` callback
  there is load-bearing.
- User context (uuid, `logged_in`, `user_role`) is attached in `contexts/user.ts`. Keep names
  and emails out of it.
- Chunk-load failures are recovered from rather than reported — see `stale-chunk.ts`. They stay
  in the ignore lists because Sentry's own global handlers capture them before the reload runs.
- Source maps upload from `build.yml` on `main` and tags, under release `osweb@<package.json
  version>` — that must stay in sync with `release` in `sentry.js`. Needs the
  `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` repo secrets.
