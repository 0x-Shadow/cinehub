import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "./PageShell.jsx";
import Backdrop from "../components/Backdrop.jsx";
import CastStrip from "../components/CastStrip.jsx";
import TrailerModal from "../components/TrailerModal.jsx";
import WatchProviders from "../components/WatchProviders.jsx";
import Rail from "../components/Rail.jsx";
import ErrorState from "../components/ErrorState.jsx";
import useTmdb from "../hooks/useTmdb.js";
import { movieDetails, tvDetails, creditsTop, videosTrailer } from "../api/tmdb.js";
import { titleOf } from "../api/tmdb.js";
import { formatMoney, formatRuntime } from "../lib/format.js";

export default function Detail() {
  const { type, id } = useParams();
  const isMovie = type === "movie";
  const [trailerOpen, setTrailerOpen] = useState(false);

  const query = useTmdb(
    () => (isMovie ? movieDetails(Number(id)) : tvDetails(Number(id))),
    [type, id]
  );

  const cast = useMemo(() => creditsTop(query.data?.credits), [query.data?.credits]);
  const trailer = useMemo(() => videosTrailer(query.data?.videos), [query.data?.videos]);

  if (query.loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-16 h-[60vh] animate-pulse rounded-2xl bg-surface" />
      </main>
    );
  }
  if (query.error || !query.data) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <ErrorState title="Couldn't load this title" message={query.error} onRetry={query.refresh} />
      </main>
    );
  }

  const d = query.data;
  const runtime = d.runtime ?? d.episode_run_time?.[0];
  const date = d.release_date ?? d.first_air_date;
  const similar = d.similar?.results ?? [];
  const recommendations = d.recommendations?.results ?? [];

  return (
    <PageShell title={titleOf(d)} description={d.overview?.slice(0, 160)}>
      <Backdrop
        title={titleOf(d)}
        subtitle={d.tagline}
        backdropPath={d.backdrop_path}
        posterPath={d.poster_path}
        rating={d.vote_average}
        genres={d.genres ?? []}
        runtime={runtime}
        date={date}
        overview={d.overview}
        mediaType={isMovie ? "movie" : "tv"}
        id={d.id}
      />

      <div className="space-y-12 py-10">
        {trailer ? (
          <button
            type="button"
            onClick={() => setTrailerOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-surface-raised px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch trailer
          </button>
        ) : null}

        <section className="grid gap-8 sm:grid-cols-3" aria-label="Details">
          <DetailStat label="Status" value={d.status} />
          <DetailStat
            label={isMovie ? "Runtime" : "Seasons"}
            value={isMovie ? formatRuntime(runtime) : String(d.number_of_seasons ?? "—")}
          />
          <DetailStat label="Episodes" value={isMovie ? "—" : String(d.number_of_episodes ?? "—")} />
          {isMovie ? (
            <>
              <DetailStat label="Budget" value={formatMoney(d.budget)} />
              <DetailStat label="Revenue" value={formatMoney(d.revenue)} />
            </>
          ) : null}
          <DetailStat label="Language" value={d.original_language?.toUpperCase()} />
        </section>

        <CastStrip cast={cast} />
        <WatchProviders providers={d.watch?.providers} />

        {similar.length > 0 ? <Rail title="Similar titles" items={similar} href="/search" /> : null}
        {recommendations.length > 0 ? <Rail title="Recommended" items={recommendations} href="/search" /> : null}
      </div>

      {trailerOpen ? <TrailerModal video={trailer} title={titleOf(d)} onClose={() => setTrailerOpen(false)} /> : null}
    </PageShell>
  );
}

function DetailStat({ label, value }) {
  if (!value || value === "—") return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-faint">{label}</p>
      <p className="mt-1 text-sm tabular text-ink">{value}</p>
    </div>
  );
}
