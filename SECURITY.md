# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| `main` (latest) | Yes |
| Older commits / forks | Best effort |

## Reporting a vulnerability

Open a **private** report via GitHub Security Advisories on this repo
(Security tab → Report a vulnerability). Do not open a public issue for
security reports.

Include: what is affected, steps to reproduce, and the impact you see.
We will acknowledge within 72 hours and keep you updated on the fix.

## Secret handling

- Never commit `.env`, API tokens, or keystores. They are gitignored.
- The TMDB token is injected at CI build time via the `TMDB_ACCESS_TOKEN`
  repository secret — the only consumer is the GitHub Actions build.
- If a token was ever committed to git history, treat it as leaked:
  revoke it in the [TMDB dashboard](https://www.themoviedb.org/settings/api)
  and issue a new one.
