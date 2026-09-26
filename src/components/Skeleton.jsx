export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-surface-raised ${className}`} />;
}

export function PosterSkeleton() {
  return <Skeleton className="aspect-[2/3] w-full" />;
}

export function RailSkeleton({ count = 8 }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="aspect-[2/3] w-36 shrink-0 sm:w-44" />
      ))}
    </div>
  );
}
