import { describe, expect, it } from "vitest";
import {
  filterByGenre,
  filterByYear,
  groupByGenre,
  sortTitles,
  take,
  uniqueById,
} from "../src/lib/filter.js";

const items = [
  { id: 1, title: "Alpha", vote_average: 6.5, release_date: "2020-01-01", genre_ids: [28, 18] },
  { id: 2, name: "Bravo", vote_average: 8.1, first_air_date: "2022-05-05", genre_ids: [18] },
  { id: 3, title: "Charlie", vote_average: 7.0, release_date: "2024-03-03", genre_ids: [28, 18] },
];

describe("sortTitles", () => {
  it("sorts by rating descending", () => {
    expect(sortTitles(items, "rating").map((i) => i.id)).toEqual([2, 3, 1]);
  });
  it("sorts by date descending", () => {
    expect(sortTitles(items, "date").map((i) => i.id)).toEqual([3, 2, 1]);
  });
  it("sorts by title ascending", () => {
    expect(sortTitles(items, "title").map((i) => i.id)).toEqual([1, 2, 3]);
  });
  it("does not mutate the input", () => {
    const copy = [...items];
    sortTitles(items, "rating");
    expect(items.map((i) => i.id)).toEqual(copy.map((i) => i.id));
  });
});

describe("filterByGenre", () => {
  it("keeps items matching any given genre", () => {
    expect(filterByGenre(items, [28]).map((i) => i.id)).toEqual([1, 3]);
  });
  it("returns everything for no genre filter", () => {
    expect(filterByGenre(items, []).map((i) => i.id)).toEqual([1, 2, 3]);
  });
});

describe("filterByYear", () => {
  it("filters inclusively", () => {
    expect(
      filterByYear(items, { from: "2020", to: "2022" }).map((i) => i.id)
    ).toEqual([1, 2]);
  });
  it("supports an open upper bound", () => {
    expect(filterByYear(items, { from: "2024", to: null }).map((i) => i.id)).toEqual([3]);
  });
});

describe("groupByGenre", () => {
  it("buckets items by genre and sorts by count", () => {
    const genres = [
      { id: 28, name: "Action" },
      { id: 18, name: "Drama" },
    ];
    const groups = groupByGenre(items, genres);
    expect(groups[0].genre.name).toBe("Drama");
    expect(groups[0].items.map((i) => i.id)).toEqual([2, 3, 1]);
  });
});

describe("uniqueById", () => {
  it("removes duplicates by id", () => {
    expect(uniqueById([{ id: 1 }, { id: 1 }, { id: 2 }]).map((i) => i.id)).toEqual([1, 2]);
  });
});

describe("take", () => {
  it("returns the first n items", () => {
    expect(take(items, 2).map((i) => i.id)).toEqual([1, 2]);
  });
  it("is safe for n larger than the list", () => {
    expect(take(items, 99)).toHaveLength(3);
  });
});
