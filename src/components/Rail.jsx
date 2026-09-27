import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import PosterCard from "./PosterCard.jsx";
import { RailSkeleton } from "./Skeleton.jsx";

export default function Rail({ title, items = [], size = "md", showRating = true, href, loading = false, skeletonCount = 8 }) {
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const checkScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 8;
    setHasOverflow(overflow);
    setCanScrollLeft(overflow && el.scrollLeft > 8);
    setCanScrollRight(overflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, items.length, loading]);

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
        {href ? (
          <Link to={href} className="shrink-0 text-sm font-medium text-muted transition hover:text-accent">
            View all
          </Link>
        ) : null}
      </div>
      <div className="relative">
        <div
          ref={railRef}
          onScroll={checkScroll}
          className="rail rail-mask -mx-4 flex gap-4 overflow-x-auto scroll-smooth px-4 pb-2 xs:mx-0 xs:px-0 sm:mx-0 sm:px-0"
        >
          {items.map((item) => (
            <PosterCard key={`${item.id}-${item.title ?? item.name}`} item={item} size={size} showRating={showRating} />
          ))}
        </div>
        {hasOverflow ? (
          <>
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              aria-label={`Scroll ${title} left`}
              className={`tap-target glass absolute -left-1 top-[38%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink ring-1 ring-white/15 transition-all duration-300 sm:opacity-0 sm:group-hover/rail:opacity-100 ${
                canScrollLeft ? "hover:scale-105" : "pointer-events-none opacity-0"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              aria-label={`Scroll ${title} right`}
              className={`tap-target glass absolute -right-1 top-[38%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink ring-1 ring-white/15 transition-all duration-300 sm:opacity-0 sm:group-hover/rail:opacity-100 ${
                canScrollRight ? "hover:scale-105" : "pointer-events-none opacity-0"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}
