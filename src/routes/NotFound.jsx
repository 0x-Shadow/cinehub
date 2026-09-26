import { Link } from "react-router-dom";
import PageShell from "./PageShell.jsx";
import PosterCard from "../components/PosterCard.jsx";
import useTmdb from "../hooks/useTmdb.js";
import { trending } from "../api/tmdb.js";

export default function NotFound() {
  const { data } = useTmdb(() => trending("all", "week"), []);
  const suggestions = (data?.results ?? []).slice(0, 3);

  return (
    <PageShell title="Page not found" description="The page you're looking for doesn't exist.">
      <div className="space-y-10 py-16 text-center">
        <div>
          <p className="font-display text-7xl text-faint">404</p>
          <h1 className="mt-4 text-2xl font-semibold text-ink">This page doesn't exist</h1>
          <p className="mt-2 text-sm text-muted">The link may be broken, or the page may have moved.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110"
        >
          Back to home
        </Link>
        {suggestions.length ? (
          <div className="pt-8 text-left">
            <p className="mb-4 text-sm font-semibold text-ink">Trending right now</p>
            <div className="flex gap-4">
              {suggestions.map((item) => (
                <div key={item.id} className="w-36">
                  <PosterCard item={item} size="md" />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
