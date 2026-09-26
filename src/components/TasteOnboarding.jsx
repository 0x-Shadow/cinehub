import { useMemo, useState } from "react";
import { img, titleOf, mediaType } from "../api/tmdb.js";
import { makeEntry } from "../lib/library.js";
import useTmdb from "../hooks/useTmdb.js";
import { trending } from "../api/tmdb.js";

export default function TasteOnboarding({ onComplete }) {
  const { data } = useTmdb(() => trending("all", "week"), []);
  const pool = useMemo(() => (data?.results ?? []).slice(0, 16), [data]);
  const [liked, setLiked] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [done, setDone] = useState(false);

  const pick = (item) => {
    const entry = makeEntry(titleOf(item), mediaType(item), item.id, item.poster_path, {
      vote_average: item.vote_average,
    });
    if (liked.some((e) => e.id === entry.id)) return;
    setLiked((l) => {
      const next = [...l, entry];
      if (next.length >= 4) setDone(true);
      return next;
    });
  };

  const skip = (item) => setSkipped((s) => [...s, item.id]);

  const finish = () => onComplete(liked, skipped);

  if (!pool.length) {
    return <div className="py-16 text-center text-sm text-muted">Loading picks…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">
          Step 1 of 1 — pick at least 4
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Tap the ones you'd watch</h2>
        <p className="mt-1 text-sm text-muted">We'll use these to tune your home rail and search ranking.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {pool.map((item) => {
          const isLiked = liked.some((e) => e.id === item.id);
          return (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl border transition ${
                isLiked ? "border-accent" : "border-border"
              }`}
            >
              <button type="button" onClick={() => pick(item)} className="block w-full">
                {item.poster_path ? (
                  <img
                    src={img(item.poster_path, "w300")}
                    alt={titleOf(item)}
                    className="aspect-[2/3] w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full bg-surface-raised" />
                )}
              </button>
              <button
                type="button"
                onClick={() => skip(item)}
                aria-label={`Skip ${titleOf(item)}`}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition group-hover:opacity-100"
              >
                ✕
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="truncate text-xs font-medium text-white">{titleOf(item)}</p>
                <p className="text-[10px] text-white/60">{item.media_type === "movie" ? "Movie" : "TV"}</p>
              </div>
              {isLiked ? (
                <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-ink">
                  ✓
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {liked.length} selected · {skipped.length} skipped
        </p>
        <button
          type="button"
          onClick={finish}
          disabled={!done}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-ink transition enabled:hover:brightness-110 disabled:opacity-40"
        >
          {done ? "Done" : `Pick ${4 - liked.length} more`}
        </button>
      </div>
    </div>
  );
}
