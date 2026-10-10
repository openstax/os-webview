# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenStax webview — the main openstax.org website. A Preact/TypeScript SPA that fetches content from an OpenStax CMS API and renders educational resource pages (textbooks, subjects, blog, errata, etc.).

## Commands

### Build
```bash
script/build             # Dev build (output in dist/; needs nvm, else run `yarn webpack --mode development`)
```

### Testing
```bash
yarn test                # Run all tests with coverage
yarn jest layout.test    # Run a single test by name pattern
yarn jest test/src/components/shell.test.tsx  # Run a specific test file
```
Note: Tests require the build (`dist/` directory) to exist.

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
- Book details "used in N classrooms, saving students $S" numbers come from sfapi
  (`GET /api/v1/impact/books?name=<salesforce_name>`, Tableau rollover model), fetched by
  `src/app/models/book-impact.ts`. The CMS `adoptions`/`savings` fields are stale and unused.

### Code Splitting
- `src/app/helpers/jit-load.tsx` — lazy loading wrapper using `React.lazy` + `Suspense`
- Webpack splits vendor chunks per-package
- Production chunk names are content-hashed, so a deploy invalidates all ~500 of them. A tab
  opened before a deploy 404s on the next chunk it requests; `src/app/helpers/stale-chunk.ts`
  detects that and reloads (at most twice per tab, tracked in sessionStorage).

### Flex pages and audience gating
- `src/app/pages/flex-page/flex-page.tsx` renders CMS-authored flex pages via
  `@openstax/flex-page-renderer`'s `ContentBlockRoot`, using the block components in
  `src/app/pages/flex-page/block-map.ts`.
- CMS editors can set a free-text `rendering_condition` on a `hero`, `section`, or CTA button-bar
  block (comma-separated condition slugs — OR semantics, at least one active slug renders the
  block). `src/app/helpers/use-audience-conditions.ts` computes which slugs apply to the current
  viewer and `flex-page.tsx` passes that as `activeConditions` to `ContentBlockRoot`.
- Slug vocabulary (the source of truth — keep this table, the hook's checks, and the CMS field's
  help text in sync):

  | slug | condition |
  |---|---|
  | `role:anonymous` | not logged in |
  | `role:student` | `accountsModel.self_reported_role === 'student'` |
  | `role:instructor` | `accountsModel.faculty_status === 'confirmed_faculty'` |
  | `role:admin` | `accountsModel.self_reported_role` is `administrator`, `librarian`, or `designer` |
  | `status:verified` | `accountsModel.faculty_status === 'confirmed_faculty'` |
  | `status:pending` | `userModel.pendingInstructorAccess` is true |
  | `school:assignable` | `accountsModel.assignable_school_integrated === true` |
  | `adopter:yes` | `accountsModel.using_openstax === true` |

  A viewer can match several slugs at once (e.g. a confirmed-faculty self-declared administrator
  gets `role:instructor`, `status:verified`, and `role:admin`).
- `useAudienceConditions` returns `undefined` until the accounts fetch resolves, not an early
  `['role:anonymous']`. That keeps personalization additive: unconditioned blocks always render,
  and a conditioned block only appears once the viewer's audience is actually known — emitting
  `role:anonymous` immediately would show anonymous content to a logged-in instructor for a
  moment and then swap it, a flash of wrong content plus a double layout shift.
- `block-map.ts` wraps every block type (not just hero/section/CTA) with the same
  `rendering_condition` check at module scope, so gating works even for block types the
  `flex-page-renderer` package hasn't added its own check to yet. The condition value may be a
  comma-separated string or an array of slugs (the CMS's `rendering_condition` field is a
  `MultipleChoiceBlock` whose API representation joins picked slugs into that same string, so the
  wrapper accepts both for resilience if that join is ever dropped).

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
- `enabled` is false everywhere but `openstax.org`. Don't move that check into `beforeSend`:
  session envelopes skip `beforeSend`, so dev and staging would still skew release health.
- Noise filtering lives in four lists. `ignoreErrors` stays in `sentry.js`: Sentry
  substring-matches it against the whole exception value, which is too broad to reuse. The other
  three are in `src/app/helpers/exception-filters.ts` so PostHog gets them too — `ignoreMessages`
  (substring match, applied in `beforeSend`), `denyFrameSchemes` (drops an exception whose every
  stack frame is a browser-extension url, including Safari's `webkit-masked-url://`), and
  `denyUrls` (script origin). Use `denyUrls`, not `ignoreUrls` — the latter was removed in SDK v7
  and silently does nothing.
- `beforeSend` also drops errors whose stack has no `/dist/` frame and whose script frames all
  come from other origins (vendor CDNs, extensions). Inline frames, which carry the page's URL,
  are kept, because GTM custom-HTML tags (consent, PostHog) and CMS embeds run that way. The
  exception is Chrome and the Google app on iOS: they inject inline scripts of their own, so
  there every stack with no `/dist/` frame is dropped.
- CMS-embedded scripts (RawHTML `embed`, which includes flex-page HTML blocks) run from `blob:`
  URLs that `activate-scripts.ts` records. `beforeSend` keeps their errors on every browser and
  tags them `cms_embed:true`, for filtering or alerting. A `blob:` URL is used rather than
  `//# sourceURL` because WebKit ignores `sourceURL` in stacks, and a `sourceURL` on another
  origin makes WebKit mute the error entirely.
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
- Source maps are uploaded by CodeBuild, not GitHub Actions (`bit-deployment`
  `cfn/fe_project.yml`). After `script/build production` it runs `posthog-cli sourcemap process`,
  then `sentry-cli sourcemaps inject` and `upload` on `dist/`, under release
  `osweb@$RELEASE_VERSION` (the release tag). `sentry.js` builds the same string from
  `process.env.RELEASE_VERSION`. Tokens come from SSM `/shared/codebuild/*`. If one is missing the
  build warns and skips the upload, so a release can ship unsymbolicated without failing.

## Error reporting (PostHog)

- PostHog is loaded by a tag inside the GTM container, not by this bundle, so `window.posthog` is
  the only handle on it and it only exists once `initializeGTM()` has run (which itself only
  happens off the K12 portal).
- `src/app/helpers/posthog-exceptions.ts` polls for that global and installs a `before_send` hook
  applying the shared filters from `exception-filters.ts`. Without it, exception autocapture
  reports everything Sentry has been told to ignore.
- Anywhere we start handling a rejection that used to go unhandled, report it deliberately with
  both `Sentry.captureException` and this module's `captureException` — handling it removes it
  from both tools' unhandled-rejection capture.
