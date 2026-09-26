import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatMoney,
  formatRuntime,
  pluralise,
  roundRating,
  yearOf,
} from "../src/lib/format.js";

describe("formatRuntime", () => {
  it("formats hours and minutes", () => {
    expect(formatRuntime(134)).toBe("2h 14m");
  });
  it("formats minutes only", () => {
    expect(formatRuntime(45)).toBe("45m");
  });
  it("handles zero and missing values", () => {
    expect(formatRuntime(0)).toBe("—");
    expect(formatRuntime(undefined)).toBe("—");
    expect(formatRuntime(null)).toBe("—");
  });
});

describe("formatDate", () => {
  it("formats an ISO date", () => {
    const formatted = formatDate("2026-09-26");
    expect(formatted).toContain("26");
    expect(formatted).toContain("2026");
  });
  it("handles invalid input", () => {
    expect(formatDate("not-a-date")).toBe("—");
    expect(formatDate(undefined)).toBe("—");
  });
});

describe("formatMoney", () => {
  it("abbreviates large amounts", () => {
    expect(formatMoney(128400000)).toBe("$128.4M");
    expect(formatMoney(2500000000)).toBe("$2.5B");
  });
  it("handles zero", () => {
    expect(formatMoney(0)).toBe("—");
  });
});

describe("roundRating", () => {
  it("rounds to one decimal", () => {
    expect(roundRating(7.456)).toBe(7.5);
    expect(roundRating(7)).toBe(7);
  });
  it("returns undefined for missing or zero", () => {
    expect(roundRating(undefined)).toBeUndefined();
    expect(roundRating(0)).toBeUndefined();
  });
});

describe("yearOf", () => {
  it("extracts the year", () => {
    expect(yearOf("2026-09-26")).toBe("2026");
  });
  it("handles invalid input", () => {
    expect(yearOf("nope")).toBe("—");
  });
});

describe("pluralise", () => {
  it("chooses the right form", () => {
    expect(pluralise(1, "season", "seasons")).toBe("1 season");
    expect(pluralise(2, "season", "seasons")).toBe("2 seasons");
  });
});
