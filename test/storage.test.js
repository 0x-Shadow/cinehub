import { describe, expect, it } from "vitest";
import { readJSON, removeKey, STORAGE_PREFIX, writeJSON } from "../src/lib/storage.js";

function key(name) {
  return STORAGE_PREFIX + name;
}

describe("storage", () => {
  it("writes and reads JSON", () => {
    writeJSON(key("test"), { a: 1 });
    expect(readJSON(key("test"), null)).toEqual({ a: 1 });
  });
  it("returns the fallback for a missing key", () => {
    expect(readJSON(key("nope"), { fallback: true })).toEqual({ fallback: true });
  });
  it("returns the fallback for corrupt JSON", () => {
    localStorage.setItem(key("bad"), "{not json");
    expect(readJSON(key("bad"), [])).toEqual([]);
  });
  it("does not throw when JSON is unserializable", () => {
    expect(() => writeJSON(key("loop"), circular())).not.toThrow();
  });
  it("removes a key", () => {
    writeJSON(key("gone"), 1);
    removeKey(key("gone"));
    expect(readJSON(key("gone"), null)).toBeNull();
  });
});

function circular() {
  const o = {};
  o.self = o;
  return o;
}
