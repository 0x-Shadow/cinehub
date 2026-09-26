# CineHub Design Spec

**Date:** 2026-09-26
**Source repo:** MoviesHub (React 19 + Vite 7 + Tailwind CSS 4 + react-router-dom 7 + TMDB API)
**Target:** `github.com/0x-Shadow/cinehub`, deployed to GitHub Pages

---

## 1. Goal

Turn the current MoviesHub skeleton into a genuinely useful, beautiful movie & TV
discovery app that people will actually want to use. The current code is a
non-functional scaffold with real defects (see §2). This is a full product
rebuild: new design system, new architecture, new features, new deployment.

### Non-negotiable outcomes

1. Every existing bug is fixed, with a regression test where the bug was logic.
2. The UI is visually excellent and deliberately designed — not a template.
3. A feature set people actually want (watchlist, detail pages, real search).
4. Deploys cleanly to GitHub Pages via CI and works on first load.
5. Mobile-first, accessible, 60fps.

---

## 2. Current state — defects being fixed

| # | Location | Defect |
|---|----------|--------|
| B1 | `hooks/useSearchTvShows.js` | Calls `search/movie` instead of `search/tv` |
| B2 | `hooks/useSearchTvShows.js` | `const data = response.json()` without `await` → stores a **Promise** in state |
| B3 | `pages/TvShows.jsx` | Destructures `Loading:` (capital L); hook returns `loading` → TV search dead |
| B4 | `components/Header.jsx` | Links to `/login` and `/get-started`; **neither route exists** → blank page |
| B5 | `.env` | Live TMDB access token committed, not gitignored → **credential leak** |
| B6 | `pages/Home.jsx` | `py-60` is not a valid Tailwind class → hero height collapses |
| B7 | `components/Header.jsx`, `Footer.jsx` | Logo is a hotlinked Unsplash URL → breaks offline, unbranded |
| B8 | all hooks | `console.log(response)` / `console.log(data)` noise in production code |
| B9 | `App.jsx` | Dead file; not imported anywhere |
| B10 | `main.jsx` | No 404 route → any unknown path renders a blank page |
| B11 | `pages/Movies.jsx` | Search renders only `results[0]` in a yellow alert box |
| B12 | `components/Footer.jsx` | ~12 dead `to="#"` links → 404s and jank |
| B13 | everywhere | No loading skeletons, no empty states, no error recovery |

---

## 3. Design language

**Cinematic dark, Apple-grade restraint.** The posters are the content; the chrome
recedes. One accent, generous negative space, one display face for headlines,
spring-eased motion, 60fps scroll.

### 3.1 Color

| Token | Value | Role |
|-------|-------|------|
| `canvas` | `#0a0a0b` | page background |
| `surface` | `#131316` | cards, rails, inputs |
| `surface-raised` | `#1c1c21` | hover surfaces, modals |
| `border` | `rgba(255,255,255,.08)` | hairline dividers, card edges |
| `text` | `#f5f5f7` | primary (Apple off-white) |
| `text-muted` | `#a1a1aa` | secondary |
| `text-faint` | `#6b6b76` | tertiary, captions |
| `accent` | `#ffb020` | warm marquee gold — active states, highlights |
| `accent-ink` | `#0a0a0b` | text on accent |
| `positive` | `#30d158` | rating ≥ 7 |
| `warning` | `#ffd60a` | rating 4–7 |
| `negative` | `#ff453a` | rating < 4, errors |

Dark only. No light-mode toggle — it is a deliberate cinematic choice, and the
TMDB imagery is already dark-native. (A toggle doubles the QA surface for no
benefit to the core experience.)

### 3.2 Type

- **Display:** `Instrument Serif` (Google Fonts) — hero headlines, app wordmark
  on landing. Used sparingly, large, tight.
- **UI:** `Inter` — everything else. `-0.01em` tracking on headings, `tabular-nums`
  on ratings and dates so rows don't jitter.
- Scale: 12 / 14 / 16 / 20 / 28 / 40 / 56 (hero display). `clamp()` for fluid
  hero sizing.

### 3.3 Motion

- Ease: `cubic-bezier(.32,.72,0,1)` — the Apple-style decelerate.
- Card hover: `transform: scale(1.03)` + poster `filter: brightness(.75)`,
  300ms. On pointer-fine devices only.
- Entrance: `opacity 0 → 1`, `translateY(12px → 0)`, 420ms, staggered 40ms in
  rails. Applied via IntersectionObserver, once, with `use-reveal`.
- Rail scroll: `scroll-snap-type: x mandatory` on the track, snap-align start on
  cards. Hidden scrollbar.
- Scroll: `content-visibility: auto` on poster grids.
- **Honor `prefers-reduced-motion: reduce`** — all transitions become `0ms`.

### 3.4 Layout

