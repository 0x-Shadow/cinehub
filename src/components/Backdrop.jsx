import { img } from "../api/tmdb.js";
import { formatDate, formatRuntime } from "../lib/format.js";
import { makeEntry } from "../lib/library.js";
import useLibrary from "../hooks/useLibrary.js";
import Rating from "./Rating.jsx";
import { BookmarkIcon, HeartIcon } from "./PosterCard.jsx";

export default function Backdrop({ title, subtitle, backdropPath, posterPath, rating, genres = [], runtime, date, overview, mediaType, id }) {
  const { toggleWatchlist, isWatchlisted, toggleFavorite, isFavorite } = useLibrary();
  const inWatchlist = isWatchlisted(id, mediaType);
  const isFav = isFavorite(id, mediaType);
  const action = makeEntry(title, mediaType, id, posterPath, { vote_average: rating, release_date: date });

  return (
    <section className="relative -mt-16 overflow-hidden pt-16">
      {backdropPath ? (
        <>
          <img src={img(backdropPath, "original")} alt="" aria-hidden="true" fetchpriority="high" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/70 to-canvas/30" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-surface to-canvas" />
      )}

      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-40 sm:px-6 sm:pt-52">
        <div className="flex flex-col gap-8 md:flex-row md:items-end">
          {posterPath ? (
            <img
              src={img(posterPath, "w500")}
              alt={`${title} poster`}
              className="mx-auto w-48 shrink-0 rounded-2xl shadow-2xl sm:w-56 md:mx-0"
              width={500}
              height={750}
            />
          ) : (
            <div className="mx-auto aspect-[2/3] w-48 shrink-0 rounded-2xl bg-surface-raised sm:w-56 md:mx-0" />
          )}

          <div className="min-w-0 flex-1 text-center md:text-left">
            <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
            {subtitle ? <p className="mt-2 text-lg text-muted">{subtitle}</p> : null}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 md:justify-start">
              {rating ? <Rating value={rating} size="md" /> : null}
              {date ? <span className="text-sm tabular text-muted">{formatDate(date)}</span> : null}
              {runtime ? <span className="text-sm tabular text-muted">{formatRuntime(runtime)}</span> : null}
              {genres.length ? (
                <span className="flex flex-wrap justify-center gap-2 md:justify-start">
                  {genres.map((g) => (
                    <span key={g.id} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                      {g.name}
                    </span>
                  ))}
                </span>
              ) : null}
            </div>

            {overview ? <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{overview}</p> : null}

            <div className="mt-7 flex items-center justify-center gap-3 md:justify-start">
              <button
                type="button"
                onClick={() => toggleWatchlist(action)}
                aria-pressed={inWatchlist}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  inWatchlist ? "bg-accent text-accent-ink" : "bg-surface-raised text-ink hover:bg-surface"
                }`}
              >
                <BookmarkIcon filled={inWatchlist} />
                {inWatchlist ? "In watchlist" : "Watchlist"}
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(action)}
                aria-pressed={isFav}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  isFav ? "border-accent text-accent" : "border-border text-ink hover:border-faint"
                }`}
              >
                <HeartIcon filled={isFav} />
                Favourite
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
