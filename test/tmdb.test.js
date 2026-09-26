import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  creditsTop,
  fetchJson,
  img,
  mediaType,
  searchMulti,
  titleOf,
  tvDetails,
  videosTrailer,
  watchProviders,
} from "../src/api/tmdb.js";

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function firstUrl() {
  const call = global.fetch.mock.calls[0];
  return call ? call[0] : undefined;
}

describe("img", () => {
  it("builds an image url", () => {
    expect(img("/a.jpg", "w500")).toBe("https://image.tmdb.org/t/p/w500/a.jpg");
  });
  it("returns an empty string for a missing path", () => {
    expect(img(null)).toBe("");
    expect(img(undefined)).toBe("");
  });
});

describe("mediaType", () => {
  it("reads an explicit media_type", () => {
    expect(mediaType({ media_type: "tv" })).toBe("tv");
  });
  it("infers from fields", () => {
    expect(mediaType({ title: "Dune" })).toBe("movie");
    expect(mediaType({ name: "The Office" })).toBe("tv");
  });
});

describe("titleOf", () => {
  it("prefers title over name", () => {
    expect(titleOf({ title: "A", name: "B" })).toBe("A");
  });
});

describe("fetchJson", () => {
  it("sends the bearer token", async () => {
    global.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: 1 }) });
    await fetchJson("/movie/popular");
    const url = firstUrl();
    const init = global.fetch.mock.calls[0][1];
    expect(String(url)).toContain("api.themoviedb.org/3/movie/popular");
    expect(init.headers.Authorization).toContain("Bearer ");
  });
  it("throws TmdbError on a non-2xx", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ status_message: "Invalid token" }),
    });
    await expect(fetchJson("/x")).rejects.toMatchObject({ status: 401 });
  });
});

describe("searchMulti (regression for B1/B2)", () => {
  it("hits the multi-search endpoint and awaits parsed json", async () => {
    const payload = { results: [{ id: 5, media_type: "tv", name: "The Office" }] };
    global.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => payload });
    const data = await searchMulti("office");
    const url = firstUrl();
    expect(String(url)).toContain("/search/multi");
    expect(String(url)).toContain("query=office");
    expect(data).toEqual(payload);
    expect(data.results).toHaveLength(1);
  });
});

describe("tvDetails", () => {
  it("requests tv details with appends", async () => {
    global.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ id: 1 }) });
    await tvDetails(1);
    const url = firstUrl();
    expect(String(url)).toContain("/tv/1");
    expect(String(url)).toContain("append_to_response=");
  });
});

describe("creditsTop", () => {
  it("returns the top billed cast", async () => {
    const credits = {
      cast: Array.from({ length: 20 }, (_, i) => ({ id: i, name: `C${i}`, order: i })),
    };
    expect(await creditsTop(credits)).toHaveLength(12);
  });
  it("handles missing credits", async () => {
    expect(await creditsTop({})).toEqual([]);
  });
});

describe("videosTrailer", () => {
  it("prefers a YouTube Trailer", () => {
    const videos = {
      results: [
        { key: "a", site: "YouTube", type: "Teaser" },
        { key: "b", site: "YouTube", type: "Trailer" },
      ],
    };
    expect(videosTrailer(videos)).toMatchObject({ key: "b" });
  });
  it("returns null with no videos", () => {
    expect(videosTrailer({ results: [] })).toBeNull();
  });
});

describe("watchProviders", () => {
  it("returns null when there are no providers", () => {
    expect(watchProviders(null)).toBeNull();
    expect(watchProviders({})).toBeNull();
  });
  it("reads the US flatrate list", () => {
    const providers = {
      results: { US: { link: "https://tmdb", flatrate: [{ provider_name: "Netflix" }] } },
    };
    const parsed = watchProviders(providers);
    expect(parsed.link).toBe("https://tmdb");
    expect(parsed.flatrate).toEqual([{ provider_name: "Netflix" }]);
  });
});
