import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo.jsx";
import useHeaderScroll from "../hooks/useHeaderScroll.js";
import useLibrary from "../hooks/useLibrary.js";
import useMediaQuery from "../hooks/useMediaQuery.js";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/tvshows", label: "TV Shows" },
  { to: "/library", label: "Library", badge: true },
];

export default function Header() {
  const scrolled = useHeaderScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const { counts } = useLibrary();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled || menuOpen ? "glass border-border" : "border-transparent"
      }`}
    >
      <nav
        className={`mx-auto flex items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
          scrolled ? "h-14" : "h-16"
        }`}
        aria-label="Primary"
      >
        <Link to="/" className="shrink-0" aria-label="CineHub home">
          <Logo />
        </Link>

        {isDesktop ? (
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `tap-target relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-surface-raised text-ink"
                        : "text-muted hover:bg-surface hover:text-ink"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {item.badge && counts.watchlist + counts.favorites > 0 ? (
                        <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold tabular text-accent-ink">
                          {counts.watchlist + counts.favorites}
                        </span>
                      ) : null}
                      {isActive ? (
                        <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-accent" />
                      ) : null}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="tap-target flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-surface-raised"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        )}
      </nav>

      {!isDesktop ? (
        <div
          className={`overflow-hidden transition-all duration-300 ease-[var(--ease-apple)] ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="space-y-1 px-4 pb-4 pt-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                      isActive ? "bg-surface-raised text-ink" : "text-muted hover:bg-surface hover:text-ink"
                    }`
                  }
                >
                  {item.label}
                  {item.badge && counts.watchlist + counts.favorites > 0 ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold tabular text-accent-ink">
                      {counts.watchlist + counts.favorites}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
