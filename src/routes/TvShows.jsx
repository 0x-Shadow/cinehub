import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "./PageShell.jsx";
import PosterGrid from "../components/PosterGrid.jsx";
import Chip from "../components/Chip.jsx";
import useTmdb from "../hooks/useTmdb.js";
import useInfiniteScroll from "../hooks/useInfiniteScroll.js";
import { listGenres, tvList } from "../api/tmdb.js";
import { filterByGenre, sortTitles } from "../lib/filter.js";

const SORTS = [
  { key: "popularity.desc", label: "Popular" },
  { key: "vote_average.desc", label: "Top rated" },
  { key: "first_air_date.desc", label: "New releases" },
  { key: "on_the_air", label: "On air" },
];

export default function TvShows() {
  const [params, setParams] = useSearchParams();
  const sort = params.get("sort") ?? "popularity.desc";
  const genre = params.get("genre");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);

  const genresQuery = useTmdb(() => listGenres(), []);
  const query = useTmdb(
    () => tvList(sort, { page, genreIds: genre ? [Number(genre)] : [] }),
    [sort, genre, page]
  );

  useEffect(() => {
    setItems(query.data?.results ?? []);
    setPage(1);
  }, [query.data?.results, query.data?.page, sort, genre]);

  const hasNext = useMemo(
    () => (query.data ? query.data.page < query.data.total_pages : false),
    [query.data]
  );

  const loadMore = useCallback(() => {
    if (!hasNext || query.loading) return;
    setPage((p) => p + 1);
  }, [hasNext, query.loading]);

  const sentinelRef = useInfiniteScroll({ hasNext, loading: query.loading, onLoadMore: loadMore });

  const filtered = useMemo(() => {
    const list = genre ? filterByGenre(items, [Number(genre)]) : items;
    return sortTitles(list, sort.includes("vote_average") ? "rating" : "popularity");
  }, [items, genre, sort]);

  return (
    <PageShell title="TV Shows" description="Browse popular, top rated, and on-air TV shows.">
      <div className="space-y-8 py-10">
        <h1 className="font-display text-4xl text-ink">TV Shows</h1>
        <div className="flex flex-wrap items-center gap-2">
          {SORTS.map((s) => (
            <Chip
              key={s.key}
              active={sort === s.key}
              onClick={() => setParams({ sort: s.key, ...(genre ? { genre } : {}) })}
            >
              {s.label}
            </Chip>
          ))}
        </div>

        {genresQuery.data?.tv?.length ? (
          <div className="flex flex-wrap gap-2">
            <Chip active={!genre} onClick={() => setParams({ sort })}>
              All genres
            </Chip>
            {genresQuery.data.tv.map((g) => (
              <Chip key={g.id} active={genre === String(g.id)} onClick={() => setParams({ sort, genre: g.id })}>
                {g.name}
              </Chip>
            ))}
          </div>
        ) : null}

        {query.loading && items.length === 0 ? (
          <PosterGrid items={[]} loading skeletonCount={12} />
        ) : query.error ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">{query.error}</div>
        ) : (
          <PosterGrid items={filtered} />
        )}

        {query.loading && items.length > 0 ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : null}
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      </div>
    </PageShell>
  );
}
