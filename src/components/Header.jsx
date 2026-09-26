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
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || menuOpen ? "border-border bg-canvas/90 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Primary">
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
                    `relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive ? "text-ink" : "text-muted hover:text-ink"
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
                      {isActive ? <span className="absolute inset-x-3 -bottom-0.5 h-px bg-accent" /> : null}
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
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-surface-raised"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        )}
      </nav>

      {!isDesktop && menuOpen ? (
        <div className="border-t border-border bg-canvas/95 backdrop-blur-xl">
          <ul className="space-y-1 px-4 py-4">
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
