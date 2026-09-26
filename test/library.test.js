import { describe, expect, it } from "vitest";
import {
  addToList,
  emptyLibrary,
  genreBreakdown,
  isInList,
  loadLibrary,
  makeEntry,
  removeFromList,
  saveLibrary,
  sortLibrary,
  watchHours,
} from "../src/lib/library.js";
import { STORAGE_PREFIX } from "../src/lib/storage.js";

const KEY = `${STORAGE_PREFIX}library`;

describe("library persistence", () => {
  it("loads an empty library by default", () => {
    expect(loadLibrary()).toEqual(emptyLibrary());
  });
  it("saves and reloads", () => {
    const lib = { ...emptyLibrary(), watchlist: [makeEntry("Dune", "movie", 1, "/p.jpg")] };
    expect(saveLibrary(lib)).toBe(true);
    expect(loadLibrary().watchlist).toHaveLength(1);
  });
});

describe("list mutations", () => {
  it("adds entries idempotently", () => {
    const entry = makeEntry("Dune", "movie", 1, "/p.jpg");
    const list = addToList([], entry);
    expect(list).toHaveLength(1);
    expect(addToList(list, entry)).toHaveLength(1);
  });
  it("removes entries by id and mediaType", () => {
    let list = addToList([], makeEntry("Dune", "movie", 1, "/p.jpg"));
    list = addToList(list, makeEntry("The Office", "tv", 2, "/t.jpg"));
    list = removeFromList(list, 1, "movie");
    expect(list.map((e) => e.id)).toEqual([2]);
  });
  it("checks membership by id and mediaType", () => {
    const list = addToList([], makeEntry("Dune", "movie", 1, "/p.jpg"));
    expect(isInList(list, 1, "movie")).toBe(true);
    expect(isInList(list, 1, "tv")).toBe(false);
  });
});

describe("sortLibrary", () => {
  const list = [
    makeEntry("Bravo", "movie", 2, "/b.jpg", { vote_average: 8, addedAt: 20 }),
    makeEntry("Alpha", "movie", 1, "/a.jpg", { vote_average: 9, addedAt: 10 }),
  ];
  it("sorts by addedAt descending by default", () => {
    expect(sortLibrary(list, "addedAt").map((e) => e.id)).toEqual([2, 1]);
  });
  it("sorts by title", () => {
    expect(sortLibrary(list, "title").map((e) => e.id)).toEqual([1, 2]);
  });
  it("does not mutate input", () => {
    const copy = [...list];
    sortLibrary(list, "title");
    expect(list).toEqual(copy);
  });
});

describe("watchHours", () => {
  it("sums runtimes", () => {
    const list = [
      makeEntry("A", "movie", 1, "/a.jpg", { runtime: 120 }),
      makeEntry("B", "movie", 2, "/b.jpg", { runtime: 90 }),
    ];
    expect(watchHours(list)).toEqual({ hours: 3, minutes: 30 });
  });
  it("ignores missing runtimes", () => {
    expect(watchHours([makeEntry("A", "movie", 1, "/a.jpg")])).toEqual({ hours: 0, minutes: 0 });
  });
});

describe("genreBreakdown", () => {
  const genres = [
    { id: 28, name: "Action" },
    { id: 18, name: "Drama" },
  ];
  const list = [
    makeEntry("A", "movie", 1, "/a.jpg", { genre_ids: [28, 18] }),
    makeEntry("B", "movie", 2, "/b.jpg", { genre_ids: [28] }),
  ];
  it("counts and sorts genres", () => {
    expect(genreBreakdown(list, genres)).toEqual([
      { name: "Action", count: 2 },
      { name: "Drama", count: 1 },
    ]);
  });
});

describe("makeEntry", () => {
  it("normalizes fields", () => {
    const entry = makeEntry("Dune", "movie", 1, "/p.jpg", { vote_average: 8.2 });
    expect(entry).toMatchObject({
      id: 1,
      mediaType: "movie",
      title: "Dune",
      posterPath: "/p.jpg",
      vote_average: 8.2,
      addedAt: expect.any(Number),
    });
  });
});
