import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

const COLUMNS = [
  {
    title: "Discover",
    links: [
      { label: "Movies", to: "/movies" },
      { label: "TV Shows", to: "/tvshows" },
      { label: "Search", to: "/search" },
      { label: "Top Rated", to: "/movies?sort=top_rated" },
    ],
  },
  {
    title: "Your Library",
    links: [
      { label: "Watchlist", to: "/library?tab=watchlist" },
      { label: "Favourites", to: "/library?tab=favorites" },
      { label: "Import / Export", to: "/library?tab=data" },
    ],
  },
  {
    title: "About",
    links: [{ label: "CineHub", to: "/" }],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-canvas">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">
              Discover movies and TV shows, build a watchlist, and find your next favourite.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted underline-offset-4 transition hover:text-ink hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            Product data courtesy of{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline-offset-2 transition hover:text-ink hover:underline"
            >
              TMDB
            </a>
            . This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p>&copy; {new Date().getFullYear()} CineHub.</p>
        </div>
      </div>
    </footer>
  );
}
