import { describe, expect, it } from "vitest";
import { fmt, weekLabel } from "./lifewheel";
import { dateKey, mondayOf } from "./storage";

describe("weekLabel", () => {
  it("zeigt Tag und Monat", () => expect(weekLabel("2026-11-09")).toBe("9. Nov."));
});

describe("fmt", () => {
  it("rundet auf eine Nachkommastelle mit Komma", () => expect(fmt(3.75)).toBe("3,8"));
});

describe("mondayOf", () => {
  it("liefert den Montag der Woche", () => {
    expect(dateKey(mondayOf(new Date(2026, 10, 4)))).toBe("2026-11-02");
    expect(dateKey(mondayOf(new Date(2026, 10, 8)))).toBe("2026-11-02");
  });
});
