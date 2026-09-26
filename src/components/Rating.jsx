import { roundRating } from "../lib/format.js";

const SIZES = {
  sm: "h-7 w-7 text-[11px]",
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
    return <span className="text-sm tabular text-faint">—</span>;
  }

  if (size === "sm") {
    return (
      <span
        className="inline-flex items-center rounded-md bg-surface-raised px-1.5 py-0.5 text-[11px] font-semibold tabular"
        style={{ color: tone(rating) }}
      >
        {rating.toFixed(1)}
      </span>
    );
  }

  const dimension = size === "lg" ? 56 : 40;
  const stroke = size === "lg" ? 4 : 3;

  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full ${SIZES[size]}`}
      style={{
        background: `conic-gradient(${tone(rating)} ${(rating / 10) * 360}deg, var(--color-surface-raised) 0deg)`,
      }}
      role="img"
      aria-label={`Rated ${rating} out of 10`}
    >
      <span
        className="flex items-center justify-center rounded-full bg-canvas"
        style={{ width: dimension - stroke * 2, height: dimension - stroke * 2 }}
      >
        <span className="tabular font-semibold">{rating.toFixed(1)}</span>
      </span>
    </span>
  );
}
