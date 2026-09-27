# Contributing to CineHub

Thanks for your interest in contributing. Small, focused changes win.

## How to contribute

1. Open an issue first for anything large (new pages, new data sources, auth).
2. Branch from `main`: `git checkout -b feat/short-description`
3. Run the checks below before opening a PR.
4. Open a PR with the template (what changed, how you tested, screenshots for UI changes).

## Required checks

```bash
npm install
cp .env.example .env   # add your TMDB v4 read access token
npm run lint           # must be clean
npm test               # unit tests must pass
npm run build          # must build
npm run test:e2e       # smoke + responsive suites must pass
```

## Conventions

- Components are presentational; data shaping lives in `src/lib/` (unit-tested, no DOM).
- The TMDB client (`src/api/tmdb.js`) is the only module that talks to the network.
- Dark cinematic theme only; accent stays gold (`--color-accent`).
- Respect `prefers-reduced-motion`; keep tap targets at least 44px.
- Never commit `.env`, tokens, or build output — CI fails closed on secrets.

## Details

- Architecture and data flow: `docs/superpowers/specs/`
- Security policy: `SECURITY.md`
- Code of conduct: `CODE_OF_CONDUCT.md`
