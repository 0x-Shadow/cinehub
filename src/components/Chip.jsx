export default function Chip({ children, active = false, onClick, className = "" }) {
  const base =
    "inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition";
  const tone = active
    ? "border-accent bg-accent text-accent-ink"
    : "border-border bg-surface text-muted hover:border-faint hover:text-ink";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`${base} ${tone} cursor-pointer ${className}`}
      >
        {children}
      </button>
    );
  }
  return <span className={`${base} ${tone} ${className}`}>{children}</span>;
}
