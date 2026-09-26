export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse-soft rounded-lg bg-surface-raised ${className}`} />;
}

export function PosterSkeleton() {
  return <Skeleton className="aspect-[2/3] w-full" />;
}

export function RailSkeleton({ count = 8 }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="aspect-[2/3] w-32 shrink-0 xs:w-36 sm:w-44" />
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="aspect-[2/3] w-full">
          <div className="h-full w-full animate-pulse-soft rounded-xl bg-surface-raised" />
        </div>
      ))}
    </div>
  );
}
