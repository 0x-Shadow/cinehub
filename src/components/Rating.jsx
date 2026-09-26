import { roundRating } from "../lib/format.js";

const SIZES = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

function tone(value) {
  if (value >= 7) return "var(--color-positive)";
  if (value >= 4) return "var(--color-warning)";
  return "var(--color-negative)";
}

export default function Rating({ value, size = "md" }) {
  const rating = roundRating(value);
  if (rating === undefined) {
    return <span className="text-sm tabular text-faint">--</span>;
  }

  if (size === "sm") {
    return (
      <span
        className="glass inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold tabular ring-1 ring-white/15"
        style={{ color: tone(rating) }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        {rating.toFixed(1)}
      </span>
    );
  }

  const dimension = size === "lg" ? 56 : 40;
  const stroke = size === "lg" ? 4 : 3;

  return (
    <span
      className={`glass relative inline-flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 ${SIZES[size]}`}
      style={{
        background: `conic-gradient(${tone(rating)} ${(rating / 10) * 360}deg, rgba(255,255,255,0.06) 0deg)`,
      }}
      role="img"
      aria-label={`Rated ${rating} out of 10`}
    >
      <span
        className="flex items-center justify-center rounded-full bg-canvas/80 backdrop-blur-sm"
        style={{ width: dimension - stroke * 2, height: dimension - stroke * 2 }}
      >
        <span className="tabular font-semibold">{rating.toFixed(1)}</span>
      </span>
    </span>
  );
}
