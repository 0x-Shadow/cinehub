import { useEffect, useRef } from "react";

export default function useInfiniteScroll({ hasNext, loading, onLoadMore, rootMargin = "600px" }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) onLoadMore?.();
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNext, loading, onLoadMore, rootMargin]);

  return sentinelRef;
}
