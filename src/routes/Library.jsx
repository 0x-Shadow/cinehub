import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "./PageShell.jsx";
import LibraryTabs from "../components/LibraryTabs.jsx";
import PosterGrid from "../components/PosterGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Chip from "../components/Chip.jsx";
import { genreBreakdown, sortLibrary, watchHours } from "../lib/library.js";
import useLibrary from "../hooks/useLibrary.js";
import useTmdb from "../hooks/useTmdb.js";
import { listGenres } from "../api/tmdb.js";

export default function Library() {
  const { watchlist, favorites, exportData, importData, clearAll } = useLibrary();
  const [params] = useSearchParams();
  const tab = params.get("tab") ?? "watchlist";
  const [sort, setSort] = useState("addedAt");
  const fileRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);

  const genresQuery = useTmdb(() => listGenres(), []);
  const allGenres = useMemo(
    () => [...(genresQuery.data?.movie ?? []), ...(genresQuery.data?.tv ?? [])],
    [genresQuery.data]
  );

  const list = tab === "watchlist" ? watchlist : favorites;
  const sorted = useMemo(() => sortLibrary(list, sort), [list, sort]);
  const hours = useMemo(() => watchHours(list), [list]);
  const breakdown = useMemo(() => genreBreakdown(list, allGenres), [list, allGenres]);

  const doExport = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cinehub-library.json";
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
                    <button type="button" onClick={doExport} className="rounded-full border border-border px-5 py-2 text-sm font-medium text-ink transition hover:border-faint">
                      Export JSON
                    </button>
                    <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full border border-border px-5 py-2 text-sm font-medium text-ink transition hover:border-faint">
                      Import JSON
                    </button>
                    <button type="button" onClick={doClear} className="rounded-full border border-negative/40 px-5 py-2 text-sm font-medium text-negative transition hover:bg-negative/10">
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
                          <span key={g.name} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                            {g.name} · {g.count}
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
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-faint">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular text-ink">{value}</p>
    </div>
  );
}