- Max content width `1200px`, `24px` gutter (`clamp(16px, 4vw, 32px)`).
- Sticky header, `backdrop-filter: blur(20px) saturate(180%)`, translucent while
  at top, solidifies on scroll (JS-driven class).
- Hero: full-bleed backdrop with a 3-stop scrim gradient, bottom-anchored title
  in serif, inline search.
- Rails: 5-up posters (desktop), snap-scrolling.
- Poster grid: `auto-fill, minmax(160px, 1fr)`, `aspect-ratio: 2/3`.
- Detail: backdrop hero, meta row (runtime · year · rating · genres), overview,
  cast strip, trailer, similar rail.

---

## 4. Architecture

```
src/
  api/
    tmdb.js            single client: fetchJson, endpoint builders, image urls
  lib/
    format.js          formatRuntime, formatDate, formatMoney, roundRating
    storage.js         safe localStorage wrapper + namespaced keys
    library.js         watchlist/favorites selectors, taste profile, merge/sort
    filter.js          pure filter/sort/facet helpers (unit-tested)
  hooks/
    useTmdb.js         data fetch: loading | error | data, abort, refresh
    useDebounced.js
    useInfiniteScroll.js
    useLibrary.js      watchlist, favorites, taste profile, onboarding state
    useReveal.js       IntersectionObserver one-shot reveal
    useMediaQuery.js
  components/
    Header.jsx  Footer.jsx  SearchBar.jsx
    PosterCard.jsx  PosterGrid.jsx  Rail.jsx  RailRow.jsx
    Rating.jsx  Chip.jsx  Hero.jsx  Backdrop.jsx
    Skeleton.jsx  ErrorState.jsx  EmptyState.jsx  Spinner.jsx
    CastStrip.jsx  TrailerModal.jsx  LibraryTabs.jsx
    TasteOnboarding.jsx  ScrollToTop.jsx
  routes/
    Home.jsx  Movies.jsx  TvShows.jsx  Search.jsx
    Detail.jsx  Library.jsx  NotFound.jsx
  styles/
    index.css          Tailwind v4 @theme tokens + base + utilities
  App.jsx  main.jsx  Layout.jsx
test/
  filter.test.js  format.test.js  storage.test.js  library.test.js  tmdb.test.js
```

### 4.1 Data flow

```
useTmdb(endpoint, {params}) ──► api/tmdb.js ──► TMDB
                                     │
                              loading|error|data
                                     ▼
                          route component renders
                       Skeletons → grid → ErrorState
```

`useTmdb` owns an `AbortController` per fetch, dedupes in-flight requests by
endpoint+params, caches successful results in a module-level `Map` (LRU, 256
entries), and exposes `refresh()`.

### 4.2 API client (`api/tmdb.js`)

- `baseUrl = https://api.themoviedb.org/3`
- Auth: `Authorization: Bearer ${token}`, `token = import.meta.env.VITE_ACCESS_TOKEN`
- `throw new TmdbError(status, message)` with the upstream message when present.
- Image builder: `img(path, size)` → `https://image.tmdb.org/t/p/{size}{path}`
  with `w200/w300/w500/w780/original` presets. Cards use `w500`, hero `original`.
- Endpoint helpers: `movieList`, `tvList`, `trending`, `movieDetails`,
  `tvDetails`, `searchMulti`, `genreList`.
- `append_to_response` for details: `credits,videos,recommendations,similar,watch/providers`.

### 4.3 Persistence (`lib/storage.js`, `lib/library.js`)

Namespaced key `cinehub:v1`. Three slices, versioned:

```json
{
  "watchlist":  [{ "id": 123, "mediaType": "movie", "title": "…", "posterPath": "…", "addedAt": 0 }],
  "favorites":  [ … ],
  "taste":      { "likedIds": [], "skippedIds": [] },
  "onboarded":  false
}
```

- Writes go through a `StorageQuotaError`-safe wrapper; on quota failure the
  user is told, not silently dropped.
- Mutations emit a CustomEvent (`cinehub:library`) so the header badge and any
  open `Library` page update without a global store.
- Pure selectors in `lib/library.js`: `sortLibrary(list, key)`, `byGenre`,
  `byRating`, `watchHours(list)` (sum of runtimes), `tasteRecommendations`.

### 4.4 Pure, tested logic (`lib/filter.js`, `lib/format.js`)

All non-React data shaping lives here so it is unit-testable without a DOM:

- `sortTitles(items, 'popularity' | 'rating' | 'date' | 'title')`
- `filterByGenre(items, genreIds)`
- `filterByYear(items, {from, to})`
- `groupByGenre(items, genres)` → for the "browse by genre" rail
- `formatRuntime(minutes)` → `2h 14m`
- `formatDate(iso, locale)` → `Sep 2026`
- `formatMoney(n)` → `$128.4M`
- `roundRating(n)` → `7.4`

---

## 5. Routes & features

