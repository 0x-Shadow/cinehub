import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "./PageShell.jsx";
import PosterGrid from "../components/PosterGrid.jsx";
import Chip from "../components/Chip.jsx";
import EmptyState from "../components/EmptyState.jsx";
import useTmdb from "../hooks/useTmdb.js";
import useDebounced from "../hooks/useDebounced.js";
import { mediaType, searchMulti } from "../api/tmdb.js";
import { uniqueById } from "../lib/filter.js";

const TYPES = [
  { key: "all", label: "All" },
  { key: "movie", label: "Movies" },
  { key: "tv", label: "TV Shows" },
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);
  const [type, setType] = useState("all");
  const debounced = useDebounced(input, 250);

  useEffect(() => {
    setInput(q);
  }, [q]);

  const query = useTmdb(
    () =>
      debounced.trim()
        ? searchMulti(debounced.trim(), { page: 1 })
        : Promise.resolve({ results: [] }),
    [debounced]
  );

  const results = useMemo(() => {
    const all = query.data?.results ?? [];
    const filtered = type === "all" ? all : all.filter((i) => mediaType(i) === type);
    return uniqueById(filtered);
  }, [query.data, type]);

  return (
    <PageShell title={q ? `Search: ${q}` : "Search"} description="Search movies and TV shows.">
      <div className="space-y-8 py-10">
        <h1 className="font-display text-4xl text-ink">Search</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setParams(input.trim() ? { q: input.trim() } : {});
          }}
          role="search"
          className="flex gap-3"
        >
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search movies and TV shows..."
            aria-label="Search"
            autoFocus
            className="w-full rounded-full border border-border bg-surface px-5 py-3 text-sm text-ink placeholder:text-faint transition focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="tap-target shrink-0 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-ink transition hover:brightness-110"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <Chip key={t.key} active={type === t.key} onClick={() => setType(t.key)}>
              {t.label}
            </Chip>
          ))}
        </div>

        {query.loading ? (
          <PosterGrid items={[]} loading skeletonCount={12} />
        ) : query.error ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">{query.error}</div>
        ) : !debounced.trim() ? (
          <EmptyState title="Start typing to search" message="Search across movies and TV shows." />
        ) : results.length === 0 ? (
          <EmptyState title={`No results for "${debounced.trim()}"`} message="Try a different title, or check the spelling." />
        ) : (
          <>
            <p className="text-sm text-muted">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            <PosterGrid items={results} />
          </>
        )}
      </div>
    </PageShell>
  );
}
