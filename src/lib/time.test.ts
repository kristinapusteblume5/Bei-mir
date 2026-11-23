import { describe, expect, it } from "vitest";
import { dateKey } from "./storage";
import { activeDate, eveningTile, isOpen } from "./time";

describe("Zeitfenster", () => {
  it("Morgen ab 5:00", () => {
    expect(isOpen("morning", new Date(2026, 10, 4, 4, 59))).toBe(false);
    expect(isOpen("morning", new Date(2026, 10, 4, 5, 0))).toBe(true);
  });
  it("Abend ab 18:00 bis 4:59", () => {
    expect(isOpen("evening", new Date(2026, 10, 4, 17, 59))).toBe(false);
    expect(isOpen("evening", new Date(2026, 10, 4, 18, 0))).toBe(true);
    expect(isOpen("evening", new Date(2026, 10, 5, 0, 30))).toBe(true);
    expect(isOpen("evening", new Date(2026, 10, 5, 5, 0))).toBe(false);
  });
  it("nach Mitternacht zählt noch der Vortag", () => {
    expect(dateKey(activeDate(new Date(2026, 10, 5, 0, 30)))).toBe("2026-11-04");
    expect(dateKey(activeDate(new Date(2026, 10, 5, 5, 0)))).toBe("2026-11-05");
  });
});

describe("Abendkachel", () => {
  it("löst die Morgenroutine ab 17 Uhr ab", () => {
    expect(eveningTile(new Date(2026, 10, 13, 16, 59))).toBe(false);
    expect(eveningTile(new Date(2026, 10, 13, 17, 0))).toBe(true);
    expect(eveningTile(new Date(2026, 10, 14, 4, 59))).toBe(true);
    expect(eveningTile(new Date(2026, 10, 14, 5, 0))).toBe(false);
  });
});
