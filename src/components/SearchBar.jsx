import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { img, mediaType, titleOf } from "../api/tmdb.js";
import { yearOf } from "../lib/format.js";
import useDebounced from "../hooks/useDebounced.js";

export default function SearchBar({ autoFocus = false, placeholder = "Search movies and TV…", onNavigate }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const debounced = useDebounced(query, 250);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(
      `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(debounced.trim())}&include_adult=false`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
          accept: "application/json",
        },
      }
    )
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => {
        if (cancelled) return;
        setResults(
          (data.results ?? [])
            .filter((i) => i.media_type === "movie" || i.media_type === "tv")
            .slice(0, 6)
        );
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setResults([]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  useEffect(() => {
    const onClick = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (item) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    const type = mediaType(item);
    onNavigate?.();
    navigate(`/${type}/${item.id}`);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    onNavigate?.();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={submit} role="search">
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((h) => Math.min(h + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, -1));
            }
            if (e.key === "Enter" && highlight >= 0 && results[highlight]) {
              e.preventDefault();
              go(results[highlight]);
            }
            if (e.key === "Esc") setOpen(false);
          }}
          placeholder={placeholder}
          aria-label="Search movies and TV shows"
          className="w-full rounded-full border border-border bg-surface/80 py-3 pl-5 pr-12 text-sm text-ink placeholder:text-faint backdrop-blur transition focus:border-accent focus:outline-none"
        />
      </form>

      {open && query.trim() ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          {loading && !results.length ? (
            <div className="px-4 py-6 text-center text-sm text-muted">Searching…</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted">No results for “{query.trim()}”.</div>
          ) : (
            <ul role="listbox">
              {results.map((item, i) => (
                <li key={`${item.id}-${item.media_type}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === highlight}
                    onClick={() => go(item)}
                    onMouseEnter={() => setHighlight(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                      i === highlight ? "bg-surface-raised" : ""
                    }`}
                  >
                    {item.poster_path ? (
                      <img src={img(item.poster_path, "w200")} alt="" className="h-14 w-10 rounded-md object-cover" />
                    ) : (
                      <div className="h-14 w-10 rounded-md bg-surface-raised" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{titleOf(item)}</span>
                      <span className="block text-xs text-faint">
                        {item.media_type === "movie" ? "Movie" : "TV"} · {yearOf(item.release_date ?? item.first_air_date)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
