const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export class TmdbError extends Error {
  constructor(status, message) {
    super(message ?? `TMDB request failed (${status})`);
    this.name = "TmdbError";
    this.status = status;
  }
}

const token = () => import.meta.env.VITE_ACCESS_TOKEN ?? "";

export function img(path, size = "w500") {
  if (!path) return "";
  return `${IMAGE_BASE}/${size}${path}`;
}

export function mediaType(item) {
  if (item.media_type === "movie" || item.media_type === "tv") return item.media_type;
  return item.title ? "movie" : "tv";
}

export function titleOf(item) {
  return item.title ?? item.name ?? "Untitled";
}

export async function fetchJson(path, params = {}) {
  const parts = ["language=en-GB"];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    parts.push(`${encodeURIComponent(key)}=${String(value)}`);
  }

  const response = await fetch(`${BASE_URL}${path}?${parts.join("&")}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body?.status_message) message = body.status_message;
    } catch {
      /* keep the default message */
    }
    throw new TmdbError(response.status, message);
  }
  return response.json();
}

const LRU_MAX = 256;
const cache = new Map();

function cached(key, load) {
  if (cache.has(key)) {
    const value = cache.get(key);
    cache.delete(key);
    cache.set(key, value);
    return value;
  }
  const promise = load();
  cache.set(key, promise);
  promise.finally(() => {
    if (cache.size > LRU_MAX) {
      const oldest = cache.keys().next().value;
      if (oldest !== undefined) cache.delete(oldest);
    }
  });
  return promise;
}

const DETAIL_APPEND = "credits,videos,recommendations,similar,watch/providers,external_ids";

export function movieList(sort = "popular", { page = 1, genreIds = [] } = {}) {
  const params = {
    page,
    with_genres: genreIds.length ? genreIds.join(",") : undefined,
    sort_by: sort,
  };
  const key = `movie/list:${JSON.stringify(params)}`;
  return cached(key, () => fetchJson("/discover/movie", params));
}

export function tvList(sort = "popularity.desc", { page = 1, genreIds = [] } = {}) {
  const params = {
    page,
    with_genres: genreIds.length ? genreIds.join(",") : undefined,
    sort_by: sort,
  };
  const key = `tv/list:${JSON.stringify(params)}`;
  return cached(key, () => fetchJson("/discover/tv", params));
}

export function trending(mediaType, window = "week") {
  return cached(`trending:${mediaType}:${window}`, () =>
    fetchJson(`/trending/${mediaType}/${window}`)
  );
}

export function movieDetails(id) {
  return cached(`movie:${id}`, () =>
    fetchJson(`/movie/${id}`, { append_to_response: DETAIL_APPEND })
  );
}

export function tvDetails(id) {
  return cached(`tv:${id}`, () =>
    fetchJson(`/tv/${id}`, { append_to_response: DETAIL_APPEND })
  );
}

export function searchMulti(query, { page = 1 } = {}) {
  return fetchJson("/search/multi", { query, page, include_adult: "false" });
}

let genresPromise = null;
export function listGenres() {
  if (!genresPromise) {
    genresPromise = fetchJson("/genre/movie/list").then(async (movie) => {
      const tv = await fetchJson("/genre/tv/list");
      return { movie: movie.genres, tv: tv.genres };
    });
  }
  return genresPromise;
}

export async function creditsTop(credits, n = 12) {
  return (credits?.cast ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .slice(0, n);
}

export function videosTrailer(videos) {
  const results = videos?.results ?? [];
  return (
    results.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    results.find((v) => v.site === "YouTube") ??
    null
  );
}

export function watchProviders(providers) {
  const us = providers?.results?.US;
  if (!us) return null;
  return {
    link: us.link ?? null,
    flatrate: us.flatrate ?? [],
    rent: us.rent ?? [],
    buy: us.buy ?? [],
  };
}
