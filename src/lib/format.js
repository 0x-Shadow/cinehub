const DASH = "—";

export function formatRuntime(minutes) {
  if (!minutes || minutes <= 0) return DASH;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatDate(iso, locale = "en-GB") {
  if (!iso) return DASH;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return DASH;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatMoney(n) {
  if (!n || n <= 0) return DASH;
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function roundRating(n) {
  if (!n || n <= 0) return undefined;
  return Math.round(n * 10) / 10;
}

export function yearOf(iso) {
  if (!iso) return DASH;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return DASH;
  return String(date.getFullYear());
}

export function pluralise(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}
