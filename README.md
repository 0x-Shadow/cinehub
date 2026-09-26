# CineHub

A cinematic movie and TV discovery app. Build a watchlist, browse by genre,
search everything, and let a short onboarding pick surface titles you'll like.

## Stack

React 19 · Vite 7 · Tailwind CSS 4 · react-router-dom 7 · TMDB API

## Getting started

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

## Deployment

GitHub Actions builds and deploys to GitHub Pages on every push to `main`.
Add a repository secret named `TMDB_ACCESS_TOKEN` with your v4 read token.