| Route | Purpose |
|-------|---------|
| `/` | Hero backdrop + trending, now playing, top rated, personal rail |
| `/movies` | Sort (popular / top rated / upcoming / now playing) + genre + infinite scroll |
| `/tvshows` | Same for TV |
| `/search` | Debounced multi-type search, type filter chips, result grid |
| `/movie/:id` | Detail: backdrop, meta, overview, cast, trailer, similar, watch providers |
| `/tv/:id` | Same for TV (seasons, episode count) |
| `/library` | Tabs: Watchlist · Favorites · Stats; export/import/clear |
| `*` | 404 with suggested titles |

### 5.1 Feature details

**Watchlist & Favorites** — the feature people actually miss. Toggle from any
poster card or detail page. Persisted to localStorage. Header shows a live
badge count. `/library` shows totals, total watch hours, genre breakdown, and
export/import/clear with confirmation.

**Taste onboarding** — first visit (and only first visit) shows a 4-step picker:
"Tap what you'd watch" over 16 mixed titles. Writes `taste.likedIds`. Drives the
home rail "Because you picked …" and boosts similar titles in search ranking.
Dismissable, re-openable from `/library`.

**Real search** — debounced 250ms, `search/multi` (movies + people + TV),
filterable by type, full grid with posters and ratings, empty and error states.
Replaces the current yellow box showing `results[0]`.

**Infinite scroll** — `useInfiniteScroll` + IntersectionObserver sentinel, 25
per page, appends with a skeleton tail. A `page` counter resets on filter change.

**Detail pages** — backdrop hero, poster, title, meta, overview, genres as
chips, rating ring, runtime/budget/revenue, cast strip (top 12), trailer modal
(similar: up to 20), "Where to watch" from `watch/providers` when available.

**404** — friendly, with three currently-trending suggestions as clickable cards.

### 5.2 Accessibility & quality

- Semantic landmarks (`header`/`nav`/`main`/`footer`), one `<h1>` per page.
- `aria-label` on icon buttons; `aria-pressed` on watchlist toggles; `aria-current`
  on nav.
- Focus-visible ring in accent gold, 2px, offset 2px.
- Keyboard: `/` focuses search; `Esc` closes trailer modal.
- All images have meaningful `alt`; decorative backdrops `aria-hidden`.
- `prefers-reduced-motion` disables all animation.
- LCP: hero backdrop uses `fetchpriority="high"`; card posters `loading="lazy"`.
- Mobile-first; tested at 360px, 768px, 1280px, 1920px.

---

## 6. Deployment

- **Router:** `BrowserRouter` + a `404.html` in `public/` that copies
  `index.html` (the standard GitHub Pages SPA trick), so deep links survive a
  refresh. `vite.config.js` sets `base: "/cinehub/"`.
- **Vite config:** `base: "/cinehub/"`, `outDir: "dist"`, `assetsInlineLimit:
  4096`, manualChunks splitting `react` / `vendor` / app.
- **CI:** `.github/workflows/deploy.yml` — Node 22, `npm ci`, `npm run build`
  with `VITE_ACCESS_TOKEN` from `${{ secrets.TMDB_ACCESS_TOKEN }}`, upload
  `dist` artifact, `actions/deploy-pages` to `github-pages` environment.
- **Security:** `.env` is gitignored. `.env.example` documents
  `VITE_ACCESS_TOKEN=` and `VITE_API_KEY=`. The workflow is the only consumer
  of the secret. The previously-leaked token must be rotated in the TMDB
  dashboard.
- **Preview:** `npm run dev` locally reads `.env`. No token → the app shows a
  clear setup screen instead of crashing.

---

## 7. Test & verification

- **Unit (Vitest):** `filter`, `format`, `storage`, `library`, `tmdb` client
  (mocked `fetch`). These cover B1–B3 as regression tests.
- **Lint:** `npm run lint` clean.
- **Build:** `npm run build` clean, bundle analysed.
- **Browser (Playwright):** desktop 1440px + mobile 390px. Assert: home rails
  render, poster grid loads, detail page opens, watchlist toggles and persists
  across reload, search returns results, `/library` totals, no console errors,
  no horizontal overflow. Screenshot review for visual quality.
- **Live:** deploy, open the published URL, verify first load and one deep link.

---

## 8. Out of scope (deliberate)

- User accounts / server sync (localStorage only, per decision).
- Server-side rendering or static generation.
- Light mode (see §3.1).
- Non-English locales.
- Subtitle/streaming integration — links out to TMDB, no playback.

---

## 9. Risks

| Risk | Mitigation |
|------|------------|
| TMDB token leaked and must rotate | User rotates; `.env` never committed; CI injects from secret |
| GitHub Pages SPA deep-link 404 | `404.html` in `public/` + verified in browser |
| TMDB rate limit / quota | LRU client cache + `retry-after` handling in `fetchJson` |
| localStorage quota exceeded | `StorageQuotaError` surfaced to user, not swallowed |
| Unsplash logo breaks offline | Replaced with an inline SVG mark |
