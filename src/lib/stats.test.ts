import { describe, expect, it } from "vitest";
import { compareHabits, mean, topInsight } from "./stats";
import type { AppData } from "./storage";

const empty = (): AppData => ({ version: 1, checkins: {}, lifewheel: {}, routines: {}, videos: {}, routineLog: {}, exerciseLog: [], reflections: {} });

function build(days: number, withHabit: number, moodWith: number, moodWithout: number): AppData {
  const d = empty();
  for (let i = 0; i < days; i++) {
    const key = `2026-10-${String(i + 1).padStart(2, "0")}`;
    const has = i < withHabit;
    d.checkins[key] = { date: key, evening: { mood: (has ? moodWith : moodWithout) as 1, energy: 5, stress: 5, good: [], bad: [], habits: has ? ["bewegung"] : [], note: "" } };
  }
  return d;
}

describe("mean", () => {
  it("mittelt und gibt bei leerer Liste null", () => {
    expect(mean([2, 4])).toBe(3);
    expect(mean([])).toBeNull();
  });
});

describe("compareHabits", () => {
  it("zeigt nichts unter 14 Tagen", () => {
    expect(compareHabits(build(13, 7, 4, 3))).toEqual([]);
    expect(topInsight(build(13, 7, 4, 3))).toBeNull();
  });
  it("vergleicht Tage mit und ohne Gewohnheit", () => {
    const r = compareHabits(build(14, 7, 4, 3)).find((c) => c.habitId === "bewegung" && c.metric === "mood");
    expect(r?.withN).toBe(7);
    expect(r?.withoutN).toBe(7);
    expect(r?.diff).toBe(1);
    expect(r?.neutral).toBe(false);
  });
  it("lässt zu kleine Gruppen aus und nennt neutrale Ergebnisse", () => {
    expect(compareHabits(build(14, 3, 4, 3))).toEqual([]);
    expect(compareHabits(build(14, 7, 3, 3)).every((c) => c.neutral)).toBe(true);
  });
});
