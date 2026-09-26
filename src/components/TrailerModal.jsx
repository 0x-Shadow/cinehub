import { useEffect, useRef } from "react";

export default function TrailerModal({ video, title, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!video) return null;

  const src =
    video.site === "YouTube"
      ? `https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0`
      : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} trailer`}
    >
      <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <p className="truncate text-sm font-medium text-ink">{title} — Official trailer</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close trailer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-raised text-ink transition hover:bg-surface"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {src ? (
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
            <iframe
              src={src}
              title={`${title} trailer`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-2xl border border-border bg-surface text-sm text-muted">
            Trailer unavailable in this browser.
          </div>
        )}
      </div>
    </div>
  );
}
