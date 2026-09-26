import { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import PosterCard from "./PosterCard.jsx";
import { RailSkeleton } from "./Skeleton.jsx";

export default function Rail({ title, items = [], size = "md", showRating = true, href, loading = false, skeletonCount = 8 }) {
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const scroll = (dir) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

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
    <section className="group/rail space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <div className="flex items-center gap-3">
          {href ? (
            <Link to={href} className="shrink-0 text-sm font-medium text-muted transition hover:text-accent">
              View all
            </Link>
          ) : null}
          <div className="hidden gap-1.5 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="tap-target flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition hover:border-faint hover:text-ink disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="tap-target flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition hover:border-faint hover:text-ink disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        ref={railRef}
        onScroll={checkScroll}
        className="rail rail-mask -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 xs:mx-0 xs:px-0 sm:mx-0 sm:px-0"
      >
        {items.map((item) => (
          <PosterCard key={`${item.id}-${item.title ?? item.name}`} item={item} size={size} showRating={showRating} />
        ))}
      </div>
    </section>
  );
}
