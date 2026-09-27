import { useMemo, useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "./PageShell.jsx";
import LibraryTabs from "../components/LibraryTabs.jsx";
import PosterGrid from "../components/PosterGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Chip from "../components/Chip.jsx";
import { genreBreakdown, sortLibrary } from "../lib/library.js";
import useLibrary from "../hooks/useLibrary.js";
import useTmdb from "../hooks/useTmdb.js";
import { listGenres, movieDetails, tvDetails } from "../api/tmdb.js";

export default function Library() {
  const { watchlist, favorites, exportData, importData, clearAll } = useLibrary();
  const [params] = useSearchParams();
  const tab = params.get("tab") ?? "watchlist";
  const [sort, setSort] = useState("addedAt");
  const fileRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);
  const [runtimes, setRuntimes] = useState({});

  const genresQuery = useTmdb(() => listGenres(), []);
  const allGenres = useMemo(
    () => [...(genresQuery.data?.movie ?? []), ...(genresQuery.data?.tv ?? [])],
    [genresQuery.data]
  );

  const list = tab === "watchlist" ? watchlist : favorites;
  const sorted = useMemo(() => sortLibrary(list, sort), [list, sort]);
  const breakdown = useMemo(() => genreBreakdown(list, allGenres), [list, allGenres]);

  useEffect(() => {
    const missing = list.filter((e) => !e.runtime && !runtimes[e.id]);
    if (!missing.length) return;
    let cancelled = false;
    missing.forEach((entry) => {
      const fetcher = entry.mediaType === "movie" ? movieDetails(entry.id) : tvDetails(entry.id);
      fetcher
        .then((data) => {
          if (cancelled) return;
          const runtime = data.runtime ?? data.episode_run_time?.[0] ?? 0;
          setRuntimes((r) => ({ ...r, [entry.id]: runtime }));
        })
        .catch(() => {});
    });
    return () => { cancelled = true; };
  }, [list, runtimes]);

  const hours = useMemo(() => {
    const total = list.reduce((sum, e) => sum + (e.runtime ?? runtimes[e.id] ?? 0), 0);
    return { hours: Math.floor(total / 60), minutes: total % 60 };
  }, [list, runtimes]);

  const doExport = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cinehub-library.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const doExportTemplate = () => {
    const items = sorted.slice(0, 6);
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Watchlist - CineHub</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
    background: #0a0a0b;
    color: #f5f5f7;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 32px;
    max-width: 420px;
    width: 100%;
    backdrop-filter: blur(20px);
  }
  .header { text-align: center; margin-bottom: 24px; }
  .logo { font-size: 14px; font-weight: 600; color: #ffb020; letter-spacing: 0.05em; text-transform: uppercase; }
  h1 { font-size: 28px; font-weight: 700; margin-top: 8px; letter-spacing: -0.02em; }
  .subtitle { font-size: 14px; color: #a1a1aa; margin-top: 4px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .poster { aspect-ratio: 2/3; border-radius: 12px; overflow: hidden; background: #1c1c21; }
  .poster img { width: 100%; height: 100%; object-fit: cover; }
  .poster-title { font-size: 11px; color: #a1a1aa; margin-top: 6px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .stats { display: flex; justify-content: center; gap: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); }
  .stat { text-align: center; }
  .stat-value { font-size: 20px; font-weight: 700; color: #ffb020; }
  .stat-label { font-size: 11px; color: #6b6b76; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
  .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b6b76; }
</style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">CineHub</div>
      <h1>My Watchlist</h1>
      <p class="subtitle">${items.length} titles &middot; ${hours.hours}h ${hours.minutes}m of watching</p>
    </div>
    <div class="grid">
      ${items.map((e) => `
        <div>
          <div class="poster">
            <img src="https://image.tmdb.org/t/p/w300${e.posterPath}" alt="${e.title}" loading="lazy">
          </div>
          <p class="poster-title">${e.title}</p>
        </div>
      `).join("")}
    </div>
    <div class="stats">
      <div class="stat">
        <div class="stat-value">${watchlist.length}</div>
        <div class="stat-label">Watchlist</div>
      </div>
      <div class="stat">
        <div class="stat-value">${favorites.length}</div>
        <div class="stat-label">Favourites</div>
      </div>
      <div class="stat">
        <div class="stat-value">${hours.hours}h</div>
        <div class="stat-label">Watch Time</div>
      </div>
    </div>
    <p class="footer">Made with CineHub &middot; cinehub.app</p>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cinehub-watchlist.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(String(reader.result));
      setImportStatus(ok ? "Library imported." : "Could not import that file.");
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  const doClear = () => {
    if (window.confirm("Clear your entire library? This cannot be undone.")) clearAll();
  };

  return (
    <PageShell title="Your Library" description="Your watchlist, favourites, and data.">
      <div className="space-y-10 py-10">
        <h1 className="font-display text-4xl text-ink">Your Library</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Watchlist" value={watchlist.length} />
          <StatCard label="Favourites" value={favorites.length} />
          <StatCard label="Watch hours" value={`${hours.hours}h ${hours.minutes}m`} />
        </div>

        <LibraryTabs>
          {(active) => {
            if (active === "data") {
              return (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" onClick={doExport} className="tap-target glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-white/10 transition hover:ring-white/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      Export JSON
                    </button>
                    <button type="button" onClick={doExportTemplate} className="tap-target glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-accent ring-1 ring-accent/30 transition hover:ring-accent/50">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      Export Template
                    </button>
                    <button type="button" onClick={() => fileRef.current?.click()} className="tap-target glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-white/10 transition hover:ring-white/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      Import JSON
                    </button>
                    <button type="button" onClick={doClear} className="tap-target glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-negative ring-1 ring-negative/30 transition hover:ring-negative/50">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Clear library
                    </button>
                    <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={doImport} />
                  </div>
                  {importStatus ? <p className="text-sm text-muted">{importStatus}</p> : null}
                  <p className="text-xs text-faint">Export saves your watchlist, favourites, and taste profile to a JSON file you can re-import later.</p>
                </div>
              );
            }
            return (
              <>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "addedAt", label: "Recently added" },
                    { key: "title", label: "Title" },
                    { key: "rating", label: "Rating" },
                    { key: "date", label: "Release date" },
                  ].map((s) => (
                    <Chip key={s.key} active={sort === s.key} onClick={() => setSort(s.key)}>
                      {s.label}
                    </Chip>
                  ))}
                </div>

                {sorted.length === 0 ? (
                  <EmptyState
                    title={active === "watchlist" ? "Your watchlist is empty" : "No favourites yet"}
                    message={active === "watchlist" ? "Tap the bookmark on any poster to add it here." : "Tap the heart on any poster to favourite it."}
                  />
                ) : (
                  <>
                    {breakdown.length ? (
                      <div className="flex flex-wrap gap-2">
                        {breakdown.slice(0, 8).map((g) => (
                          <span key={g.name} className="glass-soft rounded-full px-3 py-1 text-xs text-muted ring-1 ring-white/5">
                            {g.name} &middot; {g.count}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <PosterGrid items={sorted} />
                  </>
                )}
              </>
            );
          }}
        </LibraryTabs>
      </div>
    </PageShell>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="glass-card card-lift rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-faint">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular text-ink">{value}</p>
    </div>
  );
}
