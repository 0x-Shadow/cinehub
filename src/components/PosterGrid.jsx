import PosterCard from "./PosterCard.jsx";
import { GridSkeleton } from "./Skeleton.jsx";

export default function PosterGrid({ items, size = "md", showRating = true, loading = false, skeletonCount = 12 }) {
  if (loading && items.length === 0) {
    return <GridSkeleton count={skeletonCount} />;
  }
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 xs:grid-cols-3 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item, i) => (
        <div key={`${item.id}-${item.title ?? item.name}`} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }} className="animate-[fadeIn_400ms_var(--ease-apple)_both]">
          <PosterCard item={item} size={size} showRating={showRating} />
        </div>
      ))}
    </div>
  );
}
