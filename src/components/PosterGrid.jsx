import PosterCard from "./PosterCard.jsx";

export default function PosterGrid({ items, size = "md", showRating = true, loading = false, skeletonCount = 12 }) {
  if (loading && items.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className="aspect-[2/3] w-full animate-pulse rounded-xl bg-surface-raised" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <PosterCard key={`${item.id}-${item.title ?? item.name}`} item={item} size={size} showRating={showRating} />
      ))}
    </div>
  );
}
