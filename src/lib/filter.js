const byDate = (a, b) => {
  const da = a.release_date ?? a.first_air_date ?? "";
  const db = b.release_date ?? b.first_air_date ?? "";
  return db.localeCompare(da);
};

const byTitle = (a, b) =>
  (a.title ?? a.name ?? "").localeCompare(b.title ?? b.name ?? "");

export function sortTitles(items, key = "popularity") {
  const list = [...items];
  switch (key) {
    case "rating":
      return list.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
    case "date":
      return list.sort(byDate);
    case "title":
      return list.sort(byTitle);
    case "popularity":
    default:
      return list.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  }
}

export function filterByGenre(items, genreIds) {
  if (!genreIds?.length) return items;
  return items.filter((item) => item.genre_ids?.some((id) => genreIds.includes(id)));
}

export function filterByYear(items, { from = null, to = null } = {}) {
  return items.filter((item) => {
    const iso = item.release_date ?? item.first_air_date;
    if (!iso) return false;
    const year = iso.slice(0, 4);
    if (from && year < from) return false;
    if (to && year > to) return false;
    return true;
  });
}

export function groupByGenre(items, genres) {
  return genres
    .map((genre) => ({
      genre,
      items: sortTitles(
        items.filter((item) => item.genre_ids?.includes(genre.id)),
        "rating"
      ),
    }))
    .filter((group) => group.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);
}

export function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function take(items, n) {
  return items.slice(0, Math.max(0, n));
}
