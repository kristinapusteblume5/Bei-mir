import { beforeEach, describe, expect, it } from "vitest";
import { clearAll, exportJson, importieren, loadData, saveDay, sicherungFaellig, sicherungNotiert } from "./storage";

// Ein schlichter Ersatz für localStorage, damit die Tests ohne Browser laufen.
class Speicher {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}
beforeEach(() => {
  (globalThis as { localStorage?: unknown }).localStorage = new Speicher();
  clearAll();
});

describe("Speichern und Sichern", () => {
  it("behält einen Eintrag und gibt ihn exportiert wieder aus", () => {
    saveDay("2026-11-16", { morning: { mood: 4, energy: 3, stress: 2, body: [], note: "" } });
    expect(loadData().checkins["2026-11-16"].morning?.mood).toBe(4);
    expect(JSON.parse(exportJson()).checkins["2026-11-16"]).toBeTruthy();
  });

  it("liest eine Sicherung wieder ein", () => {
    saveDay("2026-11-16", { morning: { mood: 5, energy: 4, stress: 1, body: [], note: "" } });
    const sicherung = exportJson();
    clearAll();
    expect(Object.keys(loadData().checkins)).toHaveLength(0);
    importieren(sicherung);
    expect(loadData().checkins["2026-11-16"].morning?.mood).toBe(5);
  });

  it("weist eine fremde Datei ab", () => {
    expect(() => importieren('{"irgendwas":true}')).toThrow();
  });

  it("mahnt eine Sicherung erst an, wenn es Daten gibt", () => {
    expect(sicherungFaellig()).toBe(false);
    saveDay("2026-11-16", { morning: { mood: 3, energy: 3, stress: 3, body: [], note: "" } });
    expect(sicherungFaellig()).toBe(true);
    sicherungNotiert();
    expect(sicherungFaellig()).toBe(false);
  });
});
