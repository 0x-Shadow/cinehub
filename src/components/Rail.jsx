import { Link } from "react-router-dom";
import PosterCard from "./PosterCard.jsx";
import { RailSkeleton } from "./Skeleton.jsx";

export default function Rail({ title, items = [], size = "md", showRating = true, href, loading = false, skeletonCount = 8 }) {
  if (loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <RailSkeleton count={skeletonCount} />
      </section>
    );
  }
  if (!items.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {href ? (
          <Link to={href} className="shrink-0 text-sm font-medium text-muted transition hover:text-accent">
            View all
          </Link>
        ) : null}
      </div>
      <div className="rail -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {items.map((item) => (
          <PosterCard key={`${item.id}-${item.title ?? item.name}`} item={item} size={size} showRating={showRating} />
        ))}
      </div>
    </section>
  );
}
