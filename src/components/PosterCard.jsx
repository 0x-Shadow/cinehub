import { Link } from "react-router-dom";
import { img, mediaType, titleOf } from "../api/tmdb.js";
import { yearOf } from "../lib/format.js";
import { makeEntry } from "../lib/library.js";
import Rating from "./Rating.jsx";
import useLibrary from "../hooks/useLibrary.js";

const SIZES = {
  sm: "w-28 xs:w-32 sm:w-36",
  md: "w-36 sm:w-40 md:w-44",
  lg: "w-44 sm:w-48 md:w-52",
};

export function BookmarkIcon({ filled = false }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function HeartIcon({ filled = false }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconButton({ children, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`tap-target flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ease-[var(--ease-apple)] ${
        active
          ? "scale-110 bg-accent text-accent-ink shadow-lg shadow-accent/30"
          : "bg-black/60 text-white hover:scale-105 hover:bg-black/80"
      }`}
    >
      {children}
    </button>
  );
}

export default function PosterCard({ item, size = "md", showRating = true, priority = false }) {
  const { toggleWatchlist, isWatchlisted, toggleFavorite, isFavorite } = useLibrary();
  const type = mediaType(item);
  const inWatchlist = isWatchlisted(item.id, type);
  const isFav = isFavorite(item.id, type);

  const posterPath = item.posterPath ?? item.poster_path;
  const base = makeEntry(titleOf(item), type, item.id, posterPath, {
    vote_average: item.vote_average,
  });

  return (
    <div className={`group relative shrink-0 ${SIZES[size]}`}>
      <Link
        to={`/${type}/${item.id}`}
        className="card-lift shine relative block overflow-hidden rounded-xl bg-surface ring-1 ring-border"
        aria-label={titleOf(item)}
      >
        {posterPath ? (
          <img
            src={img(posterPath, size === "sm" ? "w300" : "w500")}
            alt={titleOf(item)}
            loading={priority ? "eager" : "lazy"}
            fetchpriority={priority ? "high" : "auto"}
            className="aspect-[2/3] w-full object-cover transition duration-500 ease-[var(--ease-apple)] group-hover:scale-[1.03] group-hover:brightness-[.65]"
            width={size === "sm" ? 300 : 500}
            height={size === "sm" ? 450 : 750}
          />
        ) : (
          <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl bg-surface-raised">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-faint" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition duration-300 group-hover:opacity-100" />
      </Link>

      <div className="absolute left-2 top-2 flex flex-col gap-1.5 opacity-0 transition duration-300 ease-[var(--ease-apple)] group-hover:opacity-100">
        <IconButton
          label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          active={inWatchlist}
          onClick={() => toggleWatchlist(base)}
        >
          <BookmarkIcon filled={inWatchlist} />
        </IconButton>
        <IconButton
          label={isFav ? "Remove from favourites" : "Add to favourites"}
          active={isFav}
          onClick={() => toggleFavorite(base)}
        >
          <HeartIcon filled={isFav} />
        </IconButton>
      </div>

      {showRating ? (
        <div className="absolute bottom-2 left-2 transition duration-300 group-hover:scale-110">
          <Rating value={item.vote_average} size="sm" />
        </div>
      ) : null}

      <div className="mt-2 px-0.5">
        <p className="truncate text-sm font-medium text-ink transition group-hover:text-accent">
          {titleOf(item)}
        </p>
        <p className="text-xs tabular text-faint">{yearOf(item.release_date ?? item.first_air_date)}</p>
      </div>
    </div>
  );
}
