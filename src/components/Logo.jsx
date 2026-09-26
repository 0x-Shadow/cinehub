export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
        <rect width="32" height="32" rx="8" fill="#0a0a0b" />
        <rect x="7" y="12" width="18" height="10" rx="2" fill="none" stroke="#ffb020" strokeWidth="2" />
        <path d="M12 12l-3-4h6l-3 4zM20 12l-3-4h6l-3 4z" fill="#ffb020" />
      </svg>
      <span className="font-display text-xl leading-none text-ink">CineHub</span>
    </span>
  );
}
