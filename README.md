# CineHub

A cinematic movie and TV discovery app. Browse trending titles, build a
watchlist, and share it as a story-ready image.

**Live demo:** https://0x-shadow.github.io/cinehub/

## Features

- **Discover** — trending movies and TV shows, genre and sort filters, infinite scroll
- **Search** — debounced multi-type search across movies and TV
- **Detail pages** — cast, trailers, watch providers, similar and recommended titles
- **Watchlist & favourites** — persisted locally, with genre breakdown and watch-time stats
- **Taste onboarding** — pick titles you like to seed your library
- **Share as image** — one-tap 1080×1920 story PNG with hero spotlight and glass stats
- **Dark cinematic UI** — Apple-style motion, glass surfaces, mobile-first responsive

## Tech stack

React 19 · Vite 7 · Tailwind CSS 4 · react-router-dom 7 · TMDB API · Vitest · Playwright

## Quickstart

```bash
npm install
cp .env.example .env   # add your TMDB v4 read access token
npm run dev
```

Get a token at <https://www.themoviedb.org/settings/api>.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run unit tests |
| `npm run lint` | Lint |
| `npm run test:e2e` | Run Playwright end-to-end tests |

## Project structure

| Path | Purpose |
| --- | --- |
| `src/api/` | TMDB client with LRU cache |
| `src/lib/` | Pure logic: formatting, filtering, library store, PNG export |
| `src/hooks/` | Data fetching, infinite scroll, library state, reveal-on-scroll |
| `src/components/` | Presentational UI components |
| `src/routes/` | Pages: home, movies, TV, search, detail, library, 404 |
| `test/` | Vitest unit tests and Playwright specs |

## Deployment

GitHub Actions builds and deploys to GitHub Pages on every push to `main`.
Add a repository secret named `TMDB_ACCESS_TOKEN` with your v4 read token.

## Security

- Never commit `.env` — it is gitignored. Use `.env.example` as the template.
- The CI build is the only consumer of `TMDB_ACCESS_TOKEN`.
- If a token was ever committed to git, revoke it in the TMDB dashboard and issue a new one.

## Attribution

Product data courtesy of [TMDB](https://www.themoviedb.org/). This product
uses the TMDB API but is not endorsed or certified by TMDB.

## License

MIT — see [LICENSE](LICENSE).
