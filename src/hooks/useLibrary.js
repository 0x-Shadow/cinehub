import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addToList,
  emptyLibrary,
  isInList,
  loadLibrary,
  removeFromList,
  saveLibrary,
} from "../lib/library.js";

const LIBRARY_EVENT = "cinehub:library";

function notify() {
  window.dispatchEvent(new CustomEvent(LIBRARY_EVENT, { detail: loadLibrary() }));
}

export default function useLibrary() {
  const [library, setLibrary] = useState(loadLibrary);

  useEffect(() => {
    const onUpdate = (event) => setLibrary(event.detail ?? loadLibrary());
    window.addEventListener(LIBRARY_EVENT, onUpdate);
    return () => window.removeEventListener(LIBRARY_EVENT, onUpdate);
  }, []);

  const persist = useCallback((next) => {
    setLibrary(next);
    saveLibrary(next);
    notify();
  }, []);

  const addToWatchlist = useCallback(
    (entry) => persist({ ...library, watchlist: addToList(library.watchlist, entry) }),
    [library, persist]
  );

  const removeFromWatchlist = useCallback(
    (id, mediaType) =>
      persist({ ...library, watchlist: removeFromList(library.watchlist, id, mediaType) }),
    [library, persist]
  );

  const addToFavorites = useCallback(
    (entry) => persist({ ...library, favorites: addToList(library.favorites, entry) }),
    [library, persist]
  );

  const removeFromFavorites = useCallback(
    (id, mediaType) =>
      persist({ ...library, favorites: removeFromList(library.favorites, id, mediaType) }),
    [library, persist]
  );

  const recordTaste = useCallback(
    (likedIds, skippedIds = []) =>
      persist({
        ...library,
        taste: {
          likedIds: [...library.taste.likedIds, ...likedIds],
          skippedIds: [...library.taste.skippedIds, ...skippedIds],
        },
      }),
    [library, persist]
  );

  const completeOnboarding = useCallback(
    () => persist({ ...library, onboarded: true }),
    [library, persist]
  );

  const clearAll = useCallback(() => persist(emptyLibrary()), [persist]);

  const exportData = useCallback(() => JSON.stringify(library, null, 2), [library]);

  const importData = useCallback(
    (json) => {
      try {
        const parsed = JSON.parse(json);
        persist({ ...emptyLibrary(), ...parsed });
        return true;
      } catch {
        return false;
      }
    },
    [persist]
  );

  const counts = useMemo(
    () => ({ watchlist: library.watchlist.length, favorites: library.favorites.length }),
    [library]
  );

  return {
    library,
    ...library,
    counts,
    addToWatchlist,
    removeFromWatchlist,
    isWatchlisted: (id, mediaType) => isInList(library.watchlist, id, mediaType),
    toggleWatchlist: (entry) =>
      isInList(library.watchlist, entry.id, entry.mediaType)
        ? removeFromWatchlist(entry.id, entry.mediaType)
        : addToWatchlist(entry),
    addToFavorites,
    removeFromFavorites,
    isFavorite: (id, mediaType) => isInList(library.favorites, id, mediaType),
    toggleFavorite: (entry) =>
      isInList(library.favorites, entry.id, entry.mediaType)
        ? removeFromFavorites(entry.id, entry.mediaType)
        : addToFavorites(entry),
    recordTaste,
    completeOnboarding,
    clearAll,
    exportData,
    importData,
  };
}
