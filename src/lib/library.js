import { STORAGE_PREFIX, readJSON, writeJSON } from "./storage.js";

export const LIBRARY_KEY = `${STORAGE_PREFIX}library`;

export function emptyLibrary() {
  return {
    watchlist: [],
    favorites: [],
    taste: { likedIds: [], skippedIds: [] },
    onboarded: false,
  };
}

export function loadLibrary() {
  const stored = readJSON(LIBRARY_KEY, {});
  const base = emptyLibrary();
  return {
    watchlist: Array.isArray(stored.watchlist) ? stored.watchlist : base.watchlist,
    favorites: Array.isArray(stored.favorites) ? stored.favorites : base.favorites,
    taste: { ...base.taste, ...(stored.taste ?? {}) },
    onboarded: Boolean(stored.onboarded),
  };
}

export function saveLibrary(lib) {
  return writeJSON(LIBRARY_KEY, lib);
}

export function makeEntry(title, mediaType, id, posterPath, extra = {}) {
  return {
    id,
    mediaType,
    title,
    posterPath,
    addedAt: Date.now(),
    ...extra,
  };
}

export function addToList(list, entry) {
  if (isInList(list, entry.id, entry.mediaType)) return list;
  return [...list, entry];
}

export function removeFromList(list, id, mediaType) {
  return list.filter((e) => !(e.id === id && e.mediaType === mediaType));
}

export function isInList(list, id, mediaType) {
  return list.some((e) => e.id === id && e.mediaType === mediaType);
}

export function sortLibrary(list, key = "addedAt") {
  const sorted = [...list];
  if (key === "addedAt") return sorted.sort((a, b) => b.addedAt - a.addedAt);
  if (key === "title") return sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (key === "rating")
    return sorted.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
  if (key === "date") {
    return sorted.sort((a, b) => {
      const da = a.release_date ?? a.first_air_date ?? "";
      const db = b.release_date ?? b.first_air_date ?? "";
      return db.localeCompare(da);
    });
  }
  return sorted;
}

export function watchHours(list) {
  const total = list.reduce((sum, e) => sum + (e.runtime ?? 0), 0);
  return { hours: Math.floor(total / 60), minutes: total % 60 };
}

export function genreBreakdown(list, genres) {
  const counts = new Map();
  for (const entry of list) {
    for (const gid of entry.genre_ids ?? []) {
      counts.set(gid, (counts.get(gid) ?? 0) + 1);
    }
  }
  return genres
    .map((g) => ({ name: g.name, count: counts.get(g.id) ?? 0 }))
    .filter((g) => g.count > 0)
    .sort((a, b) => b.count - a.count);
}
