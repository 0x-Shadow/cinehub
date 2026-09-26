import { Link } from "react-router-dom";
import { img, mediaType, titleOf } from "../api/tmdb.js";
import { yearOf } from "../lib/format.js";
import SearchBar from "./SearchBar.jsx";
import Reveal from "./Reveal.jsx";

export default function Hero({ title, subtitle, backdrop, items = [] }) {
  return (
    <section className="relative -mt-16 flex min-h-[88vh] items-end overflow-hidden pt-16">
      {backdrop?.backdrop_path ? (
        <>
          <img
            src={img(backdrop.backdrop_path, "original")}
            alt=""
            aria-hidden="true"
            fetchpriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/60 to-canvas/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas/80 via-transparent to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-surface to-canvas" />
      )}

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:px-6">
        <Reveal>
          <h1 className="font-display max-w-3xl text-5xl leading-[1.05] text-ink sm:text-6xl md:text-7xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">{subtitle}</p> : null}
        </Reveal>
        <Reveal className="mt-8">
          <SearchBar autoFocus />
        </Reveal>

        {items.length > 0 ? (
          <Reveal className="mt-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-faint">Trending now</p>
            <div className="rail -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {items.slice(0, 10).map((item) => (
                <Link
                  key={`${item.id}-${item.title ?? item.name}`}
                  to={`/${mediaType(item)}/${item.id}`}
                  className="group flex shrink-0 items-center gap-3 rounded-full border border-border bg-black/40 py-1.5 pl-1.5 pr-4 backdrop-blur transition hover:border-faint"
                >
                  {item.poster_path ? (
                    <img src={img(item.poster_path, "w200")} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : null}
                  <span className="max-w-40 truncate text-sm font-medium text-ink group-hover:text-accent">
                    {titleOf(item)}
                  </span>
                  <span className="text-xs tabular text-faint">{yearOf(item.release_date ?? item.first_air_date)}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
